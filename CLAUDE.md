# CLAUDE.md - microservice-frontend

이 문서는 Claude Code가 microservice-frontend 프로젝트를 이해하고 개발을 돕기 위한 지침입니다.

루트 프로젝트의 CLAUDE.md에 정의된 공통 원칙(문서 작성 규칙 등)을 먼저 확인하십시오.

## 1. 서비스 개요

- 역할: QuietChatter 웹 프론트엔드 및 BFF(Backend for Frontend)
- 포트: 3000
- 특징: 브라우저와 백엔드 마이크로서비스 사이에서 보안, 인증, API 중계 역할 담당

## 2. 기술 스택

- 프레임워크: Next.js 15 (App Router)
- UI 라이브러리: Material UI (MUI) v6
- 언어: TypeScript
- 상태 관리: React Context API (Auth, Toast, Onboarding)
- 보안: jose (JWT), httpOnly Cookie
- 스타일링: Tailwind CSS v4, Emotion
- 배포: Docker (ARM64 기반 멀티스테이지 빌드 최적화)

## 3. 아키텍처

```
src/
  app/
    api/auth/      로그인, 콜백, 로그아웃 관련 API 라우트
    api/proxy/     내부 API Gateway 중계 프록시 라우트
  components/      재사용 가능한 UI 컴포넌트 (Domain별 분리)
  views/           페이지 핵심 비주얼 및 인터랙션 로직
  lib/             세션 관리 및 API 게이트웨이 클라이언트 유틸리티
  hooks/           비즈니스 로직 캡슐화를 위한 커스텀 훅
  context/         전역 상태 관리 (인증, 온보딩 등)
```

## 4. 작업 지침

모든 작업 시작 전 및 작업 중에 superpowers 스킬 목록을 항상 확인하고 상황에 맞는 스킬을 활성화하여 사용하십시오.

### A. 인증 및 세션 처리

- OAuth2 인증 흐름은 서버 사이드(app/api/auth/)에서 처리합니다.
- 세션은 jose 라이브러리로 HS256 기반 JWT를 httpOnly 쿠키에 저장합니다.
- 인증이 필요한 경로(/mypage/* 등)는 미들웨어에서 접근 제어를 수행합니다.

### B. API 프록시 규칙

- 브라우저의 API 요청은 app/api/proxy/ 라우트를 통해 내부 API Gateway로 중계합니다.
- 프록시 시 세션에서 회원 ID를 추출하여 X-Member-Id 헤더를 주입합니다.
- 내부 API Gateway URL은 환경 변수 INTERNAL_API_GATEWAY_URL로 주입합니다.

### C. 환경 변수 관리

- 민감 정보(API 시크릿, JWT 시크릿 등)는 서버 사이드 환경 변수로만 사용합니다.
- 클라이언트에 노출 가능한 값만 NEXT_PUBLIC_ 접두사를 사용합니다.
- 로컬 개발 시 .env.local.example 파일을 참고하여 .env.local을 생성합니다.

### D. UI 개발 규칙

- 레거시 프론트엔드(legacy-quiet-chatter-front-end)의 UI/UX를 계승합니다.
- MUI v6 컴포넌트를 우선 사용하고, 커스텀 스타일은 Tailwind CSS v4로 보완합니다.
- 컴포넌트는 도메인별로 분리하여 components/ 디렉토리에 관리합니다.

### E. 빌드 및 실행

```
npm install       의존성 설치
npm run dev       개발 서버 실행
npm run build     프로덕션 빌드
npm run start     빌드된 결과물 실행
```
