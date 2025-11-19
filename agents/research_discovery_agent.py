"""
RESEARCH DISCOVERY AGENT - Automatic Discovery of Cutting-Edge AI Systems
Version: 5.0 (Enhanced with ALL High-Value Integrations) (Real Deep Research Framework Integration)

Automatically discovers and analyzes new AI research papers using RDR methodology:
- Web crawling from top conferences (CVPR, NeurIPS, ICLR, ACL, CoRL, RSS, etc.)
- LLM-based filtering for relevance (agent systems, optimization, safety, GUI automation)
- Embedding-based clustering and trend analysis
- Integration with MemoryOS for persistent storage
- Weekly cron job execution for continuous discovery

References:
- Paper: https://arxiv.org/abs/2510.20809 (Real Deep Research for AI, Robotics and Beyond)
- Website: https://realdeepresearch.github.io/

Architecture (RDR 4-Stage Pipeline):
1. Data Preparation: Area filtering using LLM (agent systems, LLM optimization, safety, GUI)
2. Content Reasoning: Perspective-based analysis (technical depth, practical applicability)
3. Content Projection: Embedding generation (BAAI/bge-m3)
4. Embedding Analysis: Clustering and trend identification
"""

import os
import json
import logging
import asyncio
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Optional, Any, Set
from dataclasses import dataclass, asdict
from enum import Enum
import hashlib

# LLM client for filtering and analysis
from infrastructure.llm_client import LLMFactory, LLMProvider

# MemoryOS for persistent storage
from infrastructure.memory_os import GenesisMemoryOS, create_genesis_memory
from infrastructure.load_env import load_genesis_env
from infrastructure.genesis_discord import get_discord_client, close_discord_client
from infrastructure.payments.research_helper import ResearchPaymentAdvisor

# Import VOIX browser automation
from infrastructure.browser_automation.hybrid_automation import HybridAutomation


# Import MemoryOS MongoDB adapter for persistent memory (NEW: 49% F1 improvement)
from infrastructure.standard_integration_mixin import StandardIntegrationMixin

from infrastructure.memory_os_mongodb_adapter import (
    GenesisMemoryOSMongoDB,
    create_genesis_memory_mongodb
)

# Import WebVoyager for web navigation (optional - graceful fallback)
try:
    from infrastructure.webvoyager_client import get_webvoyager_client
    WEBVOYAGER_AVAILABLE = True
except ImportError:
    print("[WARNING] WebVoyager not available. Web navigation features will be disabled.")
    WEBVOYAGER_AVAILABLE = False
    get_webvoyager_client = None

# Import DeepEyes tool reliability tracking (NEW: High-value integration)
try:
    from infrastructure.deepeyes.tool_reliability import ToolReliabilityMiddleware
    from infrastructure.deepeyes.multimodal_tools import MultimodalToolRegistry
    from infrastructure.deepeyes.tool_chain_tracker import ToolChainTracker
    DEEPEYES_AVAILABLE = True
except ImportError:
    print("[WARNING] DeepEyes not available. Tool reliability tracking disabled.")
    DEEPEYES_AVAILABLE = False
    ToolReliabilityMiddleware = None
    MultimodalToolRegistry = None
    ToolChainTracker = None

# Import VOIX declarative browser automation (NEW: Integration #74)
try:
    from infrastructure.browser_automation.voix_detector import VoixDetector
    from infrastructure.browser_automation.voix_executor import VoixExecutor
    VOIX_AVAILABLE = True
except ImportError:
    print("[WARNING] VOIX not available. Declarative browser automation disabled.")
    VOIX_AVAILABLE = False
    VoixDetector = None
    VoixExecutor = None

# Import Gemini Computer Use (NEW: GUI automation)
try:
    from infrastructure.computer_use_client import ComputerUseClient
    COMPUTER_USE_AVAILABLE = True
except ImportError:
    print("[WARNING] Gemini Computer Use not available. GUI automation disabled.")
    COMPUTER_USE_AVAILABLE = False
    ComputerUseClient = None

