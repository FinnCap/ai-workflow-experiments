from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from common.enum.node_type import NodeType


class FlowLogModelResult(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    node_id: UUID
    node_type: NodeType
    in_message: List[str] | str
    out_message: List[str] | str
    total_tokens_in: int
    total_tokens_out: int
    created_at: datetime


class FlowLogDetailResult(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    flow_execution_id: UUID
    flow_id: UUID
    started: datetime
    stopped: datetime
    total_tokens_in: int
    total_tokens_out: int
    logs: List[FlowLogModelResult]
