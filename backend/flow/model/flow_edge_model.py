from typing import Optional
from uuid import UUID

from sqlalchemy import TEXT, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from common.base import Base


class FlowEdgeModel(Base):
    __tablename__ = "edge"

    # Database ID (UUID)
    id: Mapped[UUID] = mapped_column(PgUUID, primary_key=True)

    # React Flow ID (string identifier from frontend)
    react_flow_id: Mapped[str] = mapped_column(String(100), nullable=False)

    flow_id: Mapped[UUID] = mapped_column(PgUUID, ForeignKey("flow.id"), nullable=False)
    source_node_id: Mapped[UUID] = mapped_column(
        PgUUID, ForeignKey("node.id"), nullable=False
    )
    target_node_id: Mapped[UUID] = mapped_column(
        PgUUID, ForeignKey("node.id"), nullable=False
    )
    label: Mapped[Optional[str]] = mapped_column(TEXT)
    react_flow_source_handle: Mapped[Optional[str]] = mapped_column(TEXT)
    react_flow_target_handle: Mapped[Optional[str]] = mapped_column(TEXT)

    flow = relationship("FlowModel", back_populates="edges")
    source_node = relationship(
        "FlowNodeModel", foreign_keys=[source_node_id], lazy="joined"
    )
    target_node = relationship(
        "FlowNodeModel", foreign_keys=[target_node_id], lazy="joined"
    )
