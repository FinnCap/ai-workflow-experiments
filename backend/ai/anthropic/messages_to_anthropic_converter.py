import json
from typing import List, Union

from anthropic.types.base64_pdf_source_param import Base64PDFSourceParam
from anthropic.types.document_block_param import DocumentBlockParam
from anthropic.types.message_param import MessageParam
from anthropic.types.text_block_param import TextBlockParam
from anthropic.types.tool_result_block_param import ToolResultBlockParam
from anthropic.types.tool_use_block_param import ToolUseBlockParam

from chat.model.message_model import MessageModel
from chat.model.messages.assistant_message import AssistantMessage
from chat.model.messages.tool_response_message import ToolResponseMessage
from chat.model.messages.user_message import UserMessage
from chat.model.messages.user_pdf_content import PdfContent


def _assistant_to_anthropic(message: AssistantMessage) -> MessageParam:
    content = []
    if message.content != None:
        content.append(TextBlockParam(text=message.content, type="text"))
    if message.tool_calls != None:
        for tool_call in message.tool_calls:
            content.append(
                ToolUseBlockParam(
                    id=tool_call.tool_call_id,
                    input=tool_call.parameters,
                    name=tool_call.tool_name,
                    type="tool_use",
                )
            )
    return MessageParam(
        role="assistant",
        content=content,
    )


def _user_to_anthropic(message: UserMessage) -> MessageParam:
    result_content = []
    if isinstance(message.content, str):
        result_content.append(TextBlockParam(text=message.content, type="text"))
    else:
        for message_content in message.content:
            if isinstance(message_content, PdfContent):
                source = Base64PDFSourceParam(
                    type="base64",
                    media_type="application/pdf",
                    data=message_content.data,
                )
                result_content.append(
                    DocumentBlockParam(source=source, type="document")
                )
            elif isinstance(message_content, str):
                result_content.append(TextBlockParam(text=message_content, type="text"))

    return MessageParam(
        role="user",
        content=result_content,
    )


def _tool_response_to_anthropic(message: ToolResponseMessage) -> MessageParam:
    content = message.response
    if not isinstance(content, str):
        content = json.dumps(content)
    result_content = [
        ToolResultBlockParam(
            tool_use_id=message.tool_call_id, content=content, type="tool_result"
        )
    ]

    return MessageParam(
        role="user",
        content=result_content,
    )


def _message_to_anthropic(
    message: Union[
        AssistantMessage,
        ToolResponseMessage,
        UserMessage,
    ],
) -> MessageParam:

    if isinstance(message, AssistantMessage):
        return _assistant_to_anthropic(message)
    elif isinstance(message, UserMessage):
        return _user_to_anthropic(message)
    elif isinstance(message, ToolResponseMessage):
        return _tool_response_to_anthropic(message=message)
    else:
        raise TypeError(f"Unsupported message type: {type(message)}")


def parse_messages(messages: List[MessageModel]) -> List[MessageParam]:
    # merge the tool response message with the user messages
    parsed_messages: List[MessageParam] = []
    for previous_message in messages:
        anthropic_message = _message_to_anthropic(message=previous_message.content)

        role = anthropic_message.get("role")
        if len(parsed_messages) > 0 and parsed_messages[-1].get("role") == role:

            new_content = anthropic_message.get("content")
            if isinstance(new_content, str):
                new_content = [TextBlockParam(text=new_content, type="text")]

            previous_content = parsed_messages[-1].get("content")
            if isinstance(previous_content, str):
                new_content = [
                    TextBlockParam(text=previous_content, type="text")
                ] + list(new_content)
                parsed_messages[-1].update(content=new_content)
            else:
                parsed_messages[-1].get("content").append(new_content)  # type: ignore
        else:
            parsed_messages.append(anthropic_message)
    return parsed_messages
