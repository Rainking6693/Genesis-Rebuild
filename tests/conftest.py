"""
Pytest configuration and fixtures for Layer 2 Darwin tests

Provides:
- LLM API mocks (OpenAI, Anthropic)
- Shared fixtures (temp files, agents)
- Test data generators
- CI/CD compatibility
"""

import asyncio
import json
import tempfile
from pathlib import Path
from typing import Any, Dict
from unittest.mock import AsyncMock, MagicMock, Mock, patch

import pytest


# ============================================================================
# PYTEST CONFIGURATION
# ============================================================================

def pytest_configure(config):
    """Configure pytest markers"""
    config.addinivalue_line(
        "markers", "slow: marks tests as slow (deselect with '-m \"not slow\"')"
    )
    config.addinivalue_line(
        "markers", "requires_api_key: marks tests that require real API keys"
    )
    config.addinivalue_line(
        "markers", "integration: marks tests as integration tests"
    )


# ============================================================================
# MOCK DATA GENERATORS
# ============================================================================

def generate_mock_llm_response(content: str, model: str = "gpt-4o") -> Dict[str, Any]:
    """Generate mock OpenAI API response"""
    return {
        "id": "chatcmpl-mock123",
        "object": "chat.completion",
        "created": 1234567890,
        "model": model,
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": content,
                },
                "finish_reason": "stop",
            }
        ],
        "usage": {
            "prompt_tokens": 100,
            "completion_tokens": 50,
            "total_tokens": 150,
        },
    }


def generate_mock_diagnosis(problem_type: str = "bug") -> str:
    """Generate mock problem diagnosis"""
    diagnoses = {
        "bug": "Fix validation error in input handling. The function doesn't check for None values.",
        "optimization": "Optimize loop performance by using list comprehension instead of append.",
        "feature": "Add error handling for edge cases when input is empty or malformed.",
        "refactor": "Refactor code structure to improve readability and maintainability.",
    }
    return diagnoses.get(problem_type, diagnoses["bug"])


def generate_mock_improved_code(base_code: str = None) -> str:
    """Generate mock improved code"""
    if base_code:
        return base_code + "\n# IMPROVED: Added error handling\n"

    return """
def agent_improved(business_type, description):
    '''Improved agent with error handling'''
    if not business_type or not description:
        raise ValueError("business_type and description required")

    return f"Enhanced spec for {business_type}: {description}"

def validate_input(data):
    '''Validate input data'''
    if data is None:
        return False
    return True
"""


# ============================================================================
# LLM API MOCKS
# ============================================================================

@pytest.fixture
def mock_openai_client():
    """Mock OpenAI client for Darwin agent tests"""

    # Create mock client
    mock_client = MagicMock()

    # Mock chat.completions.create() method
    async def mock_create(*args, **kwargs):
        """Mock async completion creation"""
        messages = kwargs.get("messages", [])

        # Detect request type from messages
        if messages and len(messages) > 0:
            last_message = messages[-1].get("content", "")

            # Diagnosis request
            if "failed trajectories" in last_message.lower():
                content = generate_mock_diagnosis("bug")

            # Code generation request
            elif "improve" in last_message.lower() or "generate" in last_message.lower():
                content = generate_mock_improved_code()

            # Default response
            else:
                content = "Mock response for unknown request type"
        else:
            content = "Mock response"

        # Return mock response object
        response = MagicMock()
        response.choices = [MagicMock()]
        response.choices[0].message = MagicMock()
        response.choices[0].message.content = content

        return response

    # Attach mock method
    mock_client.chat = MagicMock()
    mock_client.chat.completions = MagicMock()
    mock_client.chat.completions.create = AsyncMock(side_effect=mock_create)

    return mock_client


@pytest.fixture
def mock_openai_patch(mock_openai_client, monkeypatch):
    """Patch OpenAI client globally and set API key in environment"""
    # Set mock API key in environment
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test-mock-key-for-testing-only")
    monkeypatch.setenv("ANTHROPIC_API_KEY", "sk-ant-test-mock-key")

    # Patch AsyncOpenAI constructor in multiple locations
    with patch("openai.AsyncOpenAI", return_value=mock_openai_client), \
         patch("agents.darwin_agent.AsyncOpenAI", return_value=mock_openai_client):
        yield mock_openai_client


