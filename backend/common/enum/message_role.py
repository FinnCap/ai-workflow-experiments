import enum


class MessageRole(enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"
    TOOL_RESPONSE = "tool_response"
