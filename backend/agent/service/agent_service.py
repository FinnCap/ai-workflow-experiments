from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID

from fastapi import Depends
from sqlalchemy.orm.session import Session

from agent.model.agent_model import AgentModel
from agent.repository.agent_repository import AgentRepository
from agent.web.form.create_agent_form import CreateAgentForm
from agent.web.form.update_agent_form import UpdateAgentForm
from api.service.api_service import ApiService
from common.base import get_db
from common.decorators.transactional import transactional


class AgentService:
    def __init__(
        self, db: Session = Depends(get_db), api_service: ApiService = Depends()
    ) -> None:
        self.db = db
        self.repo = AgentRepository(db)
        self.api_service = api_service

    def get_all(self) -> List[AgentModel]:
        return self.repo.get_all()

    @transactional
    def create_agent(self, form: CreateAgentForm) -> AgentModel:
        api_models = self.api_service.get_all_by_ids(form.api_ids)
        agent = form.to_model(api_models=api_models)
        created_agent = self.repo.create(agent=agent)
        return created_agent

    def get_by_id(self, agent_id: UUID) -> AgentModel | None:
        return self.repo.get_by_id(agent_id=agent_id)

    @transactional
    def update_agent(
        self, agent_id: UUID, form: UpdateAgentForm
    ) -> Optional[AgentModel]:

        agent_to_update = self.repo.get_by_id(agent_id)
        if not agent_to_update:
            return None

        api_models = self.api_service.get_all_by_ids(form.api_ids)
        agent_to_update.api_models = api_models

        update_data = form.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(agent_to_update, key, value)

        agent_to_update.updated_at = datetime.now(tz=timezone.utc)

        updated_agent = self.repo.update(agent=agent_to_update)

        return updated_agent

    @transactional
    def delete_agent(self, agent_id: UUID) -> bool:
        return self.repo.delete(agent_id=agent_id)
