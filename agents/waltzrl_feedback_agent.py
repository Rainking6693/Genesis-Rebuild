"""
Compatibility wrapper for WaltzRL feedback agent.

Re-exports the implementation living under `infrastructure.safety` so imports
from `agents.waltzrl_feedback_agent` continue to work.
"""

from infrastructure.safety.waltzrl_feedback_agent import *  # noqa: F401,F403
