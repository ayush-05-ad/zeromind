import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class AgentStep(Base):
    __tablename__ = "agent_steps"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String(36), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    agent_name = Column(String(50), nullable=False)
    step_number = Column(Integer, nullable=False)
    action = Column(String(100), nullable=True)
    input_data = Column(Text, nullable=True)
    output_data = Column(Text, nullable=True)
    tool_used = Column(String(50), nullable=True)
    status = Column(String(20), default="running")
    tokens_used = Column(Integer, default=0)
    duration_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    task = relationship("Task", back_populates="steps")

    def __repr__(self):
        return f"<AgentStep {self.agent_name} #{self.step_number}>"
