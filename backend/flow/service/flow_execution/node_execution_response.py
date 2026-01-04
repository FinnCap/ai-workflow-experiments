from dataclasses import dataclass
from typing import List, Optional

from flow.model.flow_node_model import FlowNodeModel


@dataclass
class NodeExecutionResponse:
    message: Optional[str] | Optional[List[str]]
    node: Optional[FlowNodeModel]
