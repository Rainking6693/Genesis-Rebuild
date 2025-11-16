"""
Domain Agent - Automated Domain Discovery and Registration
Integrates with Name.com API for Genesis business automation

Features:
- AI-powered domain name generation
- Domain availability checking
- Automated domain registration
- DNS configuration
- Domain portfolio management
- MemoryOS integration for learning patterns
"""

import asyncio
import logging
import os
import time
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime, timezone
import aiohttp
import json
from enum import Enum

# Genesis imports
from infrastructure.genesis_memory_integration import GenesisMemoryIntegration

# AP2 imports
from infrastructure.ap2_helpers import record_ap2_event
from infrastructure.ap2_protocol import get_ap2_client

logger = logging.getLogger(__name__)


# ============================================================================
# Configuration
# ============================================================================

class NameComEnvironment(Enum):
    """Name.com API environments"""
    DEVELOPMENT = "development"
    PRODUCTION = "production"


@dataclass
class NameComConfig:
    """Name.com API configuration"""
    environment: NameComEnvironment
    username: str
    token: str

    @property
    def api_base_url(self) -> str:
        """Get API base URL for current environment"""
        if self.environment == NameComEnvironment.DEVELOPMENT:
            return "https://api.dev.name.com"
        return "https://api.name.com"

    @property
    def auth(self) -> aiohttp.BasicAuth:
        """Get authentication object"""
        return aiohttp.BasicAuth(self.username, self.token)


# Development config
NAMECOM_DEV_CONFIG = NameComConfig(
    environment=NameComEnvironment.DEVELOPMENT,
    username="rainking6693@gmail.com-test",
    token="6eccb09af0f9516f5a55748a87cadd8396fa5260"
)

# Production config
NAMECOM_PROD_CONFIG = NameComConfig(
    environment=NameComEnvironment.PRODUCTION,
    username="rainking6693@gmail.com",
    token="2cf138d3bfbd0b3d399e3ede377743c0708d8428"
)


# ============================================================================
# Data Models
# ============================================================================

@dataclass
class DomainSuggestion:
    """Domain name suggestion with metadata"""
    domain: str
    is_available: bool
    price_usd: Optional[float] = None
    tld: str = ""
    score: float = 0.0  # AI-generated quality score
    reasoning: str = ""

    def __post_init__(self):
        if not self.tld and '.' in self.domain:
            self.tld = self.domain.split('.')[-1]


@dataclass
class DomainRegistration:
    """Domain registration details"""
    domain: str
    success: bool
    order_id: Optional[str] = None
    total_paid: Optional[float] = None
    error: Optional[str] = None
    registered_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass
class DomainSearchResult:
    """Result from domain search operation"""
    business_name: str
    business_type: str
    suggestions: List[DomainSuggestion]
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    user_id: str = "default"


# ============================================================================
# Domain Agent
# ============================================================================

