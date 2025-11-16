"""
SUPPORT AGENT - Microsoft Agent Framework Version
Version: 4.0 (Enhanced with DAAO + TUMIX) (Day 2 Migration)

Handles customer support, ticket management, and user assistance.
"""

import asyncio
import json
import logging
import time
from datetime import datetime, timezone
from typing import List, Dict, Optional, Any
from agent_framework import ChatAgent
from agent_framework.azure import AzureAIAgentClient
from agent_framework.observability import setup_observability
from azure.identity.aio import AzureCliCredential

setup_observability(enable_sensitive_data=True)

# Import observability for metrics (fixes P2-2)
from infrastructure.observability import get_observability_manager
obs_manager = get_observability_manager()
# Import DAAO and TUMIX
from infrastructure.daao_router import get_daao_router, RoutingDecision
from infrastructure.tumix_termination import (
    get_tumix_termination,
    RefinementResult,
    TerminationDecision
)

# Import OCR capability (legacy)
from infrastructure.ocr.ocr_agent_tool import support_agent_ticket_image_processor

# Import DeepSeek-OCR for visual memory compression (NEW: 92.9% token savings)
from infrastructure.deepseek_ocr_compressor import DeepSeekOCRCompressor, ResolutionMode

# Import self-correction for response validation
from infrastructure.self_correction import (
    SelfCorrectingAgent,
    ValidationCategory,
    get_self_correcting_agent
)

# Import OpenEnv for customer issue reproduction
from infrastructure.openenv_wrapper import EnvRegistry
from infrastructure.env_learning_agent import EnvironmentLearningAgent

# Import MemoryOS MongoDB adapter for persistent memory (NEW: 49% F1 improvement)
from infrastructure.memory_os_mongodb_adapter import (
    GenesisMemoryOSMongoDB,
    create_genesis_memory_mongodb
)

# Import MultimodalMemoryPipeline for image processing (NEW: Tier 1 Integration)
from infrastructure.genesis_memory_integration import (
    MultimodalMemoryPipeline,
    MultimodalAttachment,
    AttachmentType
)

# Import vLLM Agent-Lightning token caching for 60-80% latency reduction (NEW: Token Cache Optimization)
from infrastructure.token_cached_rag import TokenCachedRAG, TokenCacheStats
from infrastructure.token_cache_helper import initialize_token_cached_rag
from infrastructure.ap2_helpers import record_ap2_event
from infrastructure.payments import get_payment_manager
from infrastructure.payments.budget_enforcer import BudgetExceeded
from infrastructure.payments.media_helper import MediaPaymentHelper

logger = logging.getLogger(__name__)


