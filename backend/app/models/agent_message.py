import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class AgentMessage(Base):
    __tablename__ = "agent_messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String(36), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    from_agent = Column(String(50), nullable=False)
    to_agent = Column(String(50), nullable=False)
    message_type = Column(String(30), nullable=True)  # subtask_assignment, result, feedback, error
    content = Column(Text, nullable=False)
    extra_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    task = relationship("Task", back_populates="messages")

    def __repr__(self):
        return f"<AgentMessage {self.from_agent} -> {self.to_agent}>"
