<img src="https://github.com/user-attachments/assets/da57637e-83ee-415b-b2d2-6e38e6f8c101" width="300">

**네이버 로그인 기반의 메모 & 일정 관리 웹앱**<br />
**간편한 드래그 앤 드롭 기능과 직관적인 UI로 일정과 메모를 관리**

## 프로젝트 개요

NaviyNote는 일정 관리와 메모 작성을 통합한 웹 서비스로,<br />
네이버 로그인을 기반으로<br />
사용자의 Todo와 메모를 연동하고 시각적으로 관리할 수 있도록 도와줍니다.

- Todo & Memo 간 연동 기능
- 드래그 앤 드롭을 활용한 직관적인 일정 관리
- 네이버 캘린더 연동 (3차 배포 예정)

## 기획 의도

"쉽게 적고, 일정에 연결하자"
메모와 일정은 서로 가깝지만 대부분 분리되어 관리됩니다.<br />
NaviyNote는 두 기능을 연결해 효율적인 개인 기록 관리를 돕습니다.

## 주요 기능 (2차 배포 기준)

0. **Landing(랜딩 페이지)**

   - 랜딩 페이지 구성 (사이트 소개, 데모 영상, '지금 시작하기' 버튼)
   - 상단 헤더: 로고, 사이트명, 네비게이션, 로그인/로그아웃
     
1. **Main(메인 페이지)**
   
   - 사이트 주요 기능들을 한 눈에 볼 수 있도록 구성
   - 사용자의 데이터를 기반으로 다음 항목들을 시각화 및 요약 제공
      - 최신 작성 또는 수정된 메모 10개
      - 오늘 기준 ±5일 간의 To-Do
      - 중요 Todo 6개
      - 통계 정보(임시 데이터 기반) : 가장 바쁜 요일 등
      - 친구 정보(임시 데이터 기반) : 가장 많이 만난 친구 등
   - 사용자 맞춤형 요약 정보 제공을 통해, 빠르게 상태를 파악하고 필요한 작업으로 이동 가능

3. **Todo 기능**

   - CRUD 지원
      - 조회/추가: 기본 페이지에서 가능
      - 수정/삭제: 상세 모달 페이지에서 가능
   - 캘린더 기능 (FullCalendar 기반)
      - 일정은 캘린더에서 드래그 앤 드롭으로 등록 가능
      - 날짜 없는 Todo도 드래그하여 일정화 가능
      - 등록된 Todo는 캘린더 내에서 날짜 이동 가능
   - 상세 페이지 모달
      - 병렬 & 인터셉트 라우팅 적용
     
4. **메모 기능**

   - CRUD 지원
      - 조회/추가: 기본 페이지에서 가능
      - 수정/삭제: 상세 모달 페이지에서 가능
   - 중요도 & 활성화 필터링
      - 중요/비중요, 활성/비활성 상태별 4분할 그리드로 구성
      - 상태 변경은 기본 페이지에서 드래그 앤 드롭으로 직접 수정 가능
   - 상세 페이지 모달
      - 병렬 & 인터셉트 라우팅 적용
     
5. **Todo & 메모 연동**

   - 1:1 매핑, 기존 연결이 있어도 최근 연결이 우선 반영
   - Memo → Todo 연결
      - 월 선택 → 해당 월의 Todo만 필터링하여 연결
   - Todo → Memo 연결
      - connect == true인 Memo 중에서 선택
   - 연동 없이도 각각의 CRUD 및 상세 모달 기능은 독립적으로 작동
     
6. **통계 / 친구 관리**
   
   - 3차 배포 예정 (준비 중)
  
## 활용 기술

<img src="https://github.com/user-attachments/assets/33a43891-a94e-455f-b4fd-440b5c4b019c" width="600">

| 카테고리 | 내용 | 사용 기술|
| --- | --- | --- |
| 프론트엔드 | UI/UX 개발 | Next.js, TypeScript, Tailwind CSS |
| 로그인 | 네이버 OAuth 로그인 | NextAuth, Zustand |
| 데이터 관리 | 메모 및 Todo 저장, 상태 관리 | Supabase, Zustand |
| 기능 연동	| 메모 & Todo 연동 구조 | Supabase, Zustand |
| 배포 | 정적 호스팅 및 운영 | Vercel |
| 코드 품질 | 코드 컨벤션 및 정적 분석 | ESLint, Prettier |
| 개발 지원 도구 | 기획, 문서화, 개발 환경 정리 | Notion, GitHub, VSCode, PPT |

## 프로젝트 구조

<img src="https://github.com/user-attachments/assets/3268a2d6-e7ad-4b81-be01-6b065037f145" width="600">
<br />
<img src="https://github.com/user-attachments/assets/1148424c-6693-4768-98b6-2d3d5b9eb6c0" width="700">

## 수행 결과

https://github.com/user-attachments/assets/07f2cba9-548a-4c4e-bbca-fdb5c9853dda
