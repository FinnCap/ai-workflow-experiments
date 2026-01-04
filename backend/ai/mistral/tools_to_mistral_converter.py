from typing import List

from mistralai import Function
from mistralai import Tool as MistralTool

from common.model.tool_definition_model import ToolDefinitionModel


def parse_tools(tools: List[ToolDefinitionModel]) -> List[MistralTool]:
    converted_tools = []
    for tool in tools:
        converted_tools.append(
            MistralTool(
                function=Function(
                    name=tool.name,
                    parameters=tool.input_schema.model_dump(exclude_none=True),
                    description=tool.description,
                )
            )
        )
    return converted_tools
