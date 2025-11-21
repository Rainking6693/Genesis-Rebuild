"""
Example: Secure MCP Client Usage in Genesis Agents

This example shows how agents should use the security-hardened MCP client
with proper user_id, agent_name, and tool allowlists.
"""

import asyncio
from typing import Optional, Dict, Any
from infrastructure.mcp_client import (
    get_mcp_client, mcp_call, MCPCallContext, MCPAccessDeniedError
)
from infrastructure.composable_context import get_context_manager
from infrastructure.action_schemas import SendEmailSchema, CreateIssueSchema


class SecureAgentExample:
    """
    Example agent showing secure MCP client usage.
    
    Key security practices:
    1. Always provide user_id and agent_name
    2. Use tool allowlists to restrict access
    3. Use context manager with user_id
    4. Handle security exceptions gracefully
    """
    
    def __init__(self, user_id: str, agent_name: str):
        self.user_id = user_id
        self.agent_name = agent_name
        
        # Define tool allowlist for this agent
        # Only allow tools this agent actually needs
        self.tool_allowlist = {
            "read_file",
            "write_file",
            "create_issue",
            "send_message",
        }
    
    async def initialize(self):
        """Initialize secure MCP client and context manager"""
        # Get MCP client with security context
        self.mcp = await get_mcp_client(
            user_id=self.user_id,
            agent_name=self.agent_name,
            tool_allowlist=self.tool_allowlist,
            default_timeout=30.0,
            enable_filesystem=False,  # Disable filesystem unless needed
        )
        
        # Get context manager (requires user_id by default)
        self.context_manager = get_context_manager(
            require_user_id=True,
            max_contexts_per_user=100,
        )
        
        # Create agent context
        self.ctx = self.context_manager.create_context(
            name=f"{self.agent_name}_context",
            user_id=self.user_id,
            args={"agent_name": self.agent_name}
        )
    
    async def read_file_secure(self, file_path: str) -> Dict[str, Any]:
        """
        Securely read a file using MCP.
        
        Args:
            file_path: Path to file (will be validated and normalized)
        
        Returns:
            File contents
        """
        try:
            result = await self.mcp.call_tool(
                "read_file",
                {"path": file_path},
                context=MCPCallContext(
                    user_id=self.user_id,
                    agent_name=self.agent_name
                )
            )
            return result
        except MCPAccessDeniedError as e:
            # Log security violation
            print(f"Access denied: {e}")
            return {"error": "access_denied", "message": str(e)}
        except Exception as e:
            print(f"Error reading file: {e}")
            return {"error": "execution_error", "message": str(e)}
    
    async def create_github_issue_secure(
        self,
        repo: str,
        title: str,
        body: str
    ) -> Dict[str, Any]:
        """
        Securely create a GitHub issue using action schemas.
        
        Args:
            repo: Repository (owner/repo format)
            title: Issue title
            body: Issue body (will be sanitized)
        
        Returns:
            Issue creation result
        """
        try:
            # Use action schema for validation and sanitization
            from infrastructure.action_schemas import ActionSchemaRegistry
            
            registry = ActionSchemaRegistry()
            schema_class = registry.get("create_issue")
            
            if not schema_class:
                return {"error": "schema_not_found"}
            
            # Validate and sanitize input
            params = {
                "repo": repo,
                "title": title,
                "body": body,
            }
            
            # Create action instance
            from infrastructure.action_schemas import AgentAction
            action = AgentAction(
                name="create_issue",
                schema=schema_class,
                handler=lambda p, ctx: None  # Placeholder
            )
            
            # Execute with validation
            result = await action.execute(params, self.ctx)
            
            if result["success"]:
                # Now call MCP tool
                mcp_result = await self.mcp.call_tool(
                    "create_issue",
                    params,
                    context=MCPCallContext(
                        user_id=self.user_id,
                        agent_name=self.agent_name
                    )
                )
                return mcp_result
            else:
                return result
                
        except Exception as e:
            print(f"Error creating issue: {e}")
            return {"error": "execution_error", "message": str(e)}
    
    async def send_email_secure(
        self,
        to: str,
        subject: str,
        body: str
    ) -> Dict[str, Any]:
        """
        Securely send email using action schemas.
        
        Args:
            to: Recipient email
            subject: Email subject (max 200 chars)
            body: Email body (max 1MB, will be sanitized)
        
        Returns:
            Email send result
        """
        try:
            # Validate with schema (includes sanitization)
            email_schema = SendEmailSchema(
                to=to,
                subject=subject,
                body=body
            )
            
            # Use validated params
            params = {
                "to": email_schema.to,
                "subject": email_schema.subject,
                "body": email_schema.body,
            }
            
            # Call MCP tool
            result = await self.mcp.call_tool(
                "send_message",
                params,
                context=MCPCallContext(
                    user_id=self.user_id,
                    agent_name=self.agent_name
                )
            )
            return result
            
        except Exception as e:
            print(f"Error sending email: {e}")
            return {"error": "execution_error", "message": str(e)}
    
    async def cleanup(self):
        """Cleanup resources"""
        # Clear working memory
        self.ctx.clear_working()
        
        # Context will be cleaned up automatically by scheduled task


# Convenience function for agents
async def secure_mcp_call(
    tool_name: str,
    params: Dict[str, Any],
    user_id: str,
    agent_name: str
) -> Dict[str, Any]:
    """
    Convenience function for secure MCP tool calls.
    
    Example:
        result = await secure_mcp_call(
            "read_file",
            {"path": "README.md"},
            user_id="user123",
            agent_name="deploy_agent"
        )
    """
    return await mcp_call(
        tool_name=tool_name,
        params=params,
        user_id=user_id,
        agent_name=agent_name
    )


# Example usage
async def main():
    """Example usage of secure agent"""
    agent = SecureAgentExample(
        user_id="user123",
        agent_name="deploy_agent"
    )
    
    await agent.initialize()
    
    # Read file securely
    file_result = await agent.read_file_secure("README.md")
    print(f"File read result: {file_result}")
    
    # Create GitHub issue securely
    issue_result = await agent.create_github_issue_secure(
        repo="owner/repo",
        title="Test Issue",
        body="This is a test issue"
    )
    print(f"Issue creation result: {issue_result}")
    
    # Send email securely
    email_result = await agent.send_email_secure(
        to="user@example.com",
        subject="Test Email",
        body="This is a test email"
    )
    print(f"Email send result: {email_result}")
    
    await agent.cleanup()


if __name__ == "__main__":
    asyncio.run(main())