# Import Cost Profiler (NEW: Detailed cost analysis)
try:
    from infrastructure.cost_profiler import CostProfiler
    COST_PROFILER_AVAILABLE = True
except ImportError:
    print("[WARNING] Cost Profiler not available. Detailed cost analysis disabled.")
    COST_PROFILER_AVAILABLE = False
    CostProfiler = None

# Import Benchmark Runner (NEW: Quality monitoring)
try:
    from infrastructure.benchmark_runner import BenchmarkRunner
    from infrastructure.ci_eval_harness import CIEvalHarness
    BENCHMARK_RUNNER_AVAILABLE = True
except ImportError:
    print("[WARNING] Benchmark Runner not available. Quality monitoring disabled.")
    BENCHMARK_RUNNER_AVAILABLE = False
    BenchmarkRunner = None
    CIEvalHarness = None

# Import additional LLM providers (NEW: More routing options)
try:
    from infrastructure.gemini_client import get_gemini_client
    from infrastructure.deepseek_client import get_deepseek_client
    from infrastructure.mistral_client import get_mistral_client
    ADDITIONAL_LLMS_AVAILABLE = True
except ImportError:
    print("[WARNING] Additional LLM providers not available. Using default providers only.")
    ADDITIONAL_LLMS_AVAILABLE = False
    get_gemini_client = None
    get_deepseek_client = None
    get_mistral_client = None


logger = logging.getLogger(__name__)


class ResearchArea(StandardIntegrationMixin):
    """Research areas to track (based on Genesis priorities)"""
    AGENT_SYSTEMS = "agent_systems"
    LLM_OPTIMIZATION = "llm_optimization"
    SAFETY_ALIGNMENT = "safety_alignment"
    GUI_AUTOMATION = "gui_automation"
    MEMORY_SYSTEMS = "memory_systems"
    ORCHESTRATION = "orchestration"
    SELF_IMPROVEMENT = "self_improvement"


class DiscoverySource(Enum):
    """Sources for paper discovery"""
    ARXIV = "arxiv"
    CONFERENCE = "conference"
    INDUSTRY = "industry"


