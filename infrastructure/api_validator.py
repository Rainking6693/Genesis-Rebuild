"""
OpenAPI Validator for Genesis APIs

Validates requests and responses against OpenAPI 3.1 specifications.
Enforces idempotency, rate limiting, and semantic versioning.

Author: Hudson (Code Review & Quality Specialist)
Created: 2025-10-30
Version: 1.0.0 (STUB - Week 1)

TODO (Week 2 - Thon + Hudson):
- Implement full OpenAPI validation using openapi-core
- Integrate Redis for idempotency store
- Implement token bucket rate limiting
- Add FastAPI middleware integration
- Add performance benchmarks (target: <50ms overhead)
"""

import hashlib
import json
import logging
import time
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

import yaml

logger = logging.getLogger(__name__)


class ValidationStatus(Enum):
    """Validation result status"""
    VALID = "valid"
    INVALID = "invalid"
    SKIPPED = "skipped"


@dataclass
class ValidationResult:
    """
    Result of request/response validation against OpenAPI spec.

    Attributes:
        status: Validation status (valid/invalid/skipped)
        errors: List of validation errors (empty if valid)
        warnings: List of validation warnings (non-fatal)
        metadata: Additional metadata (execution time, spec version, etc.)
    """
    status: ValidationStatus
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

    @property
    def is_valid(self) -> bool:
        """Convenience property for valid status"""
        return self.status == ValidationStatus.VALID and len(self.errors) == 0

    def __str__(self) -> str:
        return (
            f"ValidationResult(status={self.status.value}, "
            f"errors={len(self.errors)}, warnings={len(self.warnings)})"
        )


@dataclass
class RateLimitStatus:
    """
    Rate limit status for a user/API key.

    Attributes:
        allowed: True if request is allowed (under limit)
        limit: Maximum requests per window
        remaining: Requests remaining in current window
        reset_at: Unix timestamp when window resets
        retry_after: Seconds to wait before retrying (if blocked)
    """
    allowed: bool
    limit: int
    remaining: int
    reset_at: int
    retry_after: int = 0

    def to_headers(self) -> Dict[str, str]:
        """Convert to HTTP response headers"""
        return {
            "X-RateLimit-Limit": str(self.limit),
            "X-RateLimit-Remaining": str(self.remaining),
            "X-RateLimit-Reset": str(self.reset_at),
        }


