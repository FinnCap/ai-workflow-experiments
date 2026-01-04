from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from agent.web.result.agent_result import AgentResult


class ChatLogResult(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    chat_id: UUID
    agent: AgentResult
    title: str
    message_count: int
    input_token_count: int
    output_token_count: int
    created_at: datetime
    updated_at: datetime
