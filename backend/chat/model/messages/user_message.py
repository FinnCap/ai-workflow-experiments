from typing import List, Literal

from pydantic import BaseModel

from chat.model.messages.user_pdf_content import PdfContent


class UserMessage(BaseModel):
    type: Literal["user"] = "user"
    content: str | List[str | PdfContent]
