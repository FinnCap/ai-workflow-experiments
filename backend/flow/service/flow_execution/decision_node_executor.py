from typing import Callable

from fastapi import Depends

from ai.ai_service import AiService
from chat.model.messages.assistant_message import AssistantMessage
from common.enum.available_models import AvailableModels
from common.errors.choice_error import ChoiceError
from flow.service.flow_execution.base_node_executor import BaseNodeExecutor
from flow.service.flow_execution.flow_execution_context import FlowExecutionContext
from flow.service.flow_execution.merge_node_executor import MergeNodeExecutor
from flow.service.flow_execution.node_execution_response import NodeExecutionResponse


class DecisionNodeExecutor(BaseNodeExecutor):
    """Executor for agent nodes"""

    def __init__(
        self,
        merge_executor: MergeNodeExecutor = Depends(),
        ai_service: AiService = Depends(),
    ):
        super().__init__()
        self.merge_executor = merge_executor
        self.ai_service = ai_service

    def execute(
        self,
        context: FlowExecutionContext,
        callback: Callable[[FlowExecutionContext], NodeExecutionResponse],
    ) -> NodeExecutionResponse:

        node_id = context.node.id
        flow_id = context.node.flow_id
        flow_execution_id = context.flow_execution_id

        system_prompt = self._get_system_prompt(context=context)
        user_message = self._get_user_message(context=context)

        files = []
        if context.pdf_data != None:
            for pdf in context.pdf_data:
                files.append(pdf)

        reponse_messages = self.ai_service.call_flow(
            flow_execution_id=flow_execution_id,
            node_id=node_id,
            flow_id=flow_id,
            files=files,
            text_input=user_message,
            system_prompt=system_prompt,
            temperature=0.0,
            model_name=AvailableModels.ANTHROPIC_CLAUDE_HAIKU_4_5,
        )

        context.pdf_data = None

        if len(reponse_messages) == 0 or not isinstance(
            reponse_messages[-1].content, AssistantMessage
        ):
            raise ChoiceError(
                f"LLM did not pick choice: {node_id} {context.node.data['decisions']}; {reponse_messages}"
            )

        response_text = reponse_messages[-1].content.content

        next_node = None
        for edge in context.flow.edges:
            if not edge.source_node_id == context.node.id:
                continue
            if not edge.label:
                continue
            if edge.label.lower() in response_text:
                next_node = edge.target_node

        assert next_node != None

        if not next_node:
            raise ChoiceError(
                f"LLM did not pick a VALID choice: {node_id} {context.node.data['decisions']}; {response_text}"
            )

        assert response_text != None

        self.log_step(
            context=context,
            messages_in=context.message,
            messages_out=response_text,
            messages=reponse_messages,
        )

        context.set_message_and_next_node(message=context.message, next_node=next_node)

        response = callback(context)
        assert response.message != None and response.node != None

        context.set_message_and_next_node(
            message=response.message, next_node=response.node
        )
        context.merge_node = response.node

        return self.merge_executor.execute(context=context, callback=callback)

    def _get_system_prompt(self, context: FlowExecutionContext) -> str:
        a = "You are a helpful assistant that is supposed to choose ONE of"
        a += f" {len(context.node.data['decisions'])} "
        a += "options separated by ;. You are supposed to only return that option and nothing else!"
        return a

    def _get_user_message(self, context: FlowExecutionContext) -> str:
        description = context.node.data["description"]
        possible_decisions = "; ".join(context.node.data["decisions"])
        return f"Input:\n{context.message}\n\nTask:\n{description}\n\nOptions\n{possible_decisions}"
