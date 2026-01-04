"""
Prepares the input schema before giving it to the AI

"""

import copy
from typing import Any, Dict, List

from api.model.api_model import ApiModel
from common.model.tool_definition_model import (
    InputSchema,
    InputSchemaType,
    Property,
    ToolDefinitionModel,
)


def prepare(api_models: List[ApiModel]) -> List[ToolDefinitionModel]:
    ai_tools: List[ApiModel] = copy.deepcopy(api_models)
    for api_model in ai_tools:

        api_model.tool_description.input_schema = _add_path_variables(
            path_variables=api_model.path_variables,
            input_schema=api_model.tool_description.input_schema,
        )
        api_model.tool_description.input_schema = _remove_defaults(
            variables=api_model.variables,
            input_schema=api_model.tool_description.input_schema,
        )

    return [a.tool_description for a in ai_tools]


def _remove_defaults(
    variables: Dict[str, Any],
    input_schema: InputSchema,
) -> InputSchema:
    """Remove properties which are predefined so they are needed by the api, but the AI should not see and also not set them.

    This could for example be the id of a user.
    """
    ai_input_schema = InputSchema(type=input_schema.type, properties={})

    for name, data in input_schema.properties.items():
        if name in list(variables.keys()):
            continue
        if data.type == InputSchemaType.OBJECT and data.properties != None:
            data.properties = _remove_defaults_from_property(
                variables=variables, properties=data.properties
            )
            ai_input_schema.properties[name] = data
        else:
            ai_input_schema.properties[name] = data
    return ai_input_schema


def _remove_defaults_from_property(
    variables: Dict[str, str | None],
    properties: Dict[str, Property],
) -> Dict[str, Property]:
    """Remove properties which are predefined so they are needed by the api, but the AI should not see and also not set them.

    This could for example be the id of a user.
    """
    ai_input_properties: Dict[str, Property] = {}

    for name, data in properties.items():
        if name in list(variables.keys()):
            continue
        if data.type == InputSchemaType.OBJECT and data.properties != None:
            data.properties = _remove_defaults_from_property(
                variables=variables, properties=data.properties
            )
            ai_input_properties[name] = data
        else:
            ai_input_properties[name] = data

    return ai_input_properties


def _add_path_variables(
    path_variables: Dict[str, str],
    input_schema: InputSchema,
) -> InputSchema:
    """We can define path variables in the url. www.example.de/user/{id}

    id is the variable

    These are by default not part of the input schema or the body of the request, so they need to be added.
    """
    if path_variables == None:
        return input_schema

    ai_input_schema = copy.deepcopy(input_schema)

    for variable_name, value in path_variables.items():

        if value != None:  # should be set by something predefined
            continue
        ai_input_schema.properties[variable_name] = Property(
            type=InputSchemaType.STRING, required=True
        )

    return ai_input_schema
    return ai_input_schema
    return ai_input_schema
    return ai_input_schema
    return ai_input_schema
    return ai_input_schema
