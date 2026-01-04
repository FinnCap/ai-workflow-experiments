from datetime import datetime, timezone
from typing import List
from uuid import UUID, uuid4

from sqlalchemy import DateTime
from sqlalchemy import Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.model.api_model import ApiModel
from common.enum.available_models import AvailableModels
from common.base import Base
from common.decorators.enum_as_string import EnumAsString
from common.enum.model_provider import ModelProvider
from common.model.mapping.agent_api_mapping import agent_api_mapping


class AgentModel(Base):
    __tablename__ = "agent"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    model_provider: Mapped[ModelProvider] = mapped_column(
        EnumAsString(ModelProvider), nullable=False
    )
    model_name: Mapped[AvailableModels] = mapped_column(
        EnumAsString(AvailableModels), nullable=False
    )
    description: Mapped[str] = mapped_column(Text)
    temperature: Mapped[float] = mapped_column(Float)
    api_models: Mapped[List[ApiModel]] = relationship(
        secondary=agent_api_mapping, lazy="joined"
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
