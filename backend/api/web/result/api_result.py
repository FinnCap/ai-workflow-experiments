from datetime import datetime
from typing import Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from api.model.api_model import ApiModel
from common.model.tool_definition_model import ToolDefinitionModel


class ApiResult(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    active: bool
    tool_description: ToolDefinitionModel
    variables: Optional[Dict[str, Optional[str]]]
    headers: Optional[Dict[str, Optional[str]]]
    response_hidden_fields: Optional[List[str]]
    path_variables: Optional[Dict[str, str]] = None
    created_at: datetime
    updated_at: datetime
    method: str
    url: str

    @classmethod
    def from_model(cls, model: ApiModel) -> "ApiResult":
        return cls.model_validate(model)
