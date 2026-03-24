import asyncio
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.schemas.task import (
    CreateTaskRequest, TaskResponse, TaskDetailResponse,
    TaskListResponse, AgentStepResponse, AgentMessageResponse
)
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.models.task import Task
from app.models.agent_step import AgentStep
from app.models.agent_message import AgentMessage
from app.agents.agent_registry import agent_pipeline
from datetime import datetime

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


async def run_agent_pipeline(task_id: str, description: str, db_url: str):
    """Background task: run the agent pipeline and save results to DB."""
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    engine = create_engine(db_url)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()

    try:
        # Update task status to in_progress
        task = db.query(Task).filter(Task.id == task_id).first()
        if not task:
            return
        task.status = "in_progress"
        db.commit()

        step_counter = [0]

        async def on_step(step_data):
            """Callback: save each agent step to DB."""
            step_counter[0] += 1
            agent_step = AgentStep(
                task_id=task_id,
                agent_name=step_data.get("agent", "unknown"),
                step_number=step_counter[0],
                action=step_data.get("message", "")[:100],
                input_data=str(step_data.get("plan", ""))[:2000],
                output_data=step_data.get("output_preview", "")[:2000],
                status=step_data.get("status", "running"),
            )
            db.add(agent_step)
            db.commit()

        # Run the pipeline
        result = await agent_pipeline.run(description, callback=on_step)

        # Update task with results
        task.status = "completed"
        task.final_output = result.get("final_output", "")
        task.execution_plan = result.get("execution_plan", {})
        task.total_tokens = result.get("total_tokens", 0)
        task.execution_time_ms = result.get("total_time_ms", 0)
        task.title = result.get("execution_plan", {}).get("task_title", description[:100])
        task.task_type = result.get("execution_plan", {}).get("task_type", "general")
        task.completed_at = datetime.utcnow()
        db.commit()

    except Exception as e:
        task = db.query(Task).filter(Task.id == task_id).first()
        if task:
            task.status = "failed"
            task.final_output = f"Error: {str(e)}"
            db.commit()
    finally:
        db.close()


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    request: CreateTaskRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new task and start the agent pipeline."""
    task = Task(
        user_id=current_user.id,
        title=request.description[:100],
        description=request.description,
        task_type=request.task_type,
        priority=request.priority,
        output_format=request.output_format,
        status="planning"
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    # Run agent pipeline in background
    from app.config import settings
    background_tasks.add_task(
        run_agent_pipeline_sync,
        str(task.id),
        request.description,
        settings.DATABASE_URL
    )

    return TaskResponse.model_validate(task)


def run_agent_pipeline_sync(task_id: str, description: str, db_url: str):
    """Sync wrapper to run async pipeline in background."""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        loop.run_until_complete(run_agent_pipeline(task_id, description, db_url))
    finally:
        loop.close()


@router.get("", response_model=TaskListResponse)
def list_tasks(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=50),
    status: Optional[str] = None,
    task_type: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all tasks for the current user (paginated)."""
    query = db.query(Task).filter(Task.user_id == current_user.id)

    if status:
        query = query.filter(Task.status == status)
    if task_type:
        query = query.filter(Task.task_type == task_type)

    total = query.count()
    tasks = query.order_by(desc(Task.created_at)).offset((page - 1) * per_page).limit(per_page).all()

    return TaskListResponse(
        tasks=[TaskResponse.model_validate(t) for t in tasks],
        total=total,
        page=page,
        per_page=per_page
    )


@router.get("/{task_id}", response_model=TaskDetailResponse)
def get_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get task details with agent steps and messages."""
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return TaskDetailResponse(
        **TaskResponse.model_validate(task).model_dump(),
        steps=[AgentStepResponse.model_validate(s) for s in task.steps],
        messages=[AgentMessageResponse.model_validate(m) for m in task.messages]
    )


@router.delete("/{task_id}")
def delete_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a task."""
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}
