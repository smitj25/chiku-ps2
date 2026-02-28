"""
Core Tool Injector — Hot-swap tools via FastAPI Depends.
(Placeholder for advanced tool injection logic based on plug).
"""
from schemas import PlugConfig


class ToolInjector:
    """Manages dynamic tool injection for the agent based on the active plug."""

    def get_tools_for_plug(self, plug: PlugConfig) -> list:
        """
        Return the list of active tools / LangChain tool objects for the given plug.
        Currently empty as the MVP relies purely on RAG and guardrails.
        """
        # E.g., if plug.plug_id == 'finance', inject Calculator Tool
        # if plug.plug_id == 'medical', inject PubMed Search Tool
        return []


tool_injector = ToolInjector()
