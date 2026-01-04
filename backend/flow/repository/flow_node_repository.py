from typing import List
from uuid import UUID

from sqlalchemy import delete
from sqlalchemy.orm import Session

from flow.model.flow_node_model import FlowNodeModel


class FlowNodeRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_bulk(self, nodes: List[FlowNodeModel]) -> List[FlowNodeModel]:
        self.session.add_all(nodes)
        return nodes

    def delete_by_flow_id(self, flow_id: UUID) -> None:
        query = delete(FlowNodeModel).where(FlowNodeModel.flow_id == flow_id)
        self.session.execute(query)
