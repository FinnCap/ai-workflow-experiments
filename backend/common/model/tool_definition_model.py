from enum import Enum
from typing import Any, Dict, Literal, Optional

from pydantic import BaseModel, ConfigDict


class InputSchemaType(str, Enum):
    STRING = "string"
    INTEGER = "integer"
    NUMBER = "number"
    BOOLEAN = "boolean"
    ARRAY = "array"
    OBJECT = "object"


class Property(BaseModel):
    type: InputSchemaType
    description: str = ""
    predefined_variable_name: Optional[str] = None
    properties: Optional[Dict[str, "Property"]] = None
    required: Optional[bool] = None


def _parse_input_properties(properties: Dict[str, Property]) -> Dict[str, Any]:
    parsed: Dict[str, Any] = {}
    for name, value in properties.items():
        if value.type != InputSchemaType.OBJECT:
            parsed[name] = {
                "type": value.type.value,
                "description": value.description,
            }
        elif value.properties != None:
            required = [
                prop_name
                for prop_name, prop_value in value.properties.items()
                if prop_value.required == True
            ]
            parsed[name] = {
                "type": value.type.value,
                "description": value.description,
                "properties": _parse_input_properties(properties=value.properties),
                "required": required,
            }
    return parsed


class InputSchema(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal["object"]
    properties: Dict[str, Property]  # str is the name of the property

    def to_ai_dict(self) -> Dict[str, Any]:
        required = [
            prop_name
            for prop_name, prop_value in self.properties.items()
            if prop_value.required == True
        ]
        return {
            "type": self.type,
            "properties": _parse_input_properties(self.properties),
            "required": required,
        }


class ToolDefinitionModel(BaseModel):
    name: str
    description: str
    input_schema: InputSchema
