"""
Core Router — Intent classifier and request router.
Middleware layer to dynamically route requests to the correct SME plug.
"""
from fastapi import Request, HTTPException


class RequestRouter:
    """Routes incoming requests to the appropriate SME-Plug based on headers."""

    def resolve_plug_id(self, request: Request, fallback_id: str = "default") -> str:
        """
        Extract the target plug ID from the request header natively.
        Expected header: X-Plug-ID
        """
        plug_id = request.headers.get("x-plug-id")
        
        # If no explicit header, could inject an LLM Intent Classifier here.
        # For now, require explicit or fallback.
        if not plug_id:
            plug_id = fallback_id

        return plug_id


request_router = RequestRouter()
