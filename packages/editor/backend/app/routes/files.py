# backend/app/routes/files.py
from fastapi import APIRouter, HTTPException
from app.models.file import FileContent, DeleteItem
from app.services.file_service import FileService
from typing import Dict, Any

router = APIRouter()
file_service = FileService()

@router.post("")
async def create_file(file_content: FileContent) -> Dict[str, bool]:
    try:
        await file_service.write_file(file_content.path, file_content.content)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
async def read_file(path: str) -> Dict[str, Any]:
    try:
        content = await file_service.read_file(path)
        return content
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("")
async def update_file(file_content: FileContent) -> Dict[str, bool]:
    try:
        await file_service.write_file(file_content.path, file_content.content)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("")
async def delete_item(item: DeleteItem) -> Dict[str, bool]:
    try:
        await file_service.delete_item(item.path, item.type)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))