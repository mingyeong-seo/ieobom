from __future__ import annotations

from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password
from app.core.timezone import today_kst
from app.models import (
    CheckinSession,
    ConversationMessage,
    Family,
    FamilyMember,
    MessageSender,
    Reaction,
    SessionStatus,
    Story,
    User,
    UserRole,
)
from app.services.ai_story import FALLBACK_KEYWORDS, FALLBACK_SUMMARY
from app.services.checkin_service import AI_QUESTIONS, create_or_get_today_session
from app.utils import REACTION_PRESETS, encode_keywords


PARENT_EMAIL = "parent@ieobom.demo"
GUARDIAN_EMAIL = "guardian@ieobom.demo"
DEMO_PASSWORD = "demo1234"


def seed_demo_data(db: Session) -> None:
    parent = _get_or_create_user(
        db,
        email=PARENT_EMAIL,
        name="김옥자",
        role=UserRole.parent,
    )
    guardian = _get_or_create_user(
        db,
        email=GUARDIAN_EMAIL,
        name="배윤정",
        role=UserRole.guardian,
    )
    family = _get_or_create_family(db, parent, guardian)

    story_date = today_kst() - timedelta(days=1)
    today_session = create_or_get_today_session(db, parent=parent, family=family)
    _ensure_today_demo_history(db, today_session)
    story_session = create_or_get_today_session(
        db,
        parent=parent,
        family=family,
        session_date=story_date,
    )
    _ensure_story(db, story_session, parent, family, story_date)
    _ensure_reactions(db, guardian)
    db.commit()


def get_demo_bootstrap(db: Session):
    from app.schemas import DemoBootstrapResponse
    from app.utils import story_to_read

    parent = db.query(User).filter(User.email == PARENT_EMAIL).one()
    guardian = db.query(User).filter(User.email == GUARDIAN_EMAIL).one()
    family = parent.family_memberships[0].family
    story = db.query(Story).order_by(Story.created_at.desc()).first()
    return DemoBootstrapResponse(
        parent_token=create_access_token(str(parent.id), {"role": parent.role.value}),
        guardian_token=create_access_token(str(guardian.id), {"role": guardian.role.value}),
        parent=parent,
        guardian=guardian,
        family=family,
        latest_story=story_to_read(story),
    )


def _get_or_create_user(db: Session, email: str, name: str, role: UserRole) -> User:
    user = db.query(User).filter(User.email == email).first()
    if user:
        return user
    user = User(
        email=email,
        password_hash=hash_password(DEMO_PASSWORD),
        name=name,
        role=role,
    )
    db.add(user)
    db.flush()
    return user


def _get_or_create_family(db: Session, parent: User, guardian: User) -> Family:
    if parent.family_memberships:
        return parent.family_memberships[0].family

    family = Family(name="이어봄 데모 가족")
    db.add(family)
    db.flush()
    db.add_all(
        [
            FamilyMember(
                family_id=family.id,
                user_id=parent.id,
                relationship="부모님",
            ),
            FamilyMember(
                family_id=family.id,
                user_id=guardian.id,
                relationship="딸",
            ),
        ]
    )
    db.flush()
    return family


def _ensure_story(
    db: Session,
    session: CheckinSession,
    parent: User,
    family: Family,
    story_date: date,
) -> Story:
    existing = db.query(Story).filter(Story.session_id == session.id).first()
    if existing:
        return existing
    session.status = SessionStatus.story_created
    story = Story(
        session_id=session.id,
        parent_id=parent.id,
        family_id=family.id,
        story_date=story_date,
        title=f"오늘 하루 · {story_date.month}월 {story_date.day}일",
        summary=FALLBACK_SUMMARY,
        keywords_json=encode_keywords(FALLBACK_KEYWORDS),
        ai_suggestion="어제 산책 이야기가 기록됐어요. 오늘은 사진 이야기를 함께 나눠보는 건 어떨까요?",
        image_url=None,
        is_ready=True,
    )
    db.add(story)
    db.flush()
    return story


def _ensure_today_demo_history(db: Session, session: CheckinSession) -> None:
    if len(session.messages) > 1:
        return

    demo_messages = [
        (
            MessageSender.parent,
            "응, 전에 담근 김치랑 같이 먹어서 더 맛있었어.",
            "text",
            2,
        ),
        (
            MessageSender.ai,
            AI_QUESTIONS[1],
            "system",
            3,
        ),
        (
            MessageSender.parent,
            "응, 날씨가 좋아서 동네 한 바퀴 돌고 왔어.",
            "text",
            4,
        ),
        (
            MessageSender.ai,
            AI_QUESTIONS[2],
            "system",
            5,
        ),
    ]
    for sender, text, response_type, order_index in demo_messages:
        db.add(
            ConversationMessage(
                session_id=session.id,
                sender=sender,
                text=text,
                response_type=response_type,
                order_index=order_index,
            )
        )
    db.flush()


def _ensure_reactions(db: Session, guardian: User) -> None:
    story = db.query(Story).order_by(Story.created_at.desc()).first()
    if not story or story.reactions:
        return
    comments = [
        ("love", "오늘도 약 잘 챙겨 드셨네요😁"),
        ("miss", "다음엔 비빔밥 같이 먹으러 가요!"),
        ("call", None),
        ("love", None),
    ]
    for reaction_type, message in comments:
        preset = REACTION_PRESETS[reaction_type]
        db.add(
            Reaction(
                story_id=story.id,
                user_id=guardian.id,
                type=reaction_type,
                label=preset["label"],
                emoji=preset["emoji"],
                message=message,
            )
        )
