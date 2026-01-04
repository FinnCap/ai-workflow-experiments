from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID

from fastapi import Depends
from sqlalchemy.orm import Session

from agent.service.agent_service import AgentService
from api.repository.api_repository import ApiRepository
from chat.model.chat_model import ChatModel
from chat.repository.chat_repository import ChatRepository
from chat.web.form.create_chat_form import CreateChatForm
from chat.web.form.update_chat_form import UpdateChatForm
from common.base import get_db
from common.decorators.transactional import transactional


class ChatService:
    def __init__(
        self, db: Session = Depends(get_db), agent_service: AgentService = Depends()
    ):
        self.db = db
        self.repository = ChatRepository(session=db)
        self.api_repository = ApiRepository(session=db)
        self.agent_service = agent_service

    def get_all_chats(self) -> List[ChatModel]:
        return self.repository.get_all()

    @transactional
    def create_chat(self, form: CreateChatForm) -> ChatModel:

        chat_model = form.to_model()
        if chat_model.title == None or chat_model.title == "":
            chat_model.title = f"Chat - {chat_model.id}"

        return self.repository.create(chat=chat_model)

    def get_chat_by_id(self, chat_id: UUID) -> Optional[ChatModel]:
        return self.repository.get_by_id(chat_id=chat_id)

    @transactional
    def update_chat(self, chat_id: UUID, form: UpdateChatForm) -> Optional[ChatModel]:
        existing_chat = self.get_chat_by_id(chat_id)
        if not existing_chat:
            return None

        if form.title is not None:
            existing_chat.title = form.title

        existing_chat.updated_at = datetime.now(tz=timezone.utc)
        return self.repository.update(chat=existing_chat)

    @transactional
    def delete_chat(self, chat_id: UUID) -> bool:
        return self.repository.delete(chat_id=chat_id)
