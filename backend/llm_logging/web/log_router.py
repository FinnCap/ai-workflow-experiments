from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends

from llm_logging.service.chat_log_service import ChatLogService
from llm_logging.service.flow_log_service import FlowLogService
from llm_logging.web.response.chat_log_result import ChatLogResult
from llm_logging.web.response.flow_log_detail_result import FlowLogDetailResult
from llm_logging.web.response.flow_log_result import FlowLogResult

log_router = APIRouter(prefix="/logs", tags=["Logs"])


@log_router.get("/chat", response_model=List[ChatLogResult])
async def get_all_chat_logs(chat_log_service: ChatLogService = Depends()):
    return chat_log_service.get_all()


@log_router.get("/flow", response_model=List[FlowLogResult])
async def get_all_flow_logs(flow_log_service: FlowLogService = Depends()):
    return flow_log_service.get_all()


@log_router.get("/flow/{flow_execution_id}", response_model=FlowLogDetailResult)
async def get_flow_log_by_execution_id(
    flow_execution_id: UUID,
    flow_log_service: FlowLogService = Depends(),
) -> FlowLogDetailResult:
    return flow_log_service.get_details_by_flow_execution_id(
        flow_execution_id=flow_execution_id
    )
