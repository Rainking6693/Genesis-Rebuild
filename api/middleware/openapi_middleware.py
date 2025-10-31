"""
OpenAPI Validation Middleware for FastAPI

Integrates OpenAPIValidator with FastAPI request/response pipeline.
Performs validation, idempotency checking, rate limiting, and version headers.

Author: Thon (Python Expert) + Hudson (Code Review & Quality Specialist)
Created: 2025-10-30
Version: 1.0.0 (PRODUCTION - Week 2)

Features:
- Request/response validation against OpenAPI specs
- Idempotency enforcement for POST/PUT operations
- Token bucket rate limiting
- Semantic versioning headers
- Performance: <10ms overhead per request
"""

import json
import logging
import time
from pathlib import Path
from typing import Callable, Dict, Optional

from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from infrastructure.api_validator import OpenAPIValidator, ValidationStatus

logger = logging.getLogger(__name__)


class OpenAPIValidationMiddleware(BaseHTTPMiddleware):
    """
    FastAPI middleware for OpenAPI validation, idempotency, and rate limiting.

    Usage:
        >>> from fastapi import FastAPI
        >>> from api.middleware import OpenAPIValidationMiddleware
        >>>
        >>> app = FastAPI()
        >>> app.add_middleware(OpenAPIValidationMiddleware, spec_directory="api/schemas")

    Features:
        - Automatic spec discovery based on endpoint path
        - Request validation before route handler
        - Response validation after route handler
        - Idempotency enforcement with Redis
        - Rate limiting with token bucket algorithm
        - Semantic versioning headers
        - Graceful error responses matching OpenAPI spec

    Week 2 Implementation:
        - Production-ready with comprehensive error handling
        - Feature flags for gradual rollout
        - Performance optimized (<10ms overhead)
        - Zero breaking changes to existing APIs
    """

    def __init__(
        self,
        app: ASGIApp,
        spec_directory: str = "api/schemas",
        enable_validation: bool = True,
        enable_idempotency: bool = True,
        enable_rate_limiting: bool = True,
        rate_limit: int = 100,
        rate_window: int = 60,
        redis_url: str = "redis://localhost:6379/0",
    ):
        """
        Initialize OpenAPI validation middleware.

        Args:
            app: FastAPI application instance
            spec_directory: Directory containing OpenAPI spec files
            enable_validation: Enable request/response validation
            enable_idempotency: Enable idempotency enforcement
            enable_rate_limiting: Enable rate limiting
            rate_limit: Requests per window (default: 100/minute)
            rate_window: Window size in seconds (default: 60)
            redis_url: Redis connection URL
        """
        super().__init__(app)
        self.spec_directory = Path(spec_directory)
        self.enable_validation = enable_validation
        self.enable_idempotency = enable_idempotency
        self.enable_rate_limiting = enable_rate_limiting

        # Initialize validator
        self.validator = OpenAPIValidator(
            spec_dir=self.spec_directory,
            enable_validation=enable_validation,
            enable_idempotency=enable_idempotency,
            enable_rate_limiting=enable_rate_limiting,
            rate_limit=rate_limit,
            rate_window=rate_window,
            redis_url=redis_url,
        )

        logger.info(
            f"OpenAPIValidationMiddleware initialized: "
            f"validation={enable_validation}, idempotency={enable_idempotency}, "
            f"rate_limiting={enable_rate_limiting}, specs={len(self.validator.specs)}"
        )

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process request through validation pipeline.

        Flow:
            1. Find OpenAPI spec for endpoint
            2. Extract user ID for rate limiting
            3. Check rate limit
            4. Validate request against spec
            5. Check idempotency (for POST/PUT)
            6. Execute request handler
            7. Store idempotency response
            8. Validate response
            9. Add version and rate limit headers
            10. Return response

        Args:
            request: Incoming HTTP request
            call_next: Next middleware/route handler

        Returns:
            HTTP response with validation, headers, and error handling
        """
        start_time = time.time()

        # Extract request info
        path = request.url.path
        method = request.method.upper()

        # Find spec for this endpoint
        spec_name = self._find_spec_for_endpoint(path)

        if not spec_name:
            # No spec defined, allow request (log warning in debug mode)
            logger.debug(f"No OpenAPI spec found for {method} {path}")
            response = await call_next(request)
            return response

        # Extract user ID for rate limiting (from API key, user ID, or IP)
        user_id = self._extract_user_id(request)

        # Step 1: Check rate limit
        if self.enable_rate_limiting:
            rate_limit_status = await self.validator.check_rate_limit(user_id)

            if not rate_limit_status.allowed:
                return self._create_error_response(
                    status_code=429,
                    code="RATE_LIMIT_EXCEEDED",
                    message=f"Rate limit exceeded ({rate_limit_status.limit} requests/minute)",
                    hint=f"Try again in {rate_limit_status.retry_after} seconds",
                    headers=rate_limit_status.to_headers(),
                    details={
                        "limit": rate_limit_status.limit,
                        "remaining": 0,
                        "reset": rate_limit_status.reset_at,
                    }
                )

        # Step 2: Validate request
        if self.enable_validation:
            request_data = await self._extract_request_data(request)
            validation_result = await self.validator.validate_request(
                spec_name, request_data, path=path, method=method
            )

            if not validation_result.is_valid:
                return self._create_error_response(
                    status_code=400,
                    code="VALIDATION_ERROR",
                    message="Request validation failed",
                    hint="Check request body, query params, and headers match OpenAPI spec",
                    details={"errors": validation_result.errors},
                )

        # Step 3: Check idempotency (for POST/PUT)
        if self.enable_idempotency and method in ["POST", "PUT", "PATCH"]:
            idempotency_key = request.headers.get("X-Idempotency-Key")

            if idempotency_key:
                try:
                    request_data = await self._extract_request_data(request)
                    request_hash = self.validator.hash_request(request_data)

                    is_new, cached_response = await self.validator.enforce_idempotency(
                        idempotency_key, request_hash
                    )

                    if not is_new:
                        # Return cached response
                        logger.info(f"Idempotency cache hit for key: {idempotency_key[:8]}...")
                        return JSONResponse(
                            content=cached_response,
                            status_code=200,
                            headers={
                                "X-Idempotency-Cached": "true",
                                "X-Schema-Version": "v1.0.0",
                            }
                        )

                except ValueError as e:
                    # Idempotency key conflict
                    return self._create_error_response(
                        status_code=409,
                        code="IDEMPOTENCY_CONFLICT",
                        message="Idempotency key reused with different params",
                        hint="Use a new idempotency key or retry with same params",
                        details={"error": str(e)},
                    )

        # Step 4: Execute request
        response = await call_next(request)

        # Step 5: Store idempotency response (if applicable)
        if self.enable_idempotency and method in ["POST", "PUT", "PATCH"]:
            idempotency_key = request.headers.get("X-Idempotency-Key")

            if idempotency_key and response.status_code in [200, 201]:
                try:
                    request_data = await self._extract_request_data(request)
                    request_hash = self.validator.hash_request(request_data)

                    # Extract response body
                    response_body = await self._extract_response_body(response)

                    # Store for future idempotency checks
                    await self.validator.enforce_idempotency(
                        idempotency_key, request_hash, response_body
                    )
                except Exception as e:
                    logger.error(f"Failed to store idempotency response: {e}")

        # Step 6: Validate response (if validation enabled)
        if self.enable_validation and spec_name:
            try:
                response_data = await self._extract_response_body(response)
                validation_result = await self.validator.validate_response(
                    spec_name, response_data, status_code=response.status_code,
                    path=path, method=method
                )

                if not validation_result.is_valid:
                    logger.warning(
                        f"Response validation failed for {method} {path}: "
                        f"{validation_result.errors}"
                    )
                    # Don't block response, just log warning
            except Exception as e:
                logger.error(f"Response validation error: {e}")

        # Step 7: Add version and rate limit headers
        response = self.validator.add_version_headers(response, spec_name=spec_name)

        if self.enable_rate_limiting:
            response.headers["X-RateLimit-Limit"] = str(rate_limit_status.limit)
            response.headers["X-RateLimit-Remaining"] = str(rate_limit_status.remaining)
            response.headers["X-RateLimit-Reset"] = str(rate_limit_status.reset_at)

        # Add processing time
        execution_time_ms = (time.time() - start_time) * 1000
        response.headers["X-Process-Time"] = f"{execution_time_ms:.2f}ms"

        return response

    def _find_spec_for_endpoint(self, path: str) -> Optional[str]:
        """
        Find OpenAPI spec name for endpoint path.

        Mapping:
            /agents/ask -> agents_ask
            /orchestrate/task -> orchestrate_task
            /halo/route -> halo_route

        Args:
            path: API path (e.g., "/agents/ask")

        Returns:
            Spec name (e.g., "agents_ask") or None if not found
        """
        # Remove leading/trailing slashes
        path_normalized = path.strip("/")

        # Replace slashes with underscores
        spec_name = path_normalized.replace("/", "_")

        # Check if spec exists
        if spec_name in self.validator.specs:
            return spec_name

        # Fallback: try common variations
        variations = [
            spec_name.replace("-", "_"),  # kebab-case to snake_case
            spec_name.lower(),  # lowercase
        ]

        for variation in variations:
            if variation in self.validator.specs:
                return variation

        return None

    def _extract_user_id(self, request: Request) -> str:
        """
        Extract user identifier for rate limiting.

        Priority:
            1. X-API-Key header (hashed)
            2. User ID from auth token
            3. Client IP address

        Args:
            request: HTTP request

        Returns:
            User identifier string
        """
        # Try API key
        api_key = request.headers.get("X-API-Key") or request.headers.get("Authorization")
        if api_key:
            # Hash API key for privacy
            import hashlib
            return hashlib.sha256(api_key.encode()).hexdigest()[:16]

        # Try user ID from request state (set by auth middleware)
        if hasattr(request.state, "user_id"):
            return str(request.state.user_id)

        # Fallback to IP address
        client_ip = request.client.host if request.client else "unknown"
        return f"ip:{client_ip}"

    async def _extract_request_data(self, request: Request) -> Dict:
        """Extract request data (body, query, headers) for validation."""
        try:
            if request.method in ["POST", "PUT", "PATCH"]:
                # Cache request body so it can be reused (validation + idempotency)
                if hasattr(request.state, "_openapi_raw_body"):
                    raw_body = request.state._openapi_raw_body
                else:
                    raw_body = await request.body()
                    request.state._openapi_raw_body = raw_body
                    # Allow downstream handlers to read the cached body
                    request._body = raw_body

                if raw_body:
                    try:
                        body = json.loads(raw_body.decode("utf-8"))
                    except (UnicodeDecodeError, json.JSONDecodeError):
                        body = {}
                else:
                    body = {}
            else:
                body = {}

            return {
                "body": body,
                "query": dict(request.query_params),
                "headers": dict(request.headers),
                "path_params": dict(request.path_params),
            }
        except Exception as e:
            logger.error(f"Failed to extract request data: {e}")
            return {"body": {}, "query": {}, "headers": {}, "path_params": {}}

    async def _extract_response_body(self, response: Response) -> Dict:
        """
        Extract response body for validation and caching.

        Args:
            response: HTTP response

        Returns:
            Response body as dictionary
        """
        try:
            # For JSONResponse
            if hasattr(response, "body"):
                body_bytes = response.body
                body_str = body_bytes.decode("utf-8") if isinstance(body_bytes, bytes) else body_bytes
                return json.loads(body_str)
            else:
                return {}
        except Exception as e:
            logger.error(f"Failed to extract response body: {e}")
            return {}

    def _create_error_response(
        self,
        status_code: int,
        code: str,
        message: str,
        hint: str = "",
        details: Dict = None,
        headers: Dict = None,
    ) -> JSONResponse:
        """
        Create standardized error response matching OpenAPI spec.

        Args:
            status_code: HTTP status code
            code: Error code (VALIDATION_ERROR, RATE_LIMIT_EXCEEDED, etc.)
            message: Human-readable error message
            hint: Suggested action to resolve error
            details: Additional error details
            headers: Optional response headers

        Returns:
            JSONResponse with error structure
        """
        import uuid
        from datetime import datetime, timezone

        error_body = {
            "error": {
                "code": code,
                "message": message,
                "hint": hint,
                "details": details or {},
                "request_id": str(uuid.uuid4()),
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        }

        return JSONResponse(
            content=error_body,
            status_code=status_code,
            headers=headers or {},
        )
