from datetime import datetime
from typing import Dict, List, Optional
from uuid import UUID

from ai.client_interface import ClientInterface
from ai.utils import api_tool_params_utils
from ai.utils.execute_mcp_tool import execute_mcp_tool
from api.model.api_model import ApiModel
from chat.model.message_model import MessageModel
from common.enum.message_role import MessageRole
from common.errors.tool_not_exist_error import ToolNotExistError


class Agent:
    def __init__(
        self,
        client: ClientInterface,
        api_models: List[ApiModel],
        agent_call_headers: Dict[UUID, Dict[str, str]],
        agent_call_variables: Dict[UUID, Dict[str, str]],
        max_tool_iterations: int = 10,
    ):

        self.api_models = api_models
        self.max_tool_iterations = max_tool_iterations
        self.agent_call_headers = agent_call_headers
        self.agent_call_variables = agent_call_variables

        self.client = client

    def execute(
        self,
        messages: List[MessageModel],
        chat_id: Optional[UUID] = None,
        flow_id: Optional[UUID] = None,
        node_id: Optional[UUID] = None,
        flow_execution_id: Optional[UUID] = None,
    ) -> List[MessageModel]:
        """Execute a conversation with automatic tool calling"""
        conversation_history = messages.copy()
        new_messages: List[MessageModel] = []

        iterations = 0

        while iterations < self.max_tool_iterations:

            response = self.client.send_message(conversation_history)

            new_message = MessageModel(
                chat_id=chat_id,
                # flow_id=flow_id,
                # node_id=node_id,
                # flow_execution_id=flow_execution_id,
                chat_position_id=len(conversation_history),
                role=MessageRole.ASSISTANT,
                created_at=datetime.now(),
            )
            new_message.content = response

            conversation_history.append(new_message)
            new_messages.append(new_message)

            if response.tool_calls == None or len(response.tool_calls) == 0:
                return new_messages

            for tool_call in response.tool_calls:
                api = self._get_api(tool_call.tool_name)
                tool_call.api_id = api.id

                url, arguments = api_tool_params_utils.prepare_for_request(
                    api_model=api,
                    ai_arguments=tool_call.parameters,
                    agent_call_variables=self.agent_call_variables.get(api.id, {}),
                )

                result = execute_mcp_tool(
                    tool_use_id=tool_call.tool_call_id,
                    api_model=api,
                    arguments=arguments,
                    url=url,
                    agent_call_headers=self.agent_call_headers.get(api.id, {}),
                )

                conversation_history.append(
                    MessageModel(
                        chat_id=chat_id,
                        # flow_id=flow_id,
                        # node_id=node_id,
                        # flow_execution_id=flow_execution_id,
                        chat_position_id=len(conversation_history),
                        role=MessageRole.TOOL_RESPONSE,
                        created_at=datetime.now(),
                    )
                )
                conversation_history[-1].content = result
                new_messages.append(conversation_history[-1])

            iterations += 1

        # If we hit max iterations, return what we have
        return new_messages

    def _get_api(self, tool_name: str) -> ApiModel:
        """Format parsed messages back to Anthropic API format"""
        for api_model in self.api_models:
            if api_model.name == tool_name:
                return api_model
        raise ToolNotExistError(
            f"Anthropic chose a tool which does not exist: {tool_name}; {[api.name for api in self.api_models]}"
        )
