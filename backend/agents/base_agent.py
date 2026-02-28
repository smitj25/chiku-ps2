"""
Base Agent — Generic LLM wrapper ("The Car").
It blindly executes the instructions provided by the SME-Plug Context Engine.
"""
import time
from typing import Optional
from config import (
    GEMINI_API_KEY, GROQ_API_KEY,
    LLM_PROVIDER, GEMINI_MODEL, GROQ_MODEL,
)


class BaseAgent:
    """Generic wrapper invoking the selected LLM."""

    def __init__(self):
        self._gemini_model = None
        self._groq_client = None

    def _init_gemini(self):
        if self._gemini_model is None:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            self._gemini_model = genai.GenerativeModel(GEMINI_MODEL)

    def _init_groq(self):
        if self._groq_client is None:
            from groq import Groq
            self._groq_client = Groq(api_key=GROQ_API_KEY)

    def generate(self, augmented_prompt: str, system_prompt: str, provider: Optional[str] = None) -> tuple[str, float]:
        """
        Execute the prompt against the LLM.
        Returns (response_text, duration_ms).
        """
        provider = provider or LLM_PROVIDER
        start = time.time()

        if provider == "gemini":
            response = self._call_gemini(augmented_prompt, system_prompt)
        elif provider == "groq":
            response = self._call_groq(augmented_prompt, system_prompt)
        else:
            raise ValueError(f"Unknown LLM provider: {provider}")

        duration_ms = (time.time() - start) * 1000
        return response, duration_ms

    def generate_vanilla(self, query: str) -> tuple[str, float]:
        """Generate response WITHOUT RAG context/guardrails for comparison mode."""
        vanilla_prompt = (
            "Answer the following question. Be helpful and informative.\n\n"
            f"Question: {query}"
        )

        start = time.time()
        provider = LLM_PROVIDER

        if provider == "gemini":
            self._init_gemini()
            result = self._gemini_model.generate_content(vanilla_prompt)
            response = result.text
        elif provider == "groq":
            self._init_groq()
            result = self._groq_client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[{"role": "user", "content": vanilla_prompt}],
                temperature=0.7,
                max_tokens=1024,
            )
            response = result.choices[0].message.content
        else:
            response = "Error: Unknown LLM provider"

        duration_ms = (time.time() - start) * 1000
        return response, duration_ms

    def _call_gemini(self, prompt: str, system_prompt: str) -> str:
        self._init_gemini()
        full_prompt = f"{system_prompt}\n\n{prompt}"
        result = self._gemini_model.generate_content(full_prompt)
        return result.text

    def _call_groq(self, prompt: str, system_prompt: str) -> str:
        self._init_groq()
        result = self._groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            temperature=0.1,  # Low temperature for deterministic, factual responses
            max_tokens=2048,
        )
        return result.choices[0].message.content


base_agent = BaseAgent()
