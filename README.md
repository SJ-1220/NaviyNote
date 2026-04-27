<img src="https://github.com/user-attachments/assets/da57637e-83ee-415b-b2d2-6e38e6f8c101" width="300">

# NaviyNote

**A memo & schedule management web app powered by Naver OAuth login.**  
Organize your todos and memos intuitively through drag-and-drop and a unified calendar view.

<details>
<summary><b>🇰🇷 한국어 설명 보기 (Click to expand)</b></summary>

# NaviyNote

**네이버 로그인 기반의 메모 & 일정 관리 웹앱**  
드래그 앤 드롭과 통합 캘린더 뷰로 Todo와 메모를 직관적으로 관리하세요.

---

## 프로젝트 개요

NaviyNote는 일정 관리와 메모 작성을 하나로 통합한 웹 서비스입니다.  
네이버 로그인을 기반으로 사용자의 Todo와 메모를 연동하고 시각적으로 관리할 수 있도록 도와줍니다.

- Todo & 메모 간 1:1 연동
- 드래그 앤 드롭을 활용한 직관적인 일정 및 메모 상태 관리
- 네이버 캘린더 연동 (일정 등록)
- 통계 & 친구 기능 (3차 배포 예정)

---

## 기획 의도

> "쉽게 적고, 일정에 연결하자"

메모와 일정은 서로 가깝지만 대부분 따로 관리됩니다.  
NaviyNote는 두 기능을 하나로 연결해 효율적인 개인 기록 관리를 돕습니다.

---

## 주요 기능

### 0. 랜딩 페이지

- 서비스 소개 및 데모 영상
- 네이버 로그인 버튼 및 네비게이션 헤더

### 1. 메인 대시보드

- 최근 수정 메모 10개 (전체보기 버튼 포함)
- 오늘 기준 ±5일 Todo (전체보기 버튼 포함)
- 중요 Todo 6개
- 통계 및 친구 요약 (임시 데이터 기반)

### 2. Todo 기능

- CRUD 완전 지원
- FullCalendar 기반 캘린더 뷰
- 날짜 없는 Todo를 캘린더로 드래그하여 일정화 가능
- 캘린더 내 일정 날짜 이동 가능
- 인터셉트 라우팅 기반 상세 모달
- 네이버 캘린더에 일정 등록 가능

### 3. 메모 기능

- CRUD 완전 지원
- 중요/비중요 × 활성/비활성의 4분할 드래그 앤 드롭 그리드
- 인터셉트 라우팅 기반 상세 모달
- Todo 연동 플래그 (`connect`) 지원

### 4. Todo & 메모 1:1 연동

- YearMonthPicker로 연도·월을 선택해 연결할 Todo 범위 필터링 (2025–2027)
- 연동 시 기존 연결 자동 해제 (Supabase 수준 무결성 보장)
- Memo → Todo, Todo → Memo 양방향 연결

### 5. 디자인 시스템

- 시맨틱 색상 토큰 (navy, secondary, surface, danger)
- 커스텀 타이포그래피 스케일 (ui-caption ~ ui-mega)
- NanumGothic 웹폰트 (Regular / Bold / ExtraBold)
- 반응형 레이아웃 (sm 브레이크포인트: 768px)

### 6. 통계 / 친구 관리

- 3차 배포 예정 (준비 중)

---

## 활용 기술

<img src="https://github.com/user-attachments/assets/33a43891-a94e-455f-b4fd-440b5c4b019c" width="600">

| 카테고리       | 내용                       | 사용 기술                            |
| -------------- | -------------------------- | ------------------------------------ |
| 프론트엔드     | UI/UX 개발                 | Next.js 15, TypeScript, Tailwind CSS |
| 상태 관리      | 전역 상태                  | Zustand                              |
| 인증           | 네이버 OAuth 로그인        | NextAuth.js                          |
| 데이터베이스   | 메모 & Todo 저장           | Supabase                             |
| 캘린더         | 일정 UI                    | FullCalendar                         |
| 드래그 앤 드롭 | 메모 상태 변경 & 일정 등록 | react-dnd                            |
| 차트           | 통계 시각화 (준비 중)      | Chart.js                             |
| 배포           | 호스팅                     | Vercel                               |
| 코드 품질      | 컨벤션 및 정적 분석        | ESLint, Prettier, Husky              |

---

## 프로젝트 구조

<img src="https://github.com/user-attachments/assets/3268a2d6-e7ad-4b81-be01-6b065037f145" width="600">
<br />
<img src="https://github.com/user-attachments/assets/1148424c-6693-4768-98b6-2d3d5b9eb6c0" width="700">

---

