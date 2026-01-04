from datetime import datetime
from typing import Dict, List, Optional
from uuid import UUID

from agent.model.agent_model import AgentModel
from ai.agent import Agent
from ai.ai_service_context import AiServiceContext
from ai.anthropic.anthropic_client import AnthropicClient
from ai.client_interface import ClientInterface
from ai.mistral.mistral_client import MistralClient
from ai.utils import ai_tool_params_utils
from api.model.api_model import ApiModel
from chat.model.chat_model import ChatModel
from chat.model.message_model import MessageModel
from chat.model.messages.user_message import UserMessage
from chat.model.messages.user_pdf_content import PdfContent
from common.enum.available_models import AvailableModels
from common.enum.message_role import MessageRole


class AiService:

    def execute_agent_flow(
        self,
        flow_id: UUID,
        node_id: UUID,
        flow_execution_id: UUID,
        text_input: str,
        agent: AgentModel,
        agent_call_variables: Dict[UUID, Dict[str, str]],
        agent_call_headers: Dict[UUID, Dict[str, str]],
        files: Optional[List[PdfContent]] = None,
    ) -> List[MessageModel]:
        """Execute agent flow with context variables"""

        ctx = AiServiceContext(
            text_input=text_input,
            previous_messages=[],
            flow_id=flow_id,
            node_id=node_id,
            files=files,
            flow_execution_id=flow_execution_id,
            agent_call_variables=agent_call_variables,
            agent_call_headers=agent_call_headers,
            system_prompt=agent.description,
            temperature=agent.temperature,
            model_name=agent.model_name,
            api_models=agent.api_models,
        )

        return self._execute_agent(ctx=ctx)

    def call_flow(
        self,
        flow_id: UUID,
        node_id: UUID,
        flow_execution_id: UUID,
        text_input: str,
        system_prompt: str,
        temperature: float,
        model_name: AvailableModels,
        files: Optional[List[PdfContent]] = None,
    ) -> List[MessageModel]:
        """Execute flow for example descision"""

        ctx = AiServiceContext(
            text_input=text_input,
            previous_messages=[],
            flow_id=flow_id,
            node_id=node_id,
            files=files,
            flow_execution_id=flow_execution_id,
            agent_call_variables={},
            agent_call_headers={},
            system_prompt=system_prompt,
            temperature=temperature,
            model_name=model_name,
            api_models=[],
        )

        return self._execute_agent(ctx=ctx)

    def execute_agent_chat(
        self,
        chat: ChatModel,
        text_input: str,
        files: List[PdfContent],
        agent: AgentModel,
        previous_messages: List[MessageModel],
        agent_call_variables: Dict[UUID, Dict[str, str]],
        agent_call_headers: Dict[UUID, Dict[str, str]],
    ) -> List[MessageModel]:
        """Execute agent chat with context variables"""
        ctx = AiServiceContext(
            previous_messages=previous_messages,
            text_input=text_input,
            files=files,
            chat_id=chat.id,
            agent_call_variables=agent_call_variables,
            agent_call_headers=agent_call_headers,
            system_prompt=agent.description,
            temperature=agent.temperature,
            model_name=agent.model_name,
            api_models=agent.api_models,
        )

        return self._execute_agent(ctx=ctx, return_all_message=False)

    def _execute_agent(
        self, ctx: AiServiceContext, return_all_message: bool = True
    ) -> List[MessageModel]:
        """
        Send a message to the agent.
        If the chat_id is not None, then the chat history will also be given to the agent
        """
        client = self._get_client(
            model_name=ctx.model_name,
            system_prompt=ctx.system_prompt,
            temperature=ctx.temperature,
            api_models=ctx.api_models,
        )

        agent = Agent(
            client=client,
            api_models=ctx.api_models,
            agent_call_headers=ctx.agent_call_headers,
            agent_call_variables=ctx.agent_call_variables,
        )

        user_message = self._get_initial_user_message(ctx)
        ctx.previous_messages.append(user_message)

        response = agent.execute(messages=ctx.previous_messages)

        if return_all_message:
            return ctx.previous_messages + response
        else:
            return [user_message] + response

    def _get_client(
        self,
        model_name: AvailableModels,
        system_prompt: str,
        temperature: float,
        api_models: List[ApiModel],
    ) -> ClientInterface:
        if model_name.is_claude():
            return AnthropicClient(
                system_prompt=system_prompt,
                temperature=temperature,
                model=model_name,
                tools=ai_tool_params_utils.prepare(api_models=api_models),
            )
        elif model_name.is_mistral():
            return MistralClient(
                system_prompt=system_prompt,
                temperature=temperature,
                model=model_name,
                tools=ai_tool_params_utils.prepare(api_models=api_models),
            )
        else:
            raise Exception("Unknown Model provider")

    def _get_initial_user_message(self, ctx: AiServiceContext) -> MessageModel:
        if ctx.files != None:
            content: List[str | PdfContent] = [ctx.text_input]
            for file in ctx.files:
                content.append(
                    PdfContent(
                        file_name=file.file_name,
                        media_type=file.media_type,
                        data=file.data,
                    )
                )
            user_message_content = UserMessage(content=content)
        else:
            user_message_content = UserMessage(content=ctx.text_input)

        user_message = MessageModel(
            chat_id=ctx.chat_id,
            chat_position_id=len(ctx.previous_messages),
            role=MessageRole.USER,
            created_at=datetime.now(),
        )
        user_message.content = user_message_content

        return user_message
