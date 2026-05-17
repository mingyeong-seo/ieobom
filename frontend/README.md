# 이어봄 (Ieobom) — Frontend

> AI 기반 가족 연결 서비스 **이어봄**의 프론트엔드 프로젝트입니다.
> 
> 
> 부모님은 AI와 대화하며 하루를 기록하고,
> 보호자는 하루 이야기와 감정 반응을 통해 부모님의 안부를 확인할 수 있습니다.
> 

---

## Links

- **Deploy** : *(배포 후 추가 예정)*
- **Figma** : *(링크 추가 예정)*
- **Demo Video** : *(영상 추가 예정)*

---

## Tech Stack

| 분류 | 기술 |
| --- | --- |
| Framework | React |
| Build Tool | Vite |
| Language | JavaScript |
| Styling | CSS (CSS Variables 기반 디자인 시스템) |

---

## 브랜치 구조

| 브랜치 | 설명 |
| --- | --- |
| `main` | 배포용 최종 브랜치 |
| `FEdevelop` | 프론트엔드 개발 브랜치 |
| `BEdevelop` | 백엔드 개발 브랜치 |

---

## 주요 기능

**부모님**

- 역할 선택 및 잠금 화면 진입
- AI 기반 안부 대화 UI
- 오늘의 기록 확인
- 하루 이야기 생성
- 최근 가족 반응 확인

**보호자**

- 부모님 하루 이야기 확인
- AI 요약 스토리 조회
- 감정 반응 및 댓글 확인
- 오늘의 기록 상태 확인

---

## MVP 범위

- 역할 선택 화면
- 잠금 화면 UI
- 부모님 홈 / 대화 / 기록 화면
- 보호자 홈 / 기록 화면
- AI 하루 이야기 생성 흐름
- 감정 반응 UI
- 준비 중 페이지
- 모바일 프레임 UI

---

## 실행 방법

```bash
npm install
npm run dev
```

---

## 프로젝트 구조

```
src
 ┣ assets
 ┃ ┣ icons          # 상태 바 아이콘 (배터리, 와이파이 등)
 ┃ ┣ images         # 잠금 화면 / 프로필 / 스토리 이미지
 ┃ ┣ img            #  AI 하루 이야기 및 스토리 화면
 ┃ └ logos          # 서비스 로고
 ┣ components
 ┃ └ common
 ┃   ┣ AppHeader    # 상단 헤더 (로고 + 프로필)
 ┃   ┣ BottomTab    # 하단 탭 네비게이션
 ┃   ┣ Button       # 공통 버튼
 ┃   ┣ Card         # 공통 카드
 ┃   ┣ PhoneLayout  # 모바일 프레임 UI (상태 바 + 안드로이드 네비)
 ┃   └ RoutineList  # 루틴 목록 컴포넌트
 ┣ mocks
 ┃ ┣ chats.js       # AI 대화 메시지 데이터
 ┃ ┣ home.js        # 홈 화면 데이터
 ┃ ┣ reactions.js   # 감정 반응 데이터
 ┃ ┣ routines.js    # 루틴 목록 데이터
 ┃ └ stories.js     # 하루 이야기 / 반응 댓글 데이터
 ┣ pages
 ┃ ┣ comingSoon     # 준비 중 페이지
 ┃ ┣ guardian       # 보호자 홈 / 기록 / 설정
 ┃ ┣ home           # 홈 공통 섹션 (루틴, 과거 기록)
 ┃ ┣ parent         # 부모님 홈 / 대화 / 기록
 ┃ ┣ role           # 역할 선택 화면
 ┃ ┣ splash         # 스플래시 / 잠금 화면
 ┃ └ story          # AI 하루 이야기 생성 화면
 ┣ styles
 ┃ ┣ global.css     # 전역 스타일
 ┃ └ theme.css      # CSS 변수 기반 디자인 토큰
 ┣ App.jsx          # 페이지 흐름 및 화면 상태 관리
 └ main.jsx
```

---

## ETC

- 현재 모든 데이터는 MVP 시연을 위한 **mock 데이터** 기반으로 구성되어 있습니다. (`src/mocks/`)
- **모바일 환경** 기반 UI로 제작되었으며, 브라우저에서도 모바일 프레임으로 확인할 수 있습니다.
