from datetime import datetime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, Enum
from typing import List, Optional


class Base(DeclarativeBase):
    pass


class UserSession(Base):
    __tablename__ = 'user_sessions'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    device_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Post(Base):
    __tablename__ = 'posts'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    type: Mapped[str] = mapped_column(String(20), index=True)  # event | lost_found | announcement
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    author_session: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    # event fields
    location: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    date: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    time: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    department: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    # lost_found
    item_type: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    item_name: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    # attachments
    image_url: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)
    attachment_url: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)


class Comment(Base):
    __tablename__ = 'comments'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    post_id: Mapped[int] = mapped_column(ForeignKey('posts.id', ondelete='CASCADE'), index=True)
    parent_comment_id: Mapped[Optional[int]] = mapped_column(ForeignKey('comments.id'), nullable=True)
    content: Mapped[str] = mapped_column(Text)
    author_session: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Reaction(Base):
    __tablename__ = 'reactions'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    target_type: Mapped[str] = mapped_column(String(20))  # post | comment
    target_id: Mapped[int] = mapped_column(index=True)
    reaction_type: Mapped[str] = mapped_column(String(8))  # 👍 ❤️ 🔥 😮 🤔 😢
    user_session: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)


class RSVP(Base):
    __tablename__ = 'rsvps'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    post_id: Mapped[int] = mapped_column(ForeignKey('posts.id', ondelete='CASCADE'), index=True)
    user_session: Mapped[str] = mapped_column(String(64))
    response_type: Mapped[str] = mapped_column(String(16))  # going | interested | not_going
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
