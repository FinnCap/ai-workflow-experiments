import json
import os
from typing import List

from mistralai import ChatCompletionResponse, Mistral, SystemMessage, TextChunk

from ai.client_interface import ClientInterface
from ai.mistral import messages_to_mistral_converter, tools_to_mistral_converter
from chat.model.message_model import MessageModel
from chat.model.messages.assistant_message import AssistantMessage
from chat.model.messages.tool_call_content import ToolCallContent
from common.enum.available_models import AvailableModels
from common.model.tool_definition_model import ToolDefinitionModel


class MistralClient(ClientInterface):

    def __init__(
        self,
        system_prompt: str,
        temperature: float,
        model: AvailableModels,
        tools: List[ToolDefinitionModel],
    ) -> None:
        self.client = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))
        self.system_prompt = system_prompt
        self.model = model
        self.tools = tools_to_mistral_converter.parse_tools(tools=tools)
        self.temperature = temperature

    def send_message(self, messages: List[MessageModel]) -> AssistantMessage:
        message = self.client.chat.complete(
            model=self.model.value,
            max_tokens=1000,
            temperature=self.temperature,
            tools=self.tools,
            messages=[SystemMessage(content=self.system_prompt)]
            + messages_to_mistral_converter.parse_messages(messages),
        )

        return self._parse_response(message)

    def _parse_response(self, message: ChatCompletionResponse) -> AssistantMessage:
        """Parse the Mistral response into structured format"""

        result = AssistantMessage()
        result.input_token_count = message.usage.prompt_tokens or 0
        result.output_token_count = message.usage.completion_tokens or 0

        # Parse content blocks

        content_block = message.choices[0]

        if isinstance(content_block.message.content, str):
            if content_block.message.content != "":
                result.content = content_block.message.content
        else:
            for c in content_block.message.content or []:
                if isinstance(c, TextChunk):
                    # I am actuall not sure if this is really a case to have multiple text content blocks in one assitant message
                    result.content = (
                        result.content if result.content != None else "" + "\n" + c.text
                    )

        if content_block.message.tool_calls:
            result.tool_calls = []
            for tool_call in content_block.message.tool_calls:
                if isinstance(tool_call.function.arguments, str):
                    # could fail but then everything afterwards will also fail, so there has to be better error handling
                    args = json.loads(tool_call.function.arguments)
                else:
                    args = tool_call.function.arguments
                result.tool_calls.append(
                    ToolCallContent(
                        tool_name=tool_call.function.name,
                        tool_call_id=tool_call.id or "",
                        api_id=None,
                        parameters=args,
                    )
                )

        return result
