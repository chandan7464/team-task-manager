from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.task import Task
from ..models.project import Project, ProjectMember
from ..models.user import User
from ..dependencies.auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()

    if current_user.role == "admin":
        tasks = db.query(Task).all()
        projects = db.query(Project).all()
        total_users = db.query(User).count()
    else:
        # Get member's projects
        memberships = db.query(ProjectMember.project_id).filter(
            ProjectMember.user_id == current_user.id
        ).all()
        project_ids = [m.project_id for m in memberships]
        tasks = db.query(Task).filter(Task.project_id.in_(project_ids)).all()
        projects = db.query(Project).filter(Project.id.in_(project_ids)).all()
        total_users = None

    total_tasks = len(tasks)
    completed = sum(1 for t in tasks if t.status == "done")
    in_progress = sum(1 for t in tasks if t.status == "in_progress")
    pending = sum(1 for t in tasks if t.status == "todo")
    overdue = sum(
        1 for t in tasks
        if t.due_date and t.due_date < today and t.status != "done"
    )

    stats = {
        "total_tasks": total_tasks,
        "completed": completed,
        "in_progress": in_progress,
        "pending": pending,
        "overdue": overdue,
        "total_projects": len(projects),
    }
    if total_users is not None:
        stats["total_users"] = total_users

    return stats
