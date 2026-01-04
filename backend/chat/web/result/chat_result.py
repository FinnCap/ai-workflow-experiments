from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from chat.model.chat_model import ChatModel


class ChatResult(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    agent_id: UUID
    title: Optional[str]
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_model(cls, model: ChatModel) -> "ChatResult":
        return cls.model_validate(model)
