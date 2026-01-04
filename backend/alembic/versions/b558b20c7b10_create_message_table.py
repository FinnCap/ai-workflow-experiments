"""create message table

Revision ID: 2649828f2c8a
Revises: b558b20c7b10
Create Date: 2025-12-31 17:10:11.254037

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB, UUID as PgUUID

# revision identifiers, used by Alembic.
revision: str = "2649828f2c8a"
down_revision: Union[str, Sequence[str], None] = "b558b20c7b10"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "message",
        sa.Column("id", PgUUID(as_uuid=True), nullable=False, primary_key=True),
        sa.Column("chat_id", PgUUID(as_uuid=True), nullable=True, index=True),
        sa.Column("chat_position_id", sa.Integer(), nullable=False),
        sa.Column("role", sa.String(), nullable=False),
        sa.Column("content", JSONB(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["chat_id"], ["chat.id"], ondelete="SET NULL"),
    )
    # op.create_index("ix_message_chat_id", "message", ["chat_id"])


def downgrade() -> None:
    """Downgrade schema."""
    # op.drop_index("ix_message_chat_id", table_name="message")
    op.drop_table("message")
