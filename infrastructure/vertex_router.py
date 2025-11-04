"""
Vertex AI Request Router
========================

Routes agent inference requests to tuned Vertex AI endpoints with automatic
fallback to the base Gemini model when tuned endpoints are unavailable.

The router can operate in live mode (calling Google Cloud SDK) or mock mode for
testing.  Weighted round-robin balancing is used when multiple endpoints are
available for the same agent role.
"""

from __future__ import annotations

import itertools
import logging
from typing import Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

try:
    from google.cloud import aiplatform
    HAS_VERTEX = True
except ImportError:  # pragma: no cover - optional dependency
    HAS_VERTEX = False
    aiplatform = None  # type: ignore
    logger.warning("google-cloud-aiplatform not installed; VertexModelRouter will operate in mock mode.")

try:
    from vertexai.generative_models import GenerativeModel
except ImportError:  # pragma: no cover
    GenerativeModel = None  # type: ignore

BASE_MODEL = "gemini-2.0-flash-001"


class WeightedRoundRobin:
    """Simple weighted round-robin iterator used for load balancing."""

    def __init__(self, nodes: List[Tuple[str, int]]):
        self.nodes = [(node, max(weight, 1)) for node, weight in nodes]
        expanded = []
        for node, weight in self.nodes:
            expanded.extend([node] * weight)
        self._cycle = itertools.cycle(expanded) if expanded else itertools.cycle([])

    def next(self) -> Optional[str]:
        try:
            return next(self._cycle)
        except StopIteration:  # pragma: no cover - cycle shouldn't stop
            return None


class VertexModelRouter:
    """
    Routes inference requests to Vertex AI endpoints.

    Each agent role can register one or more endpoints with optional traffic
    weights.  When an endpoint call fails, the router falls back to the base
    Gemini model to keep the system responsive.
    """

    def __init__(
        self,
        project_id: str,
        location: str = "us-central1",
        enable_vertex: Optional[bool] = None,
    ):
        self.project_id = project_id
        self.location = location
        self._use_vertex = enable_vertex if enable_vertex is not None else HAS_VERTEX

        if self._use_vertex and not HAS_VERTEX:
            raise RuntimeError("enable_vertex=True but google-cloud-aiplatform is not installed.")

        if self._use_vertex:
            aiplatform.init(project=self.project_id, location=self.location)
            logger.info("VertexModelRouter running in LIVE mode")
        else:
            logger.info("VertexModelRouter running in MOCK mode")

        self._role_endpoints: Dict[str, List[Tuple[str, int]]] = {}  # role -> list of (endpoint, weight)
        self._balancers: Dict[str, WeightedRoundRobin] = {}

    # ------------------------------------------------------------------ #
    # Registration
    # ------------------------------------------------------------------ #

    def register_endpoint(self, role: str, endpoint_resource: str, weight: int = 1) -> None:
        """Register a Vertex endpoint for a specific agent role."""
        role = role.lower()
        entries = self._role_endpoints.setdefault(role, [])
        entries.append((endpoint_resource, weight))
        self._balancers[role] = WeightedRoundRobin(entries)
        logger.debug("Registered endpoint %s for role %s (weight=%s)", endpoint_resource, role, weight)

    def clear_endpoints(self, role: Optional[str] = None) -> None:
        """Clear registered endpoints (for testing)."""
        if role:
            role = role.lower()
            self._role_endpoints.pop(role, None)
            self._balancers.pop(role, None)
        else:
            self._role_endpoints.clear()
            self._balancers.clear()

    # ------------------------------------------------------------------ #
    # Routing
    # ------------------------------------------------------------------ #

    def route(
        self,
        role: str,
        prompt: str,
        endpoint_override: Optional[str] = None,
        temperature: float = 0.2,
    ) -> str:
        """
        Route a prompt to the appropriate Vertex AI endpoint.

        Args:
            role: Agent role (e.g. 'qa', 'support').
            prompt: User prompt.
            endpoint_override: optional explicit endpoint resource name.
            temperature: generation temperature for fallback base model.

        Returns:
            str: model output (may be empty string if both tuned and fallback fail).
        """
        role_key = (role or "").lower()
        endpoint = endpoint_override or self._select_endpoint(role_key)

        if endpoint and self._use_vertex:
            try:
                endpoint_obj = aiplatform.Endpoint(endpoint)
                prediction = endpoint_obj.predict(instances=[{"prompt": prompt}])
                if prediction and prediction.predictions:
                    return str(prediction.predictions[0])
            except Exception as exc:  # pragma: no cover - live failure path
                logger.warning("Vertex endpoint %s failed for role %s: %s", endpoint, role_key, exc)

        # Fallback to base Gemini model using GenerativeModel if available.
        if GenerativeModel is not None:
            try:
                model = GenerativeModel(BASE_MODEL)
                response = model.generate_content(prompt, generation_config={"temperature": temperature})
                return getattr(response, "text", "") or ""
            except Exception as exc:  # pragma: no cover
                logger.error("Base Gemini fallback failed: %s", exc)
                return ""
        return ""

    # ------------------------------------------------------------------ #
    # Helpers
    # ------------------------------------------------------------------ #

    def _select_endpoint(self, role: str) -> Optional[str]:
        """Select the next endpoint for a role using weighted round-robin."""
        balancer = self._balancers.get(role)
        if balancer:
            return balancer.next()
        return None

    def list_endpoints(self, role: Optional[str] = None) -> Dict[str, List[Tuple[str, int]]]:
        """Return registered endpoints per role."""
        if role:
            role = role.lower()
            return {role: self._role_endpoints.get(role, [])}
        return dict(self._role_endpoints)

