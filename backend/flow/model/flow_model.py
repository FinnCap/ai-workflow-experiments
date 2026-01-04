from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID

from sqlalchemy import DateTime, String, Text
from sqlalchemy.dialects.postgresql import UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from common.base import Base
from flow.model.flow_edge_model import FlowEdgeModel
from flow.model.flow_node_model import FlowNodeModel


class FlowModel(Base):
    __tablename__ = "flow"

    id: Mapped[UUID] = mapped_column(PgUUID, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    nodes: Mapped[List[FlowNodeModel]] = relationship(
        "FlowNodeModel", back_populates="flow", cascade="all, delete-orphan"
    )
    edges: Mapped[List[FlowEdgeModel]] = relationship(
        "FlowEdgeModel", back_populates="flow", cascade="all, delete-orphan"
    )
