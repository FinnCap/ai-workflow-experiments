import json
from typing import Callable, List

from fastapi import Depends

from agent.service.agent_service import AgentService
from ai.ai_service import AiService
from chat.model.messages.assistant_message import AssistantMessage
from common.errors.choice_error import ChoiceError
from common.errors.flow_execution_exception import FlowExecutionError
from flow.service.flow_execution.base_node_executor import BaseNodeExecutor
from flow.service.flow_execution.flow_execution_context import FlowExecutionContext
from flow.service.flow_execution.node_execution_response import NodeExecutionResponse


class AgentNodeExecutor(BaseNodeExecutor):
    """Executor for agent nodes"""

    def __init__(
        self,
        agent_service: AgentService = Depends(),
        ai_service: AiService = Depends(),
    ):
        super().__init__()
        self.agent_service = agent_service
        self.ai_service = ai_service

    def execute(
        self,
        context: FlowExecutionContext,
        callback: Callable[[FlowExecutionContext], NodeExecutionResponse],
    ) -> NodeExecutionResponse:

        node_id = context.node.id
        flow_id = context.node.flow_id
        agent_id = context.node.agent_id

        if agent_id == None:
            raise FlowExecutionError(
                f"Node does not have a ID node: {node_id}, flow: {flow_id}"
            )

        if isinstance(context.message, list):
            raise FlowExecutionError(
                f"Agent node message input has to be a single string: {node_id}, flow: {flow_id}, {context.message}"
            )

        agent = self.agent_service.get_by_id(agent_id)
        if agent == None:
            raise FlowExecutionError(
                f"Agent associated with id {agent_id} does not exist in flow execution node: {node_id}, flow: {flow_id}"
            )

        agent_headers = {}
        if context.agent_call_headers:
            agent_headers = context.agent_call_headers.get(agent.id, {})

        agent_variables = {}
        if context.agent_call_variables:
            agent_variables = context.agent_call_variables.get(agent.id, {})

        files = []
        if context.pdf_data != None:
            for pdf in context.pdf_data:
                files.append(pdf)

        reponse_messages = self.ai_service.execute_agent_flow(
            text_input=context.message,
            flow_execution_id=context.flow_execution_id,
            node_id=node_id,
            flow_id=flow_id,
            files=files,
            agent=agent,
            agent_call_variables=agent_variables,
            agent_call_headers=agent_headers,
        )

        context.pdf_data = None

        if len(reponse_messages) == 0:
            raise FlowExecutionError(
                f"Agent AI service did not return a response message: Node Id {node_id}, flow: {flow_id}"
            )

        if not isinstance(reponse_messages[-1].content, AssistantMessage):
            raise ChoiceError(
                f"Agent AI service did not return a response message: Node Id {node_id}, flow: {flow_id}"
            )

        response_text = reponse_messages[-1].content.content
        if response_text == None:
            raise ChoiceError(
                f"Agent AI service did not return a response message string : Node Id {node_id}, flow: {flow_id}"
            )

        next_nodes = self.find_next_nodes(flow=context.flow, current_node=context.node)

        assert len(next_nodes) == 1

        log_msgs: List[str] = []
        for m in reponse_messages:
            if m.content.type == "user":
                if isinstance(m.content.content, list):
                    log_msgs += [c for c in m.content.content if isinstance(c, str)]
                else:
                    log_msgs.append(m.content.content)
            elif m.content.type == "tool_response":
                if isinstance(m.content.response, list) or isinstance(
                    m.content.response, dict
                ):
                    log_msgs.append(json.dumps(m.content.response))
                else:
                    log_msgs.append(m.content.response)

            elif m.content.type == "assistant":
                if m.content.content != None:
                    log_msgs.append(m.content.content)
                if m.content.tool_calls != None:
                    for t in m.content.tool_calls:
                        log_msgs.append(json.dumps(t.parameters))

        self.log_step(
            context=context,
            messages_in=context.message,
            messages_out=log_msgs,
            messages=reponse_messages,
        )

        context.set_message_and_next_node(
            message=response_text, next_node=next_nodes[0]
        )

        return callback(context)
