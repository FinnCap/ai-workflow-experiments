"""create flow node table

Revision ID: e9c80ff06e36
Revises: 4c66c7245d27
Create Date: 2025-12-31 17:10:28.315034

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB, UUID as PgUUID

# revision identifiers, used by Alembic.
revision: str = "e9c80ff06e36"
down_revision: Union[str, Sequence[str], None] = "4c66c7245d27"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "node",
        sa.Column("id", PgUUID(as_uuid=True), nullable=False, primary_key=True),
        sa.Column("react_flow_id", sa.String(100), nullable=False),
        sa.Column("flow_id", PgUUID(as_uuid=True), nullable=False),
        sa.Column("node_type", sa.String(), nullable=False),
        sa.Column("position", JSONB(), nullable=False),
        sa.Column("data", JSONB(), nullable=False),
        sa.Column("agent_id", PgUUID(as_uuid=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["flow_id"], ["flow.id"]),
        sa.ForeignKeyConstraint(["agent_id"], ["agent.id"]),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("node")
