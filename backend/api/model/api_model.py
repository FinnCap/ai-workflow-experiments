from datetime import datetime, timezone
from typing import Dict, List, Optional
from uuid import UUID

from sqlalchemy import Boolean, DateTime
from sqlalchemy import Text
from sqlalchemy.dialects.postgresql import UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB

from common.base import Base
from common.decorators.enum_as_string import EnumAsString
from common.decorators.pydantic_type import PydanticType
from common.enum.http_method import HttpMethod
from common.model.tool_definition_model import ToolDefinitionModel


class ApiModel(Base):
    __tablename__ = "api"

    id: Mapped[UUID] = mapped_column(PgUUID, primary_key=True)
    url: Mapped[str] = mapped_column(Text, nullable=False)
    method: Mapped[HttpMethod] = mapped_column(EnumAsString(HttpMethod), nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    tool_description: Mapped[ToolDefinitionModel] = mapped_column(
        PydanticType(ToolDefinitionModel), nullable=False
    )
    variables: Mapped[Dict[str, Optional[str]]] = mapped_column(
        JSONB, nullable=True, default=dict
    )
    path_variables: Mapped[Dict[str, str]] = mapped_column(
        JSONB, nullable=True, default=dict
    )
    headers: Mapped[Dict[str, Optional[str]]] = mapped_column(
        JSONB, nullable=True, default=dict
    )
    response_hidden_fields: Mapped[List[str]] = mapped_column(
        JSONB, nullable=True, default=list
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def __repr__(self):
        return f"Api(id={self.id}, description={self.tool_description})"
