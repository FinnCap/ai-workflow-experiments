from typing import List, Optional
from uuid import UUID

from sqlalchemy import desc, select
from sqlalchemy.orm import Session, selectinload

from chat.model.chat_model import ChatModel


class ChatRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> List[ChatModel]:
        query = select(ChatModel).order_by(desc(ChatModel.updated_at))
        result = self.session.execute(query)
        return list(result.scalars().all())

    def get_by_id(self, chat_id: UUID) -> Optional[ChatModel]:
        query = (
            select(ChatModel)
            .where(ChatModel.id == chat_id)
            .options(selectinload(ChatModel.messages))
        )
        result = self.session.execute(query)
        return result.scalar_one_or_none()

    def create(self, chat: ChatModel) -> ChatModel:
        self.session.add(chat)
        return chat

    def update(self, chat: ChatModel) -> ChatModel:
        self.session.merge(chat)
        return chat

    def delete(self, chat_id: UUID) -> bool:
        chat = self.get_by_id(chat_id)
        if not chat:
            return False

        self.session.delete(chat)
        return True
