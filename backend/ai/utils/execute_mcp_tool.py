import json
from typing import Any, Dict, List

import requests

from api.model.api_model import ApiModel
from chat.model.messages.tool_response_message import ToolResponseMessage
from common.enum.http_method import HttpMethod


def execute_mcp_tool(
    tool_use_id: str,
    api_model: ApiModel,
    url: str,
    arguments: Dict[str, Any],
    agent_call_headers: Dict[str, str],
) -> ToolResponseMessage:

    # overwrite default headers if they are set again
    headers = api_model.headers
    for key, _ in headers.items():
        if key in agent_call_headers and agent_call_headers[key] != "":
            headers[key] = agent_call_headers[key]

    if api_model.method == HttpMethod.GET:
        response = requests.get(url=url, headers=headers, params=arguments)
    elif api_model.method == HttpMethod.POST:
        response = requests.post(url, headers=headers, json=arguments)
    elif api_model.method == HttpMethod.PUT:
        response = requests.put(url, headers=headers, json=arguments)
    elif api_model.method == HttpMethod.DELETE:
        response = requests.delete(url, headers=headers, params=arguments)
    else:
        error = f"Http method not implemented yet {HttpMethod.GET}"
        raise NotImplementedError(error)

    # Try to parse JSON response, fallback to text if not JSON
    try:
        result = response.json()
        if isinstance(response, list):
            for i in range(len(result)):
                result[i] = _remove_hidden_fields(
                    hidden_fields=api_model.response_hidden_fields, obj=result[i]
                )
        else:
            result = _remove_hidden_fields(
                hidden_fields=api_model.response_hidden_fields, obj=result
            )
        return ToolResponseMessage(
            tool_call_id=tool_use_id, api_id=api_model.id, response=result
        )
    except ValueError:
        result = response.text
        return ToolResponseMessage(
            tool_call_id=tool_use_id, api_id=api_model.id, response=json.dumps(result)
        )


def _remove_hidden_fields(
    hidden_fields: List[str], obj: Dict[str, Any] | List[Dict[str, Any]]
) -> List[Dict[str, Any]] | Dict[str, Any]:

    if isinstance(obj, list):
        results = []
        for value in obj:
            results.append(
                _remove_hidden_fields(hidden_fields=hidden_fields, obj=value)
            )
        return results
    else:
        result = {}
        for key, value in obj.items():
            if key not in hidden_fields:
                result[key] = value

            if isinstance(value, dict):
                result[key] = _remove_hidden_fields(
                    hidden_fields=hidden_fields, obj=value
                )
            if (
                isinstance(value, list)
                and len(value) > 0
                and isinstance(value[0], dict)
            ):
                for i in range(len(value)):
                    value[i] = _remove_hidden_fields(
                        hidden_fields=hidden_fields, obj=value[i]
                    )

        return result
