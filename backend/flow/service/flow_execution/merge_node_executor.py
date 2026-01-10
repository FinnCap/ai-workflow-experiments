from typing import Callable

from fastapi import Depends

from ai.ai_service import AiService
from chat.model.messages.assistant_message import AssistantMessage
from common.enum.available_models import AvailableModels
from common.errors.choice_error import ChoiceError
from flow.service.flow_execution.base_node_executor import BaseNodeExecutor
from flow.service.flow_execution.flow_execution_context import FlowExecutionContext
from flow.service.flow_execution.node_execution_response import NodeExecutionResponse


class MergeNodeExecutor(BaseNodeExecutor):
    """Executor for agent nodes"""

    def __init__(self, ai_service: AiService = Depends()):
        super().__init__()
        self.ai_service = ai_service

    def execute(
        self,
        context: FlowExecutionContext,
        callback: Callable[[FlowExecutionContext], NodeExecutionResponse],
    ) -> NodeExecutionResponse:

        if isinstance(context.message, str):
            return NodeExecutionResponse(
                message=context.message, node=context.merge_node
            )
        if len(context.message) == 1:
            return NodeExecutionResponse(
                message=context.message[0], node=context.merge_node
            )

        node_id = context.node.id
        flow_id = context.node.flow_id
        flow_execution_id = context.flow_execution_id

        system_prompt = self._get_system_prompt()
        user_message = self._get_user_message(context=context)

        reponse_messages = self.ai_service.call_flow(
            flow_execution_id=flow_execution_id,
            node_id=node_id,
            flow_id=flow_id,
            text_input=user_message,
            system_prompt=system_prompt,
            temperature=0.0,
            model_name=AvailableModels.ANTHROPIC_CLAUDE_HAIKU_4_5,
        )

        if len(reponse_messages) == 0 or not isinstance(
            reponse_messages[-1].content, AssistantMessage
        ):
            raise ChoiceError(
                f"LLM did not merge the branches corretly: {node_id} {context.node.data['decisions']}; {reponse_messages}"
            )

        response_text = reponse_messages[-1].content.content
        if response_text == None:
            raise ChoiceError(
                f"Merge node did not return a response message string : Node Id {node_id}, flow: {flow_id}"
            )

        next_nodes = self.find_next_nodes(flow=context.flow, current_node=context.node)

        assert len(next_nodes) == 1

        self.log_step(
            context=context,
            messages_in=context.message,
            messages_out=response_text,
            messages=reponse_messages,
        )

        context.set_message_and_next_node(
            message=response_text, next_node=next_nodes[0]
        )

        return callback(context)

    def _get_system_prompt(self) -> str:
        a = "You are a helpful assistant that is supposed to "
        a += "combine a list of messages into one output message, don't forget any details and structure everything nicely"
        return a

    def _get_user_message(self, context: FlowExecutionContext) -> str:
        human_messages = []
        for i, message in enumerate(context.message):
            human_messages.append(f"---{i+1}.---\n{message}")
        return "\n\n".join(human_messages)
