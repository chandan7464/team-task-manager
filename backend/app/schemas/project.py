from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from .user import UserOut


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class MemberAdd(BaseModel):
    user_id: str


class ProjectOut(BaseModel):
    id: str
    name: str
    description: Optional[str]
    owner_id: Optional[str]
    created_at: datetime
    member_count: Optional[int] = 0
    task_count: Optional[int] = 0

    class Config:
        from_attributes = True


class ProjectDetailOut(ProjectOut):
    owner: Optional[UserOut] = None
    members: Optional[List[UserOut]] = []
