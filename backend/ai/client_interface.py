from abc import ABC, abstractmethod
from typing import List

from chat.model.message_model import MessageModel
from chat.model.messages.assistant_message import AssistantMessage


class ClientInterface(ABC):

    @abstractmethod
    def send_message(self, messages: List[MessageModel]) -> AssistantMessage:
        pass
