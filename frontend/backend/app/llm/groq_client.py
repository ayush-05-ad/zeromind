from groq import Groq
from app.config import settings


class GroqClient:
    """Groq API wrapper (FREE tier) - Fallback LLM."""

    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None

    async def generate(self, prompt: str, system_prompt: str = None, temperature: float = 0.7) -> str:
        """Generate a response from Groq (Llama 3.3 70B)."""
        if not self.client:
            raise Exception("Groq API key not configured")

        try:
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})

            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                temperature=temperature,
                max_tokens=4096,
            )
            return response.choices[0].message.content

        except Exception as e:
            raise Exception(f"Groq API error: {str(e)}")


# Singleton instance
groq_client = GroqClient()
