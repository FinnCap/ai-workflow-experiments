from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from flow.service.flow_execution_service import FlowExecutionService
from flow.service.flow_service import FlowService
from flow.web.form.create_flow_form import CreateFlowForm
from flow.web.form.execute_flow_request import FlowExecutionRequest
from flow.web.form.update_flow_form import UpdateFlowForm
from flow.web.result.flow_small_result import FlowSmallResult
from flow.web.result.flow_result import FlowResult

flow_router = APIRouter(prefix="/flows", tags=["Flow"])


@flow_router.post("/", response_model=FlowResult, status_code=201)
async def create_flow(form: CreateFlowForm, flow_service: FlowService = Depends()):
    flow = flow_service.create_flow(form)
    return FlowResult.from_model(flow)


@flow_router.get("/", response_model=List[FlowSmallResult])
async def get_flows(flow_service: FlowService = Depends()):
    flows = flow_service.get_all_flows()
    return [FlowSmallResult.from_model(flow) for flow in flows]


@flow_router.get("/{flow_id}", response_model=FlowResult)
async def get_flow(flow_id: UUID, flow_service: FlowService = Depends()):
    flow = flow_service.get_flow(flow_id)
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    return FlowResult.from_model(flow)


@flow_router.put("/{flow_id}", response_model=FlowResult)
async def update_flow(
    flow_id: UUID, form: UpdateFlowForm, flow_service: FlowService = Depends()
):
    flow = flow_service.update_flow(flow_id, form)
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    return FlowResult.from_model(flow)


@flow_router.delete("/{flow_id}", status_code=204)
async def delete_flow(flow_id: UUID, flow_service: FlowService = Depends()):
    success = flow_service.delete_flow(flow_id)
    if not success:
        raise HTTPException(status_code=404, detail="Flow not found")
    return {"message": "Flow deleted successfully"}


@flow_router.post("/{flow_id}/execute")
async def execute_flow(
    flow_id: UUID,
    request: FlowExecutionRequest,
    flow_execution_service: FlowExecutionService = Depends(),
):
    response = flow_execution_service.execute_flow(
        flow_id=flow_id,
        input_str=request.input_str,
        pdf_data=request.pdf_data,
        agent_call_variables=request.agent_call_variables,
        agent_call_headers=request.agent_call_headers,
    )
    if not response:
        raise HTTPException(status_code=404, detail="Flow not found")
    return {"flow_response": response}