@pytest.fixture
def mock_anthropic_client():
    """Mock Anthropic client for fallback testing"""

    mock_client = MagicMock()

    async def mock_create(*args, **kwargs):
        """Mock async message creation"""
        # Return mock response
        response = MagicMock()
        response.content = [MagicMock()]
        response.content[0].text = generate_mock_improved_code()
        return response

    mock_client.messages = MagicMock()
    mock_client.messages.create = AsyncMock(side_effect=mock_create)

    return mock_client


# ============================================================================
# FILE FIXTURES
# ============================================================================

@pytest.fixture
def temp_agent_code():
    """Create temporary agent code file"""
    code_file = Path(tempfile.mktemp(suffix=".py"))
    code_file.write_text("""
def generate(business_type, description):
    '''Generate business specification'''
    return f"Spec for {business_type}: {description}"

def validate(spec):
    '''Validate specification'''
    return len(spec) > 0
""")

    yield code_file

    # Cleanup
    if code_file.exists():
        code_file.unlink()


@pytest.fixture
def temp_evolution_dir():
    """Create temporary evolution directory"""
    evo_dir = Path(tempfile.mkdtemp(prefix="darwin_test_"))

    yield evo_dir

    # Cleanup
    import shutil
    if evo_dir.exists():
        shutil.rmtree(evo_dir)


@pytest.fixture
def temp_checkpoint_dir():
    """Create temporary checkpoint directory"""
    cp_dir = Path(tempfile.mkdtemp(prefix="checkpoint_test_"))

    yield cp_dir

    # Cleanup
    import shutil
    if cp_dir.exists():
        shutil.rmtree(cp_dir)


# ============================================================================
# AGENT FIXTURES
# ============================================================================

@pytest.fixture
def mock_darwin_agent(temp_agent_code, mock_openai_patch):
    """Create Darwin agent with mocked LLM"""
    from agents.darwin_agent import DarwinAgent

    darwin = DarwinAgent(
        agent_name="test_agent",
        initial_code_path=str(temp_agent_code),
        max_generations=2,
        population_size=2,
    )

    return darwin


@pytest.fixture
def mock_replay_buffer():
    """Create mock ReplayBuffer"""
    from infrastructure.replay_buffer import ReplayBuffer
    from infrastructure import OutcomeTag

    # Create in-memory buffer
    buffer = ReplayBuffer(db_uri=None)  # Force in-memory mode

    # Add some mock trajectories
    for i in range(5):
        trajectory = {
            "agent_id": "test_agent",
            "task": f"test_task_{i}",
            "actions": [f"action_{j}" for j in range(3)],
            "final_outcome": OutcomeTag.SUCCESS.value if i % 2 == 0 else OutcomeTag.FAILURE.value,
            "final_reward": 0.8 if i % 2 == 0 else 0.2,
            "initial_state": {"metrics": {"overall_score": 0.5}},
        }
        buffer.store(
            agent_id=trajectory["agent_id"],
            task=trajectory["task"],
            actions=trajectory["actions"],
            outcome=trajectory["final_outcome"],
            reward=trajectory["final_reward"],
            metadata={"initial_state": trajectory["initial_state"]},
        )

    return buffer


@pytest.fixture
def mock_world_model():
    """Create WorldModel instance"""
    from infrastructure.world_model import WorldModel

    model = WorldModel(
        state_dim=128,
        action_dim=128,
        hidden_dim=256,
    )

    return model


# ============================================================================
# BENCHMARK FIXTURES
# ============================================================================

@pytest.fixture
def mock_benchmark_suite():
    """Create mock benchmark suite"""
    from infrastructure.benchmark_runner import BenchmarkTask

    tasks = [
        BenchmarkTask(
            task_id="test_task_1",
            description="Test task 1",
            test_cases=[
                {"input": {"x": 1}, "expected": {"y": 2}},
                {"input": {"x": 2}, "expected": {"y": 4}},
            ],
            scoring_fn=lambda actual, expected: 1.0 if actual == expected else 0.0,
        ),
        BenchmarkTask(
            task_id="test_task_2",
            description="Test task 2",
            test_cases=[
                {"input": {"a": "hello"}, "expected": {"b": "HELLO"}},
            ],
            scoring_fn=lambda actual, expected: 1.0 if actual == expected else 0.0,
        ),
    ]

    return tasks


