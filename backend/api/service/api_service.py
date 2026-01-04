from typing import List, Optional
from uuid import UUID

from fastapi import Depends
from sqlalchemy.orm import Session

from api.model.api_model import ApiModel
from api.repository.api_repository import ApiRepository
from api.web.form.create_api_form import CreateAPIForm
from api.web.form.update_api_form import UpdateAPIForm
from common.base import get_db
from common.decorators.transactional import transactional


class ApiService:

    def __init__(self, db: Session = Depends(get_db)) -> None:
        self.db = db
        self.repository = ApiRepository(session=db)

    def get_all(self) -> List[ApiModel]:
        return self.repository.get_all()

    def get_by_name(self, name: str) -> ApiModel | None:
        return self.repository.get_by_name(name=name)

    @transactional
    def create_api(self, form: CreateAPIForm) -> ApiModel:
        api_model = form.to_model()
        return self.repository.create(api=api_model)

    def get_by_id(self, api_id: UUID) -> ApiModel | None:
        return self.repository.get_by_id(api_id=api_id)

    def get_all_by_ids(self, api_ids: List[UUID]) -> List[ApiModel]:
        return self.repository.get_by_ids(api_ids=api_ids)

    @transactional
    def update_api(self, api_id: UUID, form: UpdateAPIForm) -> Optional[ApiModel]:
        api_to_update = self.get_by_id(api_id)
        if not api_to_update:
            return None

        # update_data = form.model_dump(exclude_unset=True)
        # for key, value in update_data.items():
        #     setattr(api_to_update, key, value)
        for field_name in form.model_fields_set:
            value = getattr(form, field_name)
            setattr(api_to_update, field_name, value)

        self.repository.update(api=api_to_update)

        return api_to_update

    @transactional
    def delete_api(self, api_id: UUID) -> bool:
        return self.repository.delete(api_id=api_id)
