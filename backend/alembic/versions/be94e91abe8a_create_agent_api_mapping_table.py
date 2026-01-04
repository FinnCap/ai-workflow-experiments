"""create agent api mapping table

Revision ID: be94e91abe8a
Revises: b88395791797
Create Date: 2025-12-31 17:24:03.606362

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID as PgUUID

# revision identifiers, used by Alembic.
revision: str = "be94e91abe8a"
down_revision: Union[str, Sequence[str], None] = "b88395791797"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "agent_api_mapping",
        sa.Column("agent_id", PgUUID(as_uuid=True), nullable=False),
        sa.Column("api_id", PgUUID(as_uuid=True), nullable=False),
        sa.PrimaryKeyConstraint("agent_id", "api_id"),
        sa.ForeignKeyConstraint(["agent_id"], ["agent.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["api_id"], ["api.id"], ondelete="CASCADE"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("agent_api_mapping")
