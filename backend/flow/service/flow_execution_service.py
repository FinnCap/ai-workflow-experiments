import logging
from typing import Dict, List, Optional, Union
from uuid import UUID, uuid4

from fastapi import Depends
from sqlalchemy.orm import Session

from agent.service.agent_service import AgentService
from chat.model.messages.user_pdf_content import PdfContent
from chat.repository.message_repository import MessageRepository
from common.base import get_db

from common.decorators.transactional import transactional
from common.enum.node_type import NodeType
from common.errors.flow_execution_exception import FlowExecutionError
from flow.model.flow_log_model import FlowLogModel
from flow.model.flow_model import FlowModel
from flow.model.flow_node_model import FlowNodeModel
from flow.repository.flow_log_repository import FlowLogRepository
from flow.repository.flow_repository import FlowRepository
from flow.service.flow_execution.agent_node_executor import AgentNodeExecutor
from flow.service.flow_execution.decision_node_executor import DecisionNodeExecutor
from flow.service.flow_execution.flow_execution_context import FlowExecutionContext
from flow.service.flow_execution.input_node_executor import InputNodeExecutor
from flow.service.flow_execution.merge_node_executor import MergeNodeExecutor
from flow.service.flow_execution.node_execution_response import NodeExecutionResponse
from flow.service.flow_execution.parallel_node_executor import ParallelNodeExecutor

logger = logging.Logger(__name__)


class FlowExecutionService:
    def __init__(
        self,
        db: Session = Depends(get_db),
        agent_service: AgentService = Depends(),
        agent_executor: AgentNodeExecutor = Depends(),
        merge_executor: MergeNodeExecutor = Depends(),
        decision_executor: DecisionNodeExecutor = Depends(),
        input_executor: InputNodeExecutor = Depends(),
        parallel_executor: ParallelNodeExecutor = Depends(),
    ):

        self.db = db
        self.flow_log_repository = FlowLogRepository(session=db)
        self.agent_service = agent_service
        self.flow_repository = FlowRepository(session=db)
        self.message_repository = MessageRepository(session=db)

        self.agent_executor = agent_executor
        self.merge_executor = merge_executor
        self.decision_executor = decision_executor
        self.input_executor = input_executor
        self.parallel_executor = parallel_executor

    def execute_flow(
        self,
        flow_id: UUID,
        input_str: str,
        agent_call_variables: Optional[Dict[UUID, Dict[UUID, Dict[str, str]]]],
        agent_call_headers: Optional[Dict[UUID, Dict[UUID, Dict[str, str]]]],
        pdf_data: List[PdfContent] | None,
    ) -> Optional[str]:
        """Validate flow structure"""

        flow = self.flow_repository.get_by_id(flow_id=flow_id)
        if flow == None:
            return None

        start_node = [n for n in flow.nodes if n.node_type == NodeType.INPUT][0]
        return self._execute_start_node(
            flow=flow,
            current_node=start_node,
            message=input_str,
            agent_call_variables=agent_call_variables,
            agent_call_headers=agent_call_headers,
            pdf_data=pdf_data,
        )

    def _execute_start_node(
        self,
        flow: FlowModel,
        current_node: FlowNodeModel,
        message: str,
        agent_call_variables: Optional[Dict[UUID, Dict[UUID, Dict[str, str]]]],
        agent_call_headers: Optional[Dict[UUID, Dict[UUID, Dict[str, str]]]],
        pdf_data: List[PdfContent] | None,
    ) -> Optional[str]:
        context = FlowExecutionContext(
            flow=flow,
            flow_execution_id=uuid4(),
            node=current_node,
            message=message,
            merge_node=None,
            agent_call_variables=agent_call_variables,
            agent_call_headers=agent_call_headers,
            pdf_data=pdf_data,
        )
        response = self.input_executor.execute(
            context=context, callback=self._call_next_node
        )
        if response.message == None:
            raise FlowExecutionError(
                f"Flow execution didn't return a response: flow: {flow.id}, {response}"
            )
        if isinstance(response.message, list):
            raise FlowExecutionError(
                f"Flow execution returned a list of messages: flow: {flow.id}, {response}"
            )

        return response.message

    def _call_next_node(self, context: FlowExecutionContext) -> NodeExecutionResponse:
        logger.info(context.node.node_type)
        logger.info([context.message])
        if context.node.node_type == NodeType.OUTPUT:
            self.log_step(
                context=context,
                messages_in=context.message,
                messages_out=context.message,
            )
            return NodeExecutionResponse(
                message=context.message, node=context.merge_node
            )
        elif context.node.node_type == NodeType.AGENT:
            return self.agent_executor.execute(
                context=context, callback=self._call_next_node
            )
        elif context.node.node_type == NodeType.DECISION:
            return self.decision_executor.execute(
                context=context, callback=self._call_next_node
            )
        elif context.node.node_type == NodeType.MERGE:
            # this will go back to the parrallel or decision node then
            return NodeExecutionResponse(message=context.message, node=context.node)
        elif context.node.node_type == NodeType.PARALLEL:
            return self.parallel_executor.execute(
                context=context, callback=self._call_next_node
            )
        else:
            return NodeExecutionResponse(
                message=context.message, node=context.merge_node
            )

    @transactional
    def log_step(
        self,
        context: FlowExecutionContext,
        messages_in: Union[List[str], str],
        messages_out: Union[List[str], str],
    ):
        """Log execution step"""

        model = FlowLogModel(
            id=uuid4(),
            flow_id=context.flow.id,
            flow_execution_id=context.flow_execution_id,
            node_id=context.node.id,
            node_type=context.node.node_type,
            messages_in=messages_in,
            messages_out=messages_out,
            input_tokens=0,
            output_tokens=0,
        )
        self.flow_log_repository.create(model)
