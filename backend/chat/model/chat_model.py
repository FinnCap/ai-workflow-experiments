from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import Boolean, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from chat.model.message_model import MessageModel
from common.base import Base


class ChatModel(Base):
    __tablename__ = "chat"

    id: Mapped[UUID] = mapped_column(PgUUID, primary_key=True)
    agent_id: Mapped[UUID] = mapped_column(
        PgUUID, ForeignKey("agent.id"), nullable=False
    )

    use_tools: Mapped[Boolean] = mapped_column(Boolean, nullable=False, default=True)

    title: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    messages: Mapped[list["MessageModel"]] = relationship(
        "MessageModel",
        back_populates="chat",
        cascade="all, delete-orphan",
        order_by="MessageModel.created_at",
    )

    def __repr__(self):
        return f"Chat(id={self.id}, agent_id={self.agent_id}, model={self.model_provider.value}:{self.model_name})"
