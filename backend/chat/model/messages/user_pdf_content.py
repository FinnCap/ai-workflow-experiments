from typing import Optional

from pydantic import BaseModel


class PdfContent(BaseModel):
    file_name: Optional[str]
    media_type: str
    data: str
