from typing import List, Literal, Optional

from pydantic import BaseModel

from chat.model.messages.tool_call_content import ToolCallContent


class AssistantMessage(BaseModel):
    type: Literal["assistant"] = "assistant"
    content: Optional[str] = None
    tool_calls: Optional[List[ToolCallContent]] = None
    input_token_count: int = 0
    output_token_count: int = 0
