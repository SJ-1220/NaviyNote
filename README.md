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

https://github.com/user-attachments/assets/07f2cba9-548a-4c4e-bbca-fdb5c9853dda
