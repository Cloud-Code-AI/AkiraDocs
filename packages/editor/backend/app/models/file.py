# backend/app/models/file.py
from pydantic import BaseModel
from typing import Optional, Dict, Any, Literal

class FileContent(BaseModel):
    path: str
    content: Dict[str, Any]

class DeleteItem(BaseModel):
    path: str
    type: Literal['file', 'folder']