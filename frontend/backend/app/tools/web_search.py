from typing import List, Dict
import httpx
from duckduckgo_search import DDGS


async def search_web(query: str, max_results: int = 5) -> List[Dict]:
    """Search the web using DuckDuckGo (FREE, no API key needed).

    Args:
        query: Search query string
        max_results: Maximum number of results to return

    Returns:
        List of dicts with: title, url, snippet
    """
    try:
        with DDGS() as ddgs:
            results = []
            for r in ddgs.text(query, max_results=max_results):
                results.append({
                    "title": r.get("title", ""),
                    "url": r.get("href", ""),
                    "snippet": r.get("body", "")
                })
            return results
    except Exception as e:
        print(f"Search error: {e}")
        return [{"title": "Search failed", "url": "", "snippet": str(e)}]


async def scrape_url(url: str) -> str:
    """Scrape text content from a URL.

    Args:
        url: The URL to scrape

    Returns:
        Extracted text content (truncated to 5000 chars)
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, follow_redirects=True)
            response.raise_for_status()

            from bs4 import BeautifulSoup
            soup = BeautifulSoup(response.text, "html.parser")

            # Remove script and style elements
            for script in soup(["script", "style", "nav", "footer", "header"]):
                script.decompose()

            text = soup.get_text(separator="\n", strip=True)

            # Clean up whitespace
            lines = [line.strip() for line in text.splitlines() if line.strip()]
            clean_text = "\n".join(lines)

            return clean_text[:5000]

    except Exception as e:
        return f"Error scraping URL: {str(e)}"
