from typing import List, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from api.model.api_model import ApiModel


class ApiRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> List[ApiModel]:
        return self.session.query(ApiModel).all()

    def get_by_id(self, api_id: UUID) -> Optional[ApiModel]:
        return self.session.query(ApiModel).filter(ApiModel.id == api_id).first()

    def get_by_name(self, name: str) -> Optional[ApiModel]:
        return self.session.query(ApiModel).filter(ApiModel.name == name).first()

    def create(self, api: ApiModel) -> ApiModel:
        self.session.add(api)
        return api

    def update(self, api: ApiModel) -> Optional[ApiModel]:
        self.session.merge(api)
        return api

    def delete(self, api_id: UUID) -> bool:
        api = self.get_by_id(api_id)
        if not api:
            return False

        self.session.delete(api)
        return True

    def get_by_ids(self, api_ids: List[UUID]) -> List[ApiModel]:
        if not api_ids:
            return []

        query = select(ApiModel).where(ApiModel.id.in_(api_ids))
        result = self.session.execute(query)
        return list(result.scalars().all())
