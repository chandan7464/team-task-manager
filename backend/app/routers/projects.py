from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..database import get_db
from ..models.project import Project, ProjectMember
from ..models.user import User
from ..models.task import Task
from ..schemas.project import ProjectCreate, ProjectUpdate, ProjectOut, ProjectDetailOut, MemberAdd
from ..schemas.user import UserOut
from ..dependencies.auth import get_current_user, require_admin

router = APIRouter(prefix="/api/projects", tags=["Projects"])


def _is_project_member(db: Session, project_id: str, user_id: str) -> bool:
    return db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id
    ).first() is not None


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    project = Project(name=data.name, description=data.description, owner_id=current_user.id)
    db.add(project)
    db.flush()
    # Auto-add creator as member
    db.add(ProjectMember(project_id=project.id, user_id=current_user.id))
    db.commit()
    db.refresh(project)
    project.member_count = 1
    project.task_count = 0
    return project


@router.get("", response_model=List[ProjectOut])
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "admin":
        projects = db.query(Project).all()
    else:
        memberships = db.query(ProjectMember.project_id).filter(
            ProjectMember.user_id == current_user.id
        ).all()
        project_ids = [m.project_id for m in memberships]
        projects = db.query(Project).filter(Project.id.in_(project_ids)).all()

    result = []
    for p in projects:
        member_count = db.query(ProjectMember).filter(ProjectMember.project_id == p.id).count()
        task_count = db.query(Task).filter(Task.project_id == p.id).count()
        out = ProjectOut.model_validate(p)
        out.member_count = member_count
        out.task_count = task_count
        result.append(out)
    return result


@router.get("/{project_id}", response_model=ProjectDetailOut)
def get_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).options(
        joinedload(Project.owner),
        joinedload(Project.members).joinedload(ProjectMember.user)
    ).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if current_user.role != "admin" and not _is_project_member(db, project_id, current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")

    members = [UserOut.model_validate(m.user) for m in project.members if m.user]
    task_count = db.query(Task).filter(Task.project_id == project_id).count()
    out = ProjectDetailOut.model_validate(project)
    out.members = members
    out.member_count = len(members)
    out.task_count = task_count
    return out


@router.patch("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: str,
    data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if data.name is not None:
        project.name = data.name
    if data.description is not None:
        project.description = data.description

    db.commit()
    db.refresh(project)
    project.member_count = db.query(ProjectMember).filter(ProjectMember.project_id == project_id).count()
    project.task_count = db.query(Task).filter(Task.project_id == project_id).count()
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()


@router.post("/{project_id}/members", status_code=status.HTTP_201_CREATED)
def add_member(
    project_id: str,
    data: MemberAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if _is_project_member(db, project_id, data.user_id):
        raise HTTPException(status_code=400, detail="User is already a member")

    db.add(ProjectMember(project_id=project_id, user_id=data.user_id))
    db.commit()
    return {"message": f"{user.username} added to project"}


@router.delete("/{project_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_member(
    project_id: str,
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id
    ).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Member not found in project")
    db.delete(membership)
    db.commit()
