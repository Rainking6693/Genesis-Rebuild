"""
VOIX Detector - Discovers and parses VOIX tags from web pages

Implements DOM scanning for <tool> and <context> tags as specified in
arXiv:2511.11287 - Building the Web for Agents
"""

import json
import logging
import re
import time
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Set
from urllib.parse import urlparse

logger = logging.getLogger(__name__)


@dataclass
class VoixTool:
    """Represents a VOIX tool tag"""

    name: str
    endpoint: str
    description: str = ""
    parameters: Dict[str, Any] = field(default_factory=dict)
    method: str = "POST"
    auth_type: str = "none"  # none, session, bearer
    visibility: str = "visible"  # visible, hidden
    selector: Optional[str] = None
    raw_html: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "description": self.description,
            "parameters": self.parameters,
            "endpoint": self.endpoint,
            "method": self.method,
            "auth_type": self.auth_type,
            "visibility": self.visibility,
            "selector": self.selector,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "VoixTool":
        return cls(**{k: v for k, v in data.items() if k in cls.__dataclass_fields__})


@dataclass
class VoixContext:
    """Represents a VOIX context tag"""

    name: str
    value: Any
    scope: str = "page"  # page, session, global
    ttl_seconds: Optional[int] = None
    expires_at: Optional[float] = None
    selector: Optional[str] = None
    raw_html: Optional[str] = None

    def is_expired(self) -> bool:
        if self.expires_at is None:
            return False
        return time.time() > self.expires_at

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "value": self.value,
            "scope": self.scope,
            "ttl_seconds": self.ttl_seconds,
            "expires_at": self.expires_at,
            "selector": self.selector,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "VoixContext":
        return cls(**{k: v for k, v in data.items() if k in cls.__dataclass_fields__})


