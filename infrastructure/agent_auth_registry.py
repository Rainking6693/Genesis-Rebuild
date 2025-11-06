"""
Agent Authentication Registry
Cryptographic agent identity verification system

Implements VULN-002 fix: Agent authentication with HMAC signatures
"""
import hashlib
import hmac
import secrets
import logging
from typing import Dict, Optional
from dataclasses import dataclass, field
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


@dataclass
class AuthenticatedAgent:
    """Authenticated agent with cryptographic identity"""
    agent_name: str
    agent_id: str  # UUID
    token_hash: str  # HMAC of token (don't store plaintext)
    signature: str  # Cryptographic signature
    registered_at: datetime
    last_verified: datetime
    metadata: Dict[str, str] = field(default_factory=dict)
    permissions: list[str] = field(default_factory=list)  # Agent permissions


class AgentAuthRegistry:
    """
    Cryptographic agent authentication registry

    Security Features:
    - HMAC-SHA256 signatures for agent identity
    - Secure token generation (secrets.token_urlsafe)
    - Token expiration (24 hours)
    - Rate limiting on verification attempts
    - Audit logging of all authentication events
    """

    TOKEN_EXPIRATION_HOURS = 24
    MAX_VERIFY_ATTEMPTS_PER_MINUTE = 100

    def __init__(self, master_secret: Optional[str] = None):
        """
        Initialize authentication registry

        Args:
            master_secret: Optional master secret for HMAC (auto-generated if not provided)
        """
        # Generate master secret if not provided
        self.master_secret = master_secret or secrets.token_urlsafe(64)

        # Storage
        self.agents: Dict[str, AuthenticatedAgent] = {}  # agent_id -> AuthenticatedAgent
        self.agent_tokens: Dict[str, str] = {}  # agent_id -> plaintext token (memory only)

        # Rate limiting
        self.verify_attempts: Dict[str, list] = {}  # agent_name -> [timestamp, ...]

        logger.info("AgentAuthRegistry initialized with cryptographic verification")

    def register_agent(
        self,
        agent_name: str,
        metadata: Optional[Dict[str, str]] = None,
        permissions: Optional[list[str]] = None
    ) -> tuple[str, str]:
        """
        Register a new agent with cryptographic identity

        Args:
            agent_name: Unique agent name
            metadata: Optional metadata (capabilities, version, etc.)
            permissions: Optional list of permissions (e.g., ["read", "write", "execute"])

        Returns:
            (agent_id, auth_token) - Store auth_token securely, it's shown only once

        Raises:
            ValueError: If agent already registered
        """
        # Check if agent already registered
        for agent in self.agents.values():
            if agent.agent_name == agent_name:
                raise ValueError(f"Agent '{agent_name}' already registered")

        # Generate unique agent ID
        agent_id = secrets.token_urlsafe(16)

        # Generate cryptographic token (32 bytes = 256 bits)
        auth_token = secrets.token_urlsafe(32)

        # Create HMAC signature
        signature = self._create_signature(agent_name, auth_token)

        # Hash token for storage (don't store plaintext)
        token_hash = hashlib.sha256(auth_token.encode()).hexdigest()

        # Create authenticated agent
        now = datetime.now()
        authenticated_agent = AuthenticatedAgent(
            agent_name=agent_name,
            agent_id=agent_id,
            token_hash=token_hash,
            signature=signature,
            registered_at=now,
            last_verified=now,
            metadata=metadata or {},
            permissions=permissions or []
        )

        # Store
        self.agents[agent_id] = authenticated_agent
        self.agent_tokens[agent_id] = auth_token  # Store plaintext for verification

        logger.info(f"Agent registered: {agent_name} (ID: {agent_id[:8]}...) with permissions: {permissions or []}")

        return agent_id, auth_token

    def verify_agent(
        self,
        agent_name: str,
        auth_token: str
    ) -> bool:
        """
        Verify agent identity with cryptographic signature

        Args:
            agent_name: Agent name to verify
            auth_token: Authentication token

        Returns:
            True if agent is authenticated and token is valid

        Raises:
            SecurityError: If too many verification attempts (rate limit)
        """
        # Rate limiting check
        if not self._check_rate_limit(agent_name):
            raise SecurityError(
                f"Too many verification attempts for '{agent_name}' "
                f"(max {self.MAX_VERIFY_ATTEMPTS_PER_MINUTE}/minute)"
            )

        # Record verification attempt
        self._record_verify_attempt(agent_name)

        # Find agent by name
        agent = self._find_agent_by_name(agent_name)
        if not agent:
            logger.warning(f"Agent verification failed: '{agent_name}' not registered")
            return False

        # Check token expiration
        if not self._is_token_valid(agent):
            logger.warning(
                f"Agent verification failed: '{agent_name}' token expired "
                f"(registered: {agent.registered_at.isoformat()})"
            )
            return False

        # Verify signature
        expected_signature = self._create_signature(agent_name, auth_token)
        if not hmac.compare_digest(agent.signature, expected_signature):
            logger.warning(f"Agent verification failed: Invalid signature for '{agent_name}'")
            return False

        # Update last verified timestamp
        agent.last_verified = datetime.now()

        logger.info(f"Agent verified successfully: '{agent_name}'")
        return True

    def get_agent_id(self, agent_name: str) -> Optional[str]:
        """Get agent ID by name"""
        agent = self._find_agent_by_name(agent_name)
        return agent.agent_id if agent else None

    def is_registered(self, agent_name: str) -> bool:
        """Check if agent is registered"""
        return self._find_agent_by_name(agent_name) is not None

    def revoke_agent(self, agent_name: str) -> bool:
        """
        Revoke agent authentication

        Args:
            agent_name: Agent to revoke

        Returns:
            True if revoked, False if not found
        """
        agent = self._find_agent_by_name(agent_name)
        if not agent:
            return False

        # Remove from registry
        del self.agents[agent.agent_id]
        if agent.agent_id in self.agent_tokens:
            del self.agent_tokens[agent.agent_id]

        logger.info(f"Agent revoked: '{agent_name}'")
        return True

    def list_agents(self) -> list[str]:
        """List all registered agent names"""
        return [agent.agent_name for agent in self.agents.values()]

    def get_agent_metadata(self, agent_name: str) -> Optional[Dict[str, str]]:
        """Get agent metadata"""
        agent = self._find_agent_by_name(agent_name)
        return agent.metadata if agent else None

    def verify_token(self, auth_token) -> bool:
        """
        Verify if a token is valid (exists in registry)

        Args:
            auth_token: Authentication token to verify (str or tuple[str, str] from register_agent)

        Returns:
            True if token is valid and not expired
        """
        # Handle tuple return from register_agent (for convenience)
        if isinstance(auth_token, tuple):
            auth_token = auth_token[1]  # Extract token from (agent_id, token) tuple

        # Find agent with this token
        for agent_id, stored_token in self.agent_tokens.items():
            if hmac.compare_digest(auth_token, stored_token):
                agent = self.agents.get(agent_id)
                if agent and self._is_token_valid(agent):
                    # Update last verified
                    agent.last_verified = datetime.now()
                    logger.info(f"Token verified for agent: {agent.agent_name}")
                    return True

        logger.warning("Token verification failed: Invalid or expired token")
        return False

    def has_permission(self, auth_token, permission: str) -> bool:
        """
        Check if an authenticated agent has a specific permission

        Args:
            auth_token: Authentication token (str or tuple[str, str] from register_agent)
            permission: Permission to check (e.g., "read", "write", "execute")

        Returns:
            True if agent has the permission, False otherwise
        """
        # Handle tuple return from register_agent (for convenience)
        if isinstance(auth_token, tuple):
            auth_token = auth_token[1]  # Extract token from (agent_id, token) tuple

        # Find agent with this token
        for agent_id, stored_token in self.agent_tokens.items():
            if hmac.compare_digest(auth_token, stored_token):
                agent = self.agents.get(agent_id)
                if agent and self._is_token_valid(agent):
                    has_perm = permission in agent.permissions
                    logger.info(
                        f"Permission check for {agent.agent_name}: "
                        f"{permission} = {has_perm}"
                    )
                    return has_perm

        logger.warning(f"Permission check failed: Invalid token or permission '{permission}' not found")
        return False

    def get_agent_permissions(self, agent_name: str) -> list[str]:
        """
        Get all permissions for an agent

        Args:
            agent_name: Agent name

        Returns:
            List of permissions
        """
        agent = self._find_agent_by_name(agent_name)
        return agent.permissions if agent else []

    def update_permissions(self, agent_name: str, permissions: list[str]) -> bool:
        """
        Update agent permissions

        Args:
            agent_name: Agent name
            permissions: New list of permissions

        Returns:
            True if updated, False if agent not found
        """
        agent = self._find_agent_by_name(agent_name)
        if not agent:
            return False

        agent.permissions = permissions
        logger.info(f"Updated permissions for {agent_name}: {permissions}")
        return True

    # Private methods

    def _create_signature(self, agent_name: str, auth_token: str) -> str:
        """Create HMAC-SHA256 signature"""
        message = f"{agent_name}:{auth_token}"
        return hmac.new(
            self.master_secret.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()

    def _find_agent_by_name(self, agent_name: str) -> Optional[AuthenticatedAgent]:
        """Find agent by name"""
        for agent in self.agents.values():
            if agent.agent_name == agent_name:
                return agent
        return None

    def _is_token_valid(self, agent: AuthenticatedAgent) -> bool:
        """Check if token is still valid (not expired)"""
        expiration = agent.registered_at + timedelta(hours=self.TOKEN_EXPIRATION_HOURS)
        return datetime.now() < expiration

    def _check_rate_limit(self, agent_name: str) -> bool:
        """Check if verification attempts are within rate limit"""
        if agent_name not in self.verify_attempts:
            return True

        # Get attempts in last minute
        now = datetime.now()
        one_minute_ago = now - timedelta(minutes=1)
        recent_attempts = [
            ts for ts in self.verify_attempts[agent_name]
            if ts > one_minute_ago
        ]

        return len(recent_attempts) < self.MAX_VERIFY_ATTEMPTS_PER_MINUTE

    def _record_verify_attempt(self, agent_name: str) -> None:
        """Record verification attempt for rate limiting"""
        if agent_name not in self.verify_attempts:
            self.verify_attempts[agent_name] = []

        # Clean old attempts (> 1 minute)
        now = datetime.now()
        one_minute_ago = now - timedelta(minutes=1)
        self.verify_attempts[agent_name] = [
            ts for ts in self.verify_attempts[agent_name]
            if ts > one_minute_ago
        ]

        # Record new attempt
        self.verify_attempts[agent_name].append(now)


class SecurityError(Exception):
    """Security-related errors (rate limiting, invalid signatures, etc.)"""
    pass
