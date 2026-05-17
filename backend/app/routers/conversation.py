from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps import ensure_family_access, get_current_user
from app.models import CheckinSession, SessionStatus, User
from app.schemas import (
    ConversationMessageRead,
    ConversationReplyRequest,
    ConversationReplyResponse,
)
from app.services.checkin_service import append_parent_reply


router = APIRouter(prefix="/conversation", tags=["conversation"])


@router.get("/sessions/{session_id}/messages", response_model=list[ConversationMessageRead])
def read_messages(
    session_id: int,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
):
    session = _get_session(db, session_id)
    ensure_family_access(user, session.family_id)
    return session.messages


@router.post("/sessions/{session_id}/messages", response_model=ConversationReplyResponse)
def reply_to_ai(
    session_id: int,
    payload: ConversationReplyRequest,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
):
    session = _get_session(db, session_id)
    ensure_family_access(user, session.family_id)
    if session.status in {SessionStatus.completed, SessionStatus.story_created}:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Check-in session is already completed.",
        )
    saved_message, ai_message, should_generate_story = append_parent_reply(
        db,
        session,
        payload.text,
        payload.response_type,
    )
    return ConversationReplyResponse(
        saved_message=saved_message,
        ai_message=ai_message,
        session_status=session.status,
        should_generate_story=should_generate_story,
    )


def _get_session(db: Session, session_id: int) -> CheckinSession:
    session = db.get(CheckinSession, session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found.")
    return session