class VoixDetector:
    """
    Detects and parses VOIX tags from web pages

    Features:
    - DOM scanning for <tool> and <context> tags
    - Schema validation
    - TTL caching for context values
    - MutationObserver support (via JavaScript injection)
    """

    def __init__(self, cache_ttl: int = 300):
        """
        Initialize VOIX detector

        Args:
            cache_ttl: Default TTL for context values in seconds
        """
        self.cache_ttl = cache_ttl
        self._context_cache: Dict[str, VoixContext] = {}
        self._tool_cache: Dict[str, VoixTool] = {}

    def scan_dom(self, html: str, base_url: Optional[str] = None) -> Dict[str, Any]:
        """
        Scan HTML for VOIX tags

        Args:
            html: HTML content to scan
            base_url: Base URL for resolving relative endpoints

        Returns:
            Dictionary with 'tools' and 'contexts' lists
        """
        tools = self._scan_tool_tags(html, base_url)
        contexts = self._scan_context_tags(html, base_url)

        return {
            "tools": [tool.to_dict() for tool in tools],
            "contexts": [ctx.to_dict() for ctx in contexts],
            "has_voix": len(tools) > 0 or len(contexts) > 0,
        }

    def _scan_tool_tags(self, html: str, base_url: Optional[str] = None) -> List[VoixTool]:
        """Scan for <tool> tags"""
        tools = []
        # Pattern to match <tool> tags with attributes
        tool_pattern = re.compile(
            r'<tool\s+([^>]+)>',
            re.IGNORECASE | re.DOTALL
        )

        for match in tool_pattern.finditer(html):
            attrs_str = match.group(1)
            attrs = self._parse_attributes(attrs_str)

            try:
                tool = self._parse_tool_tag(attrs, match.group(0), base_url)
                if tool:
                    tools.append(tool)
            except Exception as e:
                logger.warning(f"Failed to parse tool tag: {e}")
                continue

        return tools

    def _scan_context_tags(self, html: str, base_url: Optional[str] = None) -> List[VoixContext]:
        """Scan for <context> tags"""
        contexts = []
        context_pattern = re.compile(
            r'<context\s+([^>]+)>',
            re.IGNORECASE | re.DOTALL
        )

        for match in context_pattern.finditer(html):
            attrs_str = match.group(1)
            attrs = self._parse_attributes(attrs_str)

            try:
                context = self._parse_context_tag(attrs, match.group(0), base_url)
                if context:
                    contexts.append(context)
            except Exception as e:
                logger.warning(f"Failed to parse context tag: {e}")
                continue

        return contexts

    def _parse_attributes(self, attrs_str: str) -> Dict[str, str]:
        """Parse HTML attributes from string"""
        attrs = {}
        # Match key="value" or key='value' or key=value
        attr_pattern = re.compile(
            r"(\w+)\s*=\s*(?:\"([^\\\"]*)\"|'([^']*)'|([^\s\t\r\n>]+))",
            re.IGNORECASE
        )

        for match in attr_pattern.finditer(attrs_str):
            key = match.group(1).lower()
            value = match.group(2) or match.group(3) or match.group(4) or ""
            attrs[key] = value

        return attrs

    def _parse_tool_tag(self, attrs: Dict[str, str], raw_html: str, base_url: Optional[str] = None) -> Optional[VoixTool]:
        """Parse a tool tag into VoixTool object"""
        # Required attributes
        if "name" not in attrs:
            logger.warning("Tool tag missing 'name' attribute")
            return None

        name = attrs["name"]
        description = attrs.get("description", "")
        endpoint = attrs.get("endpoint", "")
        method = attrs.get("method", "POST").upper()
        auth_type = attrs.get("auth", "none").lower()
        visibility = attrs.get("visibility", "visible").lower()
        selector = attrs.get("selector")

        # Parse parameters
        parameters = {}
        if "parameters" in attrs:
            try:
                parameters = json.loads(attrs["parameters"])
            except json.JSONDecodeError:
                logger.warning(f"Invalid JSON in parameters for tool {name}")
                parameters = {}

        # Resolve relative endpoint
        if endpoint and base_url and not endpoint.startswith(("http://", "https://")):
            parsed_base = urlparse(base_url)
            if endpoint.startswith("/"):
                endpoint = f"{parsed_base.scheme}://{parsed_base.netloc}{endpoint}"
            else:
                endpoint = f"{parsed_base.scheme}://{parsed_base.netloc}/{endpoint}"

        # Validate schema
        if not self._validate_tool_schema(name, description, endpoint, parameters):
            return None

        tool = VoixTool(
            name=name,
            description=description,
            parameters=parameters,
            endpoint=endpoint,
            method=method,
            auth_type=auth_type,
            visibility=visibility,
            selector=selector,
            raw_html=raw_html,
        )

        # Cache tool
        self._tool_cache[name] = tool
        return tool

    def _parse_context_tag(self, attrs: Dict[str, str], raw_html: str, base_url: Optional[str] = None) -> Optional[VoixContext]:
        """Parse a context tag into VoixContext object"""
        if "name" not in attrs:
            logger.warning("Context tag missing 'name' attribute")
            return None

        name = attrs["name"]
        value = attrs.get("value", "")
        scope = attrs.get("scope", "page").lower()
        ttl_seconds = None
        selector = attrs.get("selector")

        if "ttl" in attrs:
            try:
                ttl_seconds = int(attrs["ttl"])
            except ValueError:
                logger.warning(f"Invalid TTL value for context {name}")

        # Parse JSON value if present
        try:
            parsed_value = json.loads(value) if value.startswith(("{", "[")) else value
        except json.JSONDecodeError:
            parsed_value = value

        expires_at = None
        if ttl_seconds:
            expires_at = time.time() + ttl_seconds
        elif self.cache_ttl:
            expires_at = time.time() + self.cache_ttl

        context = VoixContext(
            name=name,
            value=parsed_value,
            scope=scope,
            ttl_seconds=ttl_seconds or self.cache_ttl,
            expires_at=expires_at,
            selector=selector,
            raw_html=raw_html,
        )

        # Cache context
        cache_key = f"{scope}:{name}"
        self._context_cache[cache_key] = context
        return context

    def _validate_tool_schema(self, name: str, description: str, endpoint: str, parameters: Dict[str, Any]) -> bool:
        """Validate tool schema"""
        if not name or not isinstance(name, str):
            logger.warning("Tool name must be a non-empty string")
            return False

        if not endpoint or not isinstance(endpoint, str):
            logger.warning(f"Tool {name} must have a valid endpoint")
            return False

        if not endpoint.startswith(("http://", "https://")):
            logger.warning(f"Tool {name} endpoint must be a valid URL")
            return False

        if not isinstance(parameters, dict):
            logger.warning(f"Tool {name} parameters must be a dictionary")
            return False

        return True

    def get_tool(self, name: str) -> Optional[VoixTool]:
        """Get cached tool by name"""
        return self._tool_cache.get(name)

    def get_context(self, name: str, scope: str = "page") -> Optional[VoixContext]:
        """Get cached context by name and scope"""
        cache_key = f"{scope}:{name}"
        context = self._context_cache.get(cache_key)
        if context and context.is_expired():
            del self._context_cache[cache_key]
            return None
        return context

    def clear_cache(self):
        """Clear all cached tools and contexts"""
        self._tool_cache.clear()
        self._context_cache.clear()

    def get_all_tools(self) -> List[VoixTool]:
        """Get all cached tools"""
        return list(self._tool_cache.values())

    def get_all_contexts(self) -> List[VoixContext]:
        """Get all non-expired contexts"""
        expired_keys = [
            key for key, ctx in self._context_cache.items()
            if ctx.is_expired()
        ]
        for key in expired_keys:
            del self._context_cache[key]
        return list(self._context_cache.values())
