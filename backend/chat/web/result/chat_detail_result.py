from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from chat.model.chat_model import ChatModel
from chat.web.result.message_result import MessageResult


class ChatDetailResult(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    agent_id: UUID
    title: Optional[str]
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResult]

    @classmethod
    def from_model(cls, model: ChatModel) -> "ChatDetailResult":
        return cls.model_validate(model)
