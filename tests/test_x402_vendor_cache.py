import json
import time

import pytest

from infrastructure.payments.vendor_cache import VendorCache


def test_vendor_cache_refresh(tmp_path, monkeypatch):
    cache_path = tmp_path / "vendor_caps.json"
    cache = VendorCache(cache_path)

    # simulate empty cache and fallback to defaults
    entry = cache.get_capability("test_vendor")
    assert entry.vendor == "test_vendor"

    # refresh with metadata
    cache.refresh_vendor("test_vendor", metadata={"pricing": {"api": 0.1}})
    refreshed = cache.get_capability("test_vendor")
    assert refreshed.pricing["api"] == 0.1

    # TTL enforcement
    refreshed.updated_at = time.time() - 90000
    cache._cache["test_vendor"] = refreshed
    new_entry = cache.get_capability("test_vendor")
    assert new_entry.updated_at >= refreshed.updated_at
