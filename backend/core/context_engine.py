"""
Context Engine — Dynamic prompt builder.
Injects retrieved context and system instructions for the active plug.
"""
from typing import Any


class ContextEngine:
    """Builds the final augmented prompt representing the 'steering system'."""

    def build_prompt(self, query: str, sections: list[Any], system_prompt: str) -> str:
        """
        Build the augmented prompt with retrieved context.
        Takes sections (which have .filename, .page, .title, .content).
        """
        context_parts = []
        for i, section in enumerate(sections, 1):
            context_parts.append(
                f"--- Document {i} ---\n"
                f"File: {section.filename}\n"
                f"Page: {section.page}\n"
                f"Section: {section.title}\n"
                f"Content:\n{section.content}\n"
            )

        context_block = "\n".join(context_parts) if context_parts else "No relevant documents found."

        return (
            f"RETRIEVED DOCUMENTS:\n"
            f"{'='*60}\n"
            f"{context_block}\n"
            f"{'='*60}\n\n"
            f"IMPORTANT INSTRUCTIONS:\n"
            f"1. ONLY use information from the RETRIEVED DOCUMENTS above.\n"
            f"2. For EVERY factual claim, include a citation: [Source: filename, Page X, Section Y]\n"
            f"3. If the documents do not contain the answer, clearly state: "
            f"\"The provided documents do not contain information about this topic.\"\n"
            f"4. NEVER make up information not present in the documents.\n"
            f"5. Be precise and specific — cite exact page numbers and sections.\n\n"
            f"USER QUESTION: {query}"
        )

    def build_system_prompt(self, plug) -> str:
        """Get the system prompt override or build a default one."""
        if plug.system_prompt_override:
            return plug.system_prompt_override
        return (
            f"You are {plug.name}. {plug.description}. "
            "Cite all sources using [Source: filename, Page X, Section Y] format."
        )


context_engine = ContextEngine()
