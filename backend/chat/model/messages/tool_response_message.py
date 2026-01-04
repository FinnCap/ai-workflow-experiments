from typing import Any, Dict, List, Literal, Union
from uuid import UUID

from pydantic import BaseModel


class ToolResponseMessage(BaseModel):
    type: Literal["tool_response"] = "tool_response"
    tool_call_id: str
    api_id: UUID
    response: Union[str, List[Dict[str, Any]], Dict[str, Any]]
