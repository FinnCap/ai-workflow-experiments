from typing import Callable

from common.errors.flow_execution_exception import FlowExecutionError
from flow.service.flow_execution.base_node_executor import BaseNodeExecutor
from flow.service.flow_execution.flow_execution_context import FlowExecutionContext
from flow.service.flow_execution.node_execution_response import NodeExecutionResponse


class InputNodeExecutor(BaseNodeExecutor):
    """Executor for agent nodes"""

    def __init__(self):
        super().__init__()

    def execute(
        self,
        context: FlowExecutionContext,
        callback: Callable[[FlowExecutionContext], NodeExecutionResponse],
    ) -> NodeExecutionResponse:
        node_id = context.node.id
        flow_id = context.node.flow_id

        nodes = self.find_next_nodes(
            flow=context.flow,
            current_node=context.node,
        )

        if len(nodes) != 1:
            raise FlowExecutionError(
                f"Input Node has more than one following node {node_id}, flow: {flow_id}"
            )

        self.log_step(
            context=context,
            messages_in=context.message,
            messages_out=context.message,
            messages=[],
        )

        context.node = nodes[0]

        return callback(context)
