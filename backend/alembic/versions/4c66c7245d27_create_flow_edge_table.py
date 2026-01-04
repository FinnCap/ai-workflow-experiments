"""create flow edge table

Revision ID: 4c66c7245d27
Revises: 2649828f2c8a
Create Date: 2025-12-31 17:10:24.032369

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID as PgUUID

# revision identifiers, used by Alembic.
revision: str = "3e052148bac2"
down_revision: Union[str, Sequence[str], None] = "e9c80ff06e36"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "edge",
        sa.Column("id", PgUUID(as_uuid=True), nullable=False, primary_key=True),
        sa.Column("react_flow_id", sa.String(100), nullable=False),
        sa.Column("flow_id", PgUUID(as_uuid=True), nullable=False),
        sa.Column("source_node_id", PgUUID(as_uuid=True), nullable=False),
        sa.Column("target_node_id", PgUUID(as_uuid=True), nullable=False),
        sa.Column("label", sa.Text(), nullable=True),
        sa.Column("react_flow_source_handle", sa.Text(), nullable=True),
        sa.Column("react_flow_target_handle", sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["flow_id"], ["flow.id"]),
        sa.ForeignKeyConstraint(["source_node_id"], ["node.id"]),
        sa.ForeignKeyConstraint(["target_node_id"], ["node.id"]),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("edge")
