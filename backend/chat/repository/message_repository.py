from typing import List
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from chat.model.message_model import MessageModel


class MessageRepository:
    def __init__(self, session: Session):
        self.session = session

    def add_message(self, message: MessageModel) -> MessageModel:
        self.session.add(message)
        return message

    def get_all_by_flow_execution_and_node_id(
        self, flow_execution_id: UUID, node_id: UUID
    ) -> List[MessageModel]:
        query = select(MessageModel).where(
            (MessageModel.flow_execution_id == flow_execution_id)
            & (MessageModel.node_id == node_id)
        )

        result = self.session.execute(query)
        return list(result.scalars().all())

    def add_messages(self, messages: List[MessageModel]) -> List[MessageModel]:
        self.session.add_all(messages)
        return messages

    def get_messages(self, chat_id: UUID) -> List[MessageModel]:
        query = (
            select(MessageModel)
            .where(MessageModel.chat_id == chat_id)
            .order_by(MessageModel.chat_position_id)
        )

        result = self.session.execute(query)
        return list(result.scalars().all())

    def delete_message(self, message_id: UUID) -> bool:
        query = select(MessageModel).where(MessageModel.id == message_id)
        result = self.session.execute(query)
        message = result.scalar_one_or_none()

        if not message:
            return False

        self.session.delete(message)
        return True
