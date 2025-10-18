import asyncio
import os
from agent_framework import ChatAgent
from agent_framework.azure import AzureAIAgentClient
from agent_framework.observability import setup_observability
from azure.identity.aio import AzureCliCredential
from tool_echo import echo

def math_eval(expression: str) -> str:
    """Evaluate a basic math expression (only digits, +, -, *, /, parentheses, spaces)."""
    import re
    if not re.match(r'^[\d\+\-\*/\(\)\s]+$', expression):
        return "Error: invalid characters in expression"
    try:
        result = eval(expression, {"__builtins__": {}}, {})
        return str(result)
    except Exception as e:
        return f"Error: {str(e)}"

async def main():
    setup_observability(enable_sensitive_data=True)

    endpoint = os.getenv("AZURE_AI_PROJECT_ENDPOINT")
    deployment = os.getenv("AZURE_AI_MODEL_DEPLOYMENT_NAME")

    async with AzureCliCredential() as cred, ChatAgent(
        chat_client=AzureAIAgentClient(
            async_credential=cred,
            endpoint=endpoint,
            model=deployment
        ),
        instructions="You are concise. Use the 'echo' tool when asked to echo text. Use the 'math_eval' tool when asked to compute math.",
        name="Genesis",
        tools=[echo, math_eval],
    ) as agent:
        # Test 1: Echo
        print("=== Test 1: Echo ===")
        res = await agent.run("Use the echo tool to return exactly: Genesis handshake v1")
        print(res.text)

        # Test 2: Math
        print("\n=== Test 2: Math ===")
        res = await agent.run("Use the math_eval tool to compute (12/3)+5")
        print(res.text)

if __name__ == "__main__":
    asyncio.run(main())
