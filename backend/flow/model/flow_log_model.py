from datetime import datetime, timezone
from typing import List, Union
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID as PgUUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from common.base import Base
from common.decorators.enum_as_string import EnumAsString
from common.enum.node_type import NodeType


class FlowLogModel(Base):
    __tablename__ = "flow_log"

    id: Mapped[UUID] = mapped_column(PgUUID, primary_key=True, default=uuid4)
    flow_execution_id: Mapped[UUID] = mapped_column(PgUUID, nullable=False)
    flow_id: Mapped[UUID] = mapped_column(PgUUID, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    node_id: Mapped[UUID] = mapped_column(PgUUID, nullable=False)
    node_type: Mapped[NodeType] = mapped_column(EnumAsString(NodeType), nullable=False)

    messages_in: Mapped[Union[List[str], str]] = mapped_column(
        JSONB, nullable=False, default=list
    )
    messages_out: Mapped[Union[List[str], str]] = mapped_column(
        JSONB, nullable=False, default=list
    )
    input_tokens: Mapped[int] = mapped_column(Integer, nullable=False)
    output_tokens: Mapped[int] = mapped_column(Integer, nullable=False)

    def __repr__(self):
        return f"FlowLogModel(id={self.id}, flow_id={self.flow_id}"
