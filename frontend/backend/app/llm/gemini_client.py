import google.generativeai as genai
from app.config import settings


class GeminiClient:
    """Google Gemini API wrapper (FREE tier)."""

    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-2.0-flash")

    async def generate(self, prompt: str, system_prompt: str = None, temperature: float = 0.7) -> str:
        """Generate a response from Gemini."""
        try:
            messages = []
            if system_prompt:
                full_prompt = f"{system_prompt}\n\n{prompt}"
            else:
                full_prompt = prompt

            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=temperature,
                    max_output_tokens=4096,
                )
            )
            return response.text

        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")

    async def generate_with_history(self, messages: list, system_prompt: str = None, temperature: float = 0.7) -> str:
        """Generate response with conversation history."""
        try:
            chat = self.model.start_chat(history=[])

            if system_prompt:
                chat.send_message(f"System: {system_prompt}")

            for msg in messages[:-1]:
                if msg["role"] == "user":
                    chat.send_message(msg["content"])

            response = chat.send_message(messages[-1]["content"])
            return response.text

        except Exception as e:
            raise Exception(f"Gemini Chat error: {str(e)}")


# Singleton instance
gemini_client = GeminiClient()