## 환경 변수 설정

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_ANALYTICS=   # 선택
```

---

## 로컬 실행

```bash
npm install
npm run dev
```

---

## 수행 결과

https://github.com/user-attachments/assets/4dd98fab-6066-4998-8358-21e063d838df

</details>

---

## Overview

NaviyNote is a personal productivity web service that unifies **memo writing** and **schedule management** into a single, cohesive experience. Authenticated via Naver OAuth, users can create, categorize, and link their memos and todos — then push events directly to Naver Calendar.

Key design goals:

- **"Write it quick, link it to a schedule."** Memos and todos live side-by-side and connect with a single action.
- A drag-and-drop interface that makes state changes feel effortless.
- A polished, consistent design system built on semantic Tailwind tokens.

---

## Features

### Landing Page

- Product introduction with a feature overview and demo video
- Naver Sign-In button and top navigation header

### Main Dashboard (`/main`)

- Greeting banner and personalized summary
- **Recent memos** — the 10 most recently created or updated memos, with a "View All" button
- **Upcoming todos** — todos within ±5 days of today, with a "View All" button
- **Important todos** — up to 6 pinned high-priority todos
- Statistics and friend summary widgets (placeholder data; full release in v3)

### Todo Management (`/todo`)

- Full CRUD support
- **FullCalendar** view — monthly grid with interactive event placement
- Drag date-less todos onto the calendar to assign a date
- Drag existing calendar events to reschedule them
- Detail view via **intercepting route modal** (no full-page reload)
- **Add to Naver Calendar** — push any todo directly to the user's Naver Calendar account

### Memo Management (`/memo`)

- Full CRUD support
- **4-zone drag-and-drop grid** categorized by two boolean flags:
  - `active` (active / inactive)
  - `important` (important / not important)
- Drag a memo card between zones to instantly update its flags
- Detail view via **intercepting route modal**
- `connect` flag marks a memo as linkable to a todo

### Memo–Todo 1:1 Linking

- **YearMonthPicker** — select a year (2025–2027) and month to filter the available todos before linking
- Each memo can be linked to at most one todo, and vice versa
- When a new link is created, the previous link is automatically nullified — enforced at both the application layer and the Supabase schema level
- Linking works in both directions: Memo → Todo and Todo → Memo

### Statistics & Friends (`/stats`, `/friend`)

- Placeholder pages; full feature set planned for v3

---

## Tech Stack

<img src="https://github.com/user-attachments/assets/33a43891-a94e-455f-b4fd-440b5c4b019c" width="600">

| Category         | Purpose                               | Technology                           |
| ---------------- | ------------------------------------- | ------------------------------------ |
| Frontend         | UI & routing                          | Next.js 15 (App Router), TypeScript  |
| Styling          | Design system                         | Tailwind CSS 3                       |
| State management | Client-side global state              | Zustand 5                            |
| Authentication   | Naver OAuth sign-in                   | NextAuth.js 4                        |
| Database         | Memo & todo persistence               | Supabase (PostgreSQL)                |
| Calendar UI      | Schedule display & interaction        | FullCalendar 6                       |
| Drag and drop    | Memo zone changes, calendar placement | react-dnd 16                         |
| Charts           | Stats visualization (future)          | Chart.js 4                           |
| Deployment       | Hosting & CI                          | Vercel                               |
| Code quality     | Linting, formatting, git hooks        | ESLint, Prettier, Husky, lint-staged |

---

## Architecture

### Directory Layout

```
naviynote/
├── src/
│   ├── app/
│   │   ├── layout.tsx                        # Root layout — fonts, session wrapper
│   │   ├── (pages)/
│   │   │   ├── (landing)/page.tsx            # Landing / home
│   │   │   ├── main/page.tsx                 # Dashboard
│   │   │   ├── memo/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── memoItem/[memoId]/page.tsx
│   │   │   │   └── @memoModal/(.)memoItem/[memoId]/page.tsx   # Intercepting route
│   │   │   ├── todo/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── todoItem/[todoId]/page.tsx
│   │   │   │   └── @todoModal/(.)todoItem/[todoId]/page.tsx   # Intercepting route
│   │   │   ├── stats/page.tsx
│   │   │   └── friend/page.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/           # NextAuth handler + SessionWrapper
│   │       └── naver/add-schedule/           # Naver Calendar proxy endpoint
│   └── store/
│       ├── memoStore.ts                      # Zustand memo store
│       └── todoStore.ts                      # Zustand todo store
├── components/
│   ├── Header/                               # Global header & nav
│   ├── Main/                                 # Dashboard widgets
│   ├── Memo/                                 # Memo list, modal, drop zones
│   │   └── memosServer.tsx                   # Server actions (Supabase CRUD)
│   ├── ToDo/                                 # Todo list, modal, calendar
│   │   └── todosServer.tsx                   # Server actions (Supabase CRUD)
│   ├── YearMonthPicker.tsx                   # Date range selector for memo-todo linking
│   ├── Button.tsx
│   ├── Loading.tsx
│   └── Footer.tsx
└── lib/
    ├── supabase.ts                           # Supabase client
    └── GoogleAnalytics.tsx
