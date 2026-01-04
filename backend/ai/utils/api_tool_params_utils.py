"""
Prepare the input schema and url before sending the request to the api
"""

import logging
from typing import Any, Dict, Tuple

from api.model.api_model import ApiModel
from common.model.tool_definition_model import InputSchemaType, Property

logger = logging.Logger(__name__)


def prepare_for_request(
    ai_arguments: Dict[str, Any],
    api_model: ApiModel,
    agent_call_variables: Dict[str, str],
) -> Tuple[str, Dict[str, Any]]:

    # add all the default values back in
    input_schema = api_model.tool_description.input_schema

    arguments = _add_defaults(
        variables=api_model.variables,
        ai_arguments=ai_arguments,
        properties=input_schema.properties,
        agent_call_variables=agent_call_variables,
    )

    # find the path parameters and insert them into the url
    url, arguments = _add_url_path_params(
        url=api_model.url, variables=api_model.variables, ai_arguments=arguments
    )

    logger.info(
        f"final Url: {url}",
        f"\nArguments: {arguments}",
        f"\nAi arguments: {ai_arguments}",
        f"\nInput schema: {api_model.tool_description.input_schema}",
    )
    return url, arguments


def _add_defaults(
    variables: Dict[str, str | None],
    ai_arguments: Dict[str, Any],
    properties: Dict[str, Property],
    agent_call_variables: Dict[str, str],
) -> Dict[str, Any]:

    for key, value in properties.items():
        if key in variables.keys():
            if key in agent_call_variables and agent_call_variables[key] != None:
                ai_arguments[key] = agent_call_variables[key]
            elif variables[key] != None:
                ai_arguments[key] = variables[key]
            else:
                logger.warning("default value is missing")

        elif value.type == InputSchemaType.OBJECT and value.properties != None:
            ai_arguments[key] = _add_defaults(
                variables=variables,
                ai_arguments=ai_arguments[key],
                properties=value.properties,
                agent_call_variables=agent_call_variables,
            )
        elif value.type == InputSchemaType.OBJECT and value.properties != None:
            logger.warning(f"Input Schema type is object, but no properties {value}")

    return ai_arguments


def _add_url_path_params(
    url: str,
    variables: Dict[str, str | None],
    ai_arguments: Dict[str, Any],
) -> Tuple[str, Dict[str, Any]]:
    final_url = url
    for path_param in url.split("/"):
        if path_param[1:-1] in ai_arguments.keys():
            final_url = final_url.replace(
                path_param, str(ai_arguments[path_param[1:-1]])
            )
            del ai_arguments[path_param[1:-1]]
        if path_param[1:-1] in variables.keys():
            final_url = final_url.replace(path_param, str(variables[path_param[1:-1]]))

    return final_url, ai_arguments