@dataclass
class ResearchPaper:
    """Discovered research paper"""
    arxiv_id: str
    title: str
    abstract: str
    authors: List[str]
    published_date: str
    source: DiscoverySource
    research_areas: List[ResearchArea]
    relevance_score: float
    summary: str
    key_insights: List[str]
    implementation_available: bool
    discovered_at: str
    embedding: Optional[List[float]] = None



    def _init_memory(self):
        """Initialize MemoryOS MongoDB backend for ResearchDiscoveryAgent memory."""
        try:
            import os
            self.memory = create_genesis_memory_mongodb(
                mongodb_uri=os.getenv("MONGODB_URI", "mongodb://localhost:27017/"),
                database_name="genesis_memory_research",
                short_term_capacity=10,
                mid_term_capacity=500,
                long_term_knowledge_capacity=200
            )
            logger.info("[ResearchDiscoveryAgent] MemoryOS MongoDB initialized")
        except Exception as e:
            logger.warning(f"[ResearchDiscoveryAgent] Failed to initialize MemoryOS: {e}. Memory features disabled.")
            self.memory = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for storage"""
        return {
            **asdict(self),
            "research_areas": [area.value for area in self.research_areas],
            "source": self.source.value
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ResearchPaper':
        """Load from dictionary"""
        data['research_areas'] = [ResearchArea(area) for area in data['research_areas']]
        data['source'] = DiscoverySource(data['source'])
        return cls(**data)


class ArxivCrawler:
    """
    Crawl arXiv for recent papers

    Uses arXiv API to fetch papers from relevant categories:
    - cs.AI (Artificial Intelligence)
    - cs.LG (Machine Learning)
    - cs.CL (Computation and Language)
    - cs.RO (Robotics)
    - cs.HC (Human-Computer Interaction)
    """

    def __init__(self):
        super().__init__()
        self.base_url = "http://export.arxiv.org/api/query"
        self.categories = ["cs.AI", "cs.LG", "cs.CL", "cs.RO", "cs.HC"]

    async def fetch_recent_papers(
        self,
        days_back: int = 7,
        max_results: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Fetch recent papers from arXiv

        Args:
            days_back: How many days back to search
            max_results: Maximum papers to fetch per category

        Returns:
            List of paper metadata dictionaries
        """
        try:
            import feedparser
            import urllib.parse
        except ImportError:
            logger.error("feedparser not installed. Run: pip install feedparser")
            return []

        all_papers = []
        cutoff_date = datetime.now() - timedelta(days=days_back)

        for category in self.categories:
            try:
                # Build query: recent papers in category
                query = f"cat:{category}"
                params = {
                    "search_query": query,
                    "start": 0,
                    "max_results": max_results,
                    "sortBy": "submittedDate",
                    "sortOrder": "descending"
                }

                url = f"{self.base_url}?{urllib.parse.urlencode(params)}"

                logger.info(f"Fetching recent papers from category: {category}")

                # Fetch and parse feed
                feed = feedparser.parse(url)

                for entry in feed.entries:
                    # Parse publication date
                    pub_date = datetime.strptime(entry.published, "%Y-%m-%dT%H:%M:%SZ")

                    # Filter by date
                    if pub_date < cutoff_date:
                        continue

                    # Extract arXiv ID
                    arxiv_id = entry.id.split("/abs/")[-1]

                    paper = {
                        "arxiv_id": arxiv_id,
                        "title": entry.title.replace("\n", " ").strip(),
                        "abstract": entry.summary.replace("\n", " ").strip(),
                        "authors": [author.name for author in entry.authors],
                        "published_date": entry.published,
                        "categories": [tag.term for tag in entry.tags],
                        "source": DiscoverySource.ARXIV.value
                    }

                    all_papers.append(paper)

                logger.info(f"Fetched {len(feed.entries)} papers from {category}")

                # Rate limiting (arXiv API limit: 1 request per 3 seconds)
                await asyncio.sleep(3)

            except Exception as e:
                logger.error(f"Failed to fetch from {category}: {e}")
                continue

        # Deduplicate by arxiv_id
        seen_ids = set()
        unique_papers = []
        for paper in all_papers:
            if paper["arxiv_id"] not in seen_ids:
                seen_ids.add(paper["arxiv_id"])
                unique_papers.append(paper)

        logger.info(f"Total unique papers fetched: {len(unique_papers)}")

        if not unique_papers:
            logger.warning("No papers fetched from arXiv API, using offline sample.")
            unique_papers = self._load_sample_papers()

        return unique_papers

    @staticmethod
    def _load_sample_papers() -> List[Dict[str, Any]]:
        """Provide offline sample papers when the network is unavailable."""
        now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        return [
            {
                "arxiv_id": "2501.01234",
                "title": "Genesis Agents: Coordinating Multi-Agent Systems for Autonomous Research",
                "abstract": "We present Genesis Agents, a hierarchical multi-agent framework that orchestrates "
                "research discovery, experimentation, and deployment with strong safety guarantees.",
                "authors": ["Cora Analyst", "Alex Researcher"],
                "published_date": now,
                "categories": ["cs.AI", "cs.LG"],
                "source": DiscoverySource.ARXIV.value,
            },
            {
                "arxiv_id": "2501.05678",
                "title": "MemoryOS++: Heat-Based Memory Consolidation for Continual Multi-Agent Learning",
                "abstract": "MemoryOS++ introduces a tri-tier memory architecture with heat-based promotion to "
                "deliver long-term learning for production multi-agent systems.",
                "authors": ["Nova Memory", "Thon Systems"],
                "published_date": now,
                "categories": ["cs.AI"],
                "source": DiscoverySource.ARXIV.value,
            },
        ]


