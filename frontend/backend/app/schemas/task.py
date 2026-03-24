from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


# ===== Request Schemas =====

class CreateTaskRequest(BaseModel):
    description: str
    task_type: Optional[str] = None
    priority: Optional[str] = "medium"
    output_format: Optional[str] = "markdown"


# ===== Response Schemas =====

class AgentStepResponse(BaseModel):
    id: str
    agent_name: str
    step_number: int
    action: Optional[str] = None
    input_data: Optional[str] = None
    output_data: Optional[str] = None
    tool_used: Optional[str] = None
    status: str
    tokens_used: int
    duration_ms: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AgentMessageResponse(BaseModel):
    id: str
    from_agent: str
    to_agent: str
    message_type: Optional[str] = None
    content: str
    extra_data: Optional[Any] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TaskResponse(BaseModel):
    id: str
    title: str
    description: str
    task_type: Optional[str] = None
    status: str
    priority: str
    execution_plan: Optional[Any] = None
    final_output: Optional[str] = None
    output_format: str
    total_tokens: int
    execution_time_ms: Optional[int] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TaskDetailResponse(TaskResponse):
    steps: List[AgentStepResponse] = []
    messages: List[AgentMessageResponse] = []


class TaskListResponse(BaseModel):
    tasks: List[TaskResponse]
    total: int
    page: int
    per_page: int
