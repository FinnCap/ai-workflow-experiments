from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class FlowLogResult(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    flow_execution_id: UUID
    flow_id: UUID
    started: datetime
    stopped: datetime
    total_tokens_in: int
    total_tokens_out: int
