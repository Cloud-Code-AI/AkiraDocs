# backend/app/services/file_service.py
import json
import os
import shutil
from pathlib import Path
from typing import Dict, Any
import aiofiles
import asyncio
from fastapi import HTTPException

class FileService:
    def __init__(self):
        self.base_path = Path(os.getcwd()) / 'compiled'
        self.max_retries = 3
        self.retry_delay = 1  # seconds

    async def write_file(self, file_path: str, content: Dict[str, Any]) -> None:
        full_path = self.base_path / file_path

        # Ensure directory exists
        os.makedirs(full_path.parent, exist_ok=True)

        for attempt in range(self.max_retries):
            try:
                async with aiofiles.open(full_path, 'w') as f:
                    await f.write(json.dumps(content, indent=2))
                return
            except Exception as e:
                if attempt == self.max_retries - 1:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Failed to write file after {self.max_retries} attempts: {str(e)}"
                    )
                await asyncio.sleep(self.retry_delay)

    async def read_file(self, file_path: str) -> Dict[str, Any]:
        full_path = self.base_path / file_path
        
        if not full_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        async with aiofiles.open(full_path, 'r') as f:
            content = await f.read()
            return json.loads(content)

    async def delete_item(self, item_path: str, item_type: str) -> None:
        full_path = self.base_path / item_path

        if not full_path.exists():
            raise FileNotFoundError(f"Path not found: {item_path}")

        if item_type == 'folder':
            shutil.rmtree(full_path)
        else:
            os.unlink(full_path)