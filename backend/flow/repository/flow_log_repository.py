from typing import List, Optional
from uuid import UUID

from sqlalchemy import desc
from sqlalchemy.orm import Session

from flow.model.flow_log_model import FlowLogModel


class FlowLogRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> List[FlowLogModel]:
        return (
            self.session.query(FlowLogModel)
            .order_by(desc(FlowLogModel.created_at))
            .all()
        )

    def get_by_id(self, flow_log_id: UUID) -> Optional[FlowLogModel]:
        return (
            self.session.query(FlowLogModel)
            .filter(FlowLogModel.id == flow_log_id)
            .first()
        )

    def get_by_flow_execution_id(self, flow_execution_id: UUID) -> List[FlowLogModel]:
        return (
            self.session.query(FlowLogModel)
            .filter(FlowLogModel.flow_execution_id == flow_execution_id)
            .order_by(desc(FlowLogModel.created_at))
            .all()
        )

    def get_by_flow_id(self, flow_id: UUID) -> List[FlowLogModel]:
        return (
            self.session.query(FlowLogModel)
            .filter(FlowLogModel.flow_id == flow_id)
            .order_by(desc(FlowLogModel.created_at))
            .all()
        )

    def get_by_flow_id_and_session(
        self, flow_id: UUID, log_session_id: UUID
    ) -> List[FlowLogModel]:
        return (
            self.session.query(FlowLogModel)
            .filter(
                FlowLogModel.flow_id == flow_id,
                FlowLogModel.log_session_id == log_session_id,
            )
            .order_by(desc(FlowLogModel.created_at))
            .all()
        )

    def create(self, flow_log: FlowLogModel) -> FlowLogModel:
        self.session.add(flow_log)
        return flow_log

    def update(self, flow_log: FlowLogModel) -> FlowLogModel:
        self.session.merge(flow_log)
        return flow_log

    def delete(self, flow_log_id: UUID) -> bool:
        flow_log = self.get_by_id(flow_log_id)
        if flow_log:
            self.session.delete(flow_log)

            return True
        return False

    def delete_by_log_session_id(self, log_session_id: UUID) -> int:
        """Delete all flow logs for a specific log session. Returns count of deleted records."""
        deleted_count = (
            self.session.query(FlowLogModel)
            .filter(FlowLogModel.log_session_id == log_session_id)
            .delete()
        )

        return deleted_count