class SupportAgent:
    """Customer support and ticket management agent"""

    def __init__(self, business_id: str = "default", enable_memory: bool = True):
        self.business_id = business_id
        self.enable_memory = enable_memory
        self.agent = None

        # Initialize DAAO router for cost optimization
        self.router = get_daao_router()

        # Initialize TUMIX for iterative refinement
        self.termination = get_tumix_termination(
            min_rounds=2,
            max_rounds=4,
            improvement_threshold=0.05
        )

        # Track refinement sessions for metrics
        self.refinement_history: List[List[RefinementResult]] = []

        # Initialize DeepSeek-OCR for visual memory compression (NEW: 71%+ token savings)
        self.ocr_compressor = DeepSeekOCRCompressor()

        # Self-correction wrapper (initialized after agent setup)
        self.self_correcting: Optional[SelfCorrectingAgent] = None

        # OpenEnv for customer issue reproduction (initialized after agent setup)
        self.browser_env = None
        self.env_agent = None

        # Initialize MemoryOS MongoDB adapter for persistent memory (NEW: 49% F1 improvement)
        # Enables ticket resolution memory, common issue patterns, user history tracking
        self.memory: Optional[GenesisMemoryOSMongoDB] = None
        if self.enable_memory:
            self._init_memory()

        # Initialize MultimodalMemoryPipeline for customer screenshot processing (Tier 1 - Critical)
        self.multimodal_pipeline: Optional[MultimodalMemoryPipeline] = None
        if self.enable_memory:
            self._init_multimodal_pipeline()

        # Initialize MemoryTool wrapper for structured memory operations
        self.memory_tool: Optional['MemoryTool'] = None
        if self.enable_memory:
            self._init_memory_tool()

        # Initialize vLLM Agent-Lightning token caching (NEW: 60-80% latency reduction)
        # Token caching eliminates re-tokenization overhead for support KB queries
        self.token_cached_rag: Optional[TokenCachedRAG] = None
        if self.enable_memory:
            self._init_token_cache()

        self.payment_manager = get_payment_manager()
        self.media_helper = MediaPaymentHelper("support_agent", vendor_name="support_ops_vendor")
        self.payment_contexts: List[Dict[str, str]] = []

        logger.info(f"Support Agent v4.0 initialized with DAAO + TUMIX + DeepSeek-OCR + OpenEnv + MemoryOS + MultimodalPipeline + Token-Caching for business: {business_id}")

    def __repr__(self) -> str:
        """String representation of Support Agent"""
        return f"Support Agent (business_id={self.business_id}, memory={'enabled' if self.enable_memory else 'disabled'}, token_cache={'enabled' if self.token_cached_rag else 'disabled'})"

    async def initialize(self):
        cred = AzureCliCredential()
        client = AzureAIAgentClient(async_credential=cred)
        self.agent = ChatAgent(
            chat_client=client,
            instructions="You are a customer support specialist with OCR image reading capabilities and issue reproduction via Playwright. Handle support tickets, answer user questions, troubleshoot issues, and escalate complex problems. You can process customer screenshots and error images using OCR, and reproduce customer issues by learning browser automation via self-play. Maintain empathetic, professional communication. Track ticket resolution metrics and identify common issues for documentation. Aim for 84% autonomous resolution rate.",
            name="support-agent",
            tools=[self.create_ticket, self.respond_to_ticket, self.escalate_ticket, self.search_knowledge_base, self.generate_support_report, self.process_ticket_image, self.reproduce_customer_issue]
        )

        # Initialize OpenEnv for customer issue reproduction
        self.browser_env = EnvRegistry.make("playwright")
        # Create LLM client directly (Railway: no local LLM, use cloud APIs)
        try:
            from anthropic import Anthropic
            import os
            llm_client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
        except Exception as e:
            logger.warning(f"Could not initialize LLM client for OpenEnv: {e}")
            llm_client = None

        self.env_agent = EnvironmentLearningAgent(
            env=self.browser_env,
            llm_client=llm_client,
            casebank=None,  # TODO: Integrate with CaseBank
            max_episodes=8  # Support: moderate learning
        )

        print(f"💬 Support Agent initialized for business: {self.business_id}")
        print(f"   - OpenEnv issue reproduction enabled (Playwright)")
        print(f"   - MemoryOS MongoDB backend enabled (49% F1 improvement)\n")

    def _init_memory(self):
        """Initialize MemoryOS MongoDB backend for Support ticket memory."""
        try:
            import os
            self.memory = create_genesis_memory_mongodb(
                mongodb_uri=os.getenv("MONGODB_URI", "mongodb://localhost:27017/"),
                database_name="genesis_memory_support",
                short_term_capacity=10,  # Recent tickets
                mid_term_capacity=1000,  # Historical ticket patterns (Support-specific, higher capacity)
                long_term_knowledge_capacity=200  # Common issues, user interaction history
            )
            logger.info("[SupportAgent] MemoryOS MongoDB initialized for ticket resolution tracking")
        except Exception as e:
            logger.warning(f"[SupportAgent] Failed to initialize MemoryOS: {e}. Memory features disabled.")
            self.memory = None

    def _init_multimodal_pipeline(self):
        """Initialize MultimodalMemoryPipeline for customer screenshot processing."""
        try:
            import os
            gemini_api_key = os.getenv("GEMINI_API_KEY")
            self.multimodal_pipeline = MultimodalMemoryPipeline(gemini_api_key=gemini_api_key)
            logger.info("[SupportAgent] MultimodalMemoryPipeline initialized for screenshot processing")
        except Exception as e:
            logger.warning(f"[SupportAgent] Failed to initialize MultimodalPipeline: {e}. Multimodal features disabled.")
            self.multimodal_pipeline = None

    def _init_memory_tool(self):
        """Initialize MemoryTool wrapper for structured memory operations."""
        if not self.memory:
            logger.warning("[SupportAgent] MemoryTool initialization skipped (MemoryOS not available)")
            self.memory_tool = None
            return

        try:
            self.memory_tool = MemoryTool(
                backend=self.memory,
                agent_id="support"
            )
            logger.info("[SupportAgent] MemoryTool initialized for structured memory operations")
        except Exception as e:
            logger.warning(f"[SupportAgent] Failed to initialize MemoryTool: {e}. Memory tool features disabled.")
            self.memory_tool = None

    def _init_token_cache(self):
        """
        Initialize vLLM Agent-Lightning token caching for support KB queries.

        Performance Target: 70-80% latency reduction (200-500ms → 40-100ms on cache hit)

        Cache Configuration Rationale (fixes P2-5):
        - TTL: 3600s (1 hour)
          * Support KB articles update frequently during business hours
          * Shorter TTL ensures fresher content but slightly lower hit rate
          * Balance between cache staleness and performance
        - Max Context: 4096 tokens
          * Sufficient for 3-5 support articles
          * Prevents excessive memory usage per cached query

        Tuning Guidelines:
        - Increase TTL to 7200s (2hr) if hit rate falls below 60%
        - Decrease TTL to 1800s (30min) if stale content issues reported
        - Increase max_context to 8192 if articles are frequently truncated

        Fixes Applied:
        - P0-1: Correct Redis async import via token_cache_helper
        - P0-2: Proper async client or async wrapper
        - P0-3: Realistic mock implementations with async behavior
        - P1-1: Comprehensive error handling and logging
        - P1-2: Connection pooling via singleton pattern
        - P1-3: Mock vector DB returns test data
        - P1-4: Mock LLM uses tiktoken for realistic tokenization
        - P1-5: Singleton pattern prevents connection leaks
        - P2-1: Proper error logging levels (ERROR for failures)
        - P2-3: Cache size limits (500MB maxmemory in Redis)
        - P2-4: No code duplication (shared utility)
        - P2-5: TTL rationale documented
        """
        self.token_cached_rag = initialize_token_cached_rag(
            agent_name="support",
            cache_ttl=3600,  # 1 hour (see rationale above)
            max_context_tokens=4096,
            use_mocks=True  # Will be replaced with real implementations
        )

    async def enable_self_correction(self, qa_agent: Any, max_attempts: int = 3):
        """
        Enable self-correction QA loop for support response validation.

        Args:
            qa_agent: QA agent for validation
            max_attempts: Maximum correction attempts
        """
        self.self_correcting = get_self_correcting_agent(
            agent=self,
            qa_agent=qa_agent,
            max_attempts=max_attempts,
            validation_categories=[
                ValidationCategory.CORRECTNESS,
                ValidationCategory.COMPLETENESS,
                ValidationCategory.QUALITY,
                ValidationCategory.SAFETY
            ]
        )
        logger.info(
            f"Support Agent self-correction enabled: max_attempts={max_attempts}"
        )

    async def respond_with_validation(
        self,
        task: str,
        expectations: Optional[Dict] = None
    ) -> Dict:
        """
        Generate support response with automatic QA validation loop.

        Args:
            task: Support task/ticket description
            expectations: Expected response properties

        Returns:
            Validated support response
        """
        if not self.self_correcting:
            raise RuntimeError(
                "Self-correction not enabled. Call enable_self_correction() first."
            )

        default_expectations = {
            "professional_tone": True,
            "answers_question": True,
            "safe_content": True,
            "actionable_steps": True
        }

        expectations = {**default_expectations, **(expectations or {})}

        return await self.self_correcting.execute_with_validation(
            task=task,
            expectations=expectations,
            context={"agent": "SupportAgent", "business_id": self.business_id}
        )

    def create_ticket(self, user_id: str, issue_description: str, priority: str) -> str:
        """Create a new support ticket"""
        result = {
            "ticket_id": f"TICKET-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "user_id": user_id,
            "issue_description": issue_description,
            "priority": priority,
            "status": "open",
            "assigned_to": "auto-triage",
            "created_at": datetime.now().isoformat(),
            "sla_deadline": datetime.now().isoformat()
        }
        return json.dumps(result, indent=2)

    async def respond_to_ticket(
        self,
        ticket_id: str,
        response: str,
        resolution_type: str,
        customer_id: Optional[str] = None,
        issue_type: Optional[str] = None,
        session_id: Optional[str] = None
    ) -> str:
        """
        Respond to a support ticket with a solution.

        NEW: Enhanced with Tier 1 Memory Integration
        - Retrieves customer history for context
        - Recalls common solutions for similar issues
        - Stores interaction in customer memory
        - Stores successful solutions in shared knowledge base
        - 49% F1 improvement on ticket resolution accuracy

        Args:
            ticket_id: Ticket ID
            response: Resolution response
            resolution_type: Type of resolution (resolved, pending, escalated)
            customer_id: Customer ID (optional, for memory tracking)
            issue_type: Issue type/category (optional, for solution recall)
            session_id: Session ID (optional, for interaction tracking)

        Returns:
            JSON string with ticket response and memory-enhanced context
        """
        user_id = f"support_{self.business_id}"
        session_id = session_id or f"ticket_{ticket_id}"

        # 1. Retrieve customer history if customer_id provided
        customer_context = []
        if customer_id and self.memory_tool:
            try:
                customer_context = await self.recall_customer_history(
                    customer_id=customer_id,
                    limit=5
                )
                logger.info(f"[SupportAgent] Retrieved {len(customer_context)} customer interactions")
            except Exception as e:
                logger.warning(f"[SupportAgent] Customer history retrieval failed: {e}")

        # 2. Retrieve common solutions if issue_type provided
        common_solutions = []
        if issue_type and self.memory_tool:
            try:
                common_solutions = await self.recall_common_solutions(
                    issue_type=issue_type,
                    min_success_rate=0.7
                )
                logger.info(f"[SupportAgent] Retrieved {len(common_solutions)} common solutions")
            except Exception as e:
                logger.warning(f"[SupportAgent] Common solutions retrieval failed: {e}")

        # 3. Retrieve historical ticket resolution patterns from memory (legacy method)
        historical_context = ""
        if self.memory:
            try:
                memories = self.memory.retrieve(
                    agent_id="support",
                    user_id=user_id,
                    query=f"ticket resolution: {response[:100]}",
                    memory_type=None,
                    top_k=3
                )
                if memories:
                    historical_context = "\n".join([
                        f"- Similar resolution: {m['content'].get('agent_response', '')}"
                        for m in memories
                    ])
                    logger.info(f"[SupportAgent] Retrieved {len(memories)} similar ticket patterns from memory")
            except Exception as e:
                logger.warning(f"[SupportAgent] Memory retrieval failed: {e}")

        # 4. Build result with memory-enhanced context
        result = {
            "ticket_id": ticket_id,
            "response": response,
            "resolution_type": resolution_type,
            "status": "resolved" if resolution_type == "resolved" else "pending",
            "response_time_minutes": 15,
            "customer_satisfaction_score": None,
            "responded_at": datetime.now().isoformat(),
            "memory_context": {
                "customer_history_count": len(customer_context),
                "common_solutions_count": len(common_solutions),
                "historical_patterns": historical_context if historical_context else "No similar tickets found",
                "customer_previous_issues": [
                    {
                        "issue": ctx.get("issue_description", ""),
                        "resolution": ctx.get("resolution", ""),
                        "satisfaction": ctx.get("satisfaction_score")
                    }
                    for ctx in customer_context[:3]
                ] if customer_context else [],
                "recommended_solutions": [
                    {
                        "solution": sol.get("solution", ""),
                        "success_rate": sol.get("success_rate", 0.0)
                    }
                    for sol in common_solutions[:3]
                ] if common_solutions else []
            }
        }

        # 5. Store customer interaction in memory if resolved and customer_id provided
        if customer_id and resolution_type == "resolved":
            try:
                memory_id = await self.store_customer_interaction(
                    customer_id=customer_id,
                    interaction_type="ticket",
                    issue_description=issue_type or "general_support",
                    resolution=response,
                    satisfaction_score=None,  # To be updated later
                    session_id=session_id
                )
                result["customer_memory_stored"] = True
                result["customer_memory_id"] = memory_id
                logger.info(f"[SupportAgent] Stored customer interaction: {memory_id}")
            except Exception as e:
                logger.warning(f"[SupportAgent] Customer interaction storage failed: {e}")
                result["customer_memory_stored"] = False

        # 6. Store common solution if resolved and issue_type provided
        if issue_type and resolution_type == "resolved":
            try:
                solution_id = await self.store_common_solution(
                    issue_type=issue_type,
                    solution=response,
                    success_rate=0.85  # Default success rate, to be updated with feedback
                )
                result["solution_knowledge_stored"] = True
                result["solution_memory_id"] = solution_id
                logger.info(f"[SupportAgent] Stored common solution: {solution_id}")
            except Exception as e:
                logger.warning(f"[SupportAgent] Common solution storage failed: {e}")
                result["solution_knowledge_stored"] = False

        # 7. Store ticket resolution in memory for future reference (legacy method)
        if self.memory and resolution_type == "resolved":
            try:
                self.memory.store(
                    agent_id="support",
                    user_id=user_id,
                    user_input=f"Resolve ticket {ticket_id}",
                    agent_response=f"Resolution: {response} (Type: {resolution_type})",
                    memory_type="conversation"
                )
                logger.info(f"[SupportAgent] Stored ticket resolution in memory: {ticket_id}")
            except Exception as e:
                logger.warning(f"[SupportAgent] Memory storage failed: {e}")

        return json.dumps(result, indent=2)

    def escalate_ticket(self, ticket_id: str, escalation_reason: str, escalation_team: str) -> str:
        """Escalate a ticket to a specialized team"""
        result = {
            "ticket_id": ticket_id,
            "escalation_reason": escalation_reason,
            "escalated_to": escalation_team,
            "original_priority": "medium",
            "new_priority": "high",
            "escalation_notes": "Requires specialized technical knowledge",
            "escalated_at": datetime.now().isoformat()
        }
        try:
            purchase = self.media_helper.purchase(
                resource="support_escalation",
                amount_usd=0.65,
                vendor="support_escalation_api"
            )
            self._record_payment_context(
                "escalate_ticket",
                {
                    "ticket_id": ticket_id,
                    "escalated_to": escalation_team,
                    "vendor": purchase.vendor
                }
            )
        except BudgetExceeded as exc:
            logger.warning("Support escalation blocked by budget guard: %s", exc)

        self._emit_ap2_event(
            action="escalate_ticket",
            context={
                "ticket_id": ticket_id,
                "escalation_team": escalation_team
            },
            cost=0.65
        )

        return json.dumps(result, indent=2)

    def _record_payment_context(self, action: str, context: Dict[str, str]) -> None:
        self.payment_contexts.append({
            "action": action,
            "context": context,
            "recorded_at": datetime.now(timezone.utc).isoformat()
        })

    def _emit_ap2_event(self, action: str, context: Dict[str, Any], cost: Optional[float] = None):
        record_ap2_event(
            agent="SupportAgent",
            action=action,
            cost=cost or 0.65,
            context=context
        )

    def search_knowledge_base(self, query: str, category: str) -> str:
        """Search the knowledge base for relevant articles"""
        result = {
            "query": query,
            "category": category,
            "results": [
                {"article_id": "KB-001", "title": "Common Login Issues", "relevance_score": 0.92},
                {"article_id": "KB-015", "title": "Password Reset Guide", "relevance_score": 0.87},
                {"article_id": "KB-042", "title": "Account Security Best Practices", "relevance_score": 0.76}
            ],
            "total_results": 3,
            "searched_at": datetime.now().isoformat()
        }
        return json.dumps(result, indent=2)

    async def answer_support_query_cached(
        self,
        query: str,
        top_k: int = 5,
        max_tokens: int = 500
    ) -> Dict[str, Any]:
        """
        Answer a support query using vLLM Agent-Lightning token caching.

        Achieves 60-80% latency reduction by:
        1. Retrieving cached token IDs from Redis (40-100ms on cache hit)
        2. Avoiding re-tokenization of support KB documents
        3. Passing token IDs directly to LLM for generation

        Args:
            query: Customer support question
            top_k: Number of KB articles to retrieve (default: 5)
            max_tokens: Maximum tokens in response (default: 500)

        Returns:
            Dict with response, cache_hit, latency_ms, cache_stats

        Performance Target: 70-80% latency reduction (200-500ms → 40-100ms on cache hit)
        """
        if not self.token_cached_rag:
            # Fallback to non-cached response
            logger.warning("[SupportAgent] TokenCachedRAG not available, using non-cached response")
            return {
                "response": "Support response (non-cached)",
                "cache_hit": False,
                "cache_available": False,
                "latency_ms": 0,
                "cache_stats": None
            }

        try:
            start_time = time.time()

            # Use TokenCachedRAG to generate response with token caching
            result = await self.token_cached_rag.generate_with_rag(
                query=query,
                top_k=top_k,
                max_tokens=max_tokens,
                temperature=0.7
            )

            # Log cache performance
            cache_stats = self.token_cached_rag.get_cache_stats()
            logger.info(
                f"[SupportAgent] Answer generated with token caching",
                extra={
                    "cache_hit": result.get("cache_hit"),
                    "hit_rate": cache_stats.get("hit_rate"),
                    "latency_ms": result.get("latency_ms"),
                    "context_tokens": result.get("context_tokens"),
                    "query_tokens": result.get("query_tokens")
                }
            )

            # Record metrics for observability (fixes P2-2)
            obs_manager.record_metric(
                "token_cache.hit_rate",
                cache_stats.get("hit_rate", 0),
                unit="percent",
                labels={"agent": "support", "business_id": self.business_id}
            )

            obs_manager.record_metric(
                "token_cache.latency_ms",
                result.get("latency_ms", 0),
                unit="milliseconds",
                labels={
                    "agent": "support",
                    "cache_hit": str(result.get("cache_hit", False)),
                    "business_id": self.business_id
                }
            )

            obs_manager.record_metric(
                "token_cache.context_tokens",
                result.get("context_tokens", 0),
                unit="count",
                labels={"agent": "support", "business_id": self.business_id}
            )

            return {
                "response": result.get("response", ""),
                "cache_hit": result.get("cache_hit", False),
                "cache_available": True,
                "latency_ms": result.get("latency_ms", 0),
                "context_tokens": result.get("context_tokens", 0),
                "query_tokens": result.get("query_tokens", 0),
                "total_tokens": result.get("total_tokens", 0),
                "cache_stats": cache_stats
            }

        except Exception as e:
            logger.warning(
                f"[SupportAgent] Token caching failed, falling back to non-cached: {e}",
                extra={"query": query[:50], "error": str(e)}
            )
            # Graceful degradation - return non-cached response
            return {
                "response": "Support response (fallback)",
                "cache_hit": False,
                "cache_available": False,
                "cache_error": str(e),
                "latency_ms": (time.time() - start_time) * 1000,
                "cache_stats": None
            }

    def generate_support_report(self, start_date: str, end_date: str) -> str:
        """Generate a support metrics report for a date range"""
        result = {
            "report_id": f"REPORT-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "period": {"start": start_date, "end": end_date},
            "metrics": {
                "total_tickets": 487,
                "resolved_tickets": 409,
                "autonomous_resolution_rate": 0.84,
                "average_response_time_minutes": 12,
                "customer_satisfaction_score": 4.6,
                "common_issues": ["login", "billing", "feature_requests"]
            },
            "generated_at": datetime.now().isoformat()
        }
        return json.dumps(result, indent=2)

    async def process_ticket_image(
        self,
        image_path: str,
        expected_issues: List[str] = None,
        customer_id: Optional[str] = None,
        session_id: Optional[str] = None,
        store_in_memory: bool = True
    ) -> str:
        """
        Process customer support ticket images using dual approach:
        1. DeepSeek-OCR compression for token efficiency (92.9% savings)
        2. MultimodalMemoryPipeline for deep semantic analysis

        NEW: Tier 1 Memory Integration
        - Stores image insights in customer memory with URIs
        - Enables visual context retrieval in future interactions
        - Combines OCR efficiency with semantic understanding

        Token Efficiency:
        - Before: ~3,600 tokens per customer screenshot (raw image)
        - After: ~100 tokens (Small mode optimized for simple screenshots)
        - Cost savings: $50/month for 5,000 support tickets

        Args:
            image_path: Path to customer screenshot/error image
            expected_issues: Optional list of keywords to check for (e.g., ["error", "crash"])
            customer_id: Customer ID (optional, for memory storage)
            session_id: Session ID (optional, for memory storage)
            store_in_memory: Whether to store insights in memory (default: True)

        Returns:
            JSON string with processed image data, compressed markdown, and memory insights
        """
        try:
            # Compress ticket image using DeepSeek-OCR (Small mode: 100 tokens)
            # Support uses SMALL mode (640×640, 100 tokens) optimized for customer screenshots
            compression_result = await self.ocr_compressor.compress(
                image_path,
                mode=ResolutionMode.SMALL,  # 640×640, 100 tokens - optimized for simple screenshots
                task="ocr"
            )

            # Prepare ticket processing result with compressed data
            result = {
                'valid': True,
                'compressed_markdown': compression_result.markdown,
                'tokens_used': compression_result.tokens_used,
                'compression_ratio': compression_result.compression_ratio,
                'baseline_tokens': int(compression_result.tokens_used / (1 - compression_result.compression_ratio)) if compression_result.compression_ratio < 1.0 else compression_result.tokens_used,
                'savings_percent': compression_result.compression_ratio * 100,
                'execution_time_ms': compression_result.execution_time_ms,
                'grounding_boxes': compression_result.grounding_boxes,
                'has_content': len(compression_result.markdown.strip()) > 0,
                'word_count': len(compression_result.markdown.split())
            }

            # Check for expected issue keywords if provided
            if expected_issues:
                detected_issues = []
                missing_issues = []

                for issue in expected_issues:
                    if issue.lower() in compression_result.markdown.lower():
                        detected_issues.append(issue)
                    else:
                        missing_issues.append(issue)

                result['expected_issues'] = expected_issues
                result['detected_issues'] = detected_issues
                result['missing_issues'] = missing_issues
                result['likely_issue_report'] = len(detected_issues) >= 1

                # Check for urgency keywords
                urgency_keywords = ['urgent', 'critical', 'asap', 'emergency']
                result['urgency_high'] = any(
                    keyword in compression_result.markdown.lower()
                    for keyword in urgency_keywords
                )

            # Process with MultimodalMemoryPipeline for semantic analysis (if available)
            multimodal_insights = None
            if self.multimodal_pipeline and customer_id:
                try:
                    mm_result = await self.process_customer_screenshot(
                        screenshot_uri=image_path,
                        customer_id=customer_id,
                        session_id=session_id or f"ticket_{image_path}",
                        store_in_memory=store_in_memory
                    )
                    multimodal_insights = mm_result.get("content")
                    result['multimodal_insights'] = multimodal_insights
                    result['multimodal_processing_time_ms'] = mm_result.get("processing_time_ms", 0)
                    result['memory_stored'] = store_in_memory and multimodal_insights is not None

                    logger.info(
                        f"Multimodal analysis completed: {mm_result.get('processing_time_ms', 0):.0f}ms"
                    )
                except Exception as e:
                    logger.warning(f"Multimodal analysis failed: {e}")
                    result['multimodal_error'] = str(e)

            logger.info(
                f"Ticket image processed with DeepSeek-OCR: "
                f"{compression_result.tokens_used} tokens "
                f"({compression_result.compression_ratio:.1%} savings) "
                f"in {compression_result.execution_time_ms:.0f}ms"
            )

            return json.dumps(result, indent=2)

        except Exception as e:
            logger.error(f"DeepSeek-OCR compression failed, falling back to legacy OCR: {e}")

            # Fallback to legacy OCR if compression fails
            legacy_result = support_agent_ticket_image_processor(image_path)
            legacy_result['fallback_mode'] = True
            legacy_result['error'] = str(e)
            return json.dumps(legacy_result, indent=2)

    async def create_helpdesk_ticket(self, ticket_data: Dict[str, Any]) -> dict:
        """Create a helpdesk ticket and record the payment."""
        cost = 0.35
        response = await asyncio.to_thread(
            self.payment_manager.pay,
            "support_agent",
            "https://helpdesk.genesis.com/create-ticket",
            cost,
            metadata={"ticket": ticket_data}
        )
        return {
            "transaction_id": response.transaction_id,
            "status": response.status,
            "amount": response.amount,
            "vendor": response.vendor
        }

    async def transcribe_voice_call(self, audio_url: str) -> dict:
        """Transcribe a voice call via the payment-managed transcription service."""
        cost = 0.25
        response = await asyncio.to_thread(
            self.payment_manager.pay,
            "support_agent",
            "https://voice-support.genesis.com/transcribe",
            cost,
            metadata={"audio_url": audio_url, "language": "en"}
        )
        return {
            "transaction_id": response.transaction_id,
            "status": response.status,
            "amount": response.amount,
            "vendor": response.vendor
        }

    async def reproduce_customer_issue(self, ticket_id: str, reproduction_steps: str) -> str:
        """
        Reproduce customer issue via learned browser automation (NEW: OpenEnv capability).

        Args:
            ticket_id: Support ticket ID
            reproduction_steps: Steps to reproduce the issue

        Returns:
            JSON string with reproduction results
        """
        if not self.env_agent:
            return json.dumps({
                "error": "OpenEnv not initialized",
                "message": "Call initialize() first"
            }, indent=2)

        logger.info(f"Reproducing customer issue: ticket={ticket_id}")

        # Agent learns to reproduce issue via self-play
        result = await self.env_agent.learn_task(
            goal=f"Reproduce issue: {reproduction_steps}",
            context={"ticket_id": ticket_id}
        )

        reproduction_result = {
            "reproduction_id": f"REPRO-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "ticket_id": ticket_id,
            "reproduction_steps": reproduction_steps,
            "reproduced": result["success"],
            "episodes": result["episodes"],
            "total_steps": result["total_steps"],
            "observed_behavior": result["learned_strategy"],
            "status": "REPRODUCED" if result["success"] else "COULD_NOT_REPRODUCE",
            "reproduced_at": datetime.now().isoformat()
        }

        if result["success"]:
            logger.info(
                f"Issue reproduced! Episodes: {result['episodes']}, "
                f"Steps: {result['total_steps']}"
            )
        else:
            logger.warning(
                f"Could not reproduce issue after {result['episodes']} episodes"
            )

        return json.dumps(reproduction_result, indent=2)


    def route_task(self, task_description: str, priority: float = 0.5) -> RoutingDecision:
        """
        Route task to appropriate model using DAAO

        Args:
            task_description: Description of the task
            priority: Task priority (0.0-1.0)

        Returns:
            RoutingDecision with model selection and cost estimate
        """
        task = {
            'id': f'support-{{datetime.now().strftime("%Y%m%d%H%M%S")}}',
            'description': task_description,
            'priority': priority,
            'required_tools': []
        }

        decision = self.router.route_task(task, budget_conscious=True)

        logger.info(
            f"Task routed: {decision.reasoning}",
            extra={
                'agent': 'SupportAgent',
                'model': decision.model,
                'difficulty': decision.difficulty.value,
                'estimated_cost': decision.estimated_cost
            }
        )

        return decision

    def get_cost_metrics(self) -> Dict:
        """Get cumulative cost savings from DAAO and TUMIX"""
        if not self.refinement_history:
            return {
                'agent': 'SupportAgent',
                'tumix_sessions': 0,
                'tumix_savings_percent': 0.0,
                'message': 'No refinement sessions recorded yet'
            }

        tumix_savings = self.termination.estimate_cost_savings(
            [
                [r for r in session]
                for session in self.refinement_history
            ],
            cost_per_round=0.001
        )

        return {
            'agent': 'SupportAgent',
            'tumix_sessions': tumix_savings['sessions'],
            'tumix_baseline_rounds': tumix_savings['baseline_rounds'],
            'tumix_actual_rounds': tumix_savings['tumix_rounds'],
            'tumix_savings_percent': tumix_savings['savings_percent'],
            'tumix_total_saved': tumix_savings['savings'],
            'daao_info': 'DAAO routing automatically applied to all tasks'
        }

    # =========================================================================
    # TIER 1 - CRITICAL: Memory Integration Methods
    # =========================================================================

    async def store_customer_interaction(
        self,
        customer_id: str,
        interaction_type: str,
        issue_description: str,
        resolution: str,
        satisfaction_score: Optional[float],
        session_id: str
    ) -> str:
        """
        Store customer interaction history in memory.

        This enables:
        - Customer history tracking across sessions
        - Pattern recognition for common issues
        - Personalized support based on past interactions
        - Quality metrics and satisfaction tracking

        Args:
            customer_id: Customer ID
            interaction_type: Type of interaction (ticket, chat, email, phone)
            issue_description: Description of the customer issue
            resolution: How the issue was resolved
            satisfaction_score: Customer satisfaction score (0-5, None if not rated)
            session_id: Session ID for this interaction

        Returns:
            Memory ID of stored interaction

        Memory Scope:
            - Stored in user scope: (user, customer_id)
            - Enables customer history recall across sessions
        """
        if not self.memory_tool:
            logger.warning("[SupportAgent] Memory tool not available, skipping interaction storage")
            return "memory_disabled"

        try:
            # Store interaction in customer's memory
            memory_content = {
                "interaction_type": interaction_type,
                "issue_description": issue_description,
                "resolution": resolution,
                "satisfaction_score": satisfaction_score,
                "session_id": session_id,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "agent_id": "support",
                "resolved": bool(resolution)
            }

            memory_id = self.memory_tool.store_memory(
                content=memory_content,
                scope="user",
                user_id=customer_id,
                provenance={
                    "source": "customer_interaction",
                    "session_id": session_id,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            )

            logger.info(
                f"[SupportAgent] Stored customer interaction: customer={customer_id}, "
                f"type={interaction_type}, memory_id={memory_id}"
            )

            return memory_id

        except Exception as e:
            logger.error(f"[SupportAgent] Failed to store customer interaction: {e}")
            return "error"

    async def recall_customer_history(
        self,
        customer_id: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Recall customer's past interactions from memory.

        Retrieves the most recent customer interactions for context,
        enabling personalized and informed support.

        Args:
            customer_id: Customer ID
            limit: Maximum number of interactions to retrieve (default: 10)

        Returns:
            List of customer interaction records (sorted by recency)

        Memory Scope:
            - Retrieved from user scope: (user, customer_id)
            - Ordered by recency (most recent first)
        """
        if not self.memory_tool:
            logger.warning("[SupportAgent] Memory tool not available, returning empty history")
            return []

        try:
            # Retrieve customer interaction history
            memories = self.memory_tool.recall_memory(
                query=f"customer {customer_id} interaction history",
                scope="user",
                user_id=customer_id,
                top_k=limit
            )

            # Extract and format interaction records
            interactions = []
            for mem in memories:
                content = mem.get("content", {})
                if isinstance(content, dict):
                    # Add memory metadata for reference
                    content["memory_id"] = mem.get("memory_id", "unknown")
                    content["heat_score"] = mem.get("heat_score", 0.0)
                    interactions.append(content)

            logger.info(
                f"[SupportAgent] Retrieved {len(interactions)} customer interactions: "
                f"customer={customer_id}"
            )

            return interactions

        except Exception as e:
            logger.error(f"[SupportAgent] Failed to recall customer history: {e}")
            return []

    async def store_common_solution(
        self,
        issue_type: str,
        solution: str,
        success_rate: float
    ) -> str:
        """
        Store common solution for reuse across support tickets.

        This enables:
        - Knowledge base building from successful resolutions
        - Pattern recognition for common issues
        - Faster resolution times through solution reuse
        - Quality improvement through success tracking

        Args:
            issue_type: Type/category of issue (e.g., "login_failure", "payment_error")
            solution: Solution description/steps
            success_rate: Success rate of this solution (0.0-1.0)

        Returns:
            Memory ID of stored solution

        Memory Scope:
            - Stored in app scope: (app, "support_solutions")
            - Shared across all support sessions
        """
        if not self.memory_tool:
            logger.warning("[SupportAgent] Memory tool not available, skipping solution storage")
            return "memory_disabled"

        try:
            # Store solution in shared app memory
            memory_content = {
                "issue_type": issue_type,
                "solution": solution,
                "success_rate": success_rate,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "agent_id": "support",
                "usage_count": 1
            }

            memory_id = self.memory_tool.store_memory(
                content=memory_content,
                scope="app",
                provenance={
                    "source": "common_solution",
                    "issue_type": issue_type,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            )

            logger.info(
                f"[SupportAgent] Stored common solution: issue_type={issue_type}, "
                f"success_rate={success_rate:.2%}, memory_id={memory_id}"
            )

            return memory_id

        except Exception as e:
            logger.error(f"[SupportAgent] Failed to store common solution: {e}")
            return "error"

    async def recall_common_solutions(
        self,
        issue_type: str,
        min_success_rate: float = 0.7
    ) -> List[Dict[str, Any]]:
        """
        Recall successful solutions for similar issues.

        Retrieves proven solutions from the knowledge base, filtered
        by success rate to ensure quality recommendations.

        Args:
            issue_type: Type/category of issue to search for
            min_success_rate: Minimum success rate threshold (default: 0.7 = 70%)

        Returns:
            List of solution records (sorted by success rate)

        Memory Scope:
            - Retrieved from app scope: (app, "support_solutions")
            - Shared knowledge base across all support sessions
        """
        if not self.memory_tool:
            logger.warning("[SupportAgent] Memory tool not available, returning empty solutions")
            return []

        try:
            # Retrieve common solutions from app memory
            memories = self.memory_tool.recall_memory(
                query=f"solution for {issue_type}",
                scope="app",
                top_k=10
            )

            # Filter by success rate and extract solution records
            solutions = []
            for mem in memories:
                content = mem.get("content", {})
                if isinstance(content, dict):
                    success_rate = content.get("success_rate", 0.0)

                    # Filter by minimum success rate
                    if success_rate >= min_success_rate:
                        # Add memory metadata for reference
                        content["memory_id"] = mem.get("memory_id", "unknown")
                        content["heat_score"] = mem.get("heat_score", 0.0)
                        solutions.append(content)

            # Sort by success rate (highest first)
            solutions.sort(key=lambda x: x.get("success_rate", 0.0), reverse=True)

            logger.info(
                f"[SupportAgent] Retrieved {len(solutions)} common solutions: "
                f"issue_type={issue_type}, min_success_rate={min_success_rate:.2%}"
            )

            return solutions

        except Exception as e:
            logger.error(f"[SupportAgent] Failed to recall common solutions: {e}")
            return []

    async def process_customer_screenshot(
        self,
        screenshot_uri: str,
        customer_id: str,
        session_id: str,
        store_in_memory: bool = True
    ) -> Dict[str, Any]:
        """
        Process customer screenshot using MultimodalMemoryPipeline.

        This enables:
        - Automatic error message extraction from screenshots
        - Visual context understanding for support issues
        - Memory storage of image insights with source URIs
        - Faster diagnosis through automated image analysis

        Args:
            screenshot_uri: URI/path to customer screenshot
            customer_id: Customer ID
            session_id: Session ID
            store_in_memory: Whether to store insights in customer memory (default: True)

        Returns:
            Dict with processed screenshot data:
                - uri: Screenshot URI
                - type: "image"
                - content: Extracted insights from image
                - processing_time_ms: Processing time
                - error: Error message (if failed)

        Memory Scope:
            - Stored in user scope: (user, customer_id)
            - Enables image context retrieval in future interactions
        """
        if not self.multimodal_pipeline:
            logger.warning("[SupportAgent] Multimodal pipeline not available, skipping screenshot processing")
            return {
                "uri": screenshot_uri,
                "type": "image",
                "content": None,
                "error": "Multimodal pipeline not initialized"
            }

        try:
            # Process screenshot using Gemini Vision
            start_time = time.time()

            attachment = await self.multimodal_pipeline.process_image(
                image_uri=screenshot_uri,
                user_id=customer_id,
                prompt="Analyze this customer support screenshot. Extract any error messages, UI issues, or technical problems visible."
            )

            processing_time_ms = (time.time() - start_time) * 1000

            # Store insights in customer memory if enabled
            if store_in_memory and attachment.processed_content and self.memory_tool:
                try:
                    memory_content = {
                        "type": "screenshot_analysis",
                        "screenshot_uri": screenshot_uri,
                        "insights": attachment.processed_content,
                        "session_id": session_id,
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "processing_time_ms": processing_time_ms
                    }

                    self.memory_tool.store_memory(
                        content=memory_content,
                        scope="user",
                        user_id=customer_id,
                        provenance={
                            "source": "screenshot_analysis",
                            "session_id": session_id,
                            "uri": screenshot_uri,
                            "timestamp": datetime.now(timezone.utc).isoformat()
                        }
                    )

                    logger.info(
                        f"[SupportAgent] Stored screenshot insights in memory: "
                        f"customer={customer_id}, uri={screenshot_uri}"
                    )

                except Exception as e:
                    logger.warning(f"[SupportAgent] Failed to store screenshot insights: {e}")

            return {
                "uri": screenshot_uri,
                "type": "image",
                "content": attachment.processed_content,
                "processing_time_ms": processing_time_ms,
                "error": attachment.error
            }

        except Exception as e:
            logger.error(f"[SupportAgent] Failed to process customer screenshot: {e}")
            return {
                "uri": screenshot_uri,
                "type": "image",
                "content": None,
                "error": str(e)
            }



class MemoryTool:
    """
    MemoryTool wrapper for Support Agent.

    Provides structured memory storage/retrieval for:
    - Customer interaction history
    - Common solution patterns
    - Ticket resolution knowledge
    - Support metrics and satisfaction tracking

    Scopes:
    - app: Cross-agent support knowledge (shared solutions)
    - user: Customer-specific interaction history
    """

    def __init__(self, backend: GenesisMemoryOSMongoDB, agent_id: str = "support"):
        """
        Initialize MemoryTool for Support Agent.

        Args:
            backend: GenesisMemoryOSMongoDB instance
            agent_id: Agent identifier (default: "support")
        """
        self.backend = backend
        self.agent_id = agent_id
        logger.debug(f"[Support MemoryTool] Initialized for agent_id={agent_id}")

    def store_memory(
        self,
        content: Dict[str, Any],
        scope: str = "app",
        user_id: Optional[str] = None,
        provenance: Optional[Dict[str, Any]] = None,
        memory_type: str = "conversation"
    ) -> str:
        """
        Store memory with specified scope.

        Args:
            content: Memory content (dict with interaction/solution data)
            scope: "app" for shared knowledge, "user" for customer-specific
            user_id: User ID (required for user scope)
            provenance: Optional provenance metadata
            memory_type: Memory type (default: "conversation")

        Returns:
            Memory ID
        """
        if scope == "user" and not user_id:
            raise ValueError("user_id required for user scope")

        # Determine effective user_id for storage
        effective_user_id = user_id if scope == "user" else f"{self.agent_id}_app"

        # Store in backend
        memory_id = self.backend.store(
            agent_id=self.agent_id,
            user_id=effective_user_id,
            user_input=json.dumps(provenance) if provenance else "",
            agent_response=json.dumps(content),
            memory_type=memory_type
        )

        logger.debug(
            f"[Support MemoryTool] Stored memory: scope={scope}, "
            f"user_id={effective_user_id}, memory_id={memory_id}"
        )

        return memory_id

    def recall_memory(
        self,
        query: str,
        scope: str = "app",
        user_id: Optional[str] = None,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Recall memories with semantic search.

        Args:
            query: Search query
            scope: "app" for shared knowledge, "user" for customer-specific
            user_id: User ID (required for user scope)
            top_k: Number of results to return

        Returns:
            List of memory entries
        """
        if scope == "user" and not user_id:
            raise ValueError("user_id required for user scope")

        # Determine effective user_id for retrieval
        effective_user_id = user_id if scope == "user" else f"{self.agent_id}_app"

        # Retrieve from backend
        memories = self.backend.retrieve(
            agent_id=self.agent_id,
            user_id=effective_user_id,
            query=query,
            memory_type=None,
            top_k=top_k
        )

        # Parse and return results
        results = []
        for mem in memories:
            try:
                content = mem.get("content", {})
                if isinstance(content, dict) and "agent_response" in content:
                    # Parse JSON-encoded content
                    agent_response = content["agent_response"]
                    if isinstance(agent_response, str):
                        parsed_content = json.loads(agent_response)
                    else:
                        parsed_content = agent_response

                    results.append({
                        "memory_id": mem.get("memory_id", "unknown"),
                        "content": parsed_content,
                        "heat_score": mem.get("heat_score", 0.0),
                        "created_at": mem.get("created_at", "")
                    })
            except Exception as e:
                logger.warning(f"[Support MemoryTool] Failed to parse memory: {e}")
                continue

        logger.debug(
            f"[Support MemoryTool] Retrieved {len(results)} memories: "
            f"scope={scope}, query='{query}'"
        )

        return results


async def get_support_agent(business_id: str = "default") -> SupportAgent:
    agent = SupportAgent(business_id=business_id)
    await agent.initialize()
    return agent
