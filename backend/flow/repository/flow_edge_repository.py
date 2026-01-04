from typing import List
from uuid import UUID

from sqlalchemy import delete
from sqlalchemy.orm import Session

from flow.model.flow_edge_model import FlowEdgeModel


class FlowEdgeRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_bulk(self, edges: List[FlowEdgeModel]) -> List[FlowEdgeModel]:
        self.session.add_all(edges)
        return edges

    def delete_by_flow_id(self, flow_id: UUID) -> None:
        query = delete(FlowEdgeModel).where(FlowEdgeModel.flow_id == flow_id)
        self.session.execute(query)
