# 이어봄(Ieobom)

AI 기반 가족 생활 기록 및 안부 연결 서비스입니다.

이어봄은 부모님의 하루 대화를 기록하고, AI가 하루 이야기를 요약해 보호자가 확인할 수 있도록 돕는 MVP 프로젝트입니다. 가족은 기록된 하루 이야기에 감정 반응을 남기며 자연스럽게 안부를 나눌 수 있습니다.

## 배포 링크

- Service: https://ieobom.vercel.app/
- API Docs(local): http://localhost:8000/docs

## 주요 기능

### 부모님

- 오늘의 루틴 확인
- AI 대화 기반 하루 기록
- 하루 스토리 생성
- 가족 반응 확인
- 감정 반응 남기기 및 취소

### 보호자

- 부모님 하루 스토리 조회
- 오늘의 사진 크게 보기
- 가족 반응 및 댓글 확인
- 감정 반응 남기기 및 취소
- 설정 화면 진입

## 기술 스택

### Frontend

- React
- Vite
- JavaScript
- CSS
- Vercel(frontend hosting)

### Backend

- Python
- FastAPI
- SQLAlchemy
- SQLite(local) / MySQL(deploy)
- JWT
- OpenAI API fallback

## 프로젝트 구조

```text
ieobom
├─ backend
│  ├─ app
│  ├─ tests
│  ├─ requirements.txt
│  └─ README.md
├─ frontend
│  ├─ src
│  ├─ public
│  ├─ package.json
│  └─ README.md
└─ README.md
```

## 로컬 실행 방법

프론트엔드와 백엔드를 각각 다른 터미널에서 실행합니다.

### 1. Backend 실행

Windows PowerShell 기준:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

macOS/Linux 기준:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

백엔드 서버가 정상 실행되면 아래 주소에서 확인할 수 있습니다.

```text
http://localhost:8000/docs
```

### 2. Frontend 실행

```bash
cd frontend
npm install
npm run dev
```

프론트엔드 개발 서버는 기본적으로 아래 주소에서 실행됩니다.

```text
http://localhost:5173
```

## 프론트엔드 환경 변수

프론트엔드는 기본적으로 로컬 백엔드 주소를 사용합니다.

```text
http://localhost:8000/api/v1
```

배포 환경에서는 프론트엔드 호스팅 환경 변수에 백엔드 API 주소를 설정해야 합니다.

```text
VITE_API_BASE_URL=https://<backend-domain>/api/v1
```

환경 변수를 변경한 뒤에는 재배포해야 적용됩니다.

## 데모 계정

백엔드에서 `SEED_DEMO_DATA=true`인 경우 아래 데모 계정이 생성됩니다.

```text
부모님: parent@ieobom.demo / demo1234
보호자: guardian@ieobom.demo / demo1234
```

프론트엔드 MVP는 `/api/v1/demo/bootstrap` API를 통해 데모 토큰과 기본 가족 데이터를 받아 동작합니다.

## API 연동 흐름

1. `/api/v1/demo/bootstrap`으로 부모님/보호자 데모 토큰 조회
2. `/api/v1/checkin/sessions/today`로 오늘 대화 세션 조회
3. `/api/v1/conversation/sessions/{session_id}/messages`로 부모님 응답 저장
4. `/api/v1/stories/sessions/{session_id}/generate`로 하루 스토리 생성
5. `/api/v1/stories/latest`로 최신 스토리 조회
6. `/api/v1/reactions/stories/{story_id}`로 감정 반응 조회 및 등록

## 브랜치 전략

```text
main       배포 기준 브랜치
FEdevelop  프론트엔드 개발 브랜치
BEdevelop  백엔드 개발 브랜치
```

기능 작업은 별도 브랜치에서 진행한 뒤 PR을 통해 병합합니다.

## 검증 명령어

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

### Backend

```bash
cd backend
pytest
```

## 참고

- 백엔드 서버가 실행되지 않은 상태에서 프론트엔드만 실행하면 `/api/v1/demo/bootstrap` 요청이 실패할 수 있습니다.
- 배포 환경에서 API 요청이 `localhost:8000`으로 나가면 외부 기기에서는 연결되지 않습니다. 반드시 `VITE_API_BASE_URL`을 배포 백엔드 주소로 설정해야 합니다.
