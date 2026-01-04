from typing import List, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from flow.model.flow_model import FlowModel


class FlowRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, flow: FlowModel) -> FlowModel:
        self.session.add(flow)
        return flow

    def get_by_id(self, flow_id: UUID) -> Optional[FlowModel]:
        query = (
            select(FlowModel)
            .where(FlowModel.id == flow_id)
            .options(
                selectinload(FlowModel.nodes),
                selectinload(FlowModel.edges),
            )
        )
        result = self.session.execute(query)
        return result.scalar_one_or_none()

    def get_all(self) -> List[FlowModel]:
        query = select(FlowModel).order_by(FlowModel.created_at.desc())
        result = self.session.execute(query)
        return list(result.scalars().all())

    def update(self, flow: FlowModel) -> FlowModel:
        self.session.merge(flow)
        return flow

    def delete(self, flow_id: UUID) -> bool:
        flow = self.get_by_id(flow_id)
        if not flow:
            return False
        self.session.delete(flow)

        return True
