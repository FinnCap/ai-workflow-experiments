from typing import Optional
from uuid import UUID, uuid4

from pydantic import BaseModel

from chat.model.chat_model import ChatModel


class CreateChatForm(BaseModel):
    use_tools: bool
    agent_id: Optional[UUID] = None
    title: Optional[str] = None

    def to_model(self) -> ChatModel:

        return ChatModel(
            id=uuid4(),
            agent_id=self.agent_id,
            title=self.title,
        )
