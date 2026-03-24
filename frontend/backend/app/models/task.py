import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    task_type = Column(String(50), nullable=True)
    status = Column(String(30), default="pending")
    priority = Column(String(10), default="medium")
    execution_plan = Column(JSON, nullable=True)
    final_output = Column(Text, nullable=True)
    output_format = Column(String(20), default="markdown")
    total_tokens = Column(Integer, default=0)
    execution_time_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="tasks")
    steps = relationship("AgentStep", back_populates="task", cascade="all, delete-orphan")
    messages = relationship("AgentMessage", back_populates="task", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Task {self.title[:50]}>"
