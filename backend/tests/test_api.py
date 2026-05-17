from app.main import app


def test_health():
    from fastapi.testclient import TestClient

    with TestClient(app) as client:
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"


def test_demo_flow():
    from fastapi.testclient import TestClient

    with TestClient(app) as client:
        bootstrap = client.get("/api/v1/demo/bootstrap")
        assert bootstrap.status_code == 200
        data = bootstrap.json()
        assert data["parent"]["role"] == "parent"
        assert data["guardian"]["role"] == "guardian"

        session_response = client.get(
            "/api/v1/checkin/sessions/today",
            headers={"Authorization": f"Bearer {data['parent_token']}"},
        )
        assert session_response.status_code == 200
        session_id = session_response.json()["id"]

        reply = client.post(
            f"/api/v1/conversation/sessions/{session_id}/messages",
            json={"text": "응, 맛있게 먹었어.", "response_type": "text"},
            headers={"Authorization": f"Bearer {data['parent_token']}"},
        )
        assert reply.status_code == 200
        assert reply.json()["ai_message"]["sender"] == "ai"
