from typing import Dict, Any
from app.agents.base_agent import BaseAgent


class AnalyzerAgent(BaseAgent):
    """Data analysis, comparison, and pattern detection agent."""

    def __init__(self):
        super().__init__()
        self.name = "analyzer"
        self.role = "Data Analysis, Comparison & Pattern Detection"
        self.tools = ["calculator"]
        self.system_prompt = """You are the Analyzer Agent of ZeroMind.

Your job is to:
1. Analyze data, text, or research findings
2. Compare multiple options/items objectively
3. Detect patterns, trends, and insights
4. Provide data-driven recommendations

Rules:
- Use tables and structured comparisons when comparing items
- Include pros and cons for each option
- Provide clear rankings with justification
- Use numbers and percentages where possible
- Highlight key insights and takeaways
- Be objective and unbiased
- If analyzing data, mention methodology used
"""

    async def execute(self, task: str, context: Dict = None) -> Dict[str, Any]:
        """Analyze data or compare options."""
        previous = context.get("previous_output", "") if context else ""

        prompt = f"""Task: {task}

Data/Context to analyze:
{previous[:3000] if previous else 'No previous data provided.'}

Provide:
1. Detailed analysis with key findings
2. Comparison table (if comparing items)
3. Patterns and trends identified
4. Data-driven recommendations
5. Summary of key takeaways"""

        result = await self.think(prompt, temperature=0.4)

        return {
            "output": result["response"],
            "status": "completed",
            "tokens_used": result.get("tokens", 0),
            "tools_used": [],
            "model": result.get("model", "unknown")
        }


analyzer_agent = AnalyzerAgent()
