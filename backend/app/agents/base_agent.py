from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any
from datetime import datetime

from app.llm.llm_router import llm_router


class BaseAgent(ABC):
    """Abstract base class for all ZeroMind agents.

    Every agent has:
    - name: unique identifier
    - role: description of what this agent does
    - system_prompt: instructions for the LLM
    - tools: list of available tools
    """

    def __init__(self):
        self.name: str = "base_agent"
        self.role: str = "Base agent"
        self.system_prompt: str = ""
        self.tools: List[str] = []
        self.execution_log: List[Dict] = []

    async def think(self, prompt: str, temperature: float = 0.7) -> Dict[str, Any]:
        """Call LLM with agent's system prompt."""
        result = await llm_router.generate(
            prompt=prompt,
            system_prompt=self.system_prompt,
            temperature=temperature
        )
        self._log_step("think", prompt, result["response"], result["model"])
        return result

    def _log_step(self, action: str, input_data: str, output_data: str, model: str = ""):
        """Log agent execution step."""
        self.execution_log.append({
            "agent": self.name,
            "action": action,
            "input": input_data[:500],
            "output": output_data[:1000],
            "model": model,
            "timestamp": datetime.utcnow().isoformat()
        })

    @abstractmethod
    async def execute(self, task: str, context: Dict = None) -> Dict[str, Any]:
        """Execute the agent's main task. Must be implemented by subclasses.

        Args:
            task: The task description / input
            context: Additional context from orchestrator or previous agents

        Returns:
            Dict with keys: output, status, tokens_used, tools_used
        """
        pass

    def get_log(self) -> List[Dict]:
        """Return execution log."""
        return self.execution_log

    def clear_log(self):
        """Clear execution log."""
        self.execution_log = []

    def __repr__(self):
        return f"<Agent: {self.name} | Role: {self.role}>"
