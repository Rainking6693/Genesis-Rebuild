"""Budget guard for the A2A-x402 payment flow."""
from __future__ import annotations

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional


def _agent_env_key(agent: str, suffix: str) -> str:
    return f"X402_{agent.upper()}_{suffix}"


def _env_float(key: str, default: float) -> float:
    try:
        return float(os.getenv(key, default))
    except (TypeError, ValueError):
        return default


class BudgetTracker:
    """Tracks budgets per agent and enforces limits."""

    BUDGET_DIR = Path("data/a2a-x402/budgets")
    STATE_FILE = BUDGET_DIR / "state.json"

    DEFAULTS = {
        "DAILY": 100.0,
        "MONTHLY": 1000.0,
        "PER_TXN": 10.0,
    }

    def __init__(self):
        self.BUDGET_DIR.mkdir(parents=True, exist_ok=True)
        self._state: Dict[str, Dict[str, float]] = {}
        self._load_state()

    def _load_state(self) -> None:
        if not self.STATE_FILE.exists():
            self._persist_state()
            return
        with self.STATE_FILE.open("r", encoding="utf-8") as fd:
            try:
                raw = json.load(fd)
            except json.JSONDecodeError:
                raw = {}
        self._state = {agent: data for agent, data in raw.items()}

    def _persist_state(self) -> None:
        with self.STATE_FILE.open("w", encoding="utf-8") as fd:
            json.dump(self._state, fd, indent=2)

    def _reset_if_needed(self, agent: str) -> None:
        today = datetime.utcnow().strftime("%Y-%m-%d")
        month = datetime.utcnow().strftime("%Y-%m")
        agent_state = self._state.setdefault(agent, {})
        if agent_state.get("last_daily", "") != today:
            agent_state["daily_spent"] = 0.0
            agent_state["last_daily"] = today
        if agent_state.get("last_monthly", "") != month:
            agent_state["monthly_spent"] = 0.0
            agent_state["last_monthly"] = month

    def _get_limits(self, agent: str) -> Dict[str, float]:
        return {
            "daily": _env_float(_agent_env_key(agent, "DAILY_LIMIT_USDC"), self.DEFAULTS["DAILY"]),
            "monthly": _env_float(_agent_env_key(agent, "MONTHLY_LIMIT_USDC"), self.DEFAULTS["MONTHLY"]),
            "per_txn": _env_float(_agent_env_key(agent, "PER_TRANSACTION_MAX_USDC"), self.DEFAULTS["PER_TXN"]),
        }

    def can_spend(self, agent: str, amount: float) -> bool:
        self._reset_if_needed(agent)
        limits = self._get_limits(agent)
        agent_state = self._state.setdefault(agent, {})
        daily = agent_state.get("daily_spent", 0.0)
        monthly = agent_state.get("monthly_spent", 0.0)
        if amount > limits["per_txn"]:
            return False
        if daily + amount > limits["daily"]:
            return False
        if monthly + amount > limits["monthly"]:
            return False
        return True

    def record_spend(self, agent: str, amount: float) -> None:
        self._reset_if_needed(agent)
        agent_state = self._state.setdefault(agent, {})
        agent_state["daily_spent"] = agent_state.get("daily_spent", 0.0) + amount
        agent_state["monthly_spent"] = agent_state.get("monthly_spent", 0.0) + amount
        self._persist_state()

    def get_usage(self, agent: str) -> Dict[str, float]:
        self._reset_if_needed(agent)
        agent_state = self._state.setdefault(agent, {})
        limits = self._get_limits(agent)
        return {
            "daily": agent_state.get("daily_spent", 0.0),
            "monthly": agent_state.get("monthly_spent", 0.0),
            "per_txn": limits["per_txn"],
            "daily_limit": limits["daily"],
            "monthly_limit": limits["monthly"],
        }
