from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from flow.model.flow_edge_model import FlowEdgeModel


class FlowEdgeResult(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: UUID  # Database ID
    react_flow_id: str  # React Flow ID
    source: Optional[str]  # React Flow node ID
    target: Optional[str]  # React Flow node ID
    label: Optional[str] = None
    source_handle: Optional[str] = None
    target_handle: Optional[str] = None

    @classmethod
    def from_model(cls, edge: FlowEdgeModel):
        return cls(
            id=edge.id,
            react_flow_id=edge.react_flow_id,
            source=edge.source_node.react_flow_id,
            target=edge.target_node.react_flow_id,
            label=edge.label,
            source_handle=edge.react_flow_source_handle,
            target_handle=edge.react_flow_target_handle,
        )
