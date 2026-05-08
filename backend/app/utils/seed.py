from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.project import Project, ProjectMember
from ..models.task import Task
from ..utils.security import hash_password
from datetime import date, timedelta
import uuid


def seed_database(db: Session):
    """Seed the database with demo data for testing."""

    # Check if already seeded
    if db.query(User).first():
        print("Database already seeded, skipping.")
        return

    # Create Admin user
    admin = User(
        id=str(uuid.uuid4()),
        username="admin",
        email="admin@taskmanager.com",
        password_hash=hash_password("Admin@123"),
        role="admin"
    )
    db.add(admin)

    # Create Member user
    member = User(
        id=str(uuid.uuid4()),
        username="john_doe",
        email="john@taskmanager.com",
        password_hash=hash_password("Member@123"),
        role="member"
    )
    db.add(member)

    member2 = User(
        id=str(uuid.uuid4()),
        username="jane_smith",
        email="jane@taskmanager.com",
        password_hash=hash_password("Member@123"),
        role="member"
    )
    db.add(member2)
    db.flush()

    # Create Projects
    project1 = Project(
        id=str(uuid.uuid4()),
        name="Website Redesign",
        description="Complete overhaul of the company website with modern UI/UX.",
        owner_id=admin.id
    )
    project2 = Project(
        id=str(uuid.uuid4()),
        name="Mobile App MVP",
        description="Build the first version of our mobile application.",
        owner_id=admin.id
    )
    db.add_all([project1, project2])
    db.flush()

    # Add members to projects
    db.add_all([
        ProjectMember(project_id=project1.id, user_id=admin.id),
        ProjectMember(project_id=project1.id, user_id=member.id),
        ProjectMember(project_id=project1.id, user_id=member2.id),
        ProjectMember(project_id=project2.id, user_id=admin.id),
        ProjectMember(project_id=project2.id, user_id=member.id),
    ])
    db.flush()

    today = date.today()

    # Create Tasks
    tasks = [
        Task(id=str(uuid.uuid4()), title="Design Homepage Mockup", description="Create Figma mockups for the new homepage.", status="done", due_date=today - timedelta(days=5), project_id=project1.id, assigned_to=member.id),
        Task(id=str(uuid.uuid4()), title="Implement Navigation", description="Build responsive navbar component.", status="in_progress", due_date=today + timedelta(days=3), project_id=project1.id, assigned_to=member.id),
        Task(id=str(uuid.uuid4()), title="SEO Optimization", description="Add meta tags and structured data.", status="todo", due_date=today - timedelta(days=2), project_id=project1.id, assigned_to=member2.id),
        Task(id=str(uuid.uuid4()), title="Write Content", description="Draft copy for all landing pages.", status="todo", due_date=today + timedelta(days=7), project_id=project1.id, assigned_to=member2.id),
        Task(id=str(uuid.uuid4()), title="Setup React Native", description="Initialize the RN project and CI/CD.", status="done", due_date=today - timedelta(days=10), project_id=project2.id, assigned_to=member.id),
        Task(id=str(uuid.uuid4()), title="User Authentication Screen", description="Build login and signup flows.", status="in_progress", due_date=today + timedelta(days=2), project_id=project2.id, assigned_to=member.id),
        Task(id=str(uuid.uuid4()), title="Push Notifications", description="Integrate Firebase push notifications.", status="todo", due_date=today - timedelta(days=1), project_id=project2.id, assigned_to=member.id),
    ]
    db.add_all(tasks)
    db.commit()

    print("✅ Database seeded successfully!")
    print("   Admin:  admin@taskmanager.com  / Admin@123")
    print("   Member: john@taskmanager.com   / Member@123")
    print("   Member: jane@taskmanager.com   / Member@123")
