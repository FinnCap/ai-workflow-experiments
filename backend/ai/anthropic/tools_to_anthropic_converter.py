from typing import List

from anthropic.types.tool_param import ToolParam
from anthropic.types.tool_union_param import ToolUnionParam as AnthropicTool

from common.model.tool_definition_model import ToolDefinitionModel


def parse_tools(tools: List[ToolDefinitionModel]) -> List[AnthropicTool]:
    parsed_tools: List[AnthropicTool] = []
    for tool in tools:
        parsed_tools.append(
            ToolParam(
                name=tool.name,
                description=tool.description,
                input_schema=tool.input_schema.to_ai_dict(),
            )
        )
    return parsed_tools
