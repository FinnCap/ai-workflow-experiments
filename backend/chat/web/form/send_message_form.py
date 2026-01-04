from typing import Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from chat.model.messages.user_pdf_content import PdfContent


class SendMessageForm(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    content: str
    agent_call_variables: Optional[Dict[UUID, Dict[str, str]]]
    agent_call_headers: Optional[Dict[UUID, Dict[str, str]]]
    pdf_data: Optional[List[PdfContent]] = None
