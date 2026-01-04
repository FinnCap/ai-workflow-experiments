from pydantic import BaseModel


class UpdateChatForm(BaseModel):
    title: str
