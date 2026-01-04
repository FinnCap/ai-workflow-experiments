from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from flow.model.flow_model import FlowModel
from flow.web.result.flow_edge_result import FlowEdgeResult
from flow.web.result.flow_node_result import FlowNodeResult


class FlowResult(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime
    nodes: List[FlowNodeResult]
    edges: List[FlowEdgeResult]

    @classmethod
    def from_model(cls, model: FlowModel):
        return cls(
            id=model.id,
            name=model.name,
            description=model.description,
            created_at=model.created_at,
            updated_at=model.updated_at,
            nodes=[FlowNodeResult.from_model(node) for node in model.nodes],
            edges=[FlowEdgeResult.from_model(edge) for edge in model.edges],
        )