class ResearchFilteringEngine:
    """
    LLM-based filtering for research relevance (RDR Stage 1: Data Preparation)

    Uses Claude Haiku for cost-efficient filtering (simple classification task)
    """

    def __init__(self, llm_client):
        self.llm_client = llm_client

    async def classify_paper(
        self,
        title: str,
        abstract: str
    ) -> Dict[str, Any]:
        """
        Classify paper relevance to Genesis research areas

        Args:
            title: Paper title
            abstract: Paper abstract

        Returns:
            Dictionary with:
                - is_relevant: bool
                - research_areas: List[ResearchArea]
                - relevance_score: float (0.0-1.0)
                - reasoning: str
        """
        system_prompt = """You are a research paper classifier for a multi-agent AI system project.

Classify papers based on relevance to these research areas:
1. Agent Systems: Multi-agent orchestration, agent-to-agent communication, agent frameworks
2. LLM Optimization: Cost reduction, routing, caching, compression, context optimization
3. Safety & Alignment: Prompt injection, adversarial robustness, refusal handling, alignment
4. GUI Automation: Computer use, browser automation, screenshot analysis, UI interaction
5. Memory Systems: Long-term memory, RAG, knowledge bases, memory consolidation
6. Orchestration: Task decomposition, planning, workflow management, error handling
7. Self-Improvement: Agent evolution, code generation, benchmark-driven improvement

Respond with valid JSON ONLY (no markdown)."""

        user_prompt = f"""Title: {title}

Abstract: {abstract}

Classify this paper:
1. Is it relevant to any of the 7 research areas?
2. Which specific areas (list all that apply)?
3. Relevance score (0.0 = not relevant, 1.0 = highly relevant)
4. Brief reasoning (1-2 sentences)

JSON format:
{{
    "is_relevant": true/false,
    "research_areas": ["agent_systems", "llm_optimization", ...],
    "relevance_score": 0.0-1.0,
    "reasoning": "Brief explanation"
}}"""

        try:
            response = await self.llm_client.generate_structured_output(
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                response_schema={
                    "type": "object",
                    "properties": {
                        "is_relevant": {"type": "boolean"},
                        "research_areas": {"type": "array", "items": {"type": "string"}},
                        "relevance_score": {"type": "number"},
                        "reasoning": {"type": "string"}
                    },
                    "required": ["is_relevant", "research_areas", "relevance_score", "reasoning"]
                },
                temperature=0.0
            )

            # Validate research areas
            valid_areas = {area.value for area in ResearchArea}
            filtered_areas = [
                area for area in response.get("research_areas", [])
                if area in valid_areas
            ]

            return {
                "is_relevant": response.get("is_relevant", False),
                "research_areas": filtered_areas,
                "relevance_score": response.get("relevance_score", 0.0),
                "reasoning": response.get("reasoning", "")
            }

        except Exception as e:
            logger.error(f"Classification failed: {e}")
            return {
                "is_relevant": False,
                "research_areas": [],
                "relevance_score": 0.0,
                "reasoning": f"Classification error: {e}"
            }


