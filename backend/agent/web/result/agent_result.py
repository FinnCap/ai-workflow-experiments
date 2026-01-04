from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from agent.model.agent_model import AgentModel
from api.web.result.api_result import ApiResult
from common.enum.available_models import AvailableModels
from common.enum.model_provider import ModelProvider


class AgentResult(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    description: str
    api_models: List[ApiResult]
    temperature: float
    created_at: datetime
    updated_at: datetime
    model_provider: ModelProvider
    model_name: AvailableModels

    @classmethod
    def from_model(cls, model: AgentModel) -> "AgentResult":
        return cls.model_validate(model)