class OpenAPIValidator:
    """
    OpenAPI 3.1 validator for Genesis APIs.

    Validates requests and responses against OpenAPI specs, enforces
    idempotency, rate limiting, and semantic versioning.

    **Week 1 Status:** STUB implementation with comprehensive docstrings.
    **Week 2 Plan:** Full implementation with openapi-core, Redis, FastAPI integration.

    Usage:
        >>> validator = OpenAPIValidator(spec_dir="/path/to/specs")
        >>> result = await validator.validate_request("agents_ask", request)
        >>> if not result.is_valid:
        ...     print(f"Validation failed: {result.errors}")
    """

    # Rate limiting defaults
    DEFAULT_RATE_LIMIT = 100  # requests per minute
    DEFAULT_RATE_WINDOW = 60  # seconds

    # Idempotency defaults
    IDEMPOTENCY_TTL = 86400  # 24 hours in seconds

    def __init__(
        self,
        spec_dir: Union[str, Path] = None,
        enable_validation: bool = True,
        enable_idempotency: bool = True,
        enable_rate_limiting: bool = True,
        rate_limit: int = None,
        rate_window: int = None,
        redis_client=None,
    ):
        """
        Initialize OpenAPI validator.

        Args:
            spec_dir: Directory containing OpenAPI spec files (.yaml/.json)
                     Defaults to {project_root}/api/schemas
            enable_validation: Enable request/response validation
            enable_idempotency: Enable idempotency key enforcement
            enable_rate_limiting: Enable rate limiting
            rate_limit: Requests per window (default: 100)
            rate_window: Window size in seconds (default: 60)
            redis_client: Optional Redis client for distributed state
                         If None, uses in-memory store (not production-safe)

        TODO (Week 2):
            - Load all specs from spec_dir
            - Initialize openapi-core validator
            - Connect to Redis for distributed state
            - Add spec caching for performance
        """
        # Spec management
        self.spec_dir = Path(spec_dir) if spec_dir else self._default_spec_dir()
        self.specs: Dict[str, Dict] = {}  # spec_name -> parsed spec
        self.validators: Dict[str, Any] = {}  # spec_name -> openapi-core validator

        # Feature flags
        self.enable_validation = enable_validation
        self.enable_idempotency = enable_idempotency
        self.enable_rate_limiting = enable_rate_limiting

        # Rate limiting config
        self.rate_limit = rate_limit or self.DEFAULT_RATE_LIMIT
        self.rate_window = rate_window or self.DEFAULT_RATE_WINDOW

        # State stores (in-memory for now, Redis in Week 2)
        self.redis_client = redis_client
        self.idempotency_store: Dict[str, Tuple[str, Any]] = {}  # key -> (hash, response)
        self.rate_limit_store: Dict[str, List[float]] = {}  # user_id -> [timestamps]

        logger.info(
            f"OpenAPIValidator initialized: validation={enable_validation}, "
            f"idempotency={enable_idempotency}, rate_limiting={enable_rate_limiting}"
        )

    def _default_spec_dir(self) -> Path:
        """Get default spec directory (project_root/api/schemas)"""
        # TODO (Week 2): Implement path resolution
        return Path(__file__).parent.parent / "api" / "schemas"

    def load_spec(self, spec_name: str) -> Dict[str, Any]:
        """
        Load OpenAPI spec from file.

        Args:
            spec_name: Spec filename without extension (e.g., "agents_ask")

        Returns:
            Parsed OpenAPI spec as dict

        Raises:
            FileNotFoundError: If spec file doesn't exist
            ValueError: If spec is invalid YAML/JSON

        TODO (Week 2):
            - Implement spec loading from .yaml/.json
            - Validate spec structure (OpenAPI 3.1 format)
            - Cache loaded specs
            - Support spec hot-reloading
        """
        if spec_name in self.specs:
            return self.specs[spec_name]

        # TODO (Week 2): Implement actual loading
        logger.warning(f"load_spec STUB: {spec_name}")
        return {}

    async def validate_request(
        self,
        spec_name: str,
        request: Any,
        path: str = None,
        method: str = "POST",
    ) -> ValidationResult:
        """
        Validate HTTP request against OpenAPI spec.

        Validates:
        - Request body schema (required fields, types, constraints)
        - Query parameters
        - Path parameters
        - Headers (API key, idempotency key, etc.)

        Args:
            spec_name: Name of OpenAPI spec (e.g., "agents_ask")
            request: HTTP request object (FastAPI Request or dict)
            path: API path (e.g., "/agents/ask")
            method: HTTP method (GET, POST, PUT, DELETE, etc.)

        Returns:
            ValidationResult with status, errors, warnings

        Example:
            >>> result = await validator.validate_request(
            ...     "agents_ask",
            ...     request,
            ...     path="/agents/ask",
            ...     method="POST"
            ... )
            >>> if result.is_valid:
            ...     print("Request is valid!")
            >>> else:
            ...     print(f"Errors: {result.errors}")

        TODO (Week 2):
            - Use openapi-core to validate request
            - Extract request body, params, headers
            - Validate against spec schema
            - Return detailed error messages with field paths
            - Add performance metrics (<10ms target)
        """
        start_time = time.time()

        if not self.enable_validation:
            return ValidationResult(
                status=ValidationStatus.SKIPPED,
                metadata={"reason": "validation_disabled"}
            )

        # TODO (Week 2): Implement actual validation
        logger.debug(f"validate_request STUB: spec={spec_name}, path={path}, method={method}")

        # Placeholder validation
        errors = []
        warnings = []

        execution_time_ms = (time.time() - start_time) * 1000
        return ValidationResult(
            status=ValidationStatus.VALID if not errors else ValidationStatus.INVALID,
            errors=errors,
            warnings=warnings,
            metadata={
                "spec_name": spec_name,
                "path": path,
                "method": method,
                "execution_time_ms": execution_time_ms,
            }
        )

    async def validate_response(
        self,
        spec_name: str,
        response: Any,
        status_code: int = 200,
        path: str = None,
        method: str = "POST",
    ) -> ValidationResult:
        """
        Validate HTTP response against OpenAPI spec.

        Validates:
        - Response body schema
        - Status code matches spec
        - Response headers (required headers present)

        Args:
            spec_name: Name of OpenAPI spec
            response: HTTP response object or dict
            status_code: HTTP status code (200, 400, 500, etc.)
            path: API path
            method: HTTP method

        Returns:
            ValidationResult with status, errors, warnings

        TODO (Week 2):
            - Use openapi-core to validate response
            - Validate response schema by status code
            - Check required response headers
            - Validate enum values, formats
        """
        start_time = time.time()

        if not self.enable_validation:
            return ValidationResult(
                status=ValidationStatus.SKIPPED,
                metadata={"reason": "validation_disabled"}
            )

        # TODO (Week 2): Implement actual validation
        logger.debug(
            f"validate_response STUB: spec={spec_name}, status={status_code}, "
            f"path={path}, method={method}"
        )

        errors = []
        warnings = []

        execution_time_ms = (time.time() - start_time) * 1000
        return ValidationResult(
            status=ValidationStatus.VALID if not errors else ValidationStatus.INVALID,
            errors=errors,
            warnings=warnings,
            metadata={
                "spec_name": spec_name,
                "status_code": status_code,
                "path": path,
                "method": method,
                "execution_time_ms": execution_time_ms,
            }
        )

    async def enforce_idempotency(
        self,
        idempotency_key: str,
        request_hash: str,
        response: Any = None,
    ) -> Tuple[bool, Optional[Any]]:
        """
        Enforce idempotency for mutation operations (POST/PUT/PATCH).

        Idempotency Logic:
        - First request with key: Store (key, request_hash, response)
        - Repeat request with same key + same hash: Return cached response
        - Repeat request with same key + different hash: Return 409 Conflict

        Args:
            idempotency_key: UUID idempotency key from X-Idempotency-Key header
            request_hash: Hash of request parameters (for mismatch detection)
            response: Response to cache (if first request)

        Returns:
            Tuple of (is_new_request, cached_response)
            - (True, None): New request, proceed normally
            - (False, response): Duplicate request, return cached response
            - Raises 409 if key reused with different params

        Storage:
            - In-memory: Dict[key] = (hash, response, timestamp)
            - Redis (Week 2): SET key {hash, response} EX 86400

        Example:
            >>> key = request.headers.get("X-Idempotency-Key")
            >>> hash = hash_request(request.json())
            >>> is_new, cached = await validator.enforce_idempotency(key, hash)
            >>> if not is_new:
            ...     return cached  # Return cached response
            >>> # Execute request normally
            >>> response = await execute_request(request)
            >>> await validator.enforce_idempotency(key, hash, response)

        TODO (Week 2):
            - Implement Redis storage with TTL
            - Add request hash computation (JSON canonicalization)
            - Handle concurrent requests (use Redis SETNX)
            - Add cleanup for expired keys
            - Add metrics (cache hit rate)
        """
        if not self.enable_idempotency:
            return (True, None)

        # TODO (Week 2): Implement actual idempotency enforcement
        logger.debug(f"enforce_idempotency STUB: key={idempotency_key[:8]}...")

        # Placeholder: Always treat as new request
        return (True, None)

    async def check_rate_limit(
        self,
        user_id: str,
        limit: int = None,
        window: int = None,
    ) -> RateLimitStatus:
        """
        Check rate limit for user/API key.

        Rate Limiting Algorithm: Token Bucket
        - Each user has a bucket with {limit} tokens
        - Tokens refill at rate of {limit}/{window} per second
        - Each request consumes 1 token
        - If bucket empty, request blocked until tokens refill

        Args:
            user_id: User identifier (API key hash, user ID, IP address)
            limit: Max requests per window (default: self.rate_limit)
            window: Window size in seconds (default: self.rate_window)

        Returns:
            RateLimitStatus with allowed/limit/remaining/reset_at/retry_after

        Example:
            >>> status = await validator.check_rate_limit("user_123")
            >>> if not status.allowed:
            ...     return JSONResponse(
            ...         status_code=429,
            ...         headers=status.to_headers(),
            ...         content={"error": "Rate limit exceeded"}
            ...     )

        TODO (Week 2):
            - Implement token bucket algorithm
            - Use Redis for distributed rate limiting
            - Add burst handling (allow temporary spikes)
            - Add per-endpoint limits (different limits per API)
            - Add IP-based fallback rate limiting
            - Add metrics (blocked requests, limit utilization)
        """
        if not self.enable_rate_limiting:
            return RateLimitStatus(
                allowed=True,
                limit=limit or self.rate_limit,
                remaining=limit or self.rate_limit,
                reset_at=int(time.time()) + (window or self.rate_window),
            )

        # TODO (Week 2): Implement actual rate limiting
        logger.debug(f"check_rate_limit STUB: user={user_id}")

        # Placeholder: Always allow
        return RateLimitStatus(
            allowed=True,
            limit=limit or self.rate_limit,
            remaining=(limit or self.rate_limit) - 1,
            reset_at=int(time.time()) + (window or self.rate_window),
        )

    def add_version_headers(
        self,
        response: Any,
        schema_version: str = "v1.0.0",
    ) -> Any:
        """
        Add semantic versioning headers to response.

        Adds:
        - X-Schema-Version: API schema version
        - X-Request-Id: Unique request ID (if not present)

        Args:
            response: HTTP response object (FastAPI Response)
            schema_version: Semantic version string (vMAJOR.MINOR.PATCH)

        Returns:
            Response with added headers

        Example:
            >>> response = JSONResponse(content={"data": "..."})
            >>> response = validator.add_version_headers(response, "v1.2.3")
            >>> # Response now has X-Schema-Version: v1.2.3 header

        TODO (Week 2):
            - Extract schema version from OpenAPI spec
            - Add X-Request-Id if not present
            - Add X-Correlation-Id for tracing
            - Support version negotiation (client requests specific version)
        """
        # TODO (Week 2): Implement actual header addition
        logger.debug(f"add_version_headers STUB: version={schema_version}")
        return response

    def hash_request(self, request_data: Dict[str, Any]) -> str:
        """
        Compute hash of request data for idempotency checking.

        Uses SHA256 of JSON-canonicalized request data.

        Args:
            request_data: Request parameters (body, query, path params)

        Returns:
            SHA256 hex digest

        TODO (Week 2):
            - Implement JSON canonicalization (sort keys, remove whitespace)
            - Handle special cases (floats, None, dates)
            - Add salt for security
        """
        # TODO (Week 2): Implement proper hashing
        canonical_json = json.dumps(request_data, sort_keys=True)
        return hashlib.sha256(canonical_json.encode()).hexdigest()


# Singleton instance for easy import
_validator_instance: Optional[OpenAPIValidator] = None


def get_validator() -> OpenAPIValidator:
    """
    Get singleton OpenAPIValidator instance.

    Usage:
        >>> from infrastructure.api_validator import get_validator
        >>> validator = get_validator()
        >>> result = await validator.validate_request("agents_ask", request)
    """
    global _validator_instance
    if _validator_instance is None:
        _validator_instance = OpenAPIValidator()
    return _validator_instance
