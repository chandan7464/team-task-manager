from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from ..database import get_db
from ..models.task import Task
from ..models.project import Project, ProjectMember
from ..models.user import User
from ..schemas.task import TaskCreate, TaskUpdate, TaskOut
from ..dependencies.auth import get_current_user, require_admin

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


def _check_project_access(db: Session, project_id: str, user: User):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if user.role != "admin":
        membership = db.query(ProjectMember).filter(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == user.id
        ).first()
        if not membership:
            raise HTTPException(status_code=403, detail="Access denied")
    return project


def _enrich_task(task: Task) -> TaskOut:
    today = date.today()
    out = TaskOut.model_validate(task)
    out.is_overdue = (
        task.due_date is not None and
        task.due_date < today and
        task.status != "done"
    )
    return out


@router.post("/project/{project_id}", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    project_id: str,
    data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    _check_project_access(db, project_id, current_user)

    if data.assigned_to:
        assignee = db.query(User).filter(User.id == data.assigned_to).first()
        if not assignee:
            raise HTTPException(status_code=404, detail="Assigned user not found")

    if data.status not in ["todo", "in_progress", "done"]:
        raise HTTPException(status_code=400, detail="Invalid status value")

    task = Task(
        title=data.title,
        description=data.description,
        status=data.status or "todo",
        due_date=data.due_date,
        project_id=project_id,
        assigned_to=data.assigned_to
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    task_with_rel = db.query(Task).options(joinedload(Task.assignee)).filter(Task.id == task.id).first()
    return _enrich_task(task_with_rel)


@router.get("/project/{project_id}", response_model=List[TaskOut])
def list_project_tasks(
    project_id: str,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    _check_project_access(db, project_id, current_user)

    query = db.query(Task).options(joinedload(Task.assignee)).filter(Task.project_id == project_id)
    if status_filter:
        query = query.filter(Task.status == status_filter)

    tasks = query.all()
    return [_enrich_task(t) for t in tasks]


@router.get("/{task_id}", response_model=TaskOut)
def get_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).options(joinedload(Task.assignee)).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    _check_project_access(db, task.project_id, current_user)
    return _enrich_task(task)


@router.patch("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: str,
    data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    _check_project_access(db, task.project_id, current_user)

    # Members can only update status of tasks assigned to them
    if current_user.role == "member":
        if task.assigned_to != current_user.id:
            raise HTTPException(status_code=403, detail="You can only update tasks assigned to you")
        if data.status is not None:
            if data.status not in ["todo", "in_progress", "done"]:
                raise HTTPException(status_code=400, detail="Invalid status")
            task.status = data.status
    else:
        # Admin can update everything
        if data.title is not None:
            task.title = data.title
        if data.description is not None:
            task.description = data.description
        if data.status is not None:
            if data.status not in ["todo", "in_progress", "done"]:
                raise HTTPException(status_code=400, detail="Invalid status")
            task.status = data.status
        if data.due_date is not None:
            task.due_date = data.due_date
        if data.assigned_to is not None:
            task.assigned_to = data.assigned_to

    db.commit()
    db.refresh(task)
    task_with_rel = db.query(Task).options(joinedload(Task.assignee)).filter(Task.id == task.id).first()
    return _enrich_task(task_with_rel)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
