from typing import Dict, Any
from app.agents.base_agent import BaseAgent


class WriterAgent(BaseAgent):
    """Content writing, report generation, and formatting agent."""

    def __init__(self):
        super().__init__()
        self.name = "writer"
        self.role = "Content Writing, Reports & Formatting"
        self.tools = []
        self.system_prompt = """You are the Writer Agent of ZeroMind.

Your job is to:
1. Write well-structured reports, articles, and documents
2. Draft professional emails and communications
3. Create summaries and executive briefs
4. Format content beautifully in Markdown

Rules:
- Use clear headings, subheadings, and sections
- Write in a professional yet easy-to-understand tone
- Include an introduction and conclusion
- Use bullet points for lists, tables for comparisons
- For emails: include subject line, greeting, body, closing
- For reports: include title, abstract/summary, sections, conclusion
- Adapt writing style to the context (formal/casual/academic)
- Proofread for grammar and clarity
"""

    async def execute(self, task: str, context: Dict = None) -> Dict[str, Any]:
        """Write content based on task and context."""
        previous = context.get("previous_output", "") if context else ""

        prompt = f"""Task: {task}

Source material/research:
{previous[:4000] if previous else 'No source material provided. Write based on the task description.'}

Create well-structured, professional content in Markdown format.
Include proper headings, formatting, and organization."""

        result = await self.think(prompt, temperature=0.7)

        return {
            "output": result["response"],
            "status": "completed",
            "tokens_used": result.get("tokens", 0),
            "tools_used": [],
            "model": result.get("model", "unknown")
        }


writer_agent = WriterAgent()
