import hashlib
import json
import time
from typing import Optional

from app.config import settings
from app.llm.gemini_client import gemini_client
from app.llm.groq_client import groq_client


class LLMRouter:
    """Smart LLM routing with rate limiting, caching, and auto-failover.

    Flow: Cache check → Gemini (primary) → Groq (fallback) → Error
    """

    def __init__(self):
        self.cache: dict = {}  # In-memory cache (replace with Redis in production)
        self.request_timestamps: list = []
        self.rpm_limit = settings.RATE_LIMIT_RPM  # 15 RPM for Gemini free
        self.cache_ttl = settings.LLM_CACHE_TTL_SECONDS  # 6 hours

    def _get_cache_key(self, prompt: str, system_prompt: str = None) -> str:
        """Generate cache key from prompt."""
        content = f"{system_prompt or ''}::{prompt}"
        return hashlib.md5(content.encode()).hexdigest()

    def _check_cache(self, key: str) -> Optional[str]:
        """Check if response is cached and not expired."""
        if key in self.cache:
            entry = self.cache[key]
            if time.time() - entry["timestamp"] < self.cache_ttl:
                return entry["response"]
            else:
                del self.cache[key]
        return None

    def _set_cache(self, key: str, response: str):
        """Cache a response."""
        self.cache[key] = {
            "response": response,
            "timestamp": time.time()
        }

    def _check_rate_limit(self) -> bool:
        """Check if we're within rate limits."""
        now = time.time()
        # Remove timestamps older than 60 seconds
        self.request_timestamps = [t for t in self.request_timestamps if now - t < 60]
        return len(self.request_timestamps) < self.rpm_limit

    def _record_request(self):
        """Record a request timestamp."""
        self.request_timestamps.append(time.time())

    async def generate(
        self,
        prompt: str,
        system_prompt: str = None,
        temperature: float = 0.7,
        use_cache: bool = True
    ) -> dict:
        """Generate LLM response with smart routing.

        Returns: {"response": str, "model": str, "cached": bool, "tokens": int}
        """
        # Step 1: Check cache
        if use_cache:
            cache_key = self._get_cache_key(prompt, system_prompt)
            cached = self._check_cache(cache_key)
            if cached:
                return {
                    "response": cached,
                    "model": "cache",
                    "cached": True,
                    "tokens": 0
                }

        # Step 2: Try Gemini (primary)
        if self._check_rate_limit():
            try:
                self._record_request()
                response = await gemini_client.generate(prompt, system_prompt, temperature)

                if use_cache:
                    self._set_cache(cache_key, response)

                return {
                    "response": response,
                    "model": "gemini-2.0-flash",
                    "cached": False,
                    "tokens": len(response.split()) * 2  # rough estimate
                }
            except Exception as e:
                print(f"⚠️ Gemini failed: {e}, trying fallback...")

        # Step 3: Try Groq (fallback)
        try:
            response = await groq_client.generate(prompt, system_prompt, temperature)

            if use_cache:
                self._set_cache(cache_key, response)

            return {
                "response": response,
                "model": "groq-llama-3.3-70b",
                "cached": False,
                "tokens": len(response.split()) * 2
            }
        except Exception as e:
            print(f"⚠️ Groq also failed: {e}")

        # Step 4: All failed
        raise Exception("All LLM providers failed. Check API keys and rate limits.")


# Singleton instance
llm_router = LLMRouter()
