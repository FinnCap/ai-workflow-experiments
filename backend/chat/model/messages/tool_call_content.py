from typing import Any, Dict, Optional
from uuid import UUID

from pydantic import BaseModel


class ToolCallContent(BaseModel):
    tool_name: str
    tool_call_id: str
    api_id: Optional[UUID] = None  # optional if the ai calls a tool that does not exist
    parameters: Dict[str, Any]
