"""insert apis and agents table

Revision ID: 9fbf85d1dd22
Revises: be94e91abe8a
Create Date: 2025-12-31 17:25:10.560299

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy.dialects.postgresql import JSONB, UUID as PgUUID

# revision identifiers, used by Alembic.
revision: str = "9fbf85d1dd22"
down_revision: Union[str, Sequence[str], None] = "be94e91abe8a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Define table structures for inserts
    api_table = table(
        "api",
        column("id", PgUUID),
        column("url", sa.Text),
        column("method", sa.String),
        column("name", sa.Text),
        column("active", sa.Boolean),
        column("tool_description", JSONB),
        column("variables", JSONB),
        column("path_variables", JSONB),
        column("headers", JSONB),
        column("response_hidden_fields", JSONB),
        column("created_at", sa.DateTime),
        column("updated_at", sa.DateTime),
    )

    agent_table = table(
        "agent",
        column("id", PgUUID),
        column("name", sa.String),
        column("model_provider", sa.String),
        column("model_name", sa.String),
        column("description", sa.Text),
        column("temperature", sa.Float),
        column("created_at", sa.DateTime),
        column("updated_at", sa.DateTime),
    )

    agent_api_mapping_table = table(
        "agent_api_mapping",
        column("agent_id", PgUUID),
        column("api_id", PgUUID),
    )

    # Insert APIs
    op.bulk_insert(
        api_table,
        [
            {
                "id": "0be09a16-5da7-4f41-a8b0-a57777a566c3",
                "url": "https://geocoding-api.open-meteo.com/v1/search",
                "method": "GET",
                "name": "geocoding",
                "active": True,
                "tool_description": {
                    "name": "geocoding",
                    "description": "Get the longitude and latitude of a place by either searching for the zip or the name of the place",
                    "input_schema": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string",
                                "description": "only name e.g. Berlin or zip code 10253 !!!Do not add the country!!! only the city",
                            },
                            "count": {
                                "type": "number",
                                "description": "number of results to return, default is 10, please limit this to 2 if possible. This has to be an integer without decimal",
                            },
                        },
                    },
                },
                "variables": {"count": "1"},
                "path_variables": {},
                "headers": {},
                "response_hidden_fields": [],
                "created_at": "2025-06-09T14:52:47.864702Z",
                "updated_at": "2025-12-09T20:01:07.724698Z",
            },
            {
                "id": "1090e834-97d5-43df-b468-0008c73daaa1",
                "url": "http://localhost:8000/orders/{person_id}",
                "method": "GET",
                "name": "get_all_orders",
                "active": True,
                "tool_description": {
                    "name": "get_all_orders",
                    "description": "get all the shops oders",
                    "input_schema": {"type": "object", "properties": {}},
                },
                "variables": {"person_id": "1"},
                "path_variables": {
                    "person_id": "the id of the person for whom the orders should be retrieved"
                },
                "headers": {},
                "response_hidden_fields": [],
                "created_at": "2025-06-29T20:10:06.311219Z",
                "updated_at": "2025-07-06T17:18:47.160093Z",
            },
            {
                "id": "41125fd2-c3da-4c9d-8cac-de7a441244c6",
                "url": "https://api.open-meteo.com/v1/forecast",
                "method": "GET",
                "name": "temperature",
                "active": True,
                "tool_description": {
                    "name": "temperature",
                    "description": "Get Temperatur information using longitude and latitude",
                    "input_schema": {
                        "type": "object",
                        "properties": {
                            "hourly": {
                                "type": "string",
                                "description": "set to temperature_2m to get the hourly forecast for the next 7 days temperature 2m above sea level, set to rain to get the rain forecast or get both by separating with a comma",
                            },
                            "current": {
                                "type": "string",
                                "description": "set to temperature_2m to get the current temperature 2m above sea level",
                            },
                            "latitude": {
                                "type": "string",
                                "description": "The latitude of the place",
                            },
                            "longitude": {
                                "type": "string",
                                "description": "The longitude of the place",
                            },
                        },
                    },
                },
                "variables": {},
                "path_variables": {},
                "headers": {},
                "response_hidden_fields": [],
                "created_at": "2025-06-09T14:53:59.912879Z",
                "updated_at": "2025-12-09T20:01:33.391389Z",
            },
            {
                "id": "512d8a2d-8c2d-45d9-ad58-2de7f42c7687",
                "url": "http://localhost:8000/articles/{article_id}",
                "method": "GET",
                "name": "shop_article_by_id",
                "active": True,
                "tool_description": {
                    "name": "shop_article_by_id",
                    "description": "Get a specific article from a shop by its id",
                    "input_schema": {"type": "object", "properties": {}},
                },
                "variables": {},
                "path_variables": {
                    "article_id": "the id of the article for which more information should be retrieved"
                },
                "headers": {},
                "response_hidden_fields": [],
                "created_at": "2025-06-29T20:06:02.293048Z",
                "updated_at": "2025-07-06T17:17:49.270461Z",
            },
            {
                "id": "fe6ec0e3-6bb6-422f-bc0a-0de1acdd961c",
                "url": "http://localhost:8000/articles",
                "method": "GET",
                "name": "shop_articles",
                "active": True,
                "tool_description": {
                    "name": "shop_articles",
                    "description": "Get all the articles the shop has to offer",
                    "input_schema": {"type": "object", "properties": {}},
                },
                "variables": {},
                "path_variables": None,
                "headers": {},
                "response_hidden_fields": [],
                "created_at": "2025-06-29T17:54:38.170531Z",
                "updated_at": "2025-06-29T20:11:08.053051Z",
            },
            {
                "id": "53144e38-de50-456b-86ed-e6571d199272",
                "url": "http://localhost:8000/orders",
                "method": "POST",
                "name": "create_order",
                "active": True,
                "tool_description": {
                    "name": "create_order",
                    "description": "Create a new Order",
                    "input_schema": {
                        "type": "object",
                        "properties": {
                            "quantity": {
                                "type": "number",
                                "description": "the quantity of how often article should be ordered",
                            },
                            "person_id": {"type": "number", "description": ""},
                            "article_id": {
                                "type": "number",
                                "description": "the id of the article, that should be ordered",
                            },
                        },
                    },
                },
                "variables": {"person_id": "1"},
                "path_variables": {},
                "headers": {},
                "response_hidden_fields": [],
                "created_at": "2025-06-29T20:11:12.353375Z",
                "updated_at": "2025-12-29T09:53:01.022971Z",
            },
        ],
    )

    # Insert Agents
    op.bulk_insert(
        agent_table,
        [
            {
                "id": "a6494fa2-1f84-4c50-92ea-f9688615dcad",
                "name": "Temperature Agent",
                "model_provider": "anthropic",
                "model_name": "claude-haiku-4-5-20251001",
                "description": "Your are a helpful agent that is able to retrieve the temperature for any place in the world. Don't do anything else and always be polite!",
                "temperature": 0.7,
                "created_at": "2025-06-09T14:55:20.730838Z",
                "updated_at": "2025-12-21T17:10:24.382556Z",
            },
            {
                "id": "c2738605-1ddc-4c2a-9dba-d2f3b68c8951",
                "name": "Shop Agent",
                "model_provider": "mistral",
                "model_name": "mistral-medium-2508",
                "description": "You are an agent, that can interact with a shop api, help create orders, view orders or find articles.",
                "temperature": 0.7,
                "created_at": "2025-06-29T20:12:37.515994Z",
                "updated_at": "2025-10-07T18:48:49.575645Z",
            },
            {
                "id": "3bc34d7b-dca7-4dec-b4b5-c3f4757f58ea",
                "name": "Cat Agent",
                "model_provider": "anthropic",
                "model_name": "claude-sonnet-4-5-20250929",
                "description": "You are an Agent, that can tell random Facts about cats and only cats, no other animals!",
                "temperature": 0.6,
                "created_at": "2025-06-14T12:45:02.869824Z",
                "updated_at": "2025-12-07T17:51:40.984430Z",
            },
            {
                "id": "23f2f5e9-bae6-46c6-a035-a2c4ddcff715",
                "name": "Bird Agent",
                "model_provider": "anthropic",
                "model_name": "claude-haiku-4-5-20251001",
                "description": "You are an agent, that can tell random Facts about Birds and only birds no other animals!",
                "temperature": 0.7,
                "created_at": "2025-06-14T13:54:22.738372Z",
                "updated_at": "2025-06-29T09:23:15.876488Z",
            },
            {
                "id": "7c8fab92-778a-4b27-bfcf-39de4c4fa3cd",
                "name": "Animal Agent",
                "model_provider": "mistral",
                "model_name": "mistral-medium-2508",
                "description": "You are an agent that is able to answer any information about animals. Don't answer any other information and just kindly reply that you don't know",
                "temperature": 0.2,
                "created_at": "2025-06-09T14:56:20.579310Z",
                "updated_at": "2025-12-29T13:53:12.061291Z",
            },
            {
                "id": "fc262463-7f2c-4ca4-ba47-483b94c084df",
                "name": "PDF Agent",
                "model_provider": "mistral",
                "model_name": "mistral-medium-2508",
                "description": "You are an agent that works extremely well with PDFs and is able to figure out all the data and the users questions.",
                "temperature": 0.7,
                "created_at": "2025-06-29T16:43:15.188598Z",
                "updated_at": "2025-10-07T18:25:58.122963Z",
            },
        ],
    )

    # Insert Agent-API mappings
    op.bulk_insert(
        agent_api_mapping_table,
        [
            # Temperature Agent -> geocoding + temperature APIs
            {
                "agent_id": "a6494fa2-1f84-4c50-92ea-f9688615dcad",
                "api_id": "0be09a16-5da7-4f41-a8b0-a57777a566c3",
            },
            {
                "agent_id": "a6494fa2-1f84-4c50-92ea-f9688615dcad",
                "api_id": "41125fd2-c3da-4c9d-8cac-de7a441244c6",
            },
            # Shop Agent -> all shop APIs
            {
                "agent_id": "c2738605-1ddc-4c2a-9dba-d2f3b68c8951",
                "api_id": "1090e834-97d5-43df-b468-0008c73daaa1",
            },
            {
                "agent_id": "c2738605-1ddc-4c2a-9dba-d2f3b68c8951",
                "api_id": "fe6ec0e3-6bb6-422f-bc0a-0de1acdd961c",
            },
            {
                "agent_id": "c2738605-1ddc-4c2a-9dba-d2f3b68c8951",
                "api_id": "512d8a2d-8c2d-45d9-ad58-2de7f42c7687",
            },
            {
                "agent_id": "c2738605-1ddc-4c2a-9dba-d2f3b68c8951",
                "api_id": "53144e38-de50-456b-86ed-e6571d199272",
            },
        ],
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Delete in reverse order due to foreign keys
    op.execute(
        "DELETE FROM agent_api_mapping WHERE agent_id IN ('a6494fa2-1f84-4c50-92ea-f9688615dcad', 'c2738605-1ddc-4c2a-9dba-d2f3b68c8951')"
    )
    op.execute(
        "DELETE FROM agent WHERE id IN ('a6494fa2-1f84-4c50-92ea-f9688615dcad', 'c2738605-1ddc-4c2a-9dba-d2f3b68c8951', '3bc34d7b-dca7-4dec-b4b5-c3f4757f58ea', '23f2f5e9-bae6-46c6-a035-a2c4ddcff715', '7c8fab92-778a-4b27-bfcf-39de4c4fa3cd', 'fc262463-7f2c-4ca4-ba47-483b94c084df')"
    )
    op.execute(
        "DELETE FROM api WHERE id IN ('0be09a16-5da7-4f41-a8b0-a57777a566c3', '1090e834-97d5-43df-b468-0008c73daaa1', '41125fd2-c3da-4c9d-8cac-de7a441244c6', '512d8a2d-8c2d-45d9-ad58-2de7f42c7687', 'fe6ec0e3-6bb6-422f-bc0a-0de1acdd961c', '53144e38-de50-456b-86ed-e6571d199272')"
    )
