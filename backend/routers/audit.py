"""Audit router — View query logs."""
from fastapi import APIRouter, HTTPException
from schemas import AuditEntry
from core.state_manager import state_manager

router = APIRouter(prefix="/api/audit", tags=["audit"])


@router.get("/")
async def get_audit_log() -> list[AuditEntry]:
    """Get the full audit log of all queries."""
    return state_manager.get_audit_log()


@router.get("/{query_id}")
async def get_audit_entry_by_id(query_id: str) -> AuditEntry:
    """Get detailed audit trail for a specific query."""
    entry = state_manager.get_audit_entry(query_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Query audit not found")
    return entry
