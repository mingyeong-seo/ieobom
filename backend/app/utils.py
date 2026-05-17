from __future__ import annotations

import json
from collections import Counter

from app.models import Reaction, Story


REACTION_PRESETS = {
    "love": {"id": 1, "label": "보고싶어요", "emoji": "❤️"},
    "miss": {"id": 2, "label": "고마워요", "emoji": "😊"},
    "call": {"id": 3, "label": "전화할게요", "emoji": "📞"},
}


def decode_keywords(value: str | None) -> list[str]:
    if not value:
        return []
    try:
        parsed = json.loads(value)
    except json.JSONDecodeError:
        return []
    return parsed if isinstance(parsed, list) else []


def encode_keywords(keywords: list[str]) -> str:
    return json.dumps(keywords, ensure_ascii=False)


def story_to_read(story: Story):
    from app.schemas import StoryRead

    return StoryRead(
        id=story.id,
        session_id=story.session_id,
        parent_id=story.parent_id,
        family_id=story.family_id,
        date=story.story_date,
        title=story.title,
        is_ready=story.is_ready,
        summary=story.summary,
        keywords=decode_keywords(story.keywords_json),
        ai_suggestion=story.ai_suggestion,
        images=[story.image_url] if story.image_url else [],
        created_at=story.created_at,
    )


def reaction_counts(reactions: list[Reaction]):
    from app.schemas import ReactionCountRead

    counter = Counter(reaction.type for reaction in reactions)
    return [
        ReactionCountRead(
            id=preset["id"],
            type=reaction_type,
            label=preset["label"],
            emoji=preset["emoji"],
            count=counter[reaction_type],
        )
        for reaction_type, preset in REACTION_PRESETS.items()
    ]
