from typing import Dict, Any
from app.agents.base_agent import BaseAgent
from app.tools.code_executor import execute_python_code


class CoderAgent(BaseAgent):
    """Code generation, debugging, and optimization agent."""

    def __init__(self):
        super().__init__()
        self.name = "coder"
        self.role = "Code Generation, Debugging & Optimization"
        self.tools = ["code_executor"]
        self.system_prompt = """You are the Coder Agent of ZeroMind.

Your job is to:
1. Write clean, well-commented, production-quality code
2. Debug and fix code issues
3. Optimize code for performance
4. Explain code logic clearly

Rules:
- Always include comments explaining the logic
- Follow best practices and design patterns
- Handle errors gracefully with try-except
- Include type hints in Python code
- Provide usage examples
- If writing a full application, include requirements/dependencies
- Support multiple languages: Python, JavaScript, Java, C++, SQL
- For debugging: explain what was wrong and how you fixed it
"""

    async def execute(self, task: str, context: Dict = None) -> Dict[str, Any]:
        """Generate, debug, or optimize code."""
        previous = context.get("previous_output", "") if context else ""

        prompt = f"""Task: {task}

Previous context: {previous[:2000] if previous else 'None'}

Provide:
1. Complete working code with comments
2. Brief explanation of the approach
3. Usage example
4. Any dependencies needed"""

        result = await self.think(prompt, temperature=0.3)

        return {
            "output": result["response"],
            "status": "completed",
            "tokens_used": result.get("tokens", 0),
            "tools_used": [],
            "model": result.get("model", "unknown")
        }


coder_agent = CoderAgent()
