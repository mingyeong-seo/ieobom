# 이어봄 백엔드

FastAPI 기반 이어봄 MVP 백엔드입니다. 노션의 MVP 정의와 현재 프론트 mock 데이터를 API 계약으로 옮겼습니다.

## 기술 스택

- Python 3.11
- FastAPI
- SQLAlchemy
- MySQL 8 배포, SQLite 로컬 기본값
- JWT
- OpenAI Responses API, API 키가 없으면 데모 fallback 생성
- Docker / Docker Compose

## 도메인

- `auth`: 회원가입, 로그인, JWT 발급
- `users`: 부모님/보호자 사용자 정보
- `family`: 보호자와 부모님 가족 연결
- `checkin`: 오늘의 안부 대화 세션, 루틴 완료 상태
- `conversation`: AI 질문/부모님 답변 저장, 다음 질문 반환
- `story`: 하루 이야기 생성, 최근 7일/최신 스토리 조회
- `reaction`: 보호자 감정 반응과 코멘트

## 로컬 실행

```bash
cd backend
cp .env.example .env
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API 문서:

```text
http://localhost:8000/docs
```

헬스체크:

```bash
curl http://localhost:8000/health
```

## Docker 실행

```bash
cd backend
cp .env.example .env
docker compose up --build
```

이 경우 API는 MySQL 컨테이너를 사용합니다.

## 데모 계정

`SEED_DEMO_DATA=true`이면 서버 시작 시 아래 계정과 샘플 가족/스토리/반응이 생성됩니다.

```text
부모님: parent@ieobom.demo / demo1234
보호자: guardian@ieobom.demo / demo1234
```

프론트 데모 초기화용:

```bash
curl http://localhost:8000/api/v1/demo/bootstrap
```

## MVP API 흐름

1. 보호자/부모님 토큰 받기

```bash
curl http://localhost:8000/api/v1/demo/bootstrap
```

2. 부모님 오늘 세션 조회

```bash
curl -H "Authorization: Bearer <parent_token>" \
  http://localhost:8000/api/v1/checkin/sessions/today
```

3. 부모님 답변 저장 및 다음 AI 질문 받기

```bash
curl -X POST http://localhost:8000/api/v1/conversation/sessions/1/messages \
  -H "Authorization: Bearer <parent_token>" \
  -H "Content-Type: application/json" \
  -d '{"text":"응, 전에 담근 김치랑 같이 먹어서 더 맛있었어.","response_type":"text"}'
```

4. 하루 이야기 생성

```bash
curl -X POST http://localhost:8000/api/v1/stories/sessions/1/generate \
  -H "Authorization: Bearer <parent_token>" \
  -H "Content-Type: application/json" \
  -d '{"force_regenerate":false}'
```

5. 보호자 최신 스토리 조회

```bash
curl -H "Authorization: Bearer <guardian_token>" \
  http://localhost:8000/api/v1/stories/latest
```

6. 보호자 반응 남기기

```bash
curl -X POST http://localhost:8000/api/v1/reactions/stories/1 \
  -H "Authorization: Bearer <guardian_token>" \
  -H "Content-Type: application/json" \
  -d '{"type":"love","message":"오늘도 약 잘 챙겨 드셨네요😁"}'
```

## 프론트 연결 포인트

기존 mock을 아래 API로 치환하면 됩니다.

- `mocks/chats.js` -> `GET /api/v1/checkin/sessions/today`, `GET /api/v1/conversation/sessions/{id}/messages`
- `nextAiMessage` -> `POST /api/v1/conversation/sessions/{id}/messages`의 `ai_message`
- `mocks/stories.js` -> `GET /api/v1/stories/latest`, `GET /api/v1/stories/recent?days=7`
- `mocks/reactions.js` -> `GET /api/v1/reactions/stories/{story_id}`, `POST /api/v1/reactions/stories/{story_id}`

## 배포 환경 변수

```text
ENVIRONMENT=production
DATABASE_URL=mysql+pymysql://USER:PASSWORD@HOST:3306/ieobom
CORS_ORIGINS=https://your-frontend.example.com
JWT_SECRET_KEY=<long-random-secret>
OPENAI_API_KEY=<optional-openai-api-key>
OPENAI_MODEL=gpt-5.1-mini
DEMO_MODE=false
SEED_DEMO_DATA=false
```

## AI 생성 동작

`OPENAI_API_KEY`가 비어 있으면 발표 데모가 끊기지 않도록 고정 fallback 문구로 하루 이야기를 생성합니다.
실제 AI 응답 품질을 확인하려면 `backend/.env`에 API key를 넣고 서버를 재시작하세요.
API key가 잘못되었거나 OpenAI 호출이 실패해도 MVP 흐름은 fallback으로 유지됩니다.
