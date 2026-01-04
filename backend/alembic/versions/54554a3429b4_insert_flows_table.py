"""insert flows table

Revision ID: 54554a3429b4
Revises: 9fbf85d1dd22
Create Date: 2025-12-31 17:27:25.135812

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy.dialects.postgresql import JSONB, UUID as PgUUID

# revision identifiers, used by Alembic.
revision: str = "54554a3429b4"
down_revision: Union[str, Sequence[str], None] = "9fbf85d1dd22"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Define table structures for inserts
    flow_table = table(
        "flow",
        column("id", PgUUID),
        column("name", sa.String),
        column("description", sa.Text),
        column("created_at", sa.DateTime),
        column("updated_at", sa.DateTime),
    )

    node_table = table(
        "node",
        column("id", PgUUID),
        column("react_flow_id", sa.String),
        column("flow_id", PgUUID),
        column("node_type", sa.String),
        column("position", JSONB),
        column("data", JSONB),
        column("agent_id", PgUUID),
    )

    edge_table = table(
        "edge",
        column("id", PgUUID),
        column("react_flow_id", sa.String),
        column("flow_id", PgUUID),
        column("source_node_id", PgUUID),
        column("target_node_id", PgUUID),
        column("label", sa.Text),
        column("react_flow_source_handle", sa.Text),
        column("react_flow_target_handle", sa.Text),
    )

    # Insert Flow
    op.bulk_insert(
        flow_table,
        [
            {
                "id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "name": "Weather Animal Flow",
                "description": "A flow to ask questions about the weather or animals",
                "created_at": "2025-12-21T17:28:22.765826Z",
                "updated_at": "2025-12-21T17:28:22.765826Z",
            }
        ],
    )

    # Insert Nodes
    op.bulk_insert(
        node_table,
        [
            {
                "id": "96393687-de01-4879-843e-78bb470da7c9",
                "react_flow_id": "node-1766337920316",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "node_type": "agent",
                "position": {"x": 391.75558039016016, "y": 255.72459412307427},
                "data": {
                    "label": "Agent node",
                    "agentId": "a6494fa2-1f84-4c50-92ea-f9688615dcad",
                    "agentName": "Temperature Agent",
                },
                "agent_id": "a6494fa2-1f84-4c50-92ea-f9688615dcad",
            },
            {
                "id": "792467c7-e2b3-428d-ba09-d41ac6e5fddb",
                "react_flow_id": "node-1767020239427",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "node_type": "agent",
                "position": {"x": 400.61993345704155, "y": 411.79711042565475},
                "data": {
                    "label": "Shop Agent",
                    "agentId": "c2738605-1ddc-4c2a-9dba-d2f3b68c8951",
                    "agentName": "Shop Agent",
                },
                "agent_id": "c2738605-1ddc-4c2a-9dba-d2f3b68c8951",
            },
            {
                "id": "44a1f026-ad33-4ea6-b9af-efb3722ba241",
                "react_flow_id": "node-1766337927930",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "node_type": "agent",
                "position": {"x": 406.6400935849379, "y": 11.762302806759166},
                "data": {
                    "label": "Agent node",
                    "agentId": "3bc34d7b-dca7-4dec-b4b5-c3f4757f58ea",
                    "agentName": "Cat Agent",
                },
                "agent_id": "3bc34d7b-dca7-4dec-b4b5-c3f4757f58ea",
            },
            {
                "id": "63bb5423-2323-4573-9273-b5ef369d9149",
                "react_flow_id": "node-1766337940531",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "node_type": "agent",
                "position": {"x": 407.9522819236799, "y": 119.29008677118475},
                "data": {
                    "label": "Agent node",
                    "agentId": "23f2f5e9-bae6-46c6-a035-a2c4ddcff715",
                    "agentName": "Bird Agent",
                },
                "agent_id": "23f2f5e9-bae6-46c6-a035-a2c4ddcff715",
            },
            {
                "id": "d3adb729-f6f7-4b34-be05-61f6dd077072",
                "react_flow_id": "node-1766338037434",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "node_type": "merge",
                "position": {"x": 626.210988982416, "y": 76.28757192585172},
                "data": {"label": "Merge node", "agentId": None, "agentName": None},
                "agent_id": None,
            },
            {
                "id": "66db8bae-fecc-4b53-8271-66bb1585b09a",
                "react_flow_id": "node-1766337974933",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "node_type": "parallel",
                "position": {"x": 225.20770577258205, "y": 72.60397217481625},
                "data": {"label": "Parallel node", "agentId": None, "agentName": None},
                "agent_id": None,
            },
            {
                "id": "e97f2afe-63b0-4e09-9d55-f8c772d6d050",
                "react_flow_id": "node-1766337951030",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "node_type": "decision",
                "position": {"x": -69.25477210917299, "y": 187.072885019258},
                "data": {
                    "label": "Decision node",
                    "agentId": None,
                    "agentName": None,
                    "decisions": ["animal", "weather", "shop"],
                    "description": "Decide if the user asks for information about an animal or about the weather",
                },
                "agent_id": None,
            },
            {
                "id": "f8dd8088-3cec-4272-a255-c7ac8b59a6b2",
                "react_flow_id": "2",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "node_type": "output",
                "position": {"x": 993.3722954801837, "y": 130.05670537976332},
                "data": {
                    "label": "End",
                    "ioType": "text",
                    "agentId": None,
                    "agentName": None,
                },
                "agent_id": None,
            },
            {
                "id": "bdf0d2c1-2d4b-4f4e-8d7e-cde49dd729f7",
                "react_flow_id": "1",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "node_type": "input",
                "position": {"x": -304.2974846781041, "y": 174.65946961733388},
                "data": {
                    "label": "Start",
                    "ioType": "text",
                    "agentId": None,
                    "agentName": None,
                },
                "agent_id": None,
            },
            {
                "id": "921128cc-a37b-472f-8a2e-d055e938d237",
                "react_flow_id": "node-1766338226163",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "node_type": "merge",
                "position": {"x": 819.5604539291769, "y": 155.28834663425678},
                "data": {"label": "Merge node", "agentId": None, "agentName": None},
                "agent_id": None,
            },
        ],
    )

    # Insert Edges
    op.bulk_insert(
        edge_table,
        [
            {
                "id": "75291303-08a4-4682-b357-22125f4cf42e",
                "react_flow_id": "edge-1766338032552",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "source_node_id": "e97f2afe-63b0-4e09-9d55-f8c772d6d050",  # node-1766337951030
                "target_node_id": "96393687-de01-4879-843e-78bb470da7c9",  # node-1766337920316
                "label": "weather",
                "react_flow_source_handle": "output-1",
                "react_flow_target_handle": None,
            },
            {
                "id": "df32117e-70ed-4e92-8e78-791afb63fc10",
                "react_flow_id": "edge-1767020262724",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "source_node_id": "e97f2afe-63b0-4e09-9d55-f8c772d6d050",  # node-1766337951030
                "target_node_id": "792467c7-e2b3-428d-ba09-d41ac6e5fddb",  # node-1767020239427
                "label": "",
                "react_flow_source_handle": "output-2",
                "react_flow_target_handle": None,
            },
            {
                "id": "50540365-4fda-4cfa-b956-139136ee587d",
                "react_flow_id": "edge-1766338022733",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "source_node_id": "e97f2afe-63b0-4e09-9d55-f8c772d6d050",  # node-1766337951030
                "target_node_id": "66db8bae-fecc-4b53-8271-66bb1585b09a",  # node-1766337974933
                "label": "animal",
                "react_flow_source_handle": "output-0",
                "react_flow_target_handle": None,
            },
            {
                "id": "b8f7d58e-8ca8-4862-9f0c-59c58b4d7480",
                "react_flow_id": "edge-1766337957834",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "source_node_id": "bdf0d2c1-2d4b-4f4e-8d7e-cde49dd729f7",  # 1
                "target_node_id": "e97f2afe-63b0-4e09-9d55-f8c772d6d050",  # node-1766337951030
                "label": None,
                "react_flow_source_handle": None,
                "react_flow_target_handle": None,
            },
            {
                "id": "4f8b3198-a19a-4fe3-be68-da204bde0ed3",
                "react_flow_id": "edge-1766338243478",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "source_node_id": "921128cc-a37b-472f-8a2e-d055e938d237",  # node-1766338226163
                "target_node_id": "f8dd8088-3cec-4272-a255-c7ac8b59a6b2",  # 2
                "label": None,
                "react_flow_source_handle": None,
                "react_flow_target_handle": None,
            },
            {
                "id": "cc1e18c4-383a-4993-a68b-95f1144afc3d",
                "react_flow_id": "edge-1766338229848",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "source_node_id": "d3adb729-f6f7-4b34-be05-61f6dd077072",  # node-1766338037434
                "target_node_id": "921128cc-a37b-472f-8a2e-d055e938d237",  # node-1766338226163
                "label": None,
                "react_flow_source_handle": None,
                "react_flow_target_handle": None,
            },
            {
                "id": "8badf697-03e1-4ea9-a2d9-7da16a145948",
                "react_flow_id": "edge-1766338041034",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "source_node_id": "63bb5423-2323-4573-9273-b5ef369d9149",  # node-1766337940531
                "target_node_id": "d3adb729-f6f7-4b34-be05-61f6dd077072",  # node-1766338037434
                "label": None,
                "react_flow_source_handle": None,
                "react_flow_target_handle": None,
            },
            {
                "id": "7ec8dd39-9e6d-4cc6-8254-faed627bc4f0",
                "react_flow_id": "edge-1766338039352",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "source_node_id": "44a1f026-ad33-4ea6-b9af-efb3722ba241",  # node-1766337927930
                "target_node_id": "d3adb729-f6f7-4b34-be05-61f6dd077072",  # node-1766338037434
                "label": None,
                "react_flow_source_handle": None,
                "react_flow_target_handle": None,
            },
            {
                "id": "e5001a86-606e-4e5a-8e42-03705fb441b0",
                "react_flow_id": "edge-1767020268334",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "source_node_id": "792467c7-e2b3-428d-ba09-d41ac6e5fddb",  # node-1767020239427
                "target_node_id": "921128cc-a37b-472f-8a2e-d055e938d237",  # node-1766338226163
                "label": None,
                "react_flow_source_handle": None,
                "react_flow_target_handle": None,
            },
            {
                "id": "bdce35db-3c6e-4ccc-baee-2eecb77df33a",
                "react_flow_id": "edge-1766338234012",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "source_node_id": "96393687-de01-4879-843e-78bb470da7c9",  # node-1766337920316
                "target_node_id": "921128cc-a37b-472f-8a2e-d055e938d237",  # node-1766338226163
                "label": None,
                "react_flow_source_handle": None,
                "react_flow_target_handle": None,
            },
            {
                "id": "f6270678-0609-4eb9-98ee-7afffdd488dc",
                "react_flow_id": "edge-1766338017183",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "source_node_id": "66db8bae-fecc-4b53-8271-66bb1585b09a",  # node-1766337974933
                "target_node_id": "44a1f026-ad33-4ea6-b9af-efb3722ba241",  # node-1766337927930
                "label": None,
                "react_flow_source_handle": None,
                "react_flow_target_handle": None,
            },
            {
                "id": "14531ec0-2819-4cee-96aa-01655118cff4",
                "react_flow_id": "edge-1766338019334",
                "flow_id": "d7eb1b2d-435b-4edf-93ef-082a47200217",
                "source_node_id": "66db8bae-fecc-4b53-8271-66bb1585b09a",  # node-1766337974933
                "target_node_id": "63bb5423-2323-4573-9273-b5ef369d9149",  # node-1766337940531
                "label": None,
                "react_flow_source_handle": None,
                "react_flow_target_handle": None,
            },
        ],
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Delete in reverse order due to foreign keys
    op.execute(
        "DELETE FROM edge WHERE flow_id = 'd7eb1b2d-435b-4edf-93ef-082a47200217'"
    )
    op.execute(
        "DELETE FROM node WHERE flow_id = 'd7eb1b2d-435b-4edf-93ef-082a47200217'"
    )
    op.execute("DELETE FROM flow WHERE id = 'd7eb1b2d-435b-4edf-93ef-082a47200217'")
