from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel
from .user import UserOut


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "todo"
    due_date: Optional[date] = None
    assigned_to: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[date] = None
    assigned_to: Optional[str] = None


class TaskOut(BaseModel):
    id: str
    title: str
    description: Optional[str]
    status: str
    due_date: Optional[date]
    project_id: str
    assigned_to: Optional[str]
    created_at: datetime
    assignee: Optional[UserOut] = None
    is_overdue: Optional[bool] = False

    class Config:
        from_attributes = True
