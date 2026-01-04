"""create api table

Revision ID: 23a89543ec49
Revises: 18e1848a1e01
Create Date: 2025-12-29 11:20:21.031737

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB, UUID as PgUUID


# revision identifiers, used by Alembic.
revision: str = "23a89543ec49"
down_revision: Union[str, Sequence[str], None] = "18e1848a1e01"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "api",
        sa.Column("id", PgUUID(as_uuid=True), nullable=False, primary_key=True),
        sa.Column("url", sa.Text(), nullable=False),
        sa.Column("method", sa.String(), nullable=False),
        sa.Column("name", sa.Text(), nullable=False, unique=True),
        sa.Column("active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("tool_description", JSONB(), nullable=False),
        sa.Column("variables", JSONB(), nullable=True),
        sa.Column("path_variables", JSONB(), nullable=True),
        sa.Column("headers", JSONB(), nullable=True),
        sa.Column("response_hidden_fields", JSONB(), nullable=True),
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
        sa.UniqueConstraint("name"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("api")
