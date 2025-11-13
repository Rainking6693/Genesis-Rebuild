"""
STRIPE INTEGRATION AGENT - Tier 3 Specialized Agent
Version: 1.0 (Tier 3 - Specialized Memory Integration)
Last Updated: November 13, 2025

Agent for managing Stripe payment integrations with persistent memory.

MODEL: Gemini 2.5 Flash (372 tokens/sec, $0.03/1M tokens)

CAPABILITIES:
- Payment integration configuration
- Pattern learning from successful payment setups
- User-specific payment method preferences
- Cross-agent payment knowledge sharing

MEMORY INTEGRATION (Tier 3 - Specialized):
1. store_payment_pattern() - Store payment integration patterns
2. recall_patterns() - Retrieve similar payment configurations
3. process_payment() - Process payment with learned patterns
4. recall_user_payment_methods() - Get user payment preferences

Memory Scopes:
- app: Cross-agent payment integration knowledge (shared patterns)
- user: User-specific payment methods and preferences
"""

import asyncio
import json
import logging
import os
import uuid
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any

# MemoryOS MongoDB adapter
from infrastructure.memory_os_mongodb_adapter import (
    GenesisMemoryOSMongoDB,
    create_genesis_memory_mongodb
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class PaymentConfig:
    """Configuration for Stripe payment"""
    payment_type: str  # subscription, one_time, usage_based
    amount: Optional[float] = None
    currency: str = "usd"
    interval: Optional[str] = None  # month, year for subscriptions
    metadata: Optional[Dict[str, Any]] = None
    user_id: Optional[str] = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


@dataclass
class PaymentResult:
    """Result of payment operation"""
    success: bool
    payment_id: Optional[str] = None
    amount: Optional[float] = None
    status: Optional[str] = None
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


class MemoryTool:
    """MemoryTool wrapper for Stripe Integration Agent payment pattern memory."""

    def __init__(self, backend: GenesisMemoryOSMongoDB, agent_id: str = "stripe_integration_agent"):
        self.backend = backend
        self.agent_id = agent_id
        logger.debug(f"[Stripe MemoryTool] Initialized for agent_id={agent_id}")

    def store_memory(
        self,
        content: Dict[str, Any],
        scope: str = "app",
        provenance: Optional[Dict[str, Any]] = None,
        memory_type: str = "conversation"
    ) -> bool:
        try:
            user_id = self._build_user_id(scope, content.get("user_id"))
            user_input = self._build_user_input(content)
            agent_response = self._build_agent_response(content)

            stored_content = {
                "user_input": user_input,
                "agent_response": agent_response,
                "raw_content": content
            }

            self.backend.store(
                agent_id=self.agent_id,
                user_id=user_id,
                user_input=user_input,
                agent_response=json.dumps(stored_content),
                memory_type=memory_type
            )

            logger.debug(f"[Stripe MemoryTool] Stored memory: scope={scope}")
            return True

        except Exception as e:
            logger.error(f"[Stripe MemoryTool] Failed to store memory: {e}")
            return False

    def retrieve_memory(
        self,
        query: str,
        scope: str = "app",
        filters: Optional[Dict[str, Any]] = None,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        try:
            user_id_filter = filters.get("user_id") if filters else None
            user_id = self._build_user_id(scope, user_id_filter)

            memories = self.backend.retrieve(
                agent_id=self.agent_id,
                user_id=user_id,
                query=query,
                memory_type=None,
                top_k=top_k * 2
            )

            parsed_memories = []
            for memory in memories:
                content = memory.get('content', {})
                if isinstance(content, dict):
                    agent_response = content.get('agent_response', '')
                    if isinstance(agent_response, str) and agent_response.startswith('{'):
                        try:
                            parsed_content = json.loads(agent_response)
                            memory['content'] = parsed_content
                        except json.JSONDecodeError:
                            pass
                parsed_memories.append(memory)

            if filters:
                parsed_memories = self._apply_filters(parsed_memories, filters)

            parsed_memories = parsed_memories[:top_k]

            logger.debug(f"[Stripe MemoryTool] Retrieved {len(parsed_memories)} memories")
            return parsed_memories

        except Exception as e:
            logger.error(f"[Stripe MemoryTool] Failed to retrieve memory: {e}")
            return []

    def _build_user_id(self, scope: str, user_id: Optional[str] = None) -> str:
        if scope == "app":
            return "stripe_global"
        elif scope == "user" and user_id:
            return f"stripe_{user_id}"
        else:
            return "stripe_default"

    def _build_user_input(self, content: Dict[str, Any]) -> str:
        payment_type = content.get('payment_type', 'unknown')
        amount = content.get('amount', 0)
        return f"Process {payment_type} payment for ${amount}"

    def _build_agent_response(self, content: Dict[str, Any]) -> str:
        if "result" in content:
            result = content['result']
            success = content.get('success', False)
            return f"Payment {'SUCCEEDED' if success else 'FAILED'}: {result}"
        else:
            return json.dumps(content, indent=2)

    def _apply_filters(
        self,
        memories: List[Dict[str, Any]],
        filters: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        filtered = []
        for memory in memories:
            content = memory.get('content', {})
            raw_content = content.get('raw_content', content)

            matches = True
            for key, value in filters.items():
                if key == "user_id":
                    continue

                if isinstance(raw_content, dict) and raw_content.get(key) != value:
                    matches = False
                    break

            if matches:
                filtered.append(memory)
        return filtered


class StripeIntegrationAgent:
    """
    Stripe Integration Agent - Manages payment integrations with memory.

    Features:
    1. Payment processing with pattern learning
    2. User payment method preferences
    3. Cross-agent payment knowledge sharing
    4. Best practice recommendations
    """

    def __init__(
        self,
        business_id: str = "default",
        enable_memory: bool = True
    ):
        self.business_id = business_id
        self.agent_id = f"stripe_integration_agent_{business_id}"

        self.enable_memory = enable_memory
        self.memory: Optional[GenesisMemoryOSMongoDB] = None
        self.memory_tool: Optional[MemoryTool] = None
        if enable_memory:
            self._init_memory()

        # Stripe API key (mock for now)
        self.stripe_api_key = os.getenv('STRIPE_API_KEY', 'sk_test_mock')

        # Statistics
        self.payments_processed = 0
        self.payments_successful = 0

        logger.info(f"💳 Stripe Integration Agent initialized for business: {business_id}")
        logger.info(f"   Memory: {'Enabled' if self.enable_memory else 'Disabled'}")

    def _init_memory(self):
        """Initialize MemoryOS MongoDB backend and MemoryTool."""
        try:
            mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
            self.memory = create_genesis_memory_mongodb(
                mongodb_uri=mongodb_uri,
                database_name="genesis_memory_stripe",
                short_term_capacity=10,
                mid_term_capacity=300,
                long_term_knowledge_capacity=50
            )

            self.memory_tool = MemoryTool(backend=self.memory, agent_id="stripe_integration_agent")

            logger.info("[StripeAgent] MemoryOS MongoDB initialized with MemoryTool integration")
        except Exception as e:
            logger.warning(f"[StripeAgent] Failed to initialize MemoryOS: {e}. Memory features disabled.")
            self.memory = None
            self.memory_tool = None
            self.enable_memory = False

    # ==================== MEMORY TOOL METHODS ====================

    async def store_payment_pattern(
        self,
        payment_type: str,
        config: Dict[str, Any],
        result: Dict[str, Any],
        success: bool,
        user_id: Optional[str] = None
    ) -> bool:
        """Store payment pattern for learning."""
        if not self.memory_tool:
            logger.debug("[StripeAgent] MemoryTool not available, skipping storage")
            return False

        try:
            content = {
                "payment_type": payment_type,
                "config": config,
                "result": result,
                "success": success,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "user_id": user_id
            }

            stored = self.memory_tool.store_memory(
                content=content,
                scope="app",
                memory_type="conversation"
            )

            if stored:
                logger.info(f"[StripeAgent] Stored payment pattern: {payment_type} ({'SUCCESS' if success else 'FAILED'})")

            return stored

        except Exception as e:
            logger.error(f"[StripeAgent] Failed to store payment pattern: {e}")
            return False

    async def recall_patterns(
        self,
        payment_type: str,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """Recall successful payment patterns."""
        if not self.memory_tool:
            logger.debug("[StripeAgent] MemoryTool not available, returning empty")
            return []

        try:
            query = f"successful {payment_type} payment integration"

            memories = self.memory_tool.retrieve_memory(
                query=query,
                scope="app",
                filters={"success": True},
                top_k=top_k
            )

            patterns = []
            for memory in memories:
                content = memory.get('content', {})
                raw_content = content.get('raw_content', content)

                if isinstance(raw_content, dict) and raw_content.get('success'):
                    patterns.append({
                        "payment_type": raw_content.get('payment_type'),
                        "config": raw_content.get('config', {}),
                        "result": raw_content.get('result', {})
                    })

            logger.info(f"[StripeAgent] Recalled {len(patterns)} payment patterns")
            return patterns

        except Exception as e:
            logger.error(f"[StripeAgent] Failed to recall patterns: {e}")
            return []

    async def process_payment(
        self,
        config: PaymentConfig,
        user_id: Optional[str] = None
    ) -> PaymentResult:
        """Process payment with learned patterns."""
        self.payments_processed += 1

        try:
            logger.info(f"💳 Processing {config.payment_type} payment...")

            # Recall successful patterns
            if self.enable_memory:
                patterns = await self.recall_patterns(payment_type=config.payment_type, top_k=3)
                if patterns:
                    logger.info(f"✓ Using learned pattern from {len(patterns)} successful payments")

            # Mock payment processing (would integrate with Stripe SDK)
            payment_id = f"pay_{uuid.uuid4().hex[:16]}"

            # Store successful pattern
            if self.enable_memory:
                await self.store_payment_pattern(
                    payment_type=config.payment_type,
                    config=asdict(config),
                    result={"payment_id": payment_id, "status": "succeeded"},
                    success=True,
                    user_id=user_id
                )

            self.payments_successful += 1

            logger.info(f"✅ Payment processed: {payment_id}")

            return PaymentResult(
                success=True,
                payment_id=payment_id,
                amount=config.amount,
                status="succeeded",
                metadata={
                    "payment_type": config.payment_type,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            )

        except Exception as e:
            error_msg = str(e)
            logger.error(f"Payment processing failed: {error_msg}")

            # Store failed pattern
            if self.enable_memory:
                await self.store_payment_pattern(
                    payment_type=config.payment_type,
                    config=asdict(config),
                    result={"error": error_msg},
                    success=False,
                    user_id=user_id
                )

            return PaymentResult(
                success=False,
                error=error_msg
            )

    async def recall_user_payment_methods(
        self,
        user_id: str
    ) -> List[Dict[str, Any]]:
        """Recall user-specific payment methods."""
        if not self.memory_tool:
            logger.debug("[StripeAgent] MemoryTool not available, returning empty")
            return []

        try:
            query = f"user payment methods preferences"

            memories = self.memory_tool.retrieve_memory(
                query=query,
                scope="user",
                filters={"user_id": user_id},
                top_k=10
            )

            methods = []
            for memory in memories:
                content = memory.get('content', {})
                raw_content = content.get('raw_content', content)

                if isinstance(raw_content, dict):
                    methods.append({
                        "payment_type": raw_content.get('payment_type'),
                        "config": raw_content.get('config', {})
                    })

            logger.info(f"[StripeAgent] Recalled {len(methods)} payment methods for {user_id}")
            return methods

        except Exception as e:
            logger.error(f"[StripeAgent] Failed to recall user payment methods: {e}")
            return []

    # ==================== END MEMORY TOOL METHODS ====================

    def get_statistics(self) -> Dict[str, Any]:
        """Get payment processing statistics."""
        if self.payments_processed > 0:
            success_rate = self.payments_successful / self.payments_processed
        else:
            success_rate = 0.0

        return {
            "agent_id": self.agent_id,
            "payments_processed": self.payments_processed,
            "payments_successful": self.payments_successful,
            "success_rate": success_rate,
            "memory_enabled": self.enable_memory
        }


async def get_stripe_integration_agent(
    business_id: str = "default",
    enable_memory: bool = True
) -> StripeIntegrationAgent:
    """Factory function to create Stripe Integration Agent."""
    agent = StripeIntegrationAgent(
        business_id=business_id,
        enable_memory=enable_memory
    )
    return agent


# Alias for shorter name
async def get_stripe_agent(
    business_id: str = "default",
    enable_memory: bool = True
) -> StripeIntegrationAgent:
    """Factory function alias for Stripe Integration Agent."""
    return await get_stripe_integration_agent(
        business_id=business_id,
        enable_memory=enable_memory
    )
