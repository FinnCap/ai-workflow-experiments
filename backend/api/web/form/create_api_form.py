from typing import Dict, List, Optional
from uuid import uuid4

from pydantic import BaseModel

from api.model.api_model import ApiModel

from common.enum.http_method import HttpMethod
from common.model.tool_definition_model import ToolDefinitionModel


class CreateAPIForm(BaseModel):
    tool_description: ToolDefinitionModel
    variables: Optional[Dict[str, Optional[str]]] = None
    headers: Optional[Dict[str, Optional[str]]] = None
    response_hidden_fields: Optional[List[str]] = None
    path_variables: Optional[Dict[str, str]] = None
    method: HttpMethod
    url: str

    def to_model(self) -> ApiModel:
        api_model = ApiModel(
            id=uuid4(),
            name=self.tool_description.name,
            url=self.url,
            method=HttpMethod(self.method),
            headers=self.headers,
            variables=self.variables,
            path_variables=self.path_variables,
            response_hidden_fields=self.response_hidden_fields,
            tool_description=self.tool_description,
        )
        return api_model
