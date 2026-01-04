from typing import Any, Dict, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from common.enum.node_type import NodeType
from flow.model.flow_node_model import FlowNodeModel
from flow.model.flow_node_position import FlowNodePosition


class FlowNodeResult(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    react_flow_id: str
    type: NodeType
    position: FlowNodePosition
    data: Dict[str, Any]
    agent_id: Optional[UUID] = None
    agent_name: Optional[str] = None

    @classmethod
    def from_model(cls, model: FlowNodeModel):
        return cls(
            id=model.id,
            react_flow_id=model.react_flow_id,
            type=model.node_type,
            position=model.position,
            data=model.data,
            agent_id=model.agent_id,
            agent_name=model.agent.name if model.agent != None else None,
        )
