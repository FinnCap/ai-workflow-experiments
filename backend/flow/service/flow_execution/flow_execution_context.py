from dataclasses import dataclass
from typing import Dict, List, Optional
from uuid import UUID

from chat.model.messages.user_pdf_content import PdfContent
from flow.model.flow_model import FlowModel
from flow.model.flow_node_model import FlowNodeModel


@dataclass
class FlowExecutionContext:
    """Shared context object passed between flow execution methods"""

    flow: FlowModel
    flow_execution_id: UUID
    node: FlowNodeModel
    message: List[str] | str
    merge_node: Optional[FlowNodeModel]
    agent_call_variables: Optional[Dict[UUID, Dict[UUID, Dict[str, str]]]]
    agent_call_headers: Optional[Dict[UUID, Dict[UUID, Dict[str, str]]]]
    pdf_data: List[PdfContent] | None

    def set_message_and_next_node(
        self, message: str | List[str], next_node: FlowNodeModel
    ):
        self.message = message
        self.node = next_node
