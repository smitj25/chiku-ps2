"""
Retriever Service — Orchestrates document loading and retrieval 
for the active plug/namespace.
"""
from __future__ import annotations
from core.plug_registry import plug_registry
from rag.vectorstore import DocumentStore, RetrievedSection


class RetrieverService:
    """High-level retrieval orchestrator that works with Plugs."""

    def __init__(self):
        # Cache: plug_id -> loaded DocumentStore
        self._stores: dict[str, DocumentStore] = {}

    def retrieve(
        self,
        query: str,
        plug_id: str,
        top_k: int = 5,
    ) -> list[RetrievedSection]:
        """Retrieve relevant sections for a query within the given plug's context."""
        if not plug_id:
            return []

        store = self._get_or_load_store(plug_id)
        return store.retrieve(query, top_k=top_k)

    def _get_or_load_store(self, plug_id: str) -> DocumentStore:
        """Get a cached store or load documents for this plug."""
        if plug_id not in self._stores:
            store = DocumentStore()
            corpus_texts = plug_registry.get_corpus_texts(plug_id)
            store.load_corpus(corpus_texts)
            self._stores[plug_id] = store
        return self._stores[plug_id]

    def invalidate_cache(self, plug_id: str | None = None):
        """Clear cached stores (e.g., when corpus changes)."""
        if plug_id:
            self._stores.pop(plug_id, None)
        else:
            self._stores.clear()


# Singleton
retriever_service = RetrieverService()
