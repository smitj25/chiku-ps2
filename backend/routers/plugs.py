"""Plugs router — List and manage available SME-Plugs."""
from fastapi import APIRouter, HTTPException
from schemas import PlugConfig
from core.plug_registry import plug_registry
from rag.retriever import retriever_service

router = APIRouter(prefix="/api/plugs", tags=["plugs"])


@router.get("/")
async def list_plugs():
    """List all available plugs."""
    plugs = plug_registry.list_plugs()
    return {
        "plugs": [p.model_dump() for p in plugs]
    }


@router.get("/{plug_id}")
async def get_plug(plug_id: str):
    """Get details of a specific plug."""
    plug = plug_registry.get_plug(plug_id)
    if not plug:
        raise HTTPException(status_code=404, detail=f"Plug '{plug_id}' not found")
    return {
        "plug": plug.model_dump()
    }


@router.post("/")
async def create_plug(config: PlugConfig):
    """Register a new plug configuration."""
    plug = plug_registry.create_plug(config)
    retriever_service.invalidate_cache(plug.plug_id)
    return {"status": "created", "plug": plug.model_dump()}
