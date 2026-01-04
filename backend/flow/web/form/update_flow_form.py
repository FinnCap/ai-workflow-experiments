from typing import Optional, List
from pydantic import BaseModel
from flow.web.form.create_flow_form import EdgeForm, NodeForm


class UpdateFlowForm(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    nodes: Optional[List[NodeForm]] = None
    edges: Optional[List[EdgeForm]] = None
