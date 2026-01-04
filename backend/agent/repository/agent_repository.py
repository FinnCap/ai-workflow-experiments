from typing import List, Optional
from uuid import UUID

from sqlalchemy.orm import Session

from agent.model.agent_model import AgentModel


class AgentRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> List[AgentModel]:
        return self.session.query(AgentModel).all()

    def get_by_id(self, agent_id: UUID) -> Optional[AgentModel]:
        return self.session.query(AgentModel).filter(AgentModel.id == agent_id).first()

    def create(self, agent: AgentModel) -> AgentModel:
        self.session.add(agent)
        self.session.flush()  # Flush to get the ID, but don't commit
        return agent

    def update(self, agent: AgentModel) -> Optional[AgentModel]:
        self.session.merge(agent)
        self.session.flush()  # Flush changes, but don't commit
        return agent

    def delete(self, agent_id: UUID) -> bool:
        agent = self.get_by_id(agent_id)
        if not agent:
            return False

        self.session.delete(agent)
        self.session.flush()  # Flush deletion, but don't commit
        return True
