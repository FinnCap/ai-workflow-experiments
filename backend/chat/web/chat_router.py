from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from chat.service.chat_service import ChatService
from chat.web.form.create_chat_form import CreateChatForm
from chat.web.form.update_chat_form import UpdateChatForm
from chat.web.result.chat_detail_result import ChatDetailResult
from chat.web.result.chat_result import ChatResult

chat_router = APIRouter(prefix="/chat", tags=["Chat"])


@chat_router.get("/", response_model=List[ChatResult])
async def get_all_chats(chat_service: ChatService = Depends()):
    chats = chat_service.get_all_chats()
    return [ChatResult.from_model(chat) for chat in chats]


@chat_router.post("/", response_model=ChatResult, status_code=201)
async def create_chat(form: CreateChatForm, chat_service: ChatService = Depends()):
    chat = chat_service.create_chat(form=form)
    return ChatResult.from_model(chat)


@chat_router.get("/{chat_id}", response_model=ChatDetailResult)
async def get_chat_by_id(chat_id: UUID, chat_service: ChatService = Depends()):
    chat = chat_service.get_chat_by_id(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return ChatDetailResult.from_model(chat)


@chat_router.put("/{chat_id}", response_model=ChatResult)
async def update_chat(
    chat_id: UUID, form: UpdateChatForm, chat_service: ChatService = Depends()
):
    chat = chat_service.update_chat(chat_id, form=form)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return ChatResult.from_model(chat)


@chat_router.delete("/{chat_id}")
async def delete_chat(chat_id: UUID, chat_service: ChatService = Depends()):
    success = chat_service.delete_chat(chat_id=chat_id)
    if not success:
        raise HTTPException(status_code=404, detail="Chat not found")
    return {"message": "Chat deleted successfully"}
