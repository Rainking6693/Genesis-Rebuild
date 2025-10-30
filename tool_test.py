import asyncio
import os
from agent_framework import ChatAgent
from agent_framework.azure import AzureAIAgentClient
from agent_framework.observability import setup_observability
from azure.identity.aio import AzureCliCredential
from tool_echo import echo

def math_eval(expression: str) -> str:
    """Evaluate a basic math expression (only digits, +, -, *, /, parentheses, spaces).

    Security: Uses AST-based safe evaluation instead of eval() to prevent RCE attacks.
    """
    import ast
    import operator

    # Allowed operators (whitelist)
    ops = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
        ast.USub: operator.neg,
    }

    def eval_node(node):
        """Recursively evaluate AST node (safe, no code execution)"""
        if isinstance(node, ast.Num):  # Python 3.7 compatibility
            return node.n
        elif isinstance(node, ast.Constant):  # Python 3.8+
            return node.value
        elif isinstance(node, ast.BinOp):
            return ops[type(node.op)](eval_node(node.left), eval_node(node.right))
        elif isinstance(node, ast.UnaryOp):
            return ops[type(node.op)](eval_node(node.operand))
        else:
            raise ValueError(f"Unsupported operation: {type(node).__name__}")

    try:
        tree = ast.parse(expression, mode='eval')
        result = eval_node(tree.body)
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
