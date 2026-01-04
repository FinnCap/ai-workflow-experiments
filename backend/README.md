# Backend

FastAPI backend providing AI agent capabilities and workflow automation.

## API Documentation

When running, visit http://localhost:7777/docs for interactive API documentation.

## Setup

### Prerequisites
- Python 3.13+ (probably works with lower versions, not tested)
- PostgreSQL database
- API keys for AI providers (Anthropic, Mistral)

### Installation

1. Install dependencies:
```bash
uv sync
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
# Edit .env with your database URL and API keys
```

3. Run database migrations:
```bash
uv run alembic upgrade head
```
Note: Migrations include test data. Remove insert migrations in `alembic/versions` if you don't want test data.

4. Start the server:
```bash
uv run python main.py
```

The API will be available at `http://localhost:7777`

## Extending the Platform

### Adding New AI Model Providers

To add a new AI provider (e.g., OpenAI, Google):

1. **Create a new client** in the `ai/` directory implementing `ClientInterface`:

```python
# ai/your_provider/your_provider_client.py
from ai.client_interface import ClientInterface
from chat.model.messages.assistant_message import AssistantMessage
from chat.model.message_model import MessageModel
from typing import List

class YourProviderClient(ClientInterface):
    def send_message(self, messages: List[MessageModel]) -> AssistantMessage:
        # Implement your provider's API call here
        # Handle tool calling if supported
        # Return AssistantMessage with response
        pass
```

2. **Add the provider** to `ModelProvider` enum in `common/enum/model_provider.py`:

```python
class ModelProvider(enum.Enum):
    ANTHROPIC = "anthropic"
    MISTRAL = "mistral"
    YOUR_PROVIDER = "your_provider"  # Add this line
```

3. **Add the models** to `AvailableModels` enum in `common/enum/available_models.py`:

```python
class AvailableModels(Enum):
    # ... existing models ...
    YOUR_PROVIDER_MODEL_1 = "model-name-1"
    YOUR_PROVIDER_MODEL_2 = "model-name-2"

    def is_your_provider(self):
        return "your_identifier" in self.value
```

4. **Update the AI service** to instantiate your client based on the provider enum.

```python
class AiService:
    def _get_client(
            self,
            model_name: AvailableModels,
            system_prompt: str,
            temperature: float,
            api_models: List[ApiModel],
        ) -> ClientInterface:
            if model_name.is_claude():
                return AnthropicClient(...)
            elif model_name.is_mistral():
                return MistralClient(...)
            elif model_name.is_your_provider():
                return YourClient(...)
            else:
                raise Exception("Unknown Model provider")
```

### Adding New Flow Node Types

To extend the flow system with new node types:

1. **Create a new node executor** implementing `BaseNodeExecutor`:

```python
# flow/service/flow_execution/your_node_executor.py
from flow.service.flow_execution.base_node_executor import BaseNodeExecutor
from flow.service.flow_execution.flow_execution_context import FlowExecutionContext
from flow.service.flow_execution.node_execution_response import NodeExecutionResponse
from typing import Callable

class YourNodeExecutor(BaseNodeExecutor):
    def execute(
        self,
        context: FlowExecutionContext,
        callback: Callable[[FlowExecutionContext], NodeExecutionResponse],
    ) -> NodeExecutionResponse:
        # Implement your node logic here
        # Use callback to proceed to next node
        # Log execution if needed
        pass
```

2. **Add the node type** to `NodeType` enum in `common/enum/node_type.py`:

```python
class NodeType(enum.Enum):
    INPUT = "input"
    OUTPUT = "output"
    AGENT = "agent"
    DECISION = "decision"
    PARALLEL = "parallel"
    MERGE = "merge"
    YOUR_NODE = "your_node"  # Add this line
```

3. **Update `FlowExecutionService._call_next_node`** in `flow/service/flow_execution_service.py`:

```python
def _call_next_node(self, context: FlowExecutionContext) -> NodeExecutionResponse:
    # ... existing conditions ...
    elif context.node.node_type == NodeType.YOUR_NODE:
        return self.your_node_executor.execute(
            context=context, callback=self._call_next_node
        )
```

4. **Inject the executor** in the `FlowExecutionService.__init__` constructor.

5. **Update the frontend** to support the new node type. Frontend implementation details can be found in your frontend repository.


## Shop Mock Service
A simple FastAPI mock service for testing AI agents with external APIs. Run standalone with:
```bash
uv run python shop_mock_service/main.py
```

The service runs on port 8000 and provides endpoints for articles and orders. API definitions are included in the migration files.