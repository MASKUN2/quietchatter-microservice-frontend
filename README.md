# QuietChatter microservice-frontend (BFF)

QuietChatter 서비스의 웹 프론트엔드이자 BFF(Backend for Frontend) 역할을 수행하는 Next.js 애플리케이션입니다.

## 1. 개요

이 서비스는 사용자가 직접 접속하는 진입점으로, 브라우저와 백엔드 마이크로서비스들 사이에서 보안, 인증, API 중계 역할을 담당합니다. 기존 레거시 프론트엔드(`legacy-quiet-chatter-front-end`)의 UI/UX를 계승하면서, 서버 사이드 렌더링(SSR)과 BFF 패턴을 통해 성능과 보안을 강화하였습니다.

## 2. 주요 기능 및 역할

- **OAuth2 인증 연동**: 네이버 로그인 흐름을 서버 사이드에서 안전하게 처리합니다.
- **세션 관리**: `jose` 라이브러리를 활용하여 HS256 알고리즘 기반의 JWT 세션을 `httpOnly` 쿠키로 관리합니다.
- **API 프록시**: 브라우저의 API 요청을 수신하여 세션 기반의 `X-Member-Id` 헤더를 주입하고, 내부 API Gateway로 요청을 중계합니다.
- **미들웨어 보안**: 인증이 필요한 특정 경로(`/mypage/*` 등)에 대한 접근 제어를 수행합니다.
- **MUI v6 통합**: Next.js App Router 환경에서 Material UI v6 스타일이 정상적으로 하이드레이션되도록 설정되어 있습니다.

## 3. 기술 스택

- **Framework**: Next.js 15 (App Router)
- **UI Library**: Material UI (MUI) v6
- **Language**: TypeScript
- **State Management**: React Context API (Auth, Toast, Onboarding)
- **Security**: jose (JWT), httpOnly Cookie
- **Styling**: Tailwind CSS v4, Emotion
- **Deployment**: Docker (ARM64 기반 멀티스테이지 빌드 최적화)

## 4. 프로젝트 구조

- `src/app/`: Next.js App Router 기반의 페이지 및 API 라우트
  - `api/auth/`: 로그인, 콜백, 로그아웃 관련 로직
  - `api/proxy/`: 내부 API Gateway 중계를 위한 프록시 라우트
- `src/components/`: 재사용 가능한 UI 컴포넌트 (Domain별 분리)
- `src/views/`: 각 페이지의 핵심 비주얼 및 인터랙션 로직
- `src/lib/`: 세션 관리 및 API 게이트웨이 클라이언트 등 유틸리티
- `src/hooks/`: 비즈니스 로직 캡슐화를 위한 커스텀 훅
- `src/context/`: 전역 상태 관리 (인증, 온보딩 등)

## 5. 로컬 개발 설정

### 환경 변수 (.env.local)
`.env.local.example` 파일을 복사하여 `.env.local`을 생성하고 다음 변수들을 설정하십시오.

```env
INTERNAL_API_GATEWAY_URL=   # 내부 API Gateway URL
BFF_JWT_SECRET=             # 세션 서명용 비밀키 (최소 32자)
NEXT_PUBLIC_NAVER_CLIENT_ID= # 네이버 OAuth 클라이언트 ID
NAVER_CLIENT_SECRET=        # 네이버 OAuth 클라이언트 시크릿
NEXT_PUBLIC_NAVER_REDIRECT_URI= # 네이버 콜백 URL
BFF_BASE_URL=               # BFF 외부 접속 URL
```

### 실행 및 빌드
```bash
npm install     # 의존성 설치
npm run dev     # 개발 서버 실행
npm run build   # 프로덕션 빌드
npm run start   # 빌드된 결과물 실행
```

## 6. 인프라 및 배포

본 서비스는 Docker `standalone` 모드로 빌드되어 실행됩니다.
ARM64 아키텍처(AWS t4g 인스턴스 등)에 최적화된 Dockerfile을 제공하며, 내부망의 `microservice-gateway`를 통해 다른 마이크로서비스들과 통신합니다.
