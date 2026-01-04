from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from api.service.api_service import ApiService
from api.web.form.create_api_form import CreateAPIForm
from api.web.form.update_api_form import UpdateAPIForm
from api.web.result.api_result import ApiResult

api_router = APIRouter(prefix="/api", tags=["API"])


@api_router.get("/", response_model=List[ApiResult])
async def get_all(api_service: ApiService = Depends()):
    response = api_service.get_all()
    return [ApiResult.from_model(api) for api in response]


@api_router.post("/", response_model=ApiResult)
async def create_api(form: CreateAPIForm, api_service: ApiService = Depends()):
    response = api_service.create_api(form=form)
    return ApiResult.from_model(response)


@api_router.get("/{api_id}", response_model=ApiResult)
async def get_by_id(api_id: UUID, api_service: ApiService = Depends()):
    response = api_service.get_by_id(api_id)
    if not response:
        raise HTTPException(status_code=404, detail="API not found")
    return ApiResult.from_model(response)


@api_router.put("/{api_id}", response_model=ApiResult)
async def update_api(
    api_id: UUID, form: UpdateAPIForm, api_service: ApiService = Depends()
):
    response = api_service.update_api(api_id=api_id, form=form)
    if not response:
        raise HTTPException(status_code=404, detail="API not found")
    return ApiResult.from_model(response)


@api_router.delete("/{api_id}")
async def delete_api(api_id: UUID, api_service: ApiService = Depends()):
    response = api_service.delete_api(api_id=api_id)
    if not response:
        raise HTTPException(status_code=404, detail="API not found")
    return {"message": "API deleted successfully"}
