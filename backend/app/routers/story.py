from __future__ import annotations

from datetime import timedelta
from typing import Annotated, Union

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.timezone import today_kst
from app.db.session import get_db
from app.deps import ensure_family_access, get_current_user
from app.models import CheckinSession, SessionStatus, Story, User
from app.schemas import PendingStoryRead, StoryGenerateRequest, StoryRead
from app.services.ai_story import generate_story_summary
from app.utils import encode_keywords, story_to_read


router = APIRouter(prefix="/stories", tags=["story"])


@router.post("/sessions/{session_id}/generate", response_model=StoryRead)
def generate_story(
    session_id: int,
    payload: StoryGenerateRequest,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
):
    session = db.get(CheckinSession, session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found.")
    ensure_family_access(user, session.family_id)

    existing = db.query(Story).filter(Story.session_id == session.id).first()
    if existing and not payload.force_regenerate:
        return story_to_read(existing)

    summary, keywords, ai_suggestion = generate_story_summary(session)
    story = existing or Story(
        session_id=session.id,
        parent_id=session.parent_id,
        family_id=session.family_id,
        story_date=session.session_date,
        title=f"오늘 하루 · {session.session_date.month}월 {session.session_date.day}일",
        summary=summary,
        keywords_json=encode_keywords(keywords),
        ai_suggestion=ai_suggestion,
        is_ready=True,
    )
    story.summary = summary
    story.keywords_json = encode_keywords(keywords)
    story.ai_suggestion = ai_suggestion
    story.is_ready = True
    session.status = SessionStatus.story_created
    db.add(story)
    db.commit()
    db.refresh(story)
    return story_to_read(story)


@router.get("/latest", response_model=Union[StoryRead, PendingStoryRead])
def read_latest_story(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
):
    story = (
        db.query(Story)
        .filter(Story.family_id.in_([m.family_id for m in user.family_memberships]))
        .order_by(Story.story_date.desc(), Story.created_at.desc())
        .first()
    )
    if not story:
        return PendingStoryRead(
            message="오늘의 이야기는 하루가 조금 더 쌓인 뒤 완성돼요. 대화를 시작해 오늘 하루를 마무리해 보세요😊"
        )
    return story_to_read(story)


@router.get("/recent", response_model=list[StoryRead])
def read_recent_stories(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
    days: int = Query(default=7, ge=1, le=365),
):
    since = today_kst() - timedelta(days=days)
    stories = (
        db.query(Story)
        .filter(
            Story.family_id.in_([m.family_id for m in user.family_memberships]),
            Story.story_date >= since,
        )
        .order_by(Story.story_date.desc())
        .all()
    )
    return [story_to_read(story) for story in stories]


@router.get("/{story_id}", response_model=StoryRead)
def read_story(
    story_id: int,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
):
    story = db.get(Story, story_id)
    if not story:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Story not found.")
    ensure_family_access(user, story.family_id)
    return story_to_read(story)
