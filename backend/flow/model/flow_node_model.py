from typing import Any, Dict, Optional
from uuid import UUID

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID as PgUUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from common.base import Base
from common.decorators.enum_as_string import EnumAsString
from common.decorators.pydantic_type import PydanticType
from common.enum.node_type import NodeType
from flow.model.flow_node_position import FlowNodePosition


class FlowNodeModel(Base):
    __tablename__ = "node"

    id: Mapped[UUID] = mapped_column(PgUUID, primary_key=True)

    # React Flow ID (identifier from frontend)
    react_flow_id: Mapped[str] = mapped_column(String(100), nullable=False)

    flow_id: Mapped[UUID] = mapped_column(PgUUID, ForeignKey("flow.id"), nullable=False)
    node_type: Mapped[NodeType] = mapped_column(EnumAsString(NodeType), nullable=False)

    position: Mapped[FlowNodePosition] = mapped_column(
        PydanticType(FlowNodePosition), nullable=False
    )

    data: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)

    # Optional reference to agent for AGENT type nodes
    agent_id: Mapped[Optional[UUID]] = mapped_column(
        PgUUID, ForeignKey("agent.id"), nullable=True
    )

    flow = relationship("FlowModel", back_populates="nodes")
    agent = relationship("AgentModel", lazy="joined")
