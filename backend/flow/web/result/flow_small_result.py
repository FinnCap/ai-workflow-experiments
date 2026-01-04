from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from flow.model.flow_model import FlowModel


class FlowSmallResult(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime
    node_count: int
    edge_count: int

    @classmethod
    def from_model(cls, model: FlowModel):
        return cls(
            id=model.id,
            name=model.name,
            description=model.description,
            created_at=model.created_at,
            updated_at=model.updated_at,
            node_count=len(model.nodes),
            edge_count=len(model.edges),
        )