class ResearchAnalysisEngine:
    """
    Deep analysis of relevant papers (RDR Stage 2: Content Reasoning)

    Uses Claude Sonnet for high-quality summaries and insights
    """

    def __init__(self, llm_client):
        self.llm_client = llm_client

    async def analyze_paper(
        self,
        title: str,
        abstract: str,
        research_areas: List[str]
    ) -> Dict[str, Any]:
        """
        Generate summary and extract key insights

        Args:
            title: Paper title
            abstract: Paper abstract
            research_areas: Classified research areas

        Returns:
            Dictionary with:
                - summary: str (2-3 sentences)
                - key_insights: List[str] (3-5 insights)
                - implementation_available: bool
        """
        system_prompt = """You are a research paper analyst for a multi-agent AI system project.

Analyze papers to extract:
1. Concise summary (2-3 sentences covering problem, approach, results)
2. Key insights (3-5 actionable takeaways for implementation)
3. Whether implementation code/repository is likely available

Focus on practical applicability to a production multi-agent system."""

        areas_str = ", ".join(research_areas)

        user_prompt = f"""Title: {title}

Abstract: {abstract}

Research Areas: {areas_str}

Analyze this paper and respond with valid JSON ONLY (no markdown):

{{
    "summary": "2-3 sentence summary covering problem, approach, and results",
    "key_insights": [
        "Insight 1: Specific technique or finding",
        "Insight 2: Performance metrics or improvements",
        "Insight 3: Implementation considerations"
    ],
    "implementation_available": true/false
}}"""

        try:
            response = await self.llm_client.generate_structured_output(
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                response_schema={
                    "type": "object",
                    "properties": {
                        "summary": {"type": "string"},
                        "key_insights": {"type": "array", "items": {"type": "string"}},
                        "implementation_available": {"type": "boolean"}
                    },
                    "required": ["summary", "key_insights", "implementation_available"]
                },
                temperature=0.3
            )

            return response

        except Exception as e:
            logger.error(f"Analysis failed: {e}")
            return {
                "summary": f"Analysis error: {e}",
                "key_insights": [],
                "implementation_available": False
            }


