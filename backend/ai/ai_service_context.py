from dataclasses import dataclass, field
from typing import Dict, List, Optional
from uuid import UUID

from api.model.api_model import ApiModel
from chat.model.message_model import MessageModel
from chat.model.messages.user_pdf_content import PdfContent
from common.enum.available_models import AvailableModels


@dataclass
class AiServiceContext:
    text_input: str
    system_prompt: str
    temperature: float
    model_name: AvailableModels
    api_models: List[ApiModel]
    previous_messages: List[MessageModel]
    files: Optional[List[PdfContent]] = None
    chat_id: Optional[UUID] = None
    flow_id: Optional[UUID] = None
    node_id: Optional[UUID] = None
    flow_execution_id: Optional[UUID] = None
    # {api_id_1: variables, api_id_3: variables}
    agent_call_variables: Dict[UUID, Dict[str, str]] = field(default_factory=dict)
    agent_call_headers: Dict[UUID, Dict[str, str]] = field(default_factory=dict)
