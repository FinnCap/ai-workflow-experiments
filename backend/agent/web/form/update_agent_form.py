from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field

from agent.model.agent_model import AgentModel
from api.model.api_model import ApiModel
from common.enum.available_models import AvailableModels
from common.enum.model_provider import ModelProvider


class UpdateAgentForm(BaseModel):
    model_provider: Optional[ModelProvider] = None
    model_name: Optional[AvailableModels] = None
    name: Optional[str] = None
    temperature: float
    api_ids: List[UUID] = Field(default_factory=list)
    description: Optional[str] = None

    def to_model(self, agent_id: UUID, api_models: List[ApiModel]) -> AgentModel:
        return AgentModel(
            id=agent_id,
            api_models=api_models,
            name=self.name,
            temperature=self.temperature,
            model_provider=self.model_provider,
            model_name=self.model_name,
            description=self.description,
        )
