from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID as PgUUID

from common.base import Base

# Mapping table for many-to-many relationship between agents and apis
agent_api_mapping = Table(
    "agent_api_mapping",
    Base.metadata,
    Column("agent_id", PgUUID, ForeignKey("agent.id"), primary_key=True),
    Column("api_id", PgUUID, ForeignKey("api.id"), primary_key=True),
)
