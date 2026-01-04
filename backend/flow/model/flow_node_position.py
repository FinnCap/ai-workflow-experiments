from pydantic import BaseModel


class FlowNodePosition(BaseModel):
    x: float
    y: float
