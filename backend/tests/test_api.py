import os
import tempfile

fd, db_path = tempfile.mkstemp(suffix=".db")
os.close(fd)
os.unlink(db_path)
os.environ["DATABASE_URL"] = f"sqlite:///{db_path}"
os.environ["OPENAI_API_KEY"] = ""

from app.main import app


def _bootstrap(client):
    response = client.get("/api/v1/demo/bootstrap")
    assert response.status_code == 200
    return response.json()


def _auth(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_health():
    from fastapi.testclient import TestClient

    with TestClient(app) as client:
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"


def test_demo_flow():
    from fastapi.testclient import TestClient

    with TestClient(app) as client:
        data = _bootstrap(client)
        assert data["parent"]["role"] == "parent"
        assert data["guardian"]["role"] == "guardian"

        session_response = client.post(
            "/api/v1/checkin/sessions",
            json={
                "parent_id": data["parent"]["id"],
                "family_id": data["family"]["id"],
                "session_date": "2099-01-10",
            },
            headers=_auth(data["parent_token"]),
        )
        assert session_response.status_code == 201
        session_id = session_response.json()["id"]

        reply = client.post(
            f"/api/v1/conversation/sessions/{session_id}/messages",
            json={"text": "응, 맛있게 먹었어.", "response_type": "text"},
            headers=_auth(data["parent_token"]),
        )
        assert reply.status_code == 200
        assert reply.json()["ai_message"]["sender"] == "ai"


def test_demo_today_session_is_preloaded_for_final_reply():
    from fastapi.testclient import TestClient

    with TestClient(app) as client:
        data = _bootstrap(client)
        session_response = client.get(
            "/api/v1/checkin/sessions/today",
            headers=_auth(data["parent_token"]),
        )
        assert session_response.status_code == 200
        session = session_response.json()
        assert [message["sender"] for message in session["messages"]] == [
            "ai",
            "parent",
            "ai",
            "parent",
            "ai",
        ]

        reply = client.post(
            f"/api/v1/conversation/sessions/{session['id']}/messages",
            json={"text": "응, 방금 물이랑 같이 먹었어.", "response_type": "text"},
            headers=_auth(data["parent_token"]),
        )
        assert reply.status_code == 200
        assert reply.json()["should_generate_story"] is True
        assert reply.json()["session_status"] == "completed"


def test_completed_session_rejects_more_messages():
    from fastapi.testclient import TestClient

    with TestClient(app) as client:
        data = _bootstrap(client)
        session_response = client.post(
            "/api/v1/checkin/sessions",
            json={
                "parent_id": data["parent"]["id"],
                "family_id": data["family"]["id"],
                "session_date": "2099-01-01",
            },
            headers=_auth(data["parent_token"]),
        )
        assert session_response.status_code == 201
        session_id = session_response.json()["id"]

        for text in [
            "응, 전에 담근 김치랑 같이 먹어서 더 맛있었어.",
            "응, 날씨가 좋아서 동네 한 바퀴 돌고 왔어.",
            "응, 방금 물이랑 같이 먹었어.",
        ]:
            response = client.post(
                f"/api/v1/conversation/sessions/{session_id}/messages",
                json={"text": text, "response_type": "text"},
                headers=_auth(data["parent_token"]),
            )
            assert response.status_code == 200

        duplicate = client.post(
            f"/api/v1/conversation/sessions/{session_id}/messages",
            json={"text": "한 번 더 보낼게.", "response_type": "text"},
            headers=_auth(data["parent_token"]),
        )
        assert duplicate.status_code == 409
        assert duplicate.json()["detail"] == "Check-in session is already completed."


def test_family_access_is_required_for_story_and_reaction():
    from fastapi.testclient import TestClient

    with TestClient(app) as client:
        data = _bootstrap(client)
        story_id = data["latest_story"]["id"]

        outsider = client.post(
            "/api/v1/auth/register",
            json={
                "email": "outsider@ieobom.demo",
                "password": "demo1234",
                "name": "외부 보호자",
                "role": "guardian",
            },
        )
        assert outsider.status_code == 201
        outsider_token = outsider.json()["access_token"]

        story_response = client.get(
            f"/api/v1/stories/{story_id}",
            headers=_auth(outsider_token),
        )
        assert story_response.status_code == 403

        reaction_response = client.post(
            f"/api/v1/reactions/stories/{story_id}",
            json={"type": "love", "message": "권한 없는 반응"},
            headers=_auth(outsider_token),
        )
        assert reaction_response.status_code == 403


def test_reaction_labels_match_frontend_mock_and_story_fallback_works():
    from fastapi.testclient import TestClient

    with TestClient(app) as client:
        data = _bootstrap(client)
        session_response = client.post(
            "/api/v1/checkin/sessions",
            json={
                "parent_id": data["parent"]["id"],
                "family_id": data["family"]["id"],
                "session_date": "2099-01-02",
            },
            headers=_auth(data["parent_token"]),
        )
        assert session_response.status_code == 201
        session_id = session_response.json()["id"]

        story_response = client.post(
            f"/api/v1/stories/sessions/{session_id}/generate",
            json={"force_regenerate": False},
            headers=_auth(data["parent_token"]),
        )
        assert story_response.status_code == 200
        assert story_response.json()["summary"]

        reaction_response = client.post(
            f"/api/v1/reactions/stories/{story_response.json()['id']}",
            json={"type": "love", "message": "보고싶어요"},
            headers=_auth(data["guardian_token"]),
        )
        assert reaction_response.status_code == 201
        labels = {item["type"]: item["label"] for item in reaction_response.json()["reactions"]}
        assert labels == {
            "love": "보고싶어요",
            "miss": "고마워요",
            "call": "전화할게요",
        }
