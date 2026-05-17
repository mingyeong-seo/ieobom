from __future__ import annotations

from datetime import date, datetime, time
from typing import Literal

from pydantic import BaseModel, EmailStr, Field

from app.models import MessageSender, RoutineStatus, SessionStatus, UserRole


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserRead"


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str = Field(min_length=1, max_length=80)
    role: UserRole
    phone: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserRead(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: UserRole
    phone: str | None = None
    is_active: bool

    model_config = {"from_attributes": True}


class UserUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=80)
    phone: str | None = None


class FamilyMemberRead(BaseModel):
    id: int
    user: UserRead
    relationship: str

    model_config = {"from_attributes": True}


class FamilyCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)


class FamilyConnectRequest(BaseModel):
    guardian_id: int
    parent_id: int
    family_name: str = "이어봄 가족"
    guardian_relationship: str = "딸"
    parent_relationship: str = "부모님"


class FamilyRead(BaseModel):
    id: int
    name: str
    members: list[FamilyMemberRead]

    model_config = {"from_attributes": True}


class RoutineRead(BaseModel):
    id: int
    title: str
    scheduled_time: time
    status: RoutineStatus
    completed_at: datetime | None = None

    model_config = {"from_attributes": True}


class ConversationMessageRead(BaseModel):
    id: int
    sender: MessageSender
    text: str
    response_type: str
    order_index: int
    created_at: datetime

    model_config = {"from_attributes": True}


class CheckinSessionCreateRequest(BaseModel):
    parent_id: int | None = None
    family_id: int | None = None
    session_date: date | None = None


class CheckinSessionRead(BaseModel):
    id: int
    parent_id: int
    family_id: int
    session_date: date
    status: SessionStatus
    started_at: datetime
    completed_at: datetime | None = None
    routines: list[RoutineRead] = []
    messages: list[ConversationMessageRead] = []

    model_config = {"from_attributes": True}


class ConversationReplyRequest(BaseModel):
    text: str = Field(min_length=1, max_length=1000)
    response_type: Literal["text", "button"] = "text"


class ConversationReplyResponse(BaseModel):
    saved_message: ConversationMessageRead
    ai_message: ConversationMessageRead | None = None
    session_status: SessionStatus
    should_generate_story: bool = False


class StoryGenerateRequest(BaseModel):
    force_regenerate: bool = False


class StoryRead(BaseModel):
    id: int
    session_id: int
    parent_id: int
    family_id: int
    date: date
    title: str
    is_ready: bool
    summary: str
    keywords: list[str]
    ai_suggestion: str | None = None
    images: list[str] = []
    created_at: datetime


class PendingStoryRead(BaseModel):
    id: None = None
    is_ready: bool = False
    title: str = "AI 하루 요약"
    message: str


class ReactionCreateRequest(BaseModel):
    type: Literal["love", "miss", "call"]
    message: str | None = Field(default=None, max_length=500)


class ReactionCountRead(BaseModel):
    id: int
    type: str
    label: str
    emoji: str
    count: int


class ReactionCommentRead(BaseModel):
    id: int
    writer: str
    message: str
    time: datetime


class ReactionSummaryRead(BaseModel):
    reactions: list[ReactionCountRead]
    comments: list[ReactionCommentRead]


class DemoBootstrapResponse(BaseModel):
    parent_token: str
    guardian_token: str
    parent: UserRead
    guardian: UserRead
    family: FamilyRead
    latest_story: StoryRead | PendingStoryRead
