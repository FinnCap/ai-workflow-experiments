from typing import List

from fastapi import Depends
from sqlalchemy.orm import Session

from agent.service.agent_service import AgentService
from agent.web.result.agent_result import AgentResult
from chat.model.messages.assistant_message import AssistantMessage
from chat.repository.chat_repository import ChatRepository
from chat.repository.message_repository import MessageRepository
from common.base import get_db
from llm_logging.web.response.chat_log_result import ChatLogResult


class ChatLogService:

    def __init__(
        self, db: Session = Depends(get_db), agent_service: AgentService = Depends()
    ) -> None:
        self.message_repository = MessageRepository(session=db)
        self.chat_repository = ChatRepository(session=db)
        self.agent_service = agent_service

    def get_all(self) -> List[ChatLogResult]:
        chat_models = self.chat_repository.get_all()
        chat_logs: List[ChatLogResult] = []
        for chat in chat_models:
            agent = self.agent_service.get_by_id(agent_id=chat.agent_id)

            total_tokens_in = 0
            total_tokens_out = 0

            for message in chat.messages:
                if isinstance(message.content, AssistantMessage):
                    total_tokens_out += message.content.output_token_count
                    total_tokens_in += message.content.input_token_count

            chat_logs.append(
                ChatLogResult(
                    chat_id=chat.id,
                    agent=AgentResult.from_model(agent),
                    title=chat.title if chat.title else "",
                    message_count=len(chat.messages),
                    input_token_count=total_tokens_in,
                    output_token_count=total_tokens_out,
                    created_at=chat.created_at,
                    updated_at=chat.updated_at,
                )
            )
        return chat_logs
