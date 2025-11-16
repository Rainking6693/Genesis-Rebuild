"""Lightweight wallet manager for compatibility with x402 scripts."""
from __future__ import annotations

import logging
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)


class WalletManager:
    AGENT_LIST = [
        "genesis_meta_agent",
        "support_agent",
        "marketing_agent",
        "finance_agent",
        "deploy_agent",
        "pricing_agent",
        "commerce_agent",
        "content_agent",
        "seo_agent",
        "analyst_agent",
    ]

    def __init__(self, agent_balances: Optional[Dict[str, float]] = None):
        self.agent_balances: Dict[str, float] = agent_balances or {agent: 1000.0 for agent in self.AGENT_LIST}

    def get_balance(self, agent_name: str) -> float:
        return self.agent_balances.get(agent_name, 0.0)

    def get_all_balances(self) -> Dict[str, float]:
        return dict(self.agent_balances)

    def get_low_balance_agents(self, min_balance: float = 50.0) -> List[str]:
        return [agent for agent, balance in self.agent_balances.items() if balance < min_balance]

    def record_payment(self, agent_name: str, amount: float, token: str = "USDC") -> None:
        self.agent_balances.setdefault(agent_name, 1000.0)
        self.agent_balances[agent_name] -= amount
        logger.info("Wallet %s recorded payment of %.2f %s", agent_name, amount, token)

    def fund(self, agent_name: str, amount: float, token: str = "USDC") -> None:
        self.agent_balances.setdefault(agent_name, 1000.0)
        self.agent_balances[agent_name] += amount
        logger.info("Wallet %s funded %.2f %s", agent_name, amount, token)

    def get_all_balances(self) -> Dict[str, float]:
        return dict(self.agent_balances)
