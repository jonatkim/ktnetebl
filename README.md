# KTNET

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## node.js 설치

node.js 다운로드, https://nodejs.org/ko/download

> node v22.21.1.
> npm 11.6.2.

## 설정(Setup)

먼저 의존성을 설치하세요:

```bash
# npm
npm install
```

> ⚠️ Windows PowerShell의 실행 정책(Execution Policy)이 스크립트 실행을 차단해서, Node가 설치한 `npm.ps1` 스크립트가 실행되지 않습니다.

```bash
# 현재 세션에서만 우회
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
# 확인: 이제 npm 버전/설치 명령 실행
npm -v
npm install
```

## 의존성 버전 요약

다음은 현재 `package.json`에 정의된 주요 종속성(대략적인 버전)입니다. 새 패키지를 추가하거나 업데이트할 때 참고하세요.

- **핵심(dependencies)**
  - `nuxt`: ^3.20.1 — 애플리케이션 프레임워크(Nuxt 3, 라우팅/SSR/빌드 파이프라인 제공)
  - `vuetify`: ^3.11.1 — Material 디자인 UI 컴포넌트와 Vite용 자동 임포트/플러그인
  - `vite-plugin-vuetify`: ^2.0.3 — Material 디자인 UI 컴포넌트와 Vite용 자동 임포트/플러그인
  - `ag-grid-community`: ^34.3.1 — 고성능 데이터 그리드(정렬/필터/페이징 등)
  - `ag-grid-vue3`: ^34.3.1 — 고성능 데이터 그리드(정렬/필터/페이징 등)
  - `dayjs`: ^1.11.19 — 경량 날짜/시간 유틸 (한국 로케일 사용)

- **개발용(devDependencies)**
  - `@vue/eslint-config-prettier`: ^10.2.0 — JS/Vue 코드 품질 및 스타일 규칙
  - `@eslint/js`: ^9.9.0 — JS/Vue 코드 품질 및 스타일 규칙
  - `eslint`: ^9.9.0 — JS/Vue 코드 품질 및 스타일 규칙
  - `eslint-plugin-vue`: ^10.0.0 — JS/Vue 코드 품질 및 스타일 규칙
  - `globals`: ^15.8.0 — 런타임 전역 변수 타입 정의(ESLint 환경 구성에 사용)
  - `prettier`: ^3.3.3 — 코드 포맷터(프로젝트의 스타일 가이드 자동 적용)
  - `sass`: ^1.80.0 — SCSS 컴파일을 위한 Sass 구현 및 Webpack/Vite 로더
  - `sass-loader`: ^16.0.2 — SCSS 컴파일을 위한 Sass 구현 및 Webpack/Vite 로더
  - `stylelint`: ^16.6.1 — SCSS 및 Vue 스타일 규칙 검사
  - `stylelint-config-standard-scss`: ^13.0.0 — SCSS 및 Vue 스타일 규칙 검사
  - `stylelint-config-recommended-vue`: ^1.5.0 — SCSS 및 Vue 스타일 규칙 검사

### 각 의존성의 주요 기능(간략)

- `nuxt` — 애플리케이션 프레임워크(Nuxt 3, 라우팅/SSR/빌드 파이프라인 제공)
- `vuetify` / `vite-plugin-vuetify` — Material 디자인 UI 컴포넌트와 Vite용 자동 임포트/플러그인
- `ag-grid-community` / `ag-grid-vue3` — 고성능 데이터 그리드(정렬/필터/페이징 등)
- `dayjs` — 경량 날짜/시간 유틸 (한국 로케일 사용)

- `eslint`, `@eslint/js`, `eslint-plugin-vue`, `@vue/eslint-config-prettier` — JS/Vue 코드 품질 및 스타일 규칙
- `prettier` — 코드 포맷터(프로젝트의 스타일 가이드 자동 적용)
- `stylelint`, `stylelint-config-standard-scss`, `stylelint-config-recommended-vue` — SCSS 및 Vue 스타일 규칙 검사
- `sass`, `sass-loader` — SCSS 컴파일을 위한 Sass 구현 및 Webpack/Vite 로더
- `globals` — 런타임 전역 변수 타입 정의(ESLint 환경 구성에 사용)

## 개발 서버(Development Server)

`http://localhost:3000`에서 개발 서버를 실행합니다:

```bash
# npm
npm run dev
```

## 프로덕션(Production)

프로덕션용으로 애플리케이션을 빌드합니다:

```bash
# npm
npm run build
```

프로덕션 빌드를 로컬에서 미리보기:

```bash
# npm
npm run preview
```

## 개발 관례 (자동 임포트 및 린트)

- **자동 컴포넌트/컴포저블 임포트**: 가이드 페이지 및 대부분의 뷰 파일에서는 Nuxt의 자동 임포트 기능을 활용합니다. 템플릿에서 컴포넌트를 직접 사용하면 (`<PubPropsSection />`, `<EblBtn />` 등) 명시적 `import` 문을 생략합니다. 만약 특정 환경에서 자동 임포트가 동작하지 않으면 해당 파일에 명시적으로 `import`해 주세요.

- **ESLint 규칙**: 협업 편의를 위해 일부 규칙을 경고 수준으로 완화했습니다(예: `no-empty`, `no-unused-vars`에서 `_`로 시작하는 변수는 사용하지 않아도 경고 무시). 규칙은 `eslint.config.mjs`에서 확인하세요.

- **코드 예시 표기**: `CodeGroup` 등의 샘플은 SFC 전체(`<template>/<script>`) 대신 내부 마크업/스크립트 본문만 표기해 파싱 문제를 회피합니다.

- **자동 정리(on-save) 권장 설정**:
  - VS Code에서 `ESLint` 확장 설치 후 `settings.json`에 아래를 추가하면 저장 시 가능한 ESLint 자동 수정을 적용할 수 있습니다:

```json
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}
```
