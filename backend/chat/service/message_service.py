from typing import Dict, List, Optional
from uuid import UUID

from fastapi import Depends
from sqlalchemy.orm import Session

from agent.service.agent_service import AgentService
from ai.ai_service import AiService
from chat.model.message_model import MessageModel
from chat.model.messages.user_pdf_content import PdfContent
from chat.repository.message_repository import MessageRepository
from chat.service.chat_service import ChatService
from common.base import get_db
from common.decorators.transactional import transactional


class MessageService:
    def __init__(
        self,
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(),
        agent_service: AgentService = Depends(),
        ai_service: AiService = Depends(),
    ):
        self.chat_service = chat_service
        self.message_repository = MessageRepository(session=db)
        self.agent_service = agent_service
        self.ai_service = ai_service
        self.db = db

    def get_messages(self, chat_id: UUID) -> List[MessageModel]:
        return self.message_repository.get_messages(chat_id=chat_id)

    @transactional
    def add_message(self, message: MessageModel) -> MessageModel:
        return self.message_repository.add_message(message=message)

    @transactional
    def send_message(
        self,
        chat_id: UUID,
        content: str,
        files: Optional[List[PdfContent]],
        agent_call_variables: Optional[Dict[UUID, Dict[str, str]]],
        agent_call_headers: Optional[Dict[UUID, Dict[str, str]]],
    ) -> List[MessageModel] | None:
        """
        Send a message and get AI response
        """
        chat = self.chat_service.get_chat_by_id(chat_id=chat_id)
        if chat == None or chat.agent_id == None:
            return None

        agent = self.agent_service.get_by_id(agent_id=chat.agent_id)
        if agent == None:
            return None

        previous_messages = self.get_messages(chat_id=chat.id)

        pdf_files: List[PdfContent] = []
        if files != None:
            for file in files:
                pdf_files.append(file)

        new_messages = self.ai_service.execute_agent_chat(
            chat=chat,
            text_input=content,
            agent=agent,
            files=pdf_files,
            previous_messages=previous_messages,
            agent_call_headers=agent_call_variables if agent_call_variables else {},
            agent_call_variables=agent_call_headers if agent_call_headers else {},
        )

        if new_messages == None:
            return None

        for message in new_messages:
            message.chat_id = chat.id

        self.message_repository.add_messages(new_messages)

        return new_messages
