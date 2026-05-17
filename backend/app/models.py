from __future__ import annotations

from datetime import date, datetime, time
from enum import Enum
from typing import Optional

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    Integer,
    String,
    Text,
    Time,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship as sa_relationship

from app.db.session import Base


class UserRole(str, Enum):
    parent = "parent"
    guardian = "guardian"


class SessionStatus(str, Enum):
    in_progress = "in_progress"
    completed = "completed"
    story_created = "story_created"


class MessageSender(str, Enum):
    ai = "ai"
    parent = "parent"
    system = "system"


class RoutineStatus(str, Enum):
    pending = "pending"
    completed = "completed"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(80))
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole), index=True)
    phone: Mapped[Optional[str]] = mapped_column(String(40), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    family_memberships: Mapped[list["FamilyMember"]] = sa_relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )
    reactions: Mapped[list["Reaction"]] = sa_relationship(back_populates="user")


class Family(Base):
    __tablename__ = "families"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    members: Mapped[list["FamilyMember"]] = sa_relationship(
        back_populates="family",
        cascade="all, delete-orphan",
    )
    checkin_sessions: Mapped[list["CheckinSession"]] = sa_relationship(
        back_populates="family"
    )


class FamilyMember(Base):
    __tablename__ = "family_members"
    __table_args__ = (UniqueConstraint("family_id", "user_id", name="uq_family_user"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    family_id: Mapped[int] = mapped_column(ForeignKey("families.id"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    relationship: Mapped[str] = mapped_column(String(60), default="family")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    family: Mapped[Family] = sa_relationship(back_populates="members")
    user: Mapped[User] = sa_relationship(back_populates="family_memberships")


class CheckinSession(Base):
    __tablename__ = "checkin_sessions"
    __table_args__ = (
        UniqueConstraint("parent_id", "session_date", name="uq_parent_session_date"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    parent_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    family_id: Mapped[int] = mapped_column(ForeignKey("families.id"), index=True)
    session_date: Mapped[date] = mapped_column(Date, index=True)
    status: Mapped[SessionStatus] = mapped_column(
        SAEnum(SessionStatus),
        default=SessionStatus.in_progress,
        index=True,
    )
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    family: Mapped[Family] = sa_relationship(back_populates="checkin_sessions")
    messages: Mapped[list["ConversationMessage"]] = sa_relationship(
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="ConversationMessage.order_index",
    )
    routines: Mapped[list["RoutineItem"]] = sa_relationship(
        back_populates="session",
        cascade="all, delete-orphan",
    )
    story: Mapped[Optional["Story"]] = sa_relationship(
        back_populates="session",
        cascade="all, delete-orphan",
    )


class ConversationMessage(Base):
    __tablename__ = "conversation_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("checkin_sessions.id"), index=True)
    sender: Mapped[MessageSender] = mapped_column(SAEnum(MessageSender), index=True)
    text: Mapped[str] = mapped_column(Text)
    response_type: Mapped[str] = mapped_column(String(40), default="text")
    order_index: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    session: Mapped[CheckinSession] = sa_relationship(back_populates="messages")


class RoutineItem(Base):
    __tablename__ = "routine_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("checkin_sessions.id"), index=True)
    title: Mapped[str] = mapped_column(String(80))
    scheduled_time: Mapped[time] = mapped_column(Time)
    status: Mapped[RoutineStatus] = mapped_column(
        SAEnum(RoutineStatus),
        default=RoutineStatus.pending,
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    session: Mapped[CheckinSession] = sa_relationship(back_populates="routines")


class Story(Base):
    __tablename__ = "stories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    session_id: Mapped[int] = mapped_column(
        ForeignKey("checkin_sessions.id"),
        unique=True,
        index=True,
    )
    parent_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    family_id: Mapped[int] = mapped_column(ForeignKey("families.id"), index=True)
    story_date: Mapped[date] = mapped_column(Date, index=True)
    title: Mapped[str] = mapped_column(String(120))
    summary: Mapped[str] = mapped_column(Text)
    keywords_json: Mapped[str] = mapped_column(Text, default="[]")
    ai_suggestion: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_ready: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    session: Mapped[CheckinSession] = sa_relationship(back_populates="story")
    reactions: Mapped[list["Reaction"]] = sa_relationship(
        back_populates="story",
        cascade="all, delete-orphan",
    )


class Reaction(Base):
    __tablename__ = "reactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    story_id: Mapped[int] = mapped_column(ForeignKey("stories.id"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    type: Mapped[str] = mapped_column(String(40))
    label: Mapped[str] = mapped_column(String(40))
    emoji: Mapped[str] = mapped_column(String(16))
    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    story: Mapped[Story] = sa_relationship(back_populates="reactions")
    user: Mapped[User] = sa_relationship(back_populates="reactions")
