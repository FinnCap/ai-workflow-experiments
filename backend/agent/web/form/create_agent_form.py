from typing import List
from uuid import UUID, uuid4

from pydantic import BaseModel, Field

from agent.model.agent_model import AgentModel
from api.model.api_model import ApiModel
from common.enum.available_models import AvailableModels
from common.enum.model_provider import ModelProvider


class CreateAgentForm(BaseModel):
    name: str
    model_provider: ModelProvider
    model_name: AvailableModels
    temperature: float
    api_ids: List[UUID] = Field(default_factory=list)
    description: str = ""

    def to_model(self, api_models: List[ApiModel]) -> AgentModel:

        return AgentModel(
            id=uuid4(),
            api_models=api_models,
            name=self.name,
            temperature=self.temperature,
            model_provider=self.model_provider,
            model_name=self.model_name,
            description=self.description,
        )
