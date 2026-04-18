# microservice-frontend BFF 구현 스펙

## 1. 개요

이 서비스는 QuietChatter의 Next.js BFF(Backend for Frontend)입니다. 브라우저와 백엔드 API Gateway 사이에 위치하여 OAuth2 인증, 세션 관리, API 프록시 역할을 담당합니다.

UI 페이지 구현 시 기존 레거시 프론트엔드(`legacy-quiet-chatter-front-end` 서브모듈)의 화면 구성과 UX를 참고합니다.

## 2. 트래픽 흐름

```
브라우저
  |  httpOnly 쿠키 JWT
Next.js BFF (이 서비스, 포트 3000)
  |  X-Member-Id 헤더 + 내부 네트워크
API Gateway (10.0.101.200:8080)
  |
마이크로서비스들
```

브라우저는 BFF와만 통신한다. API Gateway는 인터넷에 노출되지 않는다.

## 3. 기술 스택

- Next.js 15 (App Router)
- TypeScript
- jose (JWT 서명/검증)
- Docker (linux/arm64, t4g.micro 환경)

## 4. 환경 변수

런타임에 아래 환경 변수가 주입된다 (인프라 docker-compose에서 제공).

```
INTERNAL_API_GATEWAY_URL   # 내부 API Gateway URL (예: http://10.0.101.200:8080)
BFF_JWT_SECRET             # 세션 쿠키 JWT 서명 키
NAVER_CLIENT_ID            # 네이버 OAuth 클라이언트 ID
NAVER_CLIENT_SECRET        # 네이버 OAuth 클라이언트 시크릿
BFF_BASE_URL               # 이 BFF의 외부 접근 URL (예: http://도메인 또는 NAT IP)
```

`.env.local.example` 파일로 위 변수의 목록과 설명을 제공한다.

## 5. 프로젝트 구조

```
src/
  app/
    api/
      auth/
        naver/
          route.ts              # OAuth 시작: 네이버 인증 URL로 리다이렉트
          callback/
            route.ts            # OAuth 콜백: 코드 수신 -> 회원가입/로그인 -> 쿠키 발급
        logout/
          route.ts              # 로그아웃: 쿠키 삭제
      proxy/
        [...path]/
          route.ts              # API 프록시: 모든 메서드 지원, X-Member-Id 주입
    layout.tsx
    page.tsx
  lib/
    session.ts                  # JWT 발급/파싱, 쿠키 읽기/쓰기 헬퍼
    api-gateway.ts              # 내부 API Gateway 호출 클라이언트
  middleware.ts                 # 세션 검증: 보호된 경로 접근 시 미인증이면 리다이렉트
docs/
  spec.md                       # 이 파일
.env.local.example
Dockerfile
next.config.ts
package.json
```

## 6. OAuth2 인증 흐름

### 6.1 로그인 시작

`GET /api/auth/naver`

네이버 OAuth 인증 URL로 리다이렉트한다.

```
https://nid.naver.com/oauth2.0/authorize
  ?response_type=code
  &client_id={NAVER_CLIENT_ID}
  &redirect_uri={BFF_BASE_URL}/api/auth/naver/callback
  &state={CSRF 토큰}
```

state 값은 crypto.randomUUID()로 생성하고 응답 쿠키에 임시 저장하여 콜백에서 검증한다.

### 6.2 OAuth 콜백

`GET /api/auth/naver/callback?code=...&state=...`

1. state 쿠키와 쿼리 파라미터를 비교해 CSRF를 검증한다.
2. code와 state를 microservice-member에 전달한다.

   ```
   POST {INTERNAL_API_GATEWAY_URL}/api/v1/auth/oauth/naver
   Content-Type: application/json

   { "code": "...", "state": "..." }
   ```

3. microservice-member가 회원가입 또는 로그인 처리 후 memberId를 반환한다.

   ```json
   { "memberId": 123 }
   ```

4. BFF가 memberId를 payload로 JWT를 발급하고 httpOnly 쿠키로 설정한다.
5. `/`로 리다이렉트한다.

### 6.3 로그아웃

`POST /api/auth/logout`

세션 쿠키를 삭제하고 `/`로 리다이렉트한다.

## 7. 세션 관리 (lib/session.ts)

JWT 서명 알고리즘: HS256
쿠키 이름: `qc_session`
쿠키 설정: `httpOnly: true`, `sameSite: lax`, `path: /`

JWT payload 구조:
```typescript
interface SessionPayload {
  memberId: number
  iat: number
  exp: number
}
```

만료 시간: 7일

제공할 함수:
```typescript
createSession(memberId: number): Promise<string>
verifySession(token: string): Promise<SessionPayload | null>
getSession(request: NextRequest): Promise<SessionPayload | null>
setSessionCookie(response: NextResponse, token: string): void
clearSessionCookie(response: NextResponse): void
```

## 8. API 프록시 (app/api/proxy/[...path]/route.ts)

브라우저의 모든 API 요청을 수신하여 API Gateway로 중계한다.

지원 메서드: GET, POST, PUT, DELETE, PATCH

처리 흐름:
1. 요청 쿠키에서 세션을 파싱해 memberId를 추출한다.
2. 세션이 없으면 401을 반환한다.
3. 원래 요청의 path, query, body, Content-Type을 그대로 유지한다.
4. 아래 헤더를 추가하여 API Gateway에 전달한다.

   ```
   X-Member-Id: {memberId}
   ```

5. API Gateway 응답을 그대로 브라우저에 반환한다.

프록시 URL 예시:
```
브라우저 요청: GET /api/proxy/v1/books?query=kotlin
API Gateway 호출: GET {INTERNAL_API_GATEWAY_URL}/v1/books?query=kotlin
```

## 9. 미들웨어 (middleware.ts)

보호된 경로에 미인증 접근 시 `/api/auth/naver`로 리다이렉트한다.

공개 경로 (인증 불필요):
- `/api/auth/*`
- `/` (홈 페이지는 공개)

보호 경로 (인증 필요):
- `/my/*`
- 기타 인증이 필요한 페이지

## 10. Dockerfile

t4g.micro는 ARM64 아키텍처이므로 linux/arm64 플랫폼으로 빌드한다.

```dockerfile
FROM --platform=linux/arm64 node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM --platform=linux/arm64 node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

next.config.ts에 `output: 'standalone'`을 설정한다.

## 11. UI 참고 사항

UI 페이지 구현 시 아래 레거시 서브모듈을 참고한다.

저장소: `legacy-quiet-chatter-front-end`
참고 경로:
- `src/pages/` - 페이지별 화면 구성
- `src/components/` - 공통 컴포넌트 패턴
- `src/hooks/` - 데이터 fetching 패턴
- `docs/guide/` - 기존 개발 가이드

기존 레거시는 React + Vite + MUI 기반이다. 신규 BFF는 Next.js App Router 기반이므로 페이지 구조와 라우팅 방식은 다르지만 UI 디자인, 컴포넌트 구성, UX 흐름은 동일하게 유지한다.

## 12. 구현 범위 요약

이 스펙의 구현 범위:

- OAuth2 인증 흐름 (로그인 시작, 콜백, 로그아웃)
- 세션 관리 (JWT httpOnly 쿠키)
- API 프록시 (X-Member-Id 헤더 주입)
- 미들웨어 (보호 경로 인증 검증)
- Dockerfile (ARM64)
- 기본 페이지 레이아웃 (layout.tsx)

UI 페이지 상세 구현은 별도 스펙으로 관리한다.
