from typing import Dict, List, Optional

from pydantic import BaseModel

from common.enum.http_method import HttpMethod
from common.model.tool_definition_model import ToolDefinitionModel


class UpdateAPIForm(BaseModel):
    tool_description: ToolDefinitionModel
    variables: Optional[Dict[str, Optional[str]]] = None
    headers: Optional[Dict[str, Optional[str]]] = None
    response_hidden_fields: Optional[List[str]] = None
    path_variables: Optional[Dict[str, str]] = None
    active: Optional[bool] = True
    method: HttpMethod
    url: str