```

### Data Flow

1. **Server fetch functions** (`memosServer.tsx`, `todosServer.tsx`) query Supabase directly on the server.
2. **Client components** call these on mount (gated by `useSession`), then populate the Zustand stores (`useMemoStore`, `useTodoStore`).
3. **CRUD mutations** update both Supabase and the store optimistically, so the UI reflects changes instantly.

### Modal Pattern

Both memo and todo detail pages use **Next.js parallel + intercepting routes**:

- `@memoModal/(.)memoItem/[memoId]` — intercepts navigation to `/memo/memoItem/:id` and renders a modal overlay instead of a full page load.
- `@todoModal/(.)todoItem/[todoId]` — same pattern for todos.

This allows deep-linking to individual items while preserving the list page in the background.

### Memo–Todo 1:1 Link Invariant

Each memo holds a `todo_id` foreign key; each todo holds a `memo_id` foreign key. When `addMemo` or `updateMemo` creates a new link, the server action first nullifies the old memo's `todo_id`, ensuring neither side ends up pointing to two records simultaneously.

---

## Design System

NaviyNote ships with a custom Tailwind design system defined in `tailwind.config.ts`.

### Color Tokens

| Token                   | Hex       | Usage                                           |
| ----------------------- | --------- | ----------------------------------------------- |
| `navy` / `primary`      | `#003366` | Brand color, headings, active nav               |
| `navy2` / `secondary`   | `#4169E1` | Buttons, interactive elements, form focus rings |
| `navy3` / `accent`      | `#6495ED` | Modal highlights, secondary accents             |
| `lightnavy` / `surface` | `#99CCFF` | Card chip backgrounds, zone labels              |
| `red` / `danger`        | `#FF6347` | Important flag, destructive actions             |

### Typography Scale

| Class             | Size / Line-height | Use case                    |
| ----------------- | ------------------ | --------------------------- |
| `text-ui-caption` | 1rem / 1.5rem      | Footer, fine print          |
| `text-ui-sm`      | 1.5rem / 2rem      | Labels, badges              |
| `text-ui-md`      | 2rem / 2.5rem      | Section headings, nav links |
| `text-ui-lg`      | 2.3rem / 3rem      | Feature body text           |
| `text-ui-xl`      | 3.2rem / 4rem      | Hero headings               |
| `text-ui-mega`    | 10rem / 1          | Loading spinner display     |

### Fonts

NanumGothic is loaded from `public/fonts/` via `next/font/local` and exposed as CSS variables:

- `--font-nanumgothic-regular` (400)
- `--font-nanumgothic-bold` (700)
- `--font-nanumgothic-extrabold` (800)

### Responsive Breakpoints

- `sm: 768px` — switches from stacked mobile layout to side-by-side desktop layout
- Fine-grained overrides use Tailwind's arbitrary-value syntax (e.g., `max-[400px]:text-xs`)

---

## Authentication

NaviyNote uses **NextAuth.js** with a custom Naver OAuth provider.

**Scopes requested:** `calendar` — required for the Naver Calendar integration.

**Session flow:**

1. User clicks "Sign in with Naver" → redirected to Naver OAuth.
2. On success, NextAuth stores the Naver `access_token` in the JWT.
3. The `session` callback exposes `accessToken` to client components.
4. `SessionWrapper` wraps the app with `SessionProvider` to make `useSession()` available everywhere.
5. After sign-in, users are redirected to `/main`.

**Naver Calendar proxy** (`/api/naver/add-schedule`): forwards todo payloads (iCal format) to `https://openapi.naver.com/calendar/createSchedule.json` using the stored access token.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A Supabase project with `memos` and `todos` tables
- A Naver Developer app with OAuth credentials and Calendar scope enabled

### Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXTAUTH_SECRET=a_random_secret_string
NEXTAUTH_URL=http://localhost:3000
NAVER_CLIENT_ID=your_naver_oauth_client_id
NAVER_CLIENT_SECRET=your_naver_oauth_client_secret
NEXT_PUBLIC_GOOGLE_ANALYTICS=   # optional
```

### Install & Run

```bash
npm install
npm run dev        # Development server at http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint check (next lint)
```

Pre-commit hooks run automatically via **Husky + lint-staged**: ESLint `--fix` on `.ts`/`.tsx` files, Prettier on `.md`/`.json` files.

---

## Demo

https://github.com/user-attachments/assets/4dd98fab-6066-4998-8358-21e063d838df
