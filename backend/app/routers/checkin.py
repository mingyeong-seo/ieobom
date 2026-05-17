from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.timezone import today_kst
from app.db.session import get_db
from app.deps import get_current_user
from app.models import CheckinSession, Family, SessionStatus, User, UserRole
from app.schemas import CheckinSessionCreateRequest, CheckinSessionRead
from app.services.checkin_service import create_or_get_today_session


router = APIRouter(prefix="/checkin", tags=["checkin"])


@router.post("/sessions", response_model=CheckinSessionRead, status_code=status.HTTP_201_CREATED)
def create_session(
    payload: CheckinSessionCreateRequest,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
):
    parent = db.get(User, payload.parent_id) if payload.parent_id else user
    if not parent or parent.role != UserRole.parent:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A parent user is required for check-in.",
        )

    family = db.get(Family, payload.family_id) if payload.family_id else None
    session = create_or_get_today_session(
        db,
        parent=parent,
        family=family,
        session_date=payload.session_date or today_kst(),
    )
    return session


@router.get("/sessions/today", response_model=CheckinSessionRead)
def read_today_session(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
):
    parent = user if user.role == UserRole.parent else _first_parent_in_user_family(user)
    if not parent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Connected parent was not found.",
        )
    session = (
        db.query(CheckinSession)
        .filter(
            CheckinSession.parent_id == parent.id,
            CheckinSession.session_date == today_kst(),
        )
        .first()
    )
    if not session:
        session = create_or_get_today_session(db, parent=parent)
    return session


@router.patch("/sessions/{session_id}/complete", response_model=CheckinSessionRead)
def complete_session(session_id: int, db: Annotated[Session, Depends(get_db)]):
    session = db.get(CheckinSession, session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found.")
    session.status = SessionStatus.completed
    db.commit()
    db.refresh(session)
    return session


def _first_parent_in_user_family(user: User) -> User | None:
    for membership in user.family_memberships:
        for member in membership.family.members:
            if member.user.role == UserRole.parent:
                return member.user
    return None
