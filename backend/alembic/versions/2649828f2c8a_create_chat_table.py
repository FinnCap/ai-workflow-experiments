"""create chat table


Revision ID: b558b20c7b10
Revises: 23a89543ec49
Create Date: 2025-12-31 17:10:15.928979

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID as PgUUID

# revision identifiers, used by Alembic.

revision: str = "b558b20c7b10"
down_revision: Union[str, Sequence[str], None] = "23a89543ec49"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "chat",
        sa.Column("id", PgUUID(as_uuid=True), nullable=False, primary_key=True),
        sa.Column("agent_id", PgUUID(as_uuid=True), nullable=False),
        sa.Column("use_tools", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("title", sa.String(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["agent_id"], ["agent.id"]),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("chat")
