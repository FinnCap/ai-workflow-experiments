from typing import Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel

from chat.model.messages.user_pdf_content import PdfContent


class FlowExecutionRequest(BaseModel):
    input_str: str
    agent_call_variables: Optional[Dict[UUID, Dict[UUID, Dict[str, str]]]]
    agent_call_headers: Optional[Dict[UUID, Dict[UUID, Dict[str, str]]]]
    pdf_data: Optional[List[PdfContent]] = None
