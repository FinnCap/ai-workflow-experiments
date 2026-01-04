import concurrent.futures
import copy
from typing import Callable, List

from fastapi import Depends
from flow.model.flow_node_model import FlowNodeModel
from flow.service.flow_execution.base_node_executor import BaseNodeExecutor
from flow.service.flow_execution.flow_execution_context import FlowExecutionContext
from flow.service.flow_execution.merge_node_executor import MergeNodeExecutor
from flow.service.flow_execution.node_execution_response import NodeExecutionResponse


class ParallelNodeExecutor(BaseNodeExecutor):
    """Executor for agent nodes"""

    def __init__(
        self,
        merge_executor: MergeNodeExecutor = Depends(),
    ):
        super().__init__()
        self.merge_executor = merge_executor

    def execute(
        self,
        context: FlowExecutionContext,
        callback: Callable[[FlowExecutionContext], NodeExecutionResponse],
    ) -> NodeExecutionResponse:

        next_nodes = self.find_next_nodes(flow=context.flow, current_node=context.node)

        self.log_step(
            context=context,
            messages_in=context.message,
            messages_out=context.message,
            messages=[],
        )

        # Execute all calls in parallel using ThreadPoolExecutor
        results: List[NodeExecutionResponse] = []
        with concurrent.futures.ThreadPoolExecutor() as executor:

            # Submit all tasks
            future_to_node = {
                executor.submit(
                    self._call_node, next_node, context, callback
                ): next_node
                for next_node in next_nodes
            }

            for future in concurrent.futures.as_completed(future_to_node):
                result = future.result()
                assert result.message != None and result.node != None
                results.append(result)

        assert len(results) != 0
        messages: List[str] = []
        nodes: List[FlowNodeModel] = []
        for r in results:
            assert isinstance(r.message, str)
            messages.append(r.message)
            assert isinstance(r.node, FlowNodeModel)
            nodes.append(r.node)

        context.set_message_and_next_node(message=messages, next_node=nodes[0])

        return self.merge_executor.execute(context=context, callback=callback)

    def _call_node(
        self,
        next_node: FlowNodeModel,
        context: FlowExecutionContext,
        callback: Callable[[FlowExecutionContext], NodeExecutionResponse],
    ):
        new_context = copy.deepcopy(context)
        new_context.merge_node = None
        new_context.node = next_node
        return callback(new_context)
