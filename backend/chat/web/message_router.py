from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from chat.service.message_service import MessageService
from chat.web.form.send_message_form import SendMessageForm
from chat.web.result.message_result import MessageResult

message_router = APIRouter(prefix="/chat", tags=["Message"])


@message_router.get("/{chat_id}/messages", response_model=List[MessageResult])
async def get_messages(
    chat_id: UUID, message_service: MessageService = Depends()
) -> List[MessageResult]:
    messages = message_service.get_messages(chat_id)
    return [MessageResult.from_model(msg) for msg in messages]


@message_router.post("/{chat_id}/messages", response_model=List[MessageResult])
async def send_message(
    chat_id: UUID, form: SendMessageForm, message_service: MessageService = Depends()
) -> List[MessageResult]:

    # Send message and get AI response, this can be multiple due to tool calls
    ai_messages = message_service.send_message(
        chat_id=chat_id,
        content=form.content,
        files=form.pdf_data,
        agent_call_variables=form.agent_call_variables,
        agent_call_headers=form.agent_call_headers,
    )

    if ai_messages is None:
        raise HTTPException(status_code=500, detail="Error sending message")

    return [MessageResult.from_model(message) for message in ai_messages]