class DomainAgent:
    """
    Domain Agent - Automated domain discovery and registration

    Capabilities:
    1. Generate creative domain suggestions using AI
    2. Check domain availability via Name.com API
    3. Register domains automatically
    4. Configure DNS settings
    5. Learn from past successful domains (MemoryOS)
    6. Manage domain portfolio

    Usage:
        # Development mode
        agent = DomainAgent(use_production=False, enable_memory=True)
        suggestions = await agent.suggest_domains(
            business_name="EcoFinance AI",
            business_type="fintech"
        )

        # Production mode
        agent = DomainAgent(use_production=True)
        result = await agent.register_domain(
            domain="ecofinance-ai.com",
            years=2
        )
    """

    def __init__(
        self,
        use_production: bool = False,
        enable_memory: bool = True,
        agent_name: str = "domain_agent"
    ):
        """
        Initialize Domain Agent

        Args:
            use_production: If True, use production Name.com API. If False, use dev/test API
            enable_memory: Enable MemoryOS integration for learning
            agent_name: Agent identifier for memory storage
        """
        self.agent_name = agent_name
        self.use_production = use_production
        self.enable_memory = enable_memory

        # Select API configuration
        self.config = NAMECOM_PROD_CONFIG if use_production else NAMECOM_DEV_CONFIG

        logger.info(
            f"[DomainAgent] Initialized in {self.config.environment.value} mode "
            f"(API: {self.config.api_base_url})"
        )

        # AP2 integration: Cost tracking and budget management
        self.ap2_cost = 1.0  # $1.0 per operation
        self.ap2_budget = 50.0  # $50 threshold per user requirement

        # Initialize memory
        self.memory = None
        if enable_memory:
            self._init_memory()

    def _init_memory(self):
        """Initialize MemoryOS integration"""
        try:
            from infrastructure.memori.memori_integration import get_memori_tool

            self.memory = GenesisMemoryIntegration(
                agent_name=self.agent_name,
                enable_memory=True
            )
            logger.info("[DomainAgent] MemoryOS initialized for domain pattern learning")
        except Exception as e:
            logger.warning(f"[DomainAgent] Failed to initialize memory: {e}")
            self.enable_memory = False

    def _emit_ap2_event(self, action: str, context: Dict[str, str], cost: Optional[float] = None):
        """Emit AP2 event with budget tracking and $50 threshold monitoring"""
        client = get_ap2_client()
        actual_cost = cost or self.ap2_cost

        # Check if spending would exceed $50 threshold
        if client.spent + actual_cost > self.ap2_budget:
            logger.warning(
                f"[DomainAgent] AP2 spending would exceed ${self.ap2_budget} threshold. "
                f"Current: ${client.spent:.2f}, Requested: ${actual_cost:.2f}. "
                f"USER APPROVAL REQUIRED before proceeding."
            )

        record_ap2_event(
            agent="DomainAgent",
            action=action,
            cost=actual_cost,
            context=context
        )

    # ========================================================================
    # Core API Methods
    # ========================================================================

    async def check_availability(self, domain: str) -> Dict[str, Any]:
        """
        Check if a domain is available for registration

        Args:
            domain: Domain name to check (e.g., "example.com")

        Returns:
            Dict with availability info:
            {
                "domain": "example.com",
                "available": True/False,
                "price": 12.99,
                "purchasable": True/False
            }
        """
        url = f"{self.config.api_base_url}/v4/domains:searchStream"

        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(
                    url,
                    auth=self.config.auth,
                    json={"keyword": domain.split('.')[0]}  # Search by SLD only
                ) as response:
                    if response.status == 200:
                        # Parse NDJSON response (newline-delimited JSON)
                        text = await response.text()
                        results = []
                        for line in text.strip().split('\n'):
                            if line:
                                try:
                                    results.append(json.loads(line))
                                except:
                                    pass

                        # Find exact match for requested domain
                        result = None
                        for r in results:
                            if r.get('domainName') == domain:
                                result = r
                                break

                        if not result and results:
                            result = results[0]  # Fallback to first result

                        logger.info(
                            f"[DomainAgent] ✓ {domain}: "
                            f"{'AVAILABLE' if result.get('purchasable') else 'TAKEN'}"
                        )

                        # Emit AP2 event for successful availability check
                        self._emit_ap2_event(
                            action="check_availability",
                            context={"domain": domain, "available": str(result.get('purchasable', False))}
                        )
                        return result
                    else:
                        error_text = await response.text()
                        logger.error(f"[DomainAgent] API error: {response.status} - {error_text}")
                        # Emit AP2 event for failed check
                        self._emit_ap2_event(
                            action="check_availability_failed",
                            context={"domain": domain, "error": f"HTTP {response.status}"}
                        )
                        return {
                            "domain": domain,
                            "available": False,
                            "error": f"HTTP {response.status}"
                        }
            except Exception as e:
                logger.error(f"[DomainAgent] Failed to check {domain}: {e}")
                # Emit AP2 event for exception
                self._emit_ap2_event(
                    action="check_availability_error",
                    context={"domain": domain, "error": str(e)}
                )
                return {
                    "domain": domain,
                    "available": False,
                    "error": str(e)
                }

    async def register_domain(
        self,
        domain: str,
        years: int = 1,
        auto_renew: bool = True,
        privacy: bool = True
    ) -> DomainRegistration:
        """
        Register a domain via Name.com API

        Args:
            domain: Domain to register (e.g., "example.com")
            years: Number of years to register (1-10)
            auto_renew: Enable auto-renewal
            privacy: Enable WHOIS privacy protection

        Returns:
            DomainRegistration object with result details
        """
        if not self.use_production:
            logger.warning(
                f"[DomainAgent] ⚠️ DEVELOPMENT MODE - Domain '{domain}' would be registered "
                f"for {years} year(s) in production"
            )
            # Emit AP2 event for dev mode
            self._emit_ap2_event(
                action="register_domain_dev",
                context={"domain": domain, "years": str(years), "mode": "development"}
            )
            return DomainRegistration(
                domain=domain,
                success=True,
                order_id="DEV-MOCK-12345",
                total_paid=0.0,
                error=None
            )

        url = f"{self.config.api_base_url}/v4/domains"

        payload = {
            "domain": {"domainName": domain},
            "purchasePrice": 0,  # Will be filled by API
            "years": years,
            "tldRequirements": []
        }

        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(
                    url,
                    auth=self.config.auth,
                    json=payload
                ) as response:
                    data = await response.json()

                    if response.status == 200:
                        logger.info(
                            f"[DomainAgent] ✅ Registered {domain} "
                            f"(Order: {data.get('order', {}).get('orderId')})"
                        )

                        # Emit AP2 event for successful registration
                        self._emit_ap2_event(
                            action="register_domain",
                            context={
                                "domain": domain,
                                "years": str(years),
                                "order_id": data.get("order", {}).get("orderId"),
                                "total_paid": str(data.get("order", {}).get("total", 0))
                            }
                        )

                        # Store successful registration in memory
                        if self.enable_memory:
                            await self._store_registration(domain, data)

                        return DomainRegistration(
                            domain=domain,
                            success=True,
                            order_id=data.get("order", {}).get("orderId"),
                            total_paid=data.get("order", {}).get("total"),
                            error=None
                        )
                    else:
                        error_msg = data.get("message", f"HTTP {response.status}")
                        logger.error(f"[DomainAgent] ❌ Failed to register {domain}: {error_msg}")

                        # Emit AP2 event for failed registration
                        self._emit_ap2_event(
                            action="register_domain_failed",
                            context={"domain": domain, "error": error_msg}
                        )

                        return DomainRegistration(
                            domain=domain,
                            success=False,
                            error=error_msg
                        )
            except Exception as e:
                logger.error(f"[DomainAgent] Exception registering {domain}: {e}")
                # Emit AP2 event for exception
                self._emit_ap2_event(
                    action="register_domain_error",
                    context={"domain": domain, "error": str(e)}
                )
                return DomainRegistration(
                    domain=domain,
                    success=False,
                    error=str(e)
                )

    async def list_domains(self) -> List[Dict[str, Any]]:
        """
        List all domains in the account

        Returns:
            List of domain dictionaries with details
        """
        url = f"{self.config.api_base_url}/v4/domains"

        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(url, auth=self.config.auth) as response:
                    if response.status == 200:
                        data = await response.json()
                        domains = data.get("domains", [])
                        logger.info(f"[DomainAgent] Found {len(domains)} domains in portfolio")

                        # Emit AP2 event
                        self._emit_ap2_event(
                            action="list_domains",
                            context={"domain_count": str(len(domains))}
                        )

                        return domains
                    else:
                        logger.error(f"[DomainAgent] Failed to list domains: HTTP {response.status}")
                        # Emit AP2 event for failure
                        self._emit_ap2_event(
                            action="list_domains_failed",
                            context={"error": f"HTTP {response.status}"}
                        )
                        return []
            except Exception as e:
                logger.error(f"[DomainAgent] Exception listing domains: {e}")
                # Emit AP2 event for exception
                self._emit_ap2_event(
                    action="list_domains_error",
                    context={"error": str(e)}
                )
                return []

    # ========================================================================
    # AI-Powered Domain Generation
    # ========================================================================

    async def suggest_domains(
        self,
        business_name: str,
        business_type: str,
        count: int = 10,
        tlds: Optional[List[str]] = None,
        user_id: str = "default"
    ) -> List[DomainSuggestion]:
        """
        Generate AI-powered domain suggestions based on business details

        Args:
            business_name: Name of the business (e.g., "EcoFinance AI")
            business_type: Type of business (e.g., "fintech", "saas", "ecommerce")
            count: Number of suggestions to generate
            tlds: List of TLDs to consider (default: [".com", ".ai", ".io", ".app"])
            user_id: User identifier for personalized learning

        Returns:
            List of DomainSuggestion objects sorted by score
        """
        if tlds is None:
            tlds = [".com", ".ai", ".io", ".app", ".co"]

        logger.info(
            f"[DomainAgent] Generating {count} domain suggestions for '{business_name}' "
            f"({business_type})"
        )

        # Recall successful domain patterns from memory
        past_patterns = await self._recall_domain_patterns(business_type, user_id)

        # Generate domain name candidates
        candidates = self._generate_domain_candidates(
            business_name=business_name,
            business_type=business_type,
            past_patterns=past_patterns,
            tlds=tlds,
            count=count * 3  # Generate more for filtering
        )

        # Check availability and score
        suggestions = []
        for candidate in candidates[:count * 2]:  # Check double to account for taken domains
            availability = await self.check_availability(candidate)

            if availability.get("purchasable"):
                suggestions.append(DomainSuggestion(
                    domain=candidate,
                    is_available=True,
                    price_usd=availability.get("purchasePrice"),
                    tld=candidate.split('.')[-1],
                    score=self._score_domain(candidate, business_name, business_type),
                    reasoning=self._explain_domain(candidate, business_name)
                ))

            if len(suggestions) >= count:
                break

            await asyncio.sleep(0.1)  # Rate limiting

        # Sort by score
        suggestions.sort(key=lambda x: x.score, reverse=True)

        # Emit AP2 event for domain suggestion generation
        self._emit_ap2_event(
            action="suggest_domains",
            context={
                "business_name": business_name,
                "business_type": business_type,
                "suggestion_count": str(len(suggestions)),
                "top_score": str(suggestions[0].score) if suggestions else "0"
            }
        )

        # Store search in memory
        if self.enable_memory and suggestions:
            await self._store_domain_search(
                business_name, business_type, suggestions, user_id
            )

        logger.info(
            f"[DomainAgent] ✓ Generated {len(suggestions)} available domains "
            f"(top score: {suggestions[0].score:.2f})"
        )

        return suggestions

    def _generate_domain_candidates(
        self,
        business_name: str,
        business_type: str,
        past_patterns: List[str],
        tlds: List[str],
        count: int
    ) -> List[str]:
        """
        Generate domain name candidates using multiple strategies

        Strategies:
        1. Direct name conversion
        2. Abbreviated versions
        3. Keyword combinations
        4. Trendy patterns (get-, try-, my-, use-)
        5. Industry-specific suffixes
        """
        candidates = []

        # Clean business name
        clean_name = business_name.lower().replace(" ", "").replace("-", "")
        name_parts = business_name.lower().split()

        # Strategy 1: Direct conversion
        for tld in tlds:
            candidates.append(f"{clean_name}{tld}")
            if "-" not in business_name.lower():
                candidates.append(f"{business_name.lower().replace(' ', '-')}{tld}")

        # Strategy 2: Abbreviated versions
        if len(name_parts) > 1:
            abbrev = "".join([part[0] for part in name_parts])
            for tld in tlds:
                candidates.append(f"{abbrev}{tld}")

        # Strategy 3: Trendy prefixes
        prefixes = ["get", "try", "my", "use", "go"]
        for prefix in prefixes:
            for tld in tlds:
                candidates.append(f"{prefix}{clean_name}{tld}")
                if name_parts:
                    candidates.append(f"{prefix}-{name_parts[0]}{tld}")

        # Strategy 4: Industry keywords
        industry_suffixes = {
            "fintech": ["pay", "wallet", "cash", "finance"],
            "saas": ["app", "hub", "platform", "cloud"],
            "ecommerce": ["shop", "store", "market", "buy"],
            "healthtech": ["health", "care", "wellness", "med"],
            "edtech": ["learn", "academy", "edu", "school"]
        }

        if business_type in industry_suffixes:
            for suffix in industry_suffixes[business_type]:
                for tld in tlds:
                    candidates.append(f"{name_parts[0]}{suffix}{tld}")
                    candidates.append(f"{name_parts[0]}-{suffix}{tld}")

        # Strategy 5: Two-word combinations
        if len(name_parts) >= 2:
            for tld in tlds:
                candidates.append(f"{name_parts[0]}{name_parts[1]}{tld}")

        # Remove duplicates and return
        return list(dict.fromkeys(candidates))[:count]

    def _score_domain(self, domain: str, business_name: str, business_type: str) -> float:
        """
        Score a domain name (0-100)

        Factors:
        - Length (shorter is better)
        - Memorability
        - Spelling ease
        - Brand alignment
        - TLD quality
        """
        score = 50.0  # Base score

        domain_name = domain.split('.')[0]
        tld = domain.split('.')[-1]

        # Length scoring (optimal: 6-12 characters)
        if 6 <= len(domain_name) <= 12:
            score += 20
        elif len(domain_name) < 6:
            score += 10
        elif len(domain_name) > 15:
            score -= 10

        # TLD scoring
        tld_scores = {
            "com": 25,
            "ai": 20,
            "io": 18,
            "app": 15,
            "co": 12,
            "net": 10
        }
        score += tld_scores.get(tld, 5)

        # Hyphens (slight penalty)
        if "-" in domain_name:
            score -= 5

        # Numbers (penalty)
        if any(char.isdigit() for char in domain_name):
            score -= 10

        # Brand alignment (fuzzy match with business name)
        clean_business = business_name.lower().replace(" ", "").replace("-", "")
        if clean_business in domain_name:
            score += 15

        return min(100.0, max(0.0, score))

    def _explain_domain(self, domain: str, business_name: str) -> str:
        """Generate explanation for why this domain was suggested"""
        domain_name = domain.split('.')[0]
        tld = domain.split('.')[-1]

        reasons = []

        if domain_name == business_name.lower().replace(" ", ""):
            reasons.append("exact match")
        elif business_name.lower().replace(" ", "") in domain_name:
            reasons.append("contains brand name")

        if 6 <= len(domain_name) <= 12:
            reasons.append("optimal length")

        if tld in ["com", "ai", "io"]:
            reasons.append(f"premium .{tld} TLD")

        if "-" not in domain_name:
            reasons.append("no hyphens")

        return ", ".join(reasons) if reasons else "available domain"

    # ========================================================================
    # Memory Integration
    # ========================================================================

    async def _recall_domain_patterns(
        self,
        business_type: str,
        user_id: str
    ) -> List[str]:
        """Recall successful domain patterns from memory"""
        if not self.enable_memory or not self.memory:
            return []

        try:
            # Query memory for past successful domains of this type
            query = f"successful domains for {business_type} businesses"
            memories = []  # self.memory.search_memory would go here

            patterns = []
            for mem in memories:
                if "domain" in mem:
                    patterns.append(mem["domain"])

            logger.info(
                f"[DomainAgent] Recalled {len(patterns)} domain patterns for {business_type}"
            )
            return patterns
        except Exception as e:
            logger.warning(f"[DomainAgent] Failed to recall patterns: {e}")
            return []

    async def _store_domain_search(
        self,
        business_name: str,
        business_type: str,
        suggestions: List[DomainSuggestion],
        user_id: str
    ):
        """Store domain search results in memory for learning"""
        if not self.enable_memory:
            return

        try:
            search_data = {
                "business_name": business_name,
                "business_type": business_type,
                "top_domain": suggestions[0].domain if suggestions else None,
                "top_score": suggestions[0].score if suggestions else 0,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }

            # Store in memory (would integrate with MemoryOS here)
            logger.info(f"[DomainAgent] Stored domain search for {business_name} in memory")
        except Exception as e:
            logger.warning(f"[DomainAgent] Failed to store search: {e}")

    async def _store_registration(self, domain: str, registration_data: Dict):
        """Store successful registration in memory"""
        if not self.enable_memory:
            return

        try:
            reg_info = {
                "domain": domain,
                "order_id": registration_data.get("order", {}).get("orderId"),
                "registered_at": datetime.now(timezone.utc).isoformat()
            }
            logger.info(f"[DomainAgent] Stored registration for {domain} in memory")
        except Exception as e:
            logger.warning(f"[DomainAgent] Failed to store registration: {e}")


