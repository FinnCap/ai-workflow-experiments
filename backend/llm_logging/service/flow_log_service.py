from typing import Dict, List
from uuid import UUID

from fastapi import Depends
from sqlalchemy.orm import Session

from common.base import get_db
from common.enum.node_type import NodeType
from flow.model.flow_log_model import FlowLogModel
from flow.repository.flow_log_repository import FlowLogRepository
from llm_logging.web.response.flow_log_detail_result import (
    FlowLogDetailResult,
    FlowLogModelResult,
)
from llm_logging.web.response.flow_log_result import FlowLogResult


class FlowLogService:

    def __init__(self, db: Session = Depends(get_db)) -> None:
        self.repository = FlowLogRepository(session=db)

    def get_all(self) -> List[FlowLogResult]:
        flow_logs = self.repository.get_all()
        flow_logs_by_execution_id: Dict[UUID, List[FlowLogModel]] = {}
        for flow_log in flow_logs:
            if flow_log.flow_execution_id in flow_logs_by_execution_id:
                flow_logs_by_execution_id[flow_log.flow_execution_id].append(flow_log)
            else:
                flow_logs_by_execution_id[flow_log.flow_execution_id] = [flow_log]

        flow_log_responses: List[FlowLogResult] = []
        for value in flow_logs_by_execution_id.values():
            value.sort(key=lambda x: x.created_at)

            response = FlowLogResult(
                flow_execution_id=value[0].flow_execution_id,
                flow_id=value[0].flow_id,
                started=value[0].created_at,
                stopped=value[-1].created_at,
                total_tokens_in=sum([int(v.input_tokens) for v in value]),
                total_tokens_out=sum([int(v.output_tokens) for v in value]),
            )

            flow_log_responses.append(response)
        return flow_log_responses

    def get_details_by_flow_execution_id(
        self, flow_execution_id: UUID
    ) -> FlowLogDetailResult:
        flow_logs = self.repository.get_by_flow_execution_id(
            flow_execution_id=flow_execution_id
        )
        flow_logs.sort(key=lambda x: x.created_at)
        response = FlowLogDetailResult(
            flow_execution_id=flow_logs[0].flow_execution_id,
            flow_id=flow_logs[0].flow_id,
            started=flow_logs[0].created_at,
            stopped=flow_logs[-1].created_at,
            total_tokens_in=sum([int(v.input_tokens) for v in flow_logs]),
            total_tokens_out=sum([int(v.output_tokens) for v in flow_logs]),
            logs=[],
        )

        output_node = [n for n in flow_logs if n.node_type == NodeType.OUTPUT]
        rest = [n for n in flow_logs if n.node_type != NodeType.OUTPUT]

        for flow_log in rest + output_node:
            flow_log_response = FlowLogModelResult(
                id=flow_log.id,
                node_id=flow_log.node_id,
                node_type=flow_log.node_type,
                in_message=flow_log.messages_in,
                out_message=flow_log.messages_out,
                total_tokens_in=flow_log.input_tokens,
                total_tokens_out=flow_log.output_tokens,
                created_at=flow_log.created_at,
            )
            response.logs.append(flow_log_response)

        return response
