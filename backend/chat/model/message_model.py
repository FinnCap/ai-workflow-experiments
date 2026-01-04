import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Annotated, TypeAlias, Union
from uuid import UUID

from pydantic import Field
from sqlalchemy import INT, DateTime
from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from chat.model.messages.assistant_message import AssistantMessage
from chat.model.messages.tool_response_message import ToolResponseMessage
from chat.model.messages.user_message import UserMessage
from common.base import Base
from common.decorators.enum_as_string import EnumAsString
from common.enum.message_role import MessageRole
from common.pydantic_type_with_adapter import PydanticTypeWithAdapter

if TYPE_CHECKING:
    from chat.model.chat_model import ChatModel


MessageContent: TypeAlias = Annotated[
    Union[UserMessage, AssistantMessage, ToolResponseMessage],
    Field(discriminator="type"),
]


class MessageModel(Base):
    __tablename__ = "message"

    id: Mapped[UUID] = mapped_column(PgUUID, primary_key=True, default=uuid.uuid4)
    chat_id: Mapped[UUID | None] = mapped_column(
        PgUUID, ForeignKey("chat.id", ondelete="SET NULL"), nullable=True, index=True
    )

    chat_position_id: Mapped[int] = mapped_column(INT, nullable=False)
    role: Mapped[MessageRole] = mapped_column(EnumAsString(MessageRole), nullable=False)
    content: Mapped[MessageContent] = mapped_column(
        PydanticTypeWithAdapter(MessageContent), nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    chat: Mapped["ChatModel"] = relationship("ChatModel", back_populates="messages")

    def __repr__(self):
        return f"Message(id={self.id}, chat_id={self.chat_id}, role={self.role.value}, content={self.content})"
