from __future__ import annotations

from openai import OpenAI

from app.core.config import get_settings
from app.models import CheckinSession, ConversationMessage, MessageSender


FALLBACK_SUMMARY = (
    "오전엔 병원에 다녀오시고, 점심엔 전에 드시고 싶다고 하셨던 비빔밥을 "
    "드셨어요. 오후에는 날씨가 좋아 동네 산책을 다녀오시고 사진도 "
    "남기셨어요. 저녁에는 약도 잘 챙겨 드시며 하루 루틴을 마무리하셨어요."
)

FALLBACK_KEYWORDS = ["병원", "식사", "산책", "약 복용"]


def generate_story_summary(session: CheckinSession) -> tuple[str, list[str], str]:
    settings = get_settings()
    if not settings.openai_api_key:
        return (
            FALLBACK_SUMMARY,
            FALLBACK_KEYWORDS,
            "어제 산책 이야기가 기록됐어요. 오늘은 사진 이야기를 함께 나눠보는 건 어떨까요?",
        )

    conversation = _conversation_to_text(session.messages)
    routines = ", ".join(
        f"{routine.title} {routine.scheduled_time.strftime('%H:%M')} {routine.status.value}"
        for routine in session.routines
    )
    prompt = f"""
이어봄은 고령 부모님의 하루를 감시가 아니라 가족에게 전하는 따뜻한 하루 이야기로 정리하는 서비스입니다.
아래 대화와 루틴을 바탕으로 보호자가 읽을 하루 요약을 한국어로 작성해 주세요.

규칙:
- 진단, 감지, 위험 같은 표현을 쓰지 마세요.
- 2~4문장으로 따뜻하고 담백하게 작성하세요.
- 마지막에 자연스러운 이모지 하나까지만 허용합니다.
- 출력은 summary, keywords, ai_suggestion 키를 가진 JSON만 반환하세요.

대화:
{conversation}

루틴:
{routines}
"""
    try:
        client = OpenAI(api_key=settings.openai_api_key)
        response = client.responses.create(
            model=settings.openai_model,
            input=prompt,
            text={
                "format": {
                    "type": "json_schema",
                    "name": "ieobom_story",
                    "schema": {
                        "type": "object",
                        "additionalProperties": False,
                        "required": ["summary", "keywords", "ai_suggestion"],
                        "properties": {
                            "summary": {"type": "string"},
                            "keywords": {
                                "type": "array",
                                "items": {"type": "string"},
                                "minItems": 1,
                                "maxItems": 5,
                            },
                            "ai_suggestion": {"type": "string"},
                        },
                    },
                    "strict": True,
                }
            },
        )
        return _parse_story_json(response.output_text)
    except Exception:
        return (
            FALLBACK_SUMMARY,
            FALLBACK_KEYWORDS,
            "어제 기록을 바탕으로 오늘도 가볍게 안부를 나눠보세요.",
        )


def _conversation_to_text(messages: list[ConversationMessage]) -> str:
    lines = []
    for message in messages:
        speaker = "AI" if message.sender == MessageSender.ai else "부모님"
        lines.append(f"{speaker}: {message.text}")
    return "\n".join(lines)


def _parse_story_json(output_text: str) -> tuple[str, list[str], str]:
    import json

    data = json.loads(output_text)
    summary = str(data["summary"])
    keywords = [str(keyword) for keyword in data["keywords"]]
    ai_suggestion = str(data["ai_suggestion"])
    return summary, keywords, ai_suggestion
