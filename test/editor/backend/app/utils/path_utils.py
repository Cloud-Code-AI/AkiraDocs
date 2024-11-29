from pathlib import Path
import os

def sanitize_path(path: str) -> str:
    """Sanitize and validate file path to prevent directory traversal attacks"""
    sanitized = Path(path).resolve()
    base_path = Path(os.getcwd()).resolve()
    
    if not str(sanitized).startswith(str(base_path)):
        raise ValueError("Invalid path: Attempted directory traversal")
    
    return str(sanitized)