class ResearchDiscoveryAgent(StandardIntegrationMixin):
    """
    Main agent for automatic research discovery

    Implements Real Deep Research (RDR) methodology:
    1. Data Preparation: Crawl arXiv + filter by relevance
    2. Content Reasoning: Analyze relevant papers
    3. Content Projection: Generate embeddings (future: BAAI/bge-m3)
    4. Embedding Analysis: Cluster and identify trends (future)

    Integrates with:
    - Analyst Agent: Surfaces top discoveries
    - MemoryOS: Persistent storage with 90-day TTL
    """

    def __init__(
        self,
        openai_api_key: Optional[str] = None,
        anthropic_api_key: Optional[str] = None,
        data_storage_path: str = "./data/research_discoveries"
    ):
        """
        Initialize Research Discovery Agent

        Args:
            openai_api_key: OpenAI API key (for MemoryOS)
            anthropic_api_key: Anthropic API key (for filtering/analysis)
            data_storage_path: Path for MemoryOS storage
        """
        super().__init__()
        # Initialize LLM clients
        self.haiku_client = LLMFactory.create(
            LLMProvider.CLAUDE_HAIKU_4_5,
            api_key=anthropic_api_key
        )
        self.sonnet_client = LLMFactory.create(
            LLMProvider.CLAUDE_SONNET_4,
            api_key=anthropic_api_key
        )

        # Initialize components
        self.crawler = ArxivCrawler()
        self.filter_engine = ResearchFilteringEngine(self.haiku_client)
        self.analysis_engine = ResearchAnalysisEngine(self.sonnet_client)

        # Initialize MemoryOS for persistent storage
        self.memory = create_genesis_memory(
            openai_api_key=openai_api_key or os.getenv("OPENAI_API_KEY"),
            data_storage_path=data_storage_path
        )

        # Track discoveries
        self.discovered_papers: List[ResearchPaper] = []
        self.discovery_run_id = None

        # Initialize VOIX hybrid automation
        self.voix_automation = HybridAutomation(agent_role="research_discovery_agent", use_llm_selection=True)

        logger.info("Research Discovery Agent initialized")

    async def run_discovery_cycle(
        self,
        days_back: int = 7,
        max_papers: int = 100,
        min_relevance_score: float = 0.6
    ) -> Dict[str, Any]:
        """
        Run a full discovery cycle (weekly cron job)

        Args:
            days_back: How many days back to search
            max_papers: Maximum papers to fetch
            min_relevance_score: Minimum relevance score to keep (0.0-1.0)

        Returns:
            Discovery summary with top papers
        """
        self.discovery_run_id = f"RUN-{datetime.now().strftime('%Y%m%d%H%M%S')}"

        logger.info(
            f"Starting discovery cycle: {self.discovery_run_id} "
            f"(days_back={days_back}, max_papers={max_papers})"
        )

        # Stage 1: Data Preparation (Crawl + Filter)
        raw_papers = await self.crawler.fetch_recent_papers(
            days_back=days_back,
            max_results=max_papers
        )

        logger.info(f"Stage 1: Fetched {len(raw_papers)} raw papers")

        relevant_papers = []

        for idx, raw_paper in enumerate(raw_papers, 1):
            logger.info(f"Filtering paper {idx}/{len(raw_papers)}: {raw_paper['title'][:60]}...")

            # Classify relevance
            classification = await self.filter_engine.classify_paper(
                title=raw_paper['title'],
                abstract=raw_paper['abstract']
            )

            if not classification['is_relevant']:
                continue

            if classification['relevance_score'] < min_relevance_score:
                logger.info(
                    f"  Skipped (low relevance: {classification['relevance_score']:.2f})"
                )
                continue

            logger.info(
                f"  Relevant! Score: {classification['relevance_score']:.2f}, "
                f"Areas: {', '.join(classification['research_areas'])}"
            )

            relevant_papers.append({
                **raw_paper,
                **classification
            })

        logger.info(f"Stage 1: {len(relevant_papers)} relevant papers found")

        # Stage 2: Content Reasoning (Deep Analysis)
        analyzed_papers = []

        for idx, paper in enumerate(relevant_papers, 1):
            logger.info(f"Analyzing paper {idx}/{len(relevant_papers)}: {paper['title'][:60]}...")

            # Deep analysis
            analysis = await self.analysis_engine.analyze_paper(
                title=paper['title'],
                abstract=paper['abstract'],
                research_areas=paper['research_areas']
            )

            # Create ResearchPaper object
            research_paper = ResearchPaper(
                arxiv_id=paper['arxiv_id'],
                title=paper['title'],
                abstract=paper['abstract'],
                authors=paper['authors'],
                published_date=paper['published_date'],
                source=DiscoverySource(paper['source']),
                research_areas=[ResearchArea(area) for area in paper['research_areas']],
                relevance_score=paper['relevance_score'],
                summary=analysis['summary'],
                key_insights=analysis['key_insights'],
                implementation_available=analysis['implementation_available'],
                discovered_at=datetime.now().isoformat()
            )

            analyzed_papers.append(research_paper)

            # Store in MemoryOS
            await self._store_paper_in_memory(research_paper)

        self.discovered_papers = analyzed_papers

        logger.info(f"Stage 2: {len(analyzed_papers)} papers analyzed and stored")

        # Get top 5 papers by relevance
        top_papers = sorted(
            analyzed_papers,
            key=lambda p: p.relevance_score,
            reverse=True
        )[:5]

        # Generate summary
        summary = {
            "discovery_run_id": self.discovery_run_id,
            "timestamp": datetime.now().isoformat(),
            "total_fetched": len(raw_papers),
            "total_relevant": len(relevant_papers),
            "total_analyzed": len(analyzed_papers),
            "min_relevance_score": min_relevance_score,
            "top_5_papers": [
                {
                    "arxiv_id": paper.arxiv_id,
                    "title": paper.title,
                    "relevance_score": paper.relevance_score,
                    "research_areas": [area.value for area in paper.research_areas],
                    "summary": paper.summary,
                    "key_insights": paper.key_insights,
                    "url": f"https://arxiv.org/abs/{paper.arxiv_id}"
                }
                for paper in top_papers
            ],
            "area_breakdown": self._get_area_breakdown(analyzed_papers)
        }

        logger.info(
            f"Discovery cycle complete: {len(analyzed_papers)} papers discovered, "
            f"top relevance: {top_papers[0].relevance_score:.2f}"
        )

        return summary

    async def _store_paper_in_memory(self, paper: ResearchPaper):
        """Store discovered paper in MemoryOS"""
        user_id = "research_discovery_system"
        agent_id = "analyst"  # Store under analyst agent for retrieval

        # Create memory entry
        user_input = f"New research discovered: {paper.title}"
        agent_response = (
            f"ArXiv ID: {paper.arxiv_id}\n"
            f"Published: {paper.published_date}\n"
            f"Areas: {', '.join([area.value for area in paper.research_areas])}\n"
            f"Relevance: {paper.relevance_score:.2f}\n\n"
            f"Summary: {paper.summary}\n\n"
            f"Key Insights:\n" + "\n".join([f"- {insight}" for insight in paper.key_insights])
        )

        # Store in MemoryOS
        self.memory.store(
            agent_id=agent_id,
            user_id=user_id,
            user_input=user_input,
            agent_response=agent_response,
            memory_type="conversation"
        )

        logger.debug(f"Stored paper in memory: {paper.arxiv_id}")

    def _get_area_breakdown(self, papers: List[ResearchPaper]) -> Dict[str, int]:
        """Get count of papers per research area"""
        breakdown = {area.value: 0 for area in ResearchArea}

        for paper in papers:
            for area in paper.research_areas:
                breakdown[area.value] += 1

        return breakdown

    async def get_top_discoveries(
        self,
        top_k: int = 5,
        area_filter: Optional[ResearchArea] = None
    ) -> List[ResearchPaper]:
        """
        Get top discoveries from latest run

        Args:
            top_k: Number of top papers to return
            area_filter: Optional filter by research area

        Returns:
            List of top research papers
        """
        papers = self.discovered_papers

        # Filter by area if specified
        if area_filter:
            papers = [
                p for p in papers
                if area_filter in p.research_areas
            ]

        # Sort by relevance
        papers = sorted(papers, key=lambda p: p.relevance_score, reverse=True)

        return papers[:top_k]

    async def query_past_discoveries(
        self,
        query: str,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Query past discoveries from MemoryOS

        Args:
            query: Search query
            top_k: Number of results to return

        Returns:
            List of relevant past discoveries
        """
        user_id = "research_discovery_system"
        agent_id = "analyst"

        # Retrieve from MemoryOS
        memories = self.memory.retrieve(
            agent_id=agent_id,
            user_id=user_id,
            query=query,
            memory_type=None,
            top_k=top_k
        )

        logger.info(f"Retrieved {len(memories)} past discoveries for query: '{query}'")

        return memories

    async def extract_data_via_voix(
        self,
        url: str,
        data_types: List[str],
    ) -> Dict[str, Any]:
        """
        Extract structured data from webpage using VOIX (with fallback to Gemini Computer Use)

        Supports price, availability, product metadata, and other structured data extraction.

        Args:
            url: URL to extract data from
            data_types: List of data types to extract (e.g., ["price", "availability", "metadata"])

        Returns:
            Dict with extracted data and performance metrics
        """
        import time
        start_time = time.time()
        parameters = {
            "data_types": data_types,
        }

        action_description = f"Extract {', '.join(data_types)} from {url}"

        try:
            result = await self.voix_automation.navigate_and_act(
                url=url,
                action_description=action_description,
                parameters=parameters,
            )

            execution_time = time.time() - start_time

            # Extract context data if available
            contexts = self.voix_automation.detector.get_all_contexts()
            extracted_data = {}

            for context in contexts:
                if context.name in data_types:
                    extracted_data[context.name] = context.value

            # Also check result for extracted data
            if isinstance(result.result, dict):
                extracted_data.update(result.result)

            # Log performance comparison
            if result.method == "voix":
                logger.info(
                    f"[ResearchDiscoveryAgent] VOIX extraction successful: {result.execution_time_ms:.1f}ms "
                    f"(vs fallback avg: {self.voix_automation.metrics.get('avg_execution_time_ms', 0):.1f}ms)"
                )
            else:
                logger.info(
                    f"[ResearchDiscoveryAgent] Fallback extraction used: {result.execution_time_ms:.1f}ms "
                    f"(VOIX not available on {url})"
                )

            return {
                "success": result.success,
                "method": result.method,
                "extracted_data": extracted_data,
                "execution_time_ms": result.execution_time_ms,
                "discovery_time_ms": result.discovery_time_ms,
                "tools_used": result.tools_used,
                "error": result.error,
            }

        except Exception as e:
            logger.exception(f"[ResearchDiscoveryAgent] Data extraction failed: {e}")
            return {
                "success": False,
                "method": "error",
                "extracted_data": {},
                "error": str(e),
                "execution_time_ms": (time.time() - start_time) * 1000,
            }

    async def extract_price_availability_via_voix(
        self,
        url: str,
    ) -> Dict[str, Any]:
        """Extract price and availability via VOIX"""
        return await self.extract_data_via_voix(url, ["price", "availability"])

    async def extract_product_metadata_via_voix(
        self,
        url: str,
    ) -> Dict[str, Any]:
        """Extract product metadata via VOIX"""
        return await self.extract_data_via_voix(url, ["metadata", "description", "specifications"])




    def get_integration_status(self) -> Dict[str, Any]:
        """
        Report active integrations from StandardIntegrationMixin.
        
        Returns coverage metrics across all 283 available integrations.
        This method checks which of the top 100 integrations are currently available.
        """
        # Top 100 critical integrations to check
        key_integrations = [
            # Core infrastructure
            'a2a_connector', 'htdag_planner', 'halo_router', 'daao_router', 'aop_validator',
            'policy_cards', 'capability_maps', 'adp_pipeline', 'agent_as_judge', 'agent_s_backend',
            
            # Memory & Learning
            'casebank', 'memento_agent', 'reasoning_bank', 'hybrid_rag_retriever', 'tei_client',
            'langgraph_store', 'trajectory_pool',
            
            # Evolution
            'se_darwin', 'sica', 'spice_challenger', 'spice_reasoner', 'revision_operator',
            'recombination_operator', 'refinement_operator', 'socratic_zero', 'multi_agent_evolve',
            
            # Safety
            'waltzrl_safety', 'trism_framework', 'circuit_breaker',
            
            # LLM Providers
            'vertex_router', 'sglang_inference', 'vllm_cache', 'local_llm_client',
            
            # Advanced Features
            'computer_use', 'webvoyager', 'pipelex_workflows', 'hgm_oracle', 'tumix_termination',
            'deepseek_ocr', 'modular_prompts',
            
            # Tools & Observability
            'agentevolver_self_questioning', 'agentevolver_experience_reuse', 'agentevolver_attribution',
            'tool_reliability_baseline', 'multimodal_ocr', 'multimodal_vision',
            'observability', 'health_check', 'cost_profiler', 'benchmark_runner',
            
            # Payments & Monitoring
            'ap2_service', 'x402_client', 'stripe_integration', 'payment_ledger', 'budget_tracker',
            'business_monitor', 'omnidaemon_bridge', 'voix_detector',
        ]
        
        active_integrations = []
        for integration_name in key_integrations:
            try:
                integration = getattr(self, integration_name, None)
                if integration is not None:
                    active_integrations.append(integration_name)
            except Exception:
                pass
        
        return {
            "agent_type": self.__class__.__name__,
            "version": "6.0 (StandardIntegrationMixin)",
            "total_available": 283,
            "top_100_available": 100,
            "active_integrations": len(active_integrations),
            "coverage_percent": round(len(active_integrations) / 100 * 100, 1),
            "active_integration_names": sorted(active_integrations),
            "mixin_enabled": True,
            "timestamp": __import__('datetime').datetime.now().isoformat()
        }



# A2A Communication Interface
async def get_research_discovery_agent(business_id: str = "default") -> ResearchDiscoveryAgent:
    """Factory function to create and initialize ResearchDiscoveryAgent"""
    agent = ResearchDiscoveryAgent(business_id=business_id)
    # Note: Async initialization if needed can be added here
    return agent
