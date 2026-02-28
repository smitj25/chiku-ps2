"""
Core State Manager — Manages active session memory and audit trail.
"""
from __future__ import annotations
from schemas import AuditEntry


class StateManager:
    """Manages active conversation state and logs."""
    
    def __init__(self):
        # In-memory audit log for MVP (to be moved to Postgres later)
        self._audit_log: list[AuditEntry] = []
        
    def add_audit_entry(self, entry: AuditEntry):
        self._audit_log.append(entry)
        
    def get_audit_log(self) -> list[AuditEntry]:
        return self._audit_log
        
    def get_audit_entry(self, query_id: str) -> AuditEntry | None:
        for entry in self._audit_log:
            if entry.query_id == query_id:
                return entry
        return None


state_manager = StateManager()
