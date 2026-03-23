from typing import Dict, Any
from app.agents.base_agent import BaseAgent
from app.tools.web_search import search_web, scrape_url


class ResearcherAgent(BaseAgent):
    """Web research agent — searches the internet and gathers information."""

    def __init__(self):
        super().__init__()
        self.name = "researcher"
        self.role = "Web Research & Data Gathering"
        self.tools = ["web_search", "url_scraper"]
        self.system_prompt = """You are the Researcher Agent of ZeroMind.

Your job is to:
1. Search the web for relevant, accurate, and current information
2. Gather data from multiple sources
3. Extract key facts, statistics, and insights
4. Organize findings in a clear, structured format

Rules:
- Always cite your sources
- Prioritize recent and reliable information
- Present data in organized bullet points or sections
- If search returns limited results, clearly state what was found
- Include relevant numbers, dates, and specifics
- Be thorough but concise
"""

    async def execute(self, task: str, context: Dict = None) -> Dict[str, Any]:
        """Research a topic using web search."""
        total_tokens = 0
        tools_used = []

        # Step 1: Search the web
        search_results = await search_web(task)
        tools_used.append("web_search")

        # Step 2: Build context from search results
        search_context = "## Search Results:\n\n"
        for i, result in enumerate(search_results[:5], 1):
            search_context += f"{i}. **{result.get('title', 'N/A')}**\n"
            search_context += f"   URL: {result.get('url', 'N/A')}\n"
            search_context += f"   {result.get('snippet', 'No description')}\n\n"

        # Step 3: Synthesize with LLM
        prompt = f"""Task: {task}

{search_context}

Previous context: {context.get('previous_output', 'None') if context else 'None'}

Based on the search results above, provide a comprehensive research summary.
Include key facts, statistics, comparisons, and cite sources.
Format your response in well-organized sections with headers."""

        result = await self.think(prompt)
        total_tokens += result.get("tokens", 0)

        return {
            "output": result["response"],
            "status": "completed",
            "tokens_used": total_tokens,
            "tools_used": tools_used,
            "model": result.get("model", "unknown"),
            "sources": search_results[:5]
        }


researcher_agent = ResearcherAgent()
