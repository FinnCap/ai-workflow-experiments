from typing import List, Dict, Any, Optional
from uuid import UUID

from pydantic import BaseModel

from flow.model.flow_node_position import FlowNodePosition


class NodeForm(BaseModel):
    type: str
    react_flow_id: str
    position: FlowNodePosition
    data: Dict[str, Any]
    agent_id: Optional[UUID] = None


class EdgeForm(BaseModel):
    react_flow_id: str
    source: str
    target: str
    label: Optional[str] = None
    source_handle: Optional[str] = None
    target_handle: Optional[str] = None


class CreateFlowForm(BaseModel):
    name: str
    description: Optional[str] = None
    nodes: Optional[List[NodeForm]] = None
    edges: Optional[List[EdgeForm]] = None
