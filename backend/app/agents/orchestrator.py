import json
from typing import Dict, Any, List

from app.agents.base_agent import BaseAgent


class OrchestratorAgent(BaseAgent):
    """The brain of ZeroMind — decomposes complex tasks into subtasks
    and assigns them to specialist agents.
    """

    def __init__(self):
        super().__init__()
        self.name = "orchestrator"
        self.role = "Task Planner & Coordinator"
        self.system_prompt = """You are the Orchestrator Agent of ZeroMind — a multi-agent AI platform.

Your job is to:
1. Analyze the user's task/request carefully
2. Determine the task type (research, code, analysis, content, study, general)
3. Break it into subtasks and assign to the right specialist agents
4. Create an execution plan

Available agents:
- researcher: Web search, data gathering, fact-finding, current information
- coder: Code generation, debugging, optimization, code review
- analyzer: Data analysis, comparison, pattern detection, CSV/data processing
- writer: Report writing, email drafting, content creation, formatting
- study_helper: Exam prep, notes generation, quiz creation, syllabus analysis, study planning
- reviewer: Quality check, fact verification, improvement suggestions (always runs last)

RESPOND ONLY IN THIS JSON FORMAT (no extra text):
{
    "task_title": "Short title for the task",
    "task_type": "research|code|analysis|content|study|general",
    "subtasks": [
        {
            "step": 1,
            "agent": "agent_name",
            "instruction": "Detailed instruction for the agent",
            "depends_on": null
        },
        {
            "step": 2,
            "agent": "agent_name",
            "instruction": "Detailed instruction",
            "depends_on": 1
        }
    ],
    "final_agent": "reviewer"
}

Rules:
- Minimum 2 subtasks, maximum 6 subtasks
- Reviewer agent is ALWAYS the last step
- Use depends_on to chain agent outputs
- Be specific in instructions — agents work independently
- For student/study tasks, ALWAYS use study_helper agent
"""

    async def execute(self, task: str, context: Dict = None) -> Dict[str, Any]:
        """Decompose task into execution plan."""
        prompt = f"""User Task: {task}

Analyze this task and create an execution plan with subtasks assigned to specialist agents.
Remember to respond ONLY in the specified JSON format."""

        result = await self.think(prompt, temperature=0.3)

        try:
            # Try to parse JSON from response
            response_text = result["response"]
            # Clean up markdown code blocks if present
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0]

            plan = json.loads(response_text.strip())

            return {
                "output": plan,
                "status": "completed",
                "tokens_used": result.get("tokens", 0),
                "tools_used": [],
                "model": result.get("model", "unknown")
            }
        except json.JSONDecodeError:
            # Fallback: create a simple plan
            return {
                "output": {
                    "task_title": task[:100],
                    "task_type": "general",
                    "subtasks": [
                        {"step": 1, "agent": "researcher", "instruction": task, "depends_on": None},
                        {"step": 2, "agent": "writer", "instruction": f"Write a comprehensive response for: {task}", "depends_on": 1},
                        {"step": 3, "agent": "reviewer", "instruction": "Review and improve the output", "depends_on": 2}
                    ],
                    "final_agent": "reviewer"
                },
                "status": "completed",
                "tokens_used": result.get("tokens", 0),
                "tools_used": [],
                "model": result.get("model", "unknown")
            }


orchestrator_agent = OrchestratorAgent()