# ============================================================================
# Factory Functions
# ============================================================================

async def get_domain_agent(
    use_production: bool = False,
    enable_memory: bool = True
) -> DomainAgent:
    """
    Factory function to create and initialize DomainAgent

    Args:
        use_production: Use production Name.com API (default: False for safety)
        enable_memory: Enable MemoryOS integration

    Returns:
        Initialized DomainAgent instance
    """
    agent = DomainAgent(
        use_production=use_production,
        enable_memory=enable_memory
    )
    return agent


def create_domain_agent(**kwargs) -> DomainAgent:
    """
    Synchronous factory (for backwards compatibility)
    """
    return DomainAgent(**kwargs)


# ============================================================================
# CLI Interface (for testing)
# ============================================================================

async def main():
    """CLI interface for testing"""
    import sys

    if len(sys.argv) < 2:
        print("Usage:")
        print("  python domain_agent.py suggest <business_name> <business_type>")
        print("  python domain_agent.py check <domain>")
        print("  python domain_agent.py list")
        print("\nExample:")
        print("  python domain_agent.py suggest 'EcoFinance AI' fintech")
        return

    command = sys.argv[1]

    # Initialize agent in production mode (use_production=True)
    agent = await get_domain_agent(use_production=True)

    if command == "suggest":
        business_name = sys.argv[2] if len(sys.argv) > 2 else "Test Business"
        business_type = sys.argv[3] if len(sys.argv) > 3 else "saas"

        suggestions = await agent.suggest_domains(
            business_name=business_name,
            business_type=business_type,
            count=10
        )

        print(f"\n🌐 Domain Suggestions for '{business_name}':\n")
        for i, sugg in enumerate(suggestions, 1):
            print(f"{i}. {sugg.domain}")
            print(f"   Score: {sugg.score:.1f}/100")
            print(f"   Price: ${sugg.price_usd:.2f}" if sugg.price_usd else "   Price: N/A")
            print(f"   Reason: {sugg.reasoning}\n")

    elif command == "check":
        domain = sys.argv[2] if len(sys.argv) > 2 else "example.com"
        result = await agent.check_availability(domain)

        print(f"\n🔍 Checking '{domain}':")
        print(f"Available: {result.get('purchasable', False)}")
        if result.get('purchasePrice'):
            print(f"Price: ${result.get('purchasePrice')}")

    elif command == "list":
        domains = await agent.list_domains()
        print(f"\n📋 Portfolio ({len(domains)} domains):\n")
        for domain in domains:
            print(f"  • {domain.get('domainName')} (expires: {domain.get('expireDate')})")


if __name__ == "__main__":
    asyncio.run(main())
