"""
Secure MCP Helper for Genesis Agents

Provides a secure, easy-to-use interface for agents to access MCP tools
with proper user_id, agent_name, and tool allowlists.

Usage:
    from infrastructure.secure_mcp_helper import SecureMCPHelper
    
    helper = SecureMCPHelper(
        user_id="user123",
        agent_name="deploy_agent",
        business_id="business456"
    )
    
    # Read file securely
    result = await helper.read_file("README.md")
    
    # Create GitHub issue securely
    result = await helper.create_github_issue(
        repo="owner/repo",
        title="Bug fix",
        body="Description"
    )
"""

import asyncio
import logging
from typing import Optional, Dict, Any, Set, List
from infrastructure.mcp_client import (
    get_mcp_client, mcp_call, MCPCallContext, MCPAccessDeniedError,
    MCPRateLimitError, MCPBudgetExceededError, MCPTimeoutError
)
from infrastructure.composable_context import get_context_manager
from infrastructure.action_schemas import (
    SendEmailSchema, CreateIssueSchema, CreateRepoSchema
)

logger = logging.getLogger(__name__)


class SecureMCPHelper:
    """
    Secure MCP helper for Genesis agents.
    
    Provides secure access to MCP tools with:
    - Automatic user_id and agent_name injection
    - Tool allowlists per agent type
    - Error handling and logging
    - Context management
    """
    
    # Tool allowlists by agent type
    AGENT_TOOL_ALLOWLISTS = {
        "deploy_agent": {
            "read_file", "write_file", "list_directory",
            "create_repo", "create_issue", "create_pr",
        },
        "marketing_agent": {
            "send_message", "create_issue",
        },
        "research_discovery_agent": {
            "read_file", "query", "insert",
        },
        "analyst_agent": {
            "read_file", "query", "analyze_data",
        },
        "builder_agent": {
            "read_file", "write_file", "list_directory",
            "create_repo", "create_issue",
        },
        "default": {
            "read_file",  # Minimal safe set
        },
    }
    
    def __init__(
        self,
        user_id: str,
        agent_name: str,
        business_id: Optional[str] = None,
        tool_allowlist: Optional[Set[str]] = None,
        enable_filesystem: bool = False,
        filesystem_safe_root: Optional[str] = None,
    ):
        """
        Initialize secure MCP helper.
        
        Args:
            user_id: User ID for multi-tenant isolation
            agent_name: Agent name (e.g., "deploy_agent")
            business_id: Optional business ID for context
            tool_allowlist: Optional custom tool allowlist (overrides default)
            enable_filesystem: Enable filesystem operations (default: False)
            filesystem_safe_root: Safe root directory for filesystem (required if enable_filesystem=True)
        """
        self.user_id = user_id
        self.agent_name = agent_name
        self.business_id = business_id or "default"
        
        # Get tool allowlist for this agent
        if tool_allowlist is None:
            tool_allowlist = self.AGENT_TOOL_ALLOWLISTS.get(
                agent_name,
                self.AGENT_TOOL_ALLOWLISTS["default"]
            )
        
        self.tool_allowlist = tool_allowlist
        self._mcp_client = None
        self._context_manager = None
        
        # Filesystem settings
        self.enable_filesystem = enable_filesystem
        self.filesystem_safe_root = filesystem_safe_root
        
        if enable_filesystem and not filesystem_safe_root:
            logger.warning(
                f"Filesystem enabled but no safe_root set for {agent_name}. "
                "Filesystem operations will be disabled."
            )
            self.enable_filesystem = False
    
    async def _get_mcp_client(self):
        """Get or create MCP client instance"""
        if self._mcp_client is None:
            self._mcp_client = await get_mcp_client(
                user_id=self.user_id,
                agent_name=self.agent_name,
                tool_allowlist=self.tool_allowlist,
                enable_filesystem=self.enable_filesystem,
                filesystem_safe_root=self.filesystem_safe_root,
                filesystem_read_only=False,  # Allow writes if filesystem enabled
            )
        return self._mcp_client
    
    def _get_context_manager(self):
        """Get or create context manager"""
        if self._context_manager is None:
            self._context_manager = get_context_manager(
                require_user_id=True,
                max_contexts_per_user=100,
            )
        return self._context_manager
    
    def _create_call_context(self) -> MCPCallContext:
        """Create MCP call context"""
        return MCPCallContext(
            user_id=self.user_id,
            agent_name=self.agent_name,
        )
    
    async def read_file(self, file_path: str) -> Dict[str, Any]:
        """
        Securely read a file.
        
        Args:
            file_path: Path to file (will be validated and normalized)
        
        Returns:
            File contents
        
        Raises:
            MCPAccessDeniedError: If access is denied
            MCPError: If file read fails
        """
        mcp = await self._get_mcp_client()
        try:
            result = await mcp.call_tool(
                "read_file",
                {"path": file_path},
                context=self._create_call_context()
            )
            return result
        except (MCPAccessDeniedError, MCPError) as e:
            logger.error(f"Failed to read file {file_path}: {e}")
            raise
    
    async def write_file(self, file_path: str, content: str) -> Dict[str, Any]:
        """
        Securely write a file.
        
        Args:
            file_path: Path to file (will be validated and normalized)
            content: File content
        
        Returns:
            Write result
        
        Raises:
            MCPAccessDeniedError: If access is denied or filesystem disabled
            MCPError: If file write fails
        """
        if not self.enable_filesystem:
            raise MCPAccessDeniedError("Filesystem operations disabled for this agent")
        
        mcp = await self._get_mcp_client()
        try:
            result = await mcp.call_tool(
                "write_file",
                {"path": file_path, "content": content},
                context=self._create_call_context()
            )
            return result
        except (MCPAccessDeniedError, MCPError) as e:
            logger.error(f"Failed to write file {file_path}: {e}")
            raise
    
    async def list_directory(self, directory_path: str) -> Dict[str, Any]:
        """
        Securely list directory contents.
        
        Args:
            directory_path: Path to directory
        
        Returns:
            Directory listing
        
        Raises:
            MCPAccessDeniedError: If access is denied
            MCPError: If directory listing fails
        """
        mcp = await self._get_mcp_client()
        try:
            result = await mcp.call_tool(
                "list_directory",
                {"path": directory_path},
                context=self._create_call_context()
            )
            return result
        except (MCPAccessDeniedError, MCPError) as e:
            logger.error(f"Failed to list directory {directory_path}: {e}")
            raise
    
    async def create_github_issue(
        self,
        repo: str,
        title: str,
        body: str,
        labels: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Securely create a GitHub issue using action schemas.
        
        Args:
            repo: Repository (owner/repo format)
            title: Issue title (max 200 chars, sanitized)
            body: Issue body (max 65KB, sanitized)
            labels: Optional issue labels (max 30)
        
        Returns:
            Issue creation result
        
        Raises:
            MCPAccessDeniedError: If access is denied
            MCPError: If issue creation fails
        """
        # Validate with action schema
        try:
            issue_schema = CreateIssueSchema(
                repo=repo,
                title=title,
                body=body,
                labels=labels or []
            )
        except Exception as e:
            logger.error(f"Invalid issue parameters: {e}")
            raise MCPError(f"Validation failed: {e}")
        
        mcp = await self._get_mcp_client()
        try:
            result = await mcp.call_tool(
                "create_issue",
                {
                    "repo": issue_schema.repo,
                    "title": issue_schema.title,
                    "body": issue_schema.body,
                    "labels": issue_schema.labels,
                },
                context=self._create_call_context()
            )
            return result
        except (MCPAccessDeniedError, MCPError) as e:
            logger.error(f"Failed to create GitHub issue: {e}")
            raise
    
    async def create_github_repo(
        self,
        name: str,
        description: Optional[str] = None,
        private: bool = False
    ) -> Dict[str, Any]:
        """
        Securely create a GitHub repository using action schemas.
        
        Args:
            name: Repository name (validated)
            description: Optional description (max 500 chars)
            private: Make repository private
        
        Returns:
            Repository creation result
        
        Raises:
            MCPAccessDeniedError: If access is denied
            MCPError: If repo creation fails
        """
        # Validate with action schema
        try:
            repo_schema = CreateRepoSchema(
                name=name,
                description=description,
                private=private
            )
        except Exception as e:
            logger.error(f"Invalid repo parameters: {e}")
            raise MCPError(f"Validation failed: {e}")
        
        mcp = await self._get_mcp_client()
        try:
            result = await mcp.call_tool(
                "create_repo",
                {
                    "name": repo_schema.name,
                    "description": repo_schema.description,
                    "private": repo_schema.private,
                },
                context=self._create_call_context()
            )
            return result
        except (MCPAccessDeniedError, MCPError) as e:
            logger.error(f"Failed to create GitHub repo: {e}")
            raise
    
    async def send_email(
        self,
        to: str,
        subject: str,
        body: str,
        from_email: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Securely send an email using action schemas.
        
        Args:
            to: Recipient email (validated)
            subject: Email subject (max 200 chars, sanitized)
            body: Email body (max 1MB, sanitized)
            from_email: Optional sender email (validated)
        
        Returns:
            Email send result
        
        Raises:
            MCPAccessDeniedError: If access is denied
            MCPError: If email send fails
        """
        # Validate with action schema
        try:
            email_schema = SendEmailSchema(
                to=to,
                subject=subject,
                body=body,
                from_email=from_email
            )
        except Exception as e:
            logger.error(f"Invalid email parameters: {e}")
            raise MCPError(f"Validation failed: {e}")
        
        mcp = await self._get_mcp_client()
        try:
            result = await mcp.call_tool(
                "send_message",
                {
                    "to": email_schema.to,
                    "subject": email_schema.subject,
                    "body": email_schema.body,
                    "from_email": email_schema.from_email,
                },
                context=self._create_call_context()
            )
            return result
        except (MCPAccessDeniedError, MCPError) as e:
            logger.error(f"Failed to send email: {e}")
            raise
    
    async def execute_query(self, sql: str) -> Dict[str, Any]:
        """
        Securely execute a database query.
        
        Args:
            sql: SQL query string
        
        Returns:
            Query result
        
        Raises:
            MCPAccessDeniedError: If access is denied
            MCPError: If query execution fails
        """
        mcp = await self._get_mcp_client()
        try:
            result = await mcp.call_tool(
                "query",
                {"sql": sql},
                context=self._create_call_context()
            )
            return result
        except (MCPAccessDeniedError, MCPError) as e:
            logger.error(f"Failed to execute query: {e}")
            raise
    
    async def list_available_tools(self) -> List[Dict[str, Any]]:
        """List all available tools for this agent"""
        mcp = await self._get_mcp_client()
        return mcp.list_tools()
    
    async def set_budget(self, tokens: int) -> None:
        """Set budget for this user"""
        mcp = await self._get_mcp_client()
        await mcp.set_budget(self.user_id, tokens)
    
    async def get_remaining_budget(self) -> Optional[int]:
        """Get remaining budget for this user"""
        mcp = await self._get_mcp_client()
        return await mcp.get_remaining_budget(self.user_id)


# Convenience function for agents
async def get_secure_mcp_helper(
    user_id: str,
    agent_name: str,
    business_id: Optional[str] = None,
    **kwargs
) -> SecureMCPHelper:
    """
    Get secure MCP helper instance.
    
    Args:
        user_id: User ID
        agent_name: Agent name
        business_id: Optional business ID
        **kwargs: Additional helper configuration
    
    Returns:
        SecureMCPHelper instance
    """
    return SecureMCPHelper(
        user_id=user_id,
        agent_name=agent_name,
        business_id=business_id,
        **kwargs
    )

