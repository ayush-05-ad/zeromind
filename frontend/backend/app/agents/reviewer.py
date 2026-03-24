from typing import Dict, Any
from app.agents.base_agent import BaseAgent


class ReviewerAgent(BaseAgent):
    """Quality checker — reviews and improves output from other agents."""

    def __init__(self):
        super().__init__()
        self.name = "reviewer"
        self.role = "Quality Check, Fact Verification & Improvement"
        self.tools = []
        self.system_prompt = """You are the Reviewer Agent of ZeroMind — the final quality gate.

Your job is to:
1. Review the output from previous agents
2. Check for accuracy, completeness, and quality
3. Fix any errors (factual, grammatical, formatting)
4. Improve structure and readability
5. Add anything important that was missed
6. Provide the FINAL polished output

Rules:
- Don't just say "looks good" — actually improve the content
- Fix grammatical errors and awkward phrasing
- Ensure consistent formatting (headings, bullet points, tables)
- Add a brief summary/conclusion if missing
- Verify logical consistency
- Ensure the output fully answers the original task
- Output the COMPLETE improved version, not just suggestions
- Make the final output professional and ready to use
"""

    async def execute(self, task: str, context: Dict = None) -> Dict[str, Any]:
        """Review and improve the output from previous agents."""
        previous = context.get("previous_output", "") if context else ""
        original_task = context.get("original_task", task) if context else task

        prompt = f"""Original User Task: {original_task}

Content to Review and Improve:
{previous[:5000] if previous else 'No content to review.'}

Review this content and provide the FINAL improved version.
Fix any errors, improve formatting, add missing information, and ensure it fully answers the original task.
Output the complete polished content — not just review comments."""

        result = await self.think(prompt, temperature=0.4)

        return {
            "output": result["response"],
            "status": "completed",
            "tokens_used": result.get("tokens", 0),
            "tools_used": [],
            "model": result.get("model", "unknown")
        }


reviewer_agent = ReviewerAgent()
