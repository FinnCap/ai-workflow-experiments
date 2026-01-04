import logging
from typing import List

import anthropic
from anthropic.types.message import Message as AnthropicMessage

from ai.anthropic import messages_to_anthropic_converter, tools_to_anthropic_converter
from ai.client_interface import ClientInterface
from chat.model.message_model import MessageModel
from chat.model.messages.assistant_message import AssistantMessage
from chat.model.messages.tool_call_content import ToolCallContent
from common.enum.available_models import AvailableModels
from common.model.tool_definition_model import ToolDefinitionModel

logger = logging.Logger(name=__name__)


class AnthropicClient(ClientInterface):

    def __init__(
        self,
        system_prompt: str,
        temperature: float,
        model: AvailableModels,
        tools: List[ToolDefinitionModel],
    ) -> None:
        self.client = anthropic.Anthropic()
        self.system_prompt = system_prompt
        self.model = model
        self.tools = tools_to_anthropic_converter.parse_tools(tools)
        self.temperature = temperature

    def send_message(self, messages: List[MessageModel]) -> AssistantMessage:

        message = self.client.messages.create(
            model=self.model.value,
            max_tokens=1000,
            temperature=self.temperature,
            system=self.system_prompt,
            tools=self.tools,
            messages=messages_to_anthropic_converter.parse_messages(messages),
        )

        return self._parse_response(message)

    def _parse_response(self, message: AnthropicMessage) -> AssistantMessage:
        """Parse the Anthropic to the internal model"""

        assistant_message = AssistantMessage(
            output_token_count=message.usage.output_tokens,
            input_token_count=message.usage.input_tokens,
        )

        # Parse content blocks
        for content_block in message.content:
            if content_block.type == "text":
                assistant_message.content = content_block.text
            elif content_block.type == "tool_use":
                if assistant_message.tool_calls == None:
                    assistant_message.tool_calls = []

                assistant_message.tool_calls.append(
                    ToolCallContent(
                        tool_name=content_block.name,
                        tool_call_id=content_block.id,
                        parameters=content_block.input,
                        api_id=None,  # for now
                    )
                )

        return assistant_message
