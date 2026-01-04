"""create flow log table

Revision ID: b88395791797
Revises: 3e052148bac2
Create Date: 2025-12-31 17:10:38.973192

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB, UUID as PgUUID

# revision identifiers, used by Alembic.
revision: str = "b88395791797"
down_revision: Union[str, Sequence[str], None] = "3e052148bac2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "flow_log",
        sa.Column("id", PgUUID(as_uuid=True), nullable=False, primary_key=True),
        sa.Column("flow_execution_id", PgUUID(as_uuid=True), nullable=False),
        sa.Column("flow_id", PgUUID(as_uuid=True), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("node_id", PgUUID(as_uuid=True), nullable=False),
        sa.Column("node_type", sa.String(), nullable=False),
        sa.Column("messages_in", JSONB(), nullable=False),
        sa.Column("messages_out", JSONB(), nullable=False),
        sa.Column("input_tokens", sa.Integer(), nullable=False),
        sa.Column("output_tokens", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("flow_log")
