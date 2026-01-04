import json
from typing import List, Union

from mistralai import (
    AssistantMessage as MistralAssistantMessage,
    AssistantMessageContent,
)
from mistralai import DocumentURLChunk, FunctionCall, TextChunk, ToolCall
from mistralai import ToolMessage as MistralToolMessage
from mistralai import UserMessage as MistralUserMessage
from mistralai import UserMessageContent

from chat.model.message_model import MessageModel
from chat.model.messages.assistant_message import AssistantMessage
from chat.model.messages.tool_response_message import ToolResponseMessage
from chat.model.messages.user_message import UserMessage
from chat.model.messages.user_pdf_content import PdfContent


def _assistant_to_mistral(message: AssistantMessage) -> MistralAssistantMessage:
    content: AssistantMessageContent = []
    tool_calls: List[ToolCall] = []
    if message.content != None:
        content.append(TextChunk(text=message.content, type="text"))
    if message.tool_calls != None:
        for tool_call in message.tool_calls:
            tool_calls.append(
                ToolCall(
                    id=tool_call.tool_call_id,
                    function=FunctionCall(
                        name=tool_call.tool_name, arguments=tool_call.parameters
                    ),
                )
            )
    return MistralAssistantMessage(
        role="assistant", content=content, tool_calls=tool_calls
    )


def _user_to_mistral(message: UserMessage) -> MistralUserMessage:
    result_content: UserMessageContent = []
    if isinstance(message.content, str):
        result_content.append(TextChunk(text=message.content, type="text"))
    else:
        for message_content in message.content:
            if isinstance(message_content, PdfContent):
                result_content.append(
                    DocumentURLChunk(
                        type="document_url",
                        document_url=f"data:{message_content.media_type};base64,{message_content.data}",
                    )
                )
            elif isinstance(message_content, str):
                result_content.append(TextChunk(text=message_content, type="text"))

    return MistralUserMessage(
        role="user",
        content=result_content,
    )


def _tool_response_to_mistral(message: ToolResponseMessage) -> MistralToolMessage:
    response = message.response
    if not isinstance(response, str):
        response = json.dumps(message.response)

    return MistralToolMessage(
        role="tool",
        tool_call_id=message.tool_call_id,
        content=response,
    )


def _message_to_mistral(
    message: Union[AssistantMessage, ToolResponseMessage, UserMessage],
) -> MistralToolMessage | MistralUserMessage | MistralAssistantMessage:
    if isinstance(message, AssistantMessage):
        return _assistant_to_mistral(message)
    elif isinstance(message, UserMessage):
        return _user_to_mistral(message)
    elif isinstance(message, ToolResponseMessage):
        return _tool_response_to_mistral(message)
    else:
        raise TypeError(f"Unsupported message type: {type(message)}")


def parse_messages(
    messages: List[MessageModel],
) -> List[MistralToolMessage | MistralUserMessage | MistralAssistantMessage]:
    parsed_messages: List[
        MistralToolMessage | MistralUserMessage | MistralAssistantMessage
    ] = []
    for previous_message in messages:
        anthropic_message = _message_to_mistral(message=previous_message.content)
        parsed_messages.append(anthropic_message)

    return parsed_messages