# ============================================================================
# DOCKER FIXTURES
# ============================================================================

@pytest.fixture
def mock_docker_available():
    """Mock Docker availability check"""
    with patch("shutil.which", return_value="/usr/bin/docker"):
        yield True


@pytest.fixture
def mock_sandbox(mock_docker_available):
    """Mock sandbox for testing without Docker"""
    from infrastructure.sandbox import CodeSandbox, SandboxResult

    # Create real sandbox (will use Docker if available)
    sandbox = CodeSandbox()

    # For tests that don't need real Docker, mock execute_code
    original_execute = sandbox.execute_code

    async def mock_execute(code: str, **kwargs):
        """Mock execution that validates syntax and returns success"""
        # Check for syntax errors
        try:
            compile(code, "<string>", "exec")
            return SandboxResult(
                exit_code=0,
                stdout="Mock execution successful",
                stderr="",
                execution_time=0.1,
            )
        except SyntaxError as e:
            return SandboxResult(
                exit_code=1,
                stdout="",
                stderr=f"SyntaxError: {str(e)}",
                execution_time=0.0,
            )

    # Allow tests to choose real or mock execution
    sandbox._original_execute = original_execute
    sandbox._mock_execute = mock_execute
    sandbox.use_mock = False  # Default to real execution

    async def execute_wrapper(*args, **kwargs):
        if sandbox.use_mock:
            return await sandbox._mock_execute(*args, **kwargs)
        else:
            return await sandbox._original_execute(*args, **kwargs)

    sandbox.execute_code = execute_wrapper

    return sandbox


# ============================================================================
# API KEY MANAGEMENT
# ============================================================================

@pytest.fixture
def mock_api_keys(monkeypatch):
    """Mock API keys for tests that check key loading"""
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test-mock-key-for-testing-only")
    monkeypatch.setenv("ANTHROPIC_API_KEY", "sk-ant-test-mock-key")

    yield

    # Cleanup happens automatically with monkeypatch


# ============================================================================
# ASYNC TEST HELPERS
# ============================================================================

@pytest.fixture
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


# ============================================================================
# TEST DATA
# ============================================================================

@pytest.fixture
def sample_metrics():
    """Sample metrics for testing"""
    return {
        "overall_score": 0.75,
        "correctness": 0.80,
        "efficiency": 0.70,
        "robustness": 0.75,
        "maintainability": 0.73,
    }


@pytest.fixture
def sample_trajectory():
    """Sample trajectory for testing"""
    from infrastructure import OutcomeTag

    return {
        "agent_id": "test_agent",
        "task": "sample_task",
        "actions": [
            "Read file",
            "Parse data",
            "Generate output",
            "Write result",
        ],
        "observations": [
            "File found",
            "Data valid",
            "Output generated",
            "Result written",
        ],
        "final_outcome": OutcomeTag.SUCCESS.value,
        "final_reward": 0.85,
        "metadata": {
            "execution_time": 2.5,
            "tokens_used": 1500,
        },
    }


# ============================================================================
# CLEANUP HELPERS
# ============================================================================

@pytest.fixture(autouse=True)
def cleanup_temp_files():
    """Automatically cleanup temporary files after each test"""
    yield

    # Cleanup any leftover temp files with our prefixes
    import glob
    import os

    temp_patterns = [
        "/tmp/darwin_test_*",
        "/tmp/checkpoint_test_*",
        "/tmp/tmp*.py",
    ]

    for pattern in temp_patterns:
        for filepath in glob.glob(pattern):
            try:
                if os.path.isfile(filepath):
                    os.unlink(filepath)
                elif os.path.isdir(filepath):
                    import shutil
                    shutil.rmtree(filepath)
            except Exception:
                pass  # Ignore cleanup errors
