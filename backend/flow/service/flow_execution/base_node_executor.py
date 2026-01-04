from abc import ABC, abstractmethod
from typing import Callable, List, Union
from uuid import uuid4

from common.base import SessionLocal
from chat.model.message_model import MessageModel
from chat.model.messages.assistant_message import AssistantMessage
from flow.model.flow_log_model import FlowLogModel
from flow.model.flow_model import FlowModel
from flow.model.flow_node_model import FlowNodeModel
from flow.repository.flow_log_repository import FlowLogRepository
from flow.service.flow_execution.flow_execution_context import FlowExecutionContext
from flow.service.flow_execution.node_execution_response import NodeExecutionResponse


class BaseNodeExecutor(ABC):
    """Base class for all node executors"""

    @abstractmethod
    def execute(
        self,
        context: FlowExecutionContext,
        callback: Callable[[FlowExecutionContext], NodeExecutionResponse],
    ) -> NodeExecutionResponse:
        """Execute the node with the given context"""
        pass

    def find_next_nodes(
        self, flow: FlowModel, current_node: FlowNodeModel
    ) -> List[FlowNodeModel]:
        """Find next nodes connected to the current node"""
        next_nodes: List[FlowNodeModel] = []
        for edge in flow.edges:
            if edge.source_node.id == current_node.id:
                next_nodes.append(edge.target_node)
        return next_nodes

    def log_step(
        self,
        context: FlowExecutionContext,
        messages_in: Union[List[str], str],
        messages_out: Union[List[str], str],
        messages: List[MessageModel],
    ):
        db = SessionLocal()
        try:
            input_tokens = 0
            output_tokens = 0

            for m in messages:
                if isinstance(m.content, AssistantMessage):
                    input_tokens += m.content.input_token_count
                    output_tokens += m.content.output_token_count

            flow_log_repository = FlowLogRepository(session=db)

            model = FlowLogModel(
                id=uuid4(),
                flow_id=context.flow.id,
                flow_execution_id=context.flow_execution_id,
                node_id=context.node.id,
                node_type=context.node.node_type,
                messages_in=messages_in,
                messages_out=messages_out,
                input_tokens=input_tokens,
                output_tokens=output_tokens,
            )
            flow_log_repository.create(model)
            db.commit()
        except Exception as e:
            db.rollback()
            raise
        finally:
            db.close()
