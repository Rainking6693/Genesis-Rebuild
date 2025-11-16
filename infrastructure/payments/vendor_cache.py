from __future__ import annotations

import json
import logging
import os
import time
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Dict, Optional

import requests

logger = logging.getLogger(__name__)


@dataclass
class VendorCapability:
    vendor: str
    pricing: Dict[str, float]
    tokens: Dict[str, str]
    chains: Dict[str, str]
    capabilities: Dict[str, str]
    updated_at: float

    def to_dict(self) -> Dict[str, object]:
        return asdict(self)


class VendorCache:
    """Cache for x402 vendor capabilities and pricing info."""

    TTL_SECONDS = int(os.getenv("X402_VENDOR_CACHE_TTL", "86400"))
    CACHE_PATH = Path("data/x402/vendor_capabilities.json")

    def __init__(self, cache_path: Optional[Path] = None):
        self.path = cache_path or self.CACHE_PATH
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._cache: Dict[str, VendorCapability] = {}
        self._load()

    def _load(self) -> None:
        if not self.path.exists():
            self._persist()
            return
        try:
            raw = json.loads(self.path.read_text())
        except Exception:
            raw = {}
            self._persist()
        for vendor, entry in raw.items():
            self._cache[vendor] = VendorCapability(
                vendor=vendor,
                pricing=entry.get("pricing", {}),
                tokens=entry.get("tokens", {}),
                chains=entry.get("chains", {}),
                capabilities=entry.get("capabilities", {}),
                updated_at=entry.get("updated_at", 0.0),
            )

    def _persist(self) -> None:
        data = {vendor: cap.to_dict() for vendor, cap in self._cache.items()}
        with self.path.open("w", encoding="utf-8") as fd:
            json.dump(data, fd, indent=2)

    def _should_refresh(self, capability: VendorCapability) -> bool:
        return (time.time() - capability.updated_at) >= self.TTL_SECONDS

    def get_capability(self, vendor: str, refresh: bool = False) -> VendorCapability:
        vendor = vendor.lower()
        capability = self._cache.get(vendor)
        if capability and not (refresh or self._should_refresh(capability)):
            return capability
        fetched = self._fetch_vendor_metadata(vendor)
        capability = VendorCapability(
            vendor=vendor,
            pricing=fetched.get("pricing", capability.pricing if capability else {}),
            tokens=fetched.get("tokens", capability.tokens if capability else {}),
            chains=fetched.get("chains", capability.chains if capability else {}),
            capabilities=fetched.get("capabilities", capability.capabilities if capability else {}),
            updated_at=time.time(),
        )
        self._cache[vendor] = capability
        self._persist()
        return capability

    def refresh_vendor(self, vendor: str, metadata: Optional[Dict[str, object]] = None) -> VendorCapability:
        vendor = vendor.lower()
        existing = self._cache.get(vendor)
        if metadata is None:
            metadata = {}
        capability = VendorCapability(
            vendor=vendor,
            pricing=metadata.get("pricing", existing.pricing if existing else {}),
            tokens=metadata.get("tokens", existing.tokens if existing else {}),
            chains=metadata.get("chains", existing.chains if existing else {}),
            capabilities=metadata.get("capabilities", existing.capabilities if existing else {}),
            updated_at=time.time(),
        )
        self._cache[vendor] = capability
        self._persist()
        return capability

    def _fetch_vendor_metadata(self, vendor: str) -> Dict[str, object]:
        env_map = os.getenv("X402_VENDOR_METADATA_URLS", "")
        vendor_urls = dict(
            tuple(item.split(":", 1))
            for item in env_map.split(";")
            if ":" in item
        )
        url = vendor_urls.get(vendor)
        if not url:
            return {}
        try:
            response = requests.get(url, timeout=6)
            response.raise_for_status()
            return response.json()
        except Exception as exc:
            logger.warning("Failed to fetch vendor metadata for %s: %s", vendor, exc)
            return {}
