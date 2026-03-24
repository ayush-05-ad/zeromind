from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.middleware.auth_middleware import get_admin_user
from app.models.user import User
from app.models.task import Task
from app.models.agent_step import AgentStep

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/stats")
def get_platform_stats(
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get platform-wide statistics (admin only)."""
    total_users = db.query(func.count(User.id)).scalar()
    total_tasks = db.query(func.count(Task.id)).scalar()
    completed_tasks = db.query(func.count(Task.id)).filter(Task.status == "completed").scalar()
    failed_tasks = db.query(func.count(Task.id)).filter(Task.status == "failed").scalar()
    total_tokens = db.query(func.sum(Task.total_tokens)).scalar() or 0
    avg_execution_time = db.query(func.avg(Task.execution_time_ms)).filter(
        Task.execution_time_ms.isnot(None)
    ).scalar() or 0

    # Task type distribution
    type_dist = db.query(Task.task_type, func.count(Task.id)).group_by(Task.task_type).all()

    # Agent usage stats
    agent_stats = db.query(
        AgentStep.agent_name,
        func.count(AgentStep.id),
        func.avg(AgentStep.tokens_used)
    ).group_by(AgentStep.agent_name).all()

    return {
        "users": {
            "total": total_users,
        },
        "tasks": {
            "total": total_tasks,
            "completed": completed_tasks,
            "failed": failed_tasks,
            "success_rate": round((completed_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0
        },
        "performance": {
            "total_tokens_used": total_tokens,
            "avg_execution_time_ms": round(avg_execution_time, 0)
        },
        "task_types": {t: c for t, c in type_dist if t},
        "agents": [
            {
                "name": name,
                "total_runs": count,
                "avg_tokens": round(avg_tokens or 0, 0)
            }
            for name, count, avg_tokens in agent_stats
        ]
    }


@router.get("/users")
def list_all_users(
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """List all users with their task counts (admin only)."""
    users = db.query(User).all()
    result = []
    for user in users:
        task_count = db.query(func.count(Task.id)).filter(Task.user_id == user.id).scalar()
        result.append({
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active,
            "task_count": task_count,
            "created_at": user.created_at.isoformat()
        })
    return {"users": result}


@router.put("/users/{user_id}/role")
def update_user_role(
    user_id: str,
    role: str,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Change a user's role (admin only)."""
    if role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Role must be 'user' or 'admin'")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = role
    db.commit()
    return {"message": f"User {user.email} role updated to {role}"}


@router.put("/users/{user_id}/toggle-active")
def toggle_user_active(
    user_id: str,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Enable/disable a user account (admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User {user.email} is now {'active' if user.is_active else 'disabled'}"}
