from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps import ensure_family_access, get_current_user
from app.models import Reaction, Story, User
from app.schemas import ReactionCommentRead, ReactionCreateRequest, ReactionSummaryRead
from app.utils import REACTION_PRESETS, reaction_counts


router = APIRouter(prefix="/reactions", tags=["reaction"])


@router.get("/stories/{story_id}", response_model=ReactionSummaryRead)
def read_story_reactions(
    story_id: int,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
):
    story = _get_story(db, story_id)
    ensure_family_access(user, story.family_id)
    return _summary(story.reactions)


@router.post("/stories/{story_id}", response_model=ReactionSummaryRead, status_code=status.HTTP_201_CREATED)
def create_story_reaction(
    story_id: int,
    payload: ReactionCreateRequest,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
):
    story = _get_story(db, story_id)
    ensure_family_access(user, story.family_id)
    preset = REACTION_PRESETS[payload.type]
    db.add(
        Reaction(
            story_id=story.id,
            user_id=user.id,
            type=payload.type,
            label=preset["label"],
            emoji=preset["emoji"],
            message=payload.message,
        )
    )
    db.commit()
    db.refresh(story)
    return _summary(story.reactions)


def _get_story(db: Session, story_id: int) -> Story:
    story = db.get(Story, story_id)
    if not story:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Story not found.")
    return story


def _summary(reactions: list[Reaction]) -> ReactionSummaryRead:
    return ReactionSummaryRead(
        reactions=reaction_counts(reactions),
        comments=[
            ReactionCommentRead(
                id=reaction.id,
                writer=reaction.user.name,
                message=reaction.message,
                time=reaction.created_at,
            )
            for reaction in reactions
            if reaction.message
        ],
    )
