"""Research helper that consults vendor pricing data."""
from __future__ import annotations

from typing import Dict

from infrastructure.payments.vendor_cache import VendorCache


class ResearchPaymentAdvisor:
    """Simple heuristics for research vendor spending."""

    def __init__(self):
        self.cache = VendorCache()

    def should_pay_for_data(self, vendor: str, budget_remaining: float, quality_score: float) -> bool:
        capability = self.cache.get_capability(vendor)
        pricing = capability.pricing.get("per_call", 0.0)
        if pricing <= 0:
            return False
        if budget_remaining < pricing:
            return False
        return quality_score > 0.5

    def get_vendor_metadata(self, vendor: str) -> Dict[str, object]:
        return self.cache.get_capability(vendor).to_dict()
