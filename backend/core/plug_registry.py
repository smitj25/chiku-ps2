"""
Core Plug Registry — Manages stateless loading of SME-Plugs from JSON files.
"""
from __future__ import annotations
import json
from pathlib import Path
from typing import Optional

from config import PLUGS_DIR, CORPORA_DIR
from schemas import PlugConfig


class PlugRegistry:
    """Stateless loader for SME-Plug JSON configurations."""

    def __init__(self):
        self._plugs_cache: dict[str, PlugConfig] = {}

    def load_plugs(self):
        """Pre-load all plug configs from the data/plugs directory."""
        self._plugs_cache.clear()
        if not PLUGS_DIR.exists():
            return

        for plug_file in PLUGS_DIR.glob("*.json"):
            try:
                data = json.loads(plug_file.read_text(encoding="utf-8"))
                plug = PlugConfig(**data)
                self._plugs_cache[plug.plug_id] = plug
            except Exception as e:
                print(f"Failed to load plug {plug_file}: {e}")

    def get_plug(self, plug_id: str) -> Optional[PlugConfig]:
        """Get a plug config. Reloads from disk if not cached to support hot additions."""
        if plug_id in self._plugs_cache:
            return self._plugs_cache[plug_id]

        # Try to find it on disk dynamically
        plug_file = PLUGS_DIR / f"{plug_id}.json"
        if plug_file.exists():
            try:
                data = json.loads(plug_file.read_text(encoding="utf-8"))
                plug = PlugConfig(**data)
                self._plugs_cache[plug.plug_id] = plug
                return plug
            except Exception as e:
                print(f"Failed to load plug {plug_file}: {e}")
        
        return None

    def list_plugs(self) -> list[PlugConfig]:
        """List all currently loaded plugs."""
        self.load_plugs()  # Refresh cache
        return list(self._plugs_cache.values())

    def create_plug(self, config: PlugConfig) -> PlugConfig:
        """Save a new plug config to disk."""
        plug_file = PLUGS_DIR / f"{config.plug_id}.json"
        with open(plug_file, "w") as f:
            json.dump(config.model_dump(), f, indent=2)
        self._plugs_cache[config.plug_id] = config
        return config

    def get_corpus_paths(self, plug_id: str) -> list[Path]:
        """Return full file paths for the given plug's corpus."""
        plug = self.get_plug(plug_id)
        if not plug:
            return []
        return [CORPORA_DIR / f for f in plug.corpus_files if (CORPORA_DIR / f).exists()]

    def get_corpus_texts(self, plug_id: str) -> dict[str, str]:
        """Load and return corpus texts keyed by filename for a given plug."""
        paths = self.get_corpus_paths(plug_id)
        texts = {}
        for p in paths:
            texts[p.name] = p.read_text(encoding="utf-8")
        return texts


plug_registry = PlugRegistry()
