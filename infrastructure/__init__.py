"""
Genesis Infrastructure Layer
Foundation utilities for agent system
"""

from .intent_abstraction import IntentExtractor, Intent, Action, Motive, BusinessType, Priority
from .logging_config import get_logger, genesis_logger, infrastructure_logger, agent_logger, a2a_logger

# Import trajectory pool for OperatorType
try:
    from .trajectory_pool import OperatorType
    TRAJECTORY_POOL_AVAILABLE = True
except ImportError:
    TRAJECTORY_POOL_AVAILABLE = False
    OperatorType = None

# Import learning infrastructure (with graceful fallback)
try:
    from .reasoning_bank import get_reasoning_bank, ReasoningBank, MemoryType, OutcomeTag
    REASONING_BANK_AVAILABLE = True
except ImportError:
    REASONING_BANK_AVAILABLE = False
    get_reasoning_bank = None
    ReasoningBank = None
    MemoryType = None
    OutcomeTag = None

try:
    from .replay_buffer import get_replay_buffer, ReplayBuffer, Trajectory, ActionStep
    REPLAY_BUFFER_AVAILABLE = True
except ImportError:
    REPLAY_BUFFER_AVAILABLE = False
    get_replay_buffer = None
    ReplayBuffer = None
    Trajectory = None
    ActionStep = None

try:
    from .reflection_harness import ReflectionHarness, with_reflection
    REFLECTION_HARNESS_AVAILABLE = True
except ImportError:
    REFLECTION_HARNESS_AVAILABLE = False
    ReflectionHarness = None
    with_reflection = None

__all__ = [
    # Intent abstraction
    "IntentExtractor",
    "Intent",
    "Action",
    "Motive",
    "BusinessType",
    "Priority",
    # Logging
    "get_logger",
    "genesis_logger",
    "infrastructure_logger",
    "agent_logger",
    "a2a_logger",
    # Trajectory pool
    "OperatorType",
    # Learning infrastructure
    "get_reasoning_bank",
    "ReasoningBank",
    "MemoryType",
    "OutcomeTag",
    "get_replay_buffer",
    "ReplayBuffer",
    "Trajectory",
    "ActionStep",
    "ReflectionHarness",
    "with_reflection",
    # Availability flags
    "TRAJECTORY_POOL_AVAILABLE",
    "REASONING_BANK_AVAILABLE",
    "REPLAY_BUFFER_AVAILABLE",
    "REFLECTION_HARNESS_AVAILABLE",
]
