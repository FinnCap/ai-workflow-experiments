from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from agent.service.agent_service import AgentService
from agent.web.form.create_agent_form import CreateAgentForm
from agent.web.form.update_agent_form import UpdateAgentForm
from agent.web.result.agent_result import AgentResult

agent_router = APIRouter(prefix="/agent", tags=["Agent"])


@agent_router.get("/", response_model=List[AgentResult])
async def get_all(agent_service: AgentService = Depends()):
    response = agent_service.get_all()
    return [AgentResult.from_model(r) for r in response]


@agent_router.post("/", response_model=AgentResult)
async def create_agent(form: CreateAgentForm, agent_service: AgentService = Depends()):
    response = agent_service.create_agent(form=form)
    return AgentResult.from_model(response)


@agent_router.get("/{agent_id}", response_model=AgentResult)
async def get_by_id(agent_id: UUID, agent_service: AgentService = Depends()):
    response = agent_service.get_by_id(agent_id)
    if not response:
        raise HTTPException(status_code=404, detail="Agent not found")
    return AgentResult.from_model(response)


@agent_router.put("/{agent_id}", response_model=AgentResult)
async def update_agent(
    agent_id: UUID, form: UpdateAgentForm, agent_service: AgentService = Depends()
):
    response = agent_service.update_agent(agent_id=agent_id, form=form)
    if not response:
        raise HTTPException(status_code=404, detail="Agent not found")
    return AgentResult.from_model(response)


@agent_router.delete("/{agent_id}")
async def delete_agent(agent_id: UUID, agent_service: AgentService = Depends()):
    response = agent_service.delete_agent(agent_id=agent_id)
    if not response:
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"message": "Agent deleted successfully"}
