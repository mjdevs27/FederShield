from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class Cell(BaseModel):
    id: str
    type: str # "code" | "markdown"
    content: str
    output: Optional[Any] = None

class NotebookBase(BaseModel):
    name: str
    cells: List[Cell] = []

class NotebookCreate(NotebookBase):
    pass

class NotebookUpdate(NotebookBase):
    pass

class Notebook(NotebookBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ExecutionRequest(BaseModel):
    notebook_id: str
    code: str

class ExecutionResponse(BaseModel):
    stdout: str
    stderr: Optional[str] = None
    error: Optional[str] = None
    plots: List[str] = []
