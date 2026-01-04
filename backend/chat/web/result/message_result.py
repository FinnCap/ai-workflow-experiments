from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from chat.model.message_model import MessageContent, MessageModel
from common.enum.message_role import MessageRole


class MessageResult(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    chat_id: UUID
    role: MessageRole
    chat_position_id: int
    content: MessageContent
    created_at: datetime

    @classmethod
    def from_model(cls, model: MessageModel) -> "MessageResult":
        assert model.chat_id != None
        assert model.content != None
        return cls(
            id=model.id,
            chat_id=model.chat_id,
            role=model.role,
            chat_position_id=model.chat_position_id,
            content=model.content,
            created_at=model.created_at,
        )
