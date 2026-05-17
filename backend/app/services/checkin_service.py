from __future__ import annotations

from datetime import datetime, time

from sqlalchemy.orm import Session

from app.core.timezone import today_kst
from app.models import (
    CheckinSession,
    ConversationMessage,
    Family,
    MessageSender,
    RoutineItem,
    RoutineStatus,
    SessionStatus,
    User,
    UserRole,
)


DEFAULT_ROUTINES = [
    ("아침 약", time(8, 12), RoutineStatus.completed),
    ("병원", time(11, 0), RoutineStatus.completed),
    ("점심", time(13, 0), RoutineStatus.completed),
    ("저녁 약", time(21, 0), RoutineStatus.pending),
]

AI_QUESTIONS = [
    "오늘 점심은 전에 말했던 비빔밥 드셨어요?",
    "오늘 산책은 다녀오셨어요?",
    "와~ 잘하셨어요!\n이제 약 드실 시간이에요 💊\n복용하셨다면 아래 버튼을 눌러주세요!",
]

FINAL_AI_MESSAGE = "좋아요. 오늘 약 복용까지 기록됐어요.\n이제 하루 이야기를 정리해볼게요."


def get_default_parent(db: Session) -> User:
    parent = db.query(User).filter(User.role == UserRole.parent).order_by(User.id).first()
    if not parent:
        raise ValueError("No parent user exists.")
    return parent


def get_default_family_for_parent(db: Session, parent: User) -> Family:
    membership = parent.family_memberships[0] if parent.family_memberships else None
    if not membership:
        raise ValueError("Parent is not connected to a family.")
    return membership.family


def create_or_get_today_session(
    db: Session,
    parent: User | None = None,
    family: Family | None = None,
    session_date=None,
) -> CheckinSession:
    parent = parent or get_default_parent(db)
    family = family or get_default_family_for_parent(db, parent)
    target_date = session_date or today_kst()

    existing = (
        db.query(CheckinSession)
        .filter(
            CheckinSession.parent_id == parent.id,
            CheckinSession.session_date == target_date,
        )
        .first()
    )
    if existing:
        return existing

    session = CheckinSession(
        parent_id=parent.id,
        family_id=family.id,
        session_date=target_date,
    )
    db.add(session)
    db.flush()

    for title, scheduled_time, status in DEFAULT_ROUTINES:
        db.add(
            RoutineItem(
                session_id=session.id,
                title=title,
                scheduled_time=scheduled_time,
                status=status,
                completed_at=datetime.utcnow()
                if status == RoutineStatus.completed
                else None,
            )
        )

    db.add(
        ConversationMessage(
            session_id=session.id,
            sender=MessageSender.ai,
            text=AI_QUESTIONS[0],
            response_type="system",
            order_index=1,
        )
    )
    db.commit()
    db.refresh(session)
    return session


def append_parent_reply(
    db: Session,
    session: CheckinSession,
    text: str,
    response_type: str,
) -> tuple[ConversationMessage, ConversationMessage | None, bool]:
    next_order = (session.messages[-1].order_index if session.messages else 0) + 1
    parent_message = ConversationMessage(
        session_id=session.id,
        sender=MessageSender.parent,
        text=text,
        response_type=response_type,
        order_index=next_order,
    )
    db.add(parent_message)
    db.flush()

    parent_reply_count = (
        db.query(ConversationMessage)
        .filter(
            ConversationMessage.session_id == session.id,
            ConversationMessage.sender == MessageSender.parent,
        )
        .count()
    )

    ai_message = None
    should_generate_story = False
    if parent_reply_count < len(AI_QUESTIONS):
        ai_message = ConversationMessage(
            session_id=session.id,
            sender=MessageSender.ai,
            text=AI_QUESTIONS[parent_reply_count],
            response_type="system",
            order_index=next_order + 1,
        )
        db.add(ai_message)
    else:
        _complete_evening_medicine(session)
        session.status = SessionStatus.completed
        session.completed_at = datetime.utcnow()
        ai_message = ConversationMessage(
            session_id=session.id,
            sender=MessageSender.ai,
            text=FINAL_AI_MESSAGE,
            response_type="system",
            order_index=next_order + 1,
        )
        db.add(ai_message)
        should_generate_story = True

    db.commit()
    db.refresh(parent_message)
    if ai_message:
        db.refresh(ai_message)
    db.refresh(session)
    return parent_message, ai_message, should_generate_story


def _complete_evening_medicine(session: CheckinSession) -> None:
    for routine in session.routines:
        if routine.title == "저녁 약":
            routine.status = RoutineStatus.completed
            routine.completed_at = datetime.utcnow()
