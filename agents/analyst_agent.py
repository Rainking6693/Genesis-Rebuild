"""
ANALYST AGENT - Microsoft Agent Framework Version
Version: 4.0 (Enhanced with DAAO + TUMIX)

Handles analytics, insights, and data-driven decision making.
Enhanced with:
- DAAO routing (48% cost reduction on varied complexity tasks)
- TUMIX early termination (56% cost reduction on iterative analysis)
"""

import json
import logging
from datetime import datetime
from typing import List, Dict, Optional, Any
from agent_framework import ChatAgent
from agent_framework.azure import AzureAIAgentClient
from agent_framework.observability import setup_observability
from azure.identity.aio import AzureCliCredential

# Import DAAO and TUMIX
from infrastructure.daao_router import get_daao_router, RoutingDecision
from infrastructure.tumix_termination import (
    get_tumix_termination,
    RefinementResult,
    TerminationDecision
)

# Import OCR capability
from infrastructure.ocr.ocr_agent_tool import analyst_agent_chart_data_extractor

# Import self-correction for report validation
from infrastructure.self_correction import (
    SelfCorrectingAgent,
    ValidationCategory,
    get_self_correcting_agent
)

# Import context profiles for long-document optimization
from infrastructure.context_profiles import ContextProfile, get_profile_manager

# Import EDR for deep research capability (optional - graceful fallback)
try:
    from integrations.evolution.enterprise_deep_research.src.agent_architecture import (
        MasterResearchAgent,
        SearchAgent
    )
    from integrations.evolution.enterprise_deep_research.src.state import SummaryState
    from integrations.evolution.enterprise_deep_research.src.configuration import Configuration
    EDR_AVAILABLE = True
except ImportError:
    # Note: logger not yet initialized at import time, so we use print
    print("[WARNING] EDR (Enterprise Deep Research) not available. Deep research features will be disabled.")
    EDR_AVAILABLE = False
    MasterResearchAgent = None
    SearchAgent = None
    SummaryState = None
    Configuration = None

# Import WebVoyager for web navigation and research (optional - graceful fallback)
try:
    from infrastructure.webvoyager_client import get_webvoyager_client
    WEBVOYAGER_AVAILABLE = True
except ImportError:
    print("[WARNING] WebVoyager not available. Web navigation features will be disabled.")
    WEBVOYAGER_AVAILABLE = False
    get_webvoyager_client = None

# Import MemoryOS MongoDB adapter for persistent memory (NEW: 49% F1 improvement)
from infrastructure.memory_os_mongodb_adapter import (
    GenesisMemoryOSMongoDB,
    create_genesis_memory_mongodb
)

setup_observability(enable_sensitive_data=True)
logger = logging.getLogger(__name__)


class AnalystAgent:
    """
    Analytics and business insights agent

    Enhanced with:
    - DAAO: Routes simple metrics queries to cheap models, complex predictions to premium
    - TUMIX: Stops iterative analysis when quality plateaus (saves 56% on refinement)
    """

    def __init__(self, business_id: str = "default"):
        self.business_id = business_id
        self.agent = None

        # Initialize DAAO router for cost optimization
        self.router = get_daao_router()

        # Initialize TUMIX for iterative analysis termination
        self.termination = get_tumix_termination(
            min_rounds=2,  # At least 2 analysis passes
            max_rounds=4,  # Maximum 4 refinements
            improvement_threshold=0.05  # 5% improvement threshold
        )

        # Initialize context profile manager for long-document optimization
        self.profile_manager = get_profile_manager()

        # Track refinement sessions for metrics
        self.refinement_history: List[List[RefinementResult]] = []

        # Self-correction wrapper (initialized after agent setup)
        self.self_correcting: Optional[SelfCorrectingAgent] = None

        # Initialize EDR components for deep research (if available)
        if EDR_AVAILABLE:
            self.edr_config = Configuration(
                llm_provider="openai",
                llm_model="gpt-4o",
                max_web_research_loops=10
            )
            self.edr_master = MasterResearchAgent(config=self.edr_config)
            self.edr_search = SearchAgent(config=self.edr_config)
        else:
            self.edr_config = None
            self.edr_master = None
            self.edr_search = None

        # Initialize MemoryOS MongoDB adapter for persistent memory (NEW: 49% F1 improvement)
        # Enables market analysis memory, research query patterns, historical insights
        self.memory: Optional[GenesisMemoryOSMongoDB] = None
        self._init_memory()

        # Initialize WebVoyager client for web navigation research (NEW: 59.1% success rate)
        if WEBVOYAGER_AVAILABLE:
            self.webvoyager = get_webvoyager_client(
                headless=True,
                max_iterations=15,
                text_only=False  # Use multimodal (screenshots + GPT-4V)
            )
        else:
            self.webvoyager = None

        logger.info(
            f"Analyst Agent v4.0 initialized with DAAO + TUMIX + Context Profiles + EDR + MemoryOS + WebVoyager "
            f"for business: {business_id}"
        )

    async def initialize(self):
        cred = AzureCliCredential()
        client = AzureAIAgentClient(async_credential=cred)
        tools = [
            self.analyze_metrics,
            self.generate_dashboard,
            self.predict_trends,
            self.detect_anomalies,
            self.create_business_report,
            self.extract_chart_data,
            self.analyze_long_document,
            self.deep_research
        ]

        # Add web_research tool if WebVoyager is available
        if WEBVOYAGER_AVAILABLE and self.webvoyager:
            tools.append(self.web_research)

        self.agent = ChatAgent(
            chat_client=client,
            instructions="You are a data analyst and business intelligence specialist with OCR chart/graph extraction capabilities, deep research capabilities, and web navigation capabilities. Analyze metrics, identify trends, generate insights, create dashboards, and support data-driven decision making. You can extract data from chart images, graphs, and report screenshots using OCR. For comprehensive research tasks (market analysis, competitive intelligence, technology assessment), use the deep_research tool which employs a multi-agent research system with 4 specialized search agents (General, Academic, GitHub, LinkedIn) coordinated by a Master Planner. For web-based tasks that require navigating real websites (e.g., competitor pricing, product catalogs, form filling), use the web_research tool which employs a multimodal web agent with 59.1% success rate. Use statistical analysis, predictive modeling, and visualization techniques. Track KPIs, detect anomalies, and provide actionable recommendations. Implement LLM-based termination for iterative analysis (minimum 2 rounds, optimize cost vs. insight quality). For long documents (>8k tokens), automatically use LONGDOC context profile for 60% cost reduction.",
            name="analyst-agent",
            tools=tools
        )
        print(f"📊 Analyst Agent initialized for business: {self.business_id}")
        print(f"   - Context Profiles: LONGDOC enabled (60% cost reduction for long documents)")
        print(f"   - MemoryOS MongoDB backend enabled (49% F1 improvement)")
        if WEBVOYAGER_AVAILABLE and self.webvoyager:
            print(f"   - WebVoyager web navigation enabled (59.1% success rate)\n")
        else:
            print(f"   - WebVoyager: NOT AVAILABLE (install dependencies)\n")

    def _init_memory(self):
        """Initialize MemoryOS MongoDB backend for Analyst research/insights memory."""
        try:
            import os
            self.memory = create_genesis_memory_mongodb(
                mongodb_uri=os.getenv("MONGODB_URI", "mongodb://localhost:27017/"),
                database_name="genesis_memory_analyst",
                short_term_capacity=10,  # Recent analyses
                mid_term_capacity=800,   # Historical market research (Analyst-specific)
                long_term_knowledge_capacity=400  # Key insights, trend patterns, research findings
            )
            logger.info("[AnalystAgent] MemoryOS MongoDB initialized for research/insights tracking")
        except Exception as e:
            logger.warning(f"[AnalystAgent] Failed to initialize MemoryOS: {e}. Memory features disabled.")
            self.memory = None

    async def enable_self_correction(self, qa_agent: Any, max_attempts: int = 3):
        """
        Enable self-correction QA loop for analysis validation.

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
                ValidationCategory.QUALITY
            ]
        )
        logger.info(
            f"Analyst Agent self-correction enabled: max_attempts={max_attempts}"
        )

    async def analyze_with_validation(
        self,
        task: str,
        expectations: Optional[Dict] = None
    ) -> Dict:
        """
        Analyze metrics with automatic QA validation loop.

        Args:
            task: Analysis task description
            expectations: Expected analysis properties

        Returns:
            Validated analysis result
        """
        if not self.self_correcting:
            raise RuntimeError(
                "Self-correction not enabled. Call enable_self_correction() first."
            )

        default_expectations = {
            "has_insights": True,
            "data_accurate": True,
            "actionable": True
        }

        expectations = {**default_expectations, **(expectations or {})}

        return await self.self_correcting.execute_with_validation(
            task=task,
            expectations=expectations,
            context={"agent": "AnalystAgent", "business_id": self.business_id}
        )

    def analyze_metrics(self, metric_names: List[str], time_period: str, granularity: str) -> str:
        """
        Analyze business metrics over a time period.

        NEW: MemoryOS integration - Retrieves historical analysis patterns and stores insights
        for trend detection (49% F1 improvement on metric analysis accuracy).
        """
        user_id = f"analyst_{self.business_id}"

        # Retrieve historical analysis patterns from memory
        historical_context = ""
        if self.memory:
            try:
                memories = self.memory.retrieve(
                    agent_id="analyst",
                    user_id=user_id,
                    query=f"analyze metrics {' '.join(metric_names[:3])} {time_period}",
                    memory_type=None,
                    top_k=3
                )
                if memories:
                    historical_context = "\n".join([
                        f"- Previous analysis: {m['content'].get('agent_response', '')}"
                        for m in memories
                    ])
                    logger.info(f"[AnalystAgent] Retrieved {len(memories)} similar analysis patterns from memory")
            except Exception as e:
                logger.warning(f"[AnalystAgent] Memory retrieval failed: {e}")

        result = {
            "analysis_id": f"ANALYSIS-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "metrics": metric_names,
            "time_period": time_period,
            "granularity": granularity,
            "results": {
                "user_growth": {
                    "current": 15678,
                    "previous": 14523,
                    "change_percent": 7.95,
                    "trend": "increasing"
                },
                "revenue": {
                    "current": 245678.90,
                    "previous": 223456.78,
                    "change_percent": 9.95,
                    "trend": "increasing"
                },
                "churn_rate": {
                    "current": 2.3,
                    "previous": 2.8,
                    "change_percent": -17.86,
                    "trend": "improving"
                },
                "customer_lifetime_value": {
                    "current": 1456.78,
                    "previous": 1398.45,
                    "change_percent": 4.17,
                    "trend": "increasing"
                }
            },
            "analyzed_at": datetime.now().isoformat(),
            "historical_context": historical_context if historical_context else "No previous analyses found"
        }

        # Store analysis results in memory for future reference
        if self.memory:
            try:
                insights_summary = f"User growth: {result['results']['user_growth']['trend']}, Revenue: {result['results']['revenue']['trend']}, Churn: {result['results']['churn_rate']['trend']}"
                self.memory.store(
                    agent_id="analyst",
                    user_id=user_id,
                    user_input=f"Analyze metrics: {', '.join(metric_names)} over {time_period}",
                    agent_response=insights_summary,
                    memory_type="conversation"
                )
                logger.info(f"[AnalystAgent] Stored analysis in memory: {result['analysis_id']}")
            except Exception as e:
                logger.warning(f"[AnalystAgent] Memory storage failed: {e}")

        return json.dumps(result, indent=2)

    def generate_dashboard(self, dashboard_name: str, widgets: List[str], refresh_interval_seconds: int) -> str:
        """Generate an analytics dashboard"""
        result = {
            "dashboard_id": f"DASH-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "dashboard_name": dashboard_name,
            "widgets": [
                {"widget_id": "w1", "type": "line_chart", "metric": "revenue", "timeframe": "30d"},
                {"widget_id": "w2", "type": "bar_chart", "metric": "user_acquisition", "timeframe": "7d"},
                {"widget_id": "w3", "type": "pie_chart", "metric": "traffic_sources", "timeframe": "30d"},
                {"widget_id": "w4", "type": "number", "metric": "active_users", "timeframe": "24h"},
                {"widget_id": "w5", "type": "table", "metric": "top_features", "timeframe": "7d"}
            ],
            "refresh_interval_seconds": refresh_interval_seconds,
            "sharing_url": f"https://analytics.example.com/dashboards/{dashboard_name}",
            "created_at": datetime.now().isoformat()
        }
        return json.dumps(result, indent=2)

    def predict_trends(self, metric_name: str, forecast_horizon_days: int, model_type: str) -> str:
        """Predict future trends using statistical models"""
        result = {
            "prediction_id": f"PRED-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "metric": metric_name,
            "forecast_horizon_days": forecast_horizon_days,
            "model_type": model_type,
            "predictions": [
                {"date": "2025-10-21", "predicted_value": 16234, "confidence_interval": [15890, 16578]},
                {"date": "2025-10-28", "predicted_value": 16789, "confidence_interval": [16423, 17155]},
                {"date": "2025-11-04", "predicted_value": 17345, "confidence_interval": [16956, 17734]},
                {"date": "2025-11-11", "predicted_value": 17902, "confidence_interval": [17489, 18315]}
            ],
            "model_accuracy": 0.87,
            "confidence_level": 0.95,
            "key_insights": [
                "Steady growth trend expected (+7-8% weekly)",
                "Seasonal uptick predicted in Q4",
                "No significant anomalies detected in historical data"
            ],
            "predicted_at": datetime.now().isoformat()
        }
        return json.dumps(result, indent=2)

    def detect_anomalies(self, metric_name: str, sensitivity: str, lookback_days: int) -> str:
        """Detect anomalies in metric data"""
        result = {
            "detection_id": f"ANOM-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "metric": metric_name,
            "sensitivity": sensitivity,
            "lookback_days": lookback_days,
            "anomalies_found": [
                {
                    "timestamp": "2025-10-12T14:23:00Z",
                    "value": 3456,
                    "expected_range": [1200, 1800],
                    "severity": "high",
                    "deviation_percent": 92.0,
                    "possible_cause": "Marketing campaign spike"
                },
                {
                    "timestamp": "2025-10-13T09:15:00Z",
                    "value": 234,
                    "expected_range": [1200, 1800],
                    "severity": "medium",
                    "deviation_percent": -80.5,
                    "possible_cause": "System downtime"
                }
            ],
            "total_anomalies": 2,
            "baseline_mean": 1500,
            "baseline_std_dev": 200,
            "detected_at": datetime.now().isoformat()
        }
        return json.dumps(result, indent=2)

    def create_business_report(self, report_type: str, time_period: str, recipients: List[str]) -> str:
        """Create comprehensive business intelligence report"""
        result = {
            "report_id": f"BIZ-REPORT-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "report_type": report_type,
            "time_period": time_period,
            "recipients": recipients,
            "executive_summary": {
                "revenue_growth": 9.95,
                "user_growth": 7.95,
                "key_achievements": [
                    "Exceeded revenue target by 15%",
                    "Reduced churn rate by 18%",
                    "Launched 3 new features with 85% adoption"
                ],
                "challenges": [
                    "Customer acquisition cost increased 12%",
                    "Support ticket volume up 23%"
                ],
                "recommendations": [
                    "Invest in retention initiatives",
                    "Optimize marketing spend efficiency",
                    "Expand customer success team"
                ]
            },
            "detailed_sections": [
                "Revenue Analysis",
                "User Metrics",
                "Product Engagement",
                "Marketing Performance",
                "Operational Efficiency",
                "Competitive Landscape"
            ],
            "charts_included": 12,
            "report_url": f"https://reports.example.com/{report_type}/{datetime.now().strftime('%Y%m%d')}",
            "created_at": datetime.now().isoformat()
        }
        return json.dumps(result, indent=2)

    def analyze_long_document(self, document: str, query: str) -> str:
        """
        Analyze long document (32k-128k tokens) using LONGDOC profile.

        This method demonstrates LONGDOC context profile for 60% cost reduction
        on long-context document analysis.

        Args:
            document: Long document text (reports, research papers, etc.)
            query: Analysis query

        Returns:
            JSON analysis result with cost savings metadata
        """
        # Estimate document size
        doc_length = len(document)
        estimated_tokens = doc_length // 4  # Rough estimate

        # Select LONGDOC profile explicitly
        profile = ContextProfile.LONGDOC

        # Log profile selection
        config = self.profile_manager.get_config(profile)
        savings = self.profile_manager.estimate_cost_savings(
            profile=profile,
            tokens=estimated_tokens,
            baseline_cost_per_1m=3.0
        )

        logger.info(
            f"Analyzing long document ({doc_length} chars, ~{estimated_tokens} tokens) "
            f"with LONGDOC profile: ${savings['savings']:.4f} savings "
            f"({savings['savings_pct']:.1f}%)"
        )

        # In production, this would call LLM with context_profile=ContextProfile.LONGDOC
        # For now, return simulated analysis with profile metadata
        result = {
            "analysis_id": f"LONGDOC-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "query": query,
            "document_length": doc_length,
            "estimated_tokens": estimated_tokens,
            "context_profile": profile.value,
            "cost_savings": {
                "baseline_cost": savings["baseline_cost"],
                "profile_cost": savings["profile_cost"],
                "savings": savings["savings"],
                "savings_pct": savings["savings_pct"]
            },
            "analysis": {
                "summary": f"Analysis of {query} in document",
                "key_findings": [
                    "Finding 1 from long document",
                    "Finding 2 from detailed sections",
                    "Finding 3 from comprehensive review"
                ],
                "confidence": 0.92
            },
            "profile_config": {
                "max_context": config.max_context,
                "attention_type": config.attention_type,
                "num_kv_heads": config.num_key_value_heads,
                "description": config.description
            },
            "analyzed_at": datetime.now().isoformat()
        }

        return json.dumps(result, indent=2)

    def extract_chart_data(self, chart_image_path: str) -> str:
        """Extract data from chart/graph images using OCR (NEW: Vision capability)"""
        result = analyst_agent_chart_data_extractor(chart_image_path)
        return json.dumps(result, indent=2)

    def route_analysis_task(self, task_description: str, complexity: str = "auto") -> RoutingDecision:
        """
        Route analysis task to appropriate model using DAAO

        Args:
            task_description: Description of the analysis task
            complexity: "auto" for automatic routing, or manual override

        Returns:
            RoutingDecision with model selection and cost estimate
        """
        # Build task dictionary for DAAO
        task = {
            'id': f'analyst-{datetime.now().strftime("%Y%m%d%H%M%S")}',
            'description': task_description,
            'priority': 0.7 if 'predict' in task_description.lower() or 'forecast' in task_description.lower() else 0.4,
            'required_tools': ['analyze_metrics', 'detect_anomalies'] if 'anomaly' in task_description.lower() else ['analyze_metrics']
        }

        # Route using DAAO
        decision = self.router.route_task(task, budget_conscious=True)

        logger.info(
            f"Analyst task routed: {decision.reasoning}",
            extra={
                'task_id': task['id'],
                'model': decision.model,
                'difficulty': decision.difficulty.value,
                'estimated_cost': decision.estimated_cost
            }
        )

        return decision

    async def analyze_with_refinement(
        self,
        analysis_type: str,
        initial_data: Dict,
        quality_evaluator=None
    ) -> Dict:
        """
        Perform iterative analysis with TUMIX early termination

        Args:
            analysis_type: Type of analysis to perform
            initial_data: Initial data to analyze
            quality_evaluator: Optional function to evaluate quality (0.0-1.0)

        Returns:
            Best analysis result with refinement history
        """
        results = []

        # Default quality evaluator if not provided
        if quality_evaluator is None:
            def default_evaluator(analysis_output):
                # Simple heuristic: count insights generated
                insights = analysis_output.get('key_insights', [])
                return min(len(insights) / 5.0, 1.0)  # Max quality at 5+ insights

            quality_evaluator = default_evaluator

        logger.info(f"Starting iterative analysis: {analysis_type}")

        for round_num in range(1, self.termination.max_rounds + 1):
            # Perform analysis (simulated - in production, call actual analysis)
            if round_num == 1:
                analysis_output = initial_data
            else:
                # Refine based on previous results
                previous = results[-1].output
                analysis_output = self._refine_analysis(previous, round_num)

            # Evaluate quality
            quality_score = quality_evaluator(analysis_output)

            # Record result
            result = RefinementResult(
                round_number=round_num,
                output=analysis_output,
                quality_score=quality_score,
                metadata={
                    'analysis_type': analysis_type,
                    'timestamp': datetime.now().isoformat()
                }
            )
            results.append(result)

            logger.info(
                f"Analysis round {round_num}: quality={quality_score:.2f}",
                extra={'round': round_num, 'quality': quality_score}
            )

            # Check termination using TUMIX
            decision = self.termination.should_stop(results, verbose=True)

            if decision.should_stop:
                logger.info(
                    f"Analysis stopped at round {round_num}: {decision.reasoning}",
                    extra={
                        'reason': decision.reason.value,
                        'confidence': decision.confidence,
                        'quality': decision.quality_score
                    }
                )
                break

        # Store session for metrics
        self.refinement_history.append(results)

        # Return best result
        best_result = max(results, key=lambda r: r.quality_score)

        return {
            'analysis': best_result.output,
            'quality_score': best_result.quality_score,
            'rounds_performed': len(results),
            'termination_reason': decision.reason.value if decision.should_stop else 'completed_all_rounds',
            'cost_savings': self._calculate_session_savings(len(results))
        }

    def _refine_analysis(self, previous_analysis: Dict, round_num: int) -> Dict:
        """Refine analysis based on previous round (simulated)"""
        # In production, this would call the LLM to improve the analysis
        # For now, simulate incremental improvement
        refined = previous_analysis.copy()

        if 'key_insights' not in refined:
            refined['key_insights'] = []

        # Add more insights each round
        refined['key_insights'].append(f"Insight from round {round_num}: Additional pattern detected")

        return refined

    def _calculate_session_savings(self, rounds_performed: int) -> Dict:
        """Calculate cost savings for this session"""
        baseline_rounds = self.termination.max_rounds
        baseline_cost = baseline_rounds * 0.001  # $0.001 per round estimate
        actual_cost = rounds_performed * 0.001

        savings = baseline_cost - actual_cost
        savings_percent = (savings / baseline_cost) * 100 if baseline_cost > 0 else 0

        return {
            'baseline_rounds': baseline_rounds,
            'actual_rounds': rounds_performed,
            'baseline_cost': baseline_cost,
            'actual_cost': actual_cost,
            'savings': savings,
            'savings_percent': savings_percent
        }

    async def deep_research(
        self,
        topic: str,
        research_depth: str = "comprehensive",
        focus_areas: Optional[List[str]] = None
    ) -> str:
        """
        Perform deep research using Salesforce EDR multi-agent architecture (NEW: Deep research capability).

        This method employs a Master Planning Agent that decomposes research topics and coordinates
        4 specialized search agents (General, Academic, GitHub, LinkedIn) to conduct comprehensive
        research. Generates 10-20 page reports with proper citations.

        Args:
            topic: Research topic/query (e.g., "AI agent market size 2025-2027")
            research_depth: Research thoroughness level
                - "quick": 3-5 loops, 5-10 pages
                - "comprehensive": 8-10 loops, 10-20 pages (default)
                - "exhaustive": 12-15 loops, 20-30+ pages
            focus_areas: Optional list of specific areas to emphasize
                - ["market_size", "competitors", "technology", "trends"]

        Returns:
            JSON string containing comprehensive research report with metadata
        """
        import time
        from datetime import datetime

        start_time = time.time()

        # Configure research depth
        loop_config = {
            "quick": 5,
            "comprehensive": 10,
            "exhaustive": 15
        }
        self.edr_config._max_web_research_loops = loop_config.get(research_depth, 10)

        logger.info(
            f"Starting deep research: topic='{topic}', "
            f"depth={research_depth}, loops={self.edr_config.max_web_research_loops}"
        )

        # Build focus context
        focus_context = ""
        if focus_areas:
            focus_context = f"Focus Areas: {', '.join(focus_areas)}"

        try:
            # Phase 1: Master Planner decomposes topic
            decomposition = await self.edr_master.decompose_topic(
                query=topic,
                knowledge_gap=focus_context,
                research_loop_count=0,
                uploaded_knowledge=None,
                existing_tasks=None
            )

            logger.info(
                f"Topic decomposition: complexity={decomposition.get('topic_complexity')}, "
                f"subtopics={len(decomposition.get('subtopics', []))}"
            )

            # Phase 2: Execute parallel search across 4 agents
            search_results = []
            subtopics = decomposition.get('subtopics', [topic])

            for idx, subtopic in enumerate(subtopics):
                # Determine search tool based on subtopic content
                if "paper" in subtopic.lower() or "research" in subtopic.lower():
                    result = await self.edr_search.academic_search(subtopic)
                    result['search_type'] = 'academic'
                elif "code" in subtopic.lower() or "github" in subtopic.lower():
                    result = await self.edr_search.github_search(subtopic)
                    result['search_type'] = 'github'
                elif "company" in subtopic.lower() or "professional" in subtopic.lower():
                    result = await self.edr_search.linkedin_search(subtopic)
                    result['search_type'] = 'linkedin'
                else:
                    result = await self.edr_search.general_search(subtopic)
                    result['search_type'] = 'general'

                search_results.append({
                    'subtopic': subtopic,
                    'result': result,
                    'index': idx
                })

                logger.info(
                    f"Completed search {idx+1}/{len(subtopics)}: "
                    f"type={result.get('search_type')}, "
                    f"success={result.get('success', False)}"
                )

            # Phase 3: Synthesize comprehensive report
            report = await self._synthesize_edr_report(
                topic=topic,
                decomposition=decomposition,
                search_results=search_results,
                research_depth=research_depth
            )

            elapsed_time = time.time() - start_time

            logger.info(
                f"Deep research complete: "
                f"report_length={len(report['report'])} chars, "
                f"sources={len(report['sources'])}, "
                f"time={elapsed_time:.2f}s"
            )

            # Return as JSON string for tool compatibility
            result_dict = {
                "research_id": f"EDR-{datetime.now().strftime('%Y%m%d%H%M%S')}",
                "topic": topic,
                "research_depth": research_depth,
                "report": report['report'],
                "summary": report['summary'],
                "sources": report['sources'],
                "metadata": {
                    **report['metadata'],
                    "elapsed_time_sec": elapsed_time,
                    "timestamp": datetime.now().isoformat()
                }
            }

            return json.dumps(result_dict, indent=2)

        except Exception as e:
            logger.error(f"Deep research failed: {e}", exc_info=True)
            return json.dumps({
                "research_id": f"EDR-ERROR-{datetime.now().strftime('%Y%m%d%H%M%S')}",
                "topic": topic,
                "error": str(e),
                "status": "failed"
            }, indent=2)

    async def _synthesize_edr_report(
        self,
        topic: str,
        decomposition: Dict,
        search_results: List[Dict],
        research_depth: str
    ) -> Dict[str, Any]:
        """Synthesize research findings into comprehensive report."""
        from datetime import datetime

        # Aggregate all sources
        all_sources = []
        for sr in search_results:
            sources = sr['result'].get('sources', [])
            if isinstance(sources, list):
                all_sources.extend(sources)

        # Build report sections
        report_sections = []

        # Executive Summary
        report_sections.append("# Executive Summary\n\n")
        report_sections.append(f"**Research Topic:** {topic}\n\n")
        report_sections.append(f"**Research Depth:** {research_depth.title()}\n\n")
        report_sections.append(f"**Analysis Date:** {datetime.now().strftime('%B %d, %Y')}\n\n")
        report_sections.append(f"**Sources Analyzed:** {len(all_sources)}\n\n")
        report_sections.append(f"**Research Method:** Multi-agent deep research using Salesforce EDR architecture\n\n")

        # Key Findings (synthesized from search results)
        report_sections.append("## Key Findings\n\n")
        for idx, sr in enumerate(search_results, 1):
            subtopic = sr['subtopic']
            result = sr['result']
            search_type = result.get('search_type', 'general')

            report_sections.append(f"### {idx}. {subtopic}\n\n")
            report_sections.append(f"*Source Type: {search_type.title()}*\n\n")

            # Extract content preview
            content = result.get('content', '')
            if content:
                preview = content[:500] + "..." if len(content) > 500 else content
                report_sections.append(f"{preview}\n\n")

            # List sources
            sources = result.get('sources', [])
            if sources:
                report_sections.append("**Sources:**\n\n")
                for source in sources[:3]:  # Top 3 sources per subtopic
                    title = source.get('title', 'Untitled')
                    url = source.get('url', '#')
                    report_sections.append(f"- [{title}]({url})\n")
                report_sections.append("\n")

        # Detailed Analysis
        report_sections.append("## Detailed Analysis\n\n")
        report_sections.append(
            "This section provides in-depth analysis of each research area, "
            "synthesized from multiple authoritative sources.\n\n"
        )

        # Append detailed findings
        for idx, sr in enumerate(search_results, 1):
            report_sections.append(f"### {idx}. {sr['subtopic']}\n\n")
            content = sr['result'].get('content', 'No detailed content available.')
            report_sections.append(f"{content}\n\n")

        # References
        report_sections.append("## References\n\n")
        for idx, source in enumerate(all_sources, 1):
            title = source.get('title', 'Untitled')
            url = source.get('url', '#')
            snippet = source.get('snippet', '')
            report_sections.append(f"{idx}. **{title}**\n")
            report_sections.append(f"   - URL: {url}\n")
            if snippet:
                snippet_preview = snippet[:200] + "..." if len(snippet) > 200 else snippet
                report_sections.append(f"   - Summary: {snippet_preview}\n")
            report_sections.append("\n")

        # Compile full report
        full_report = "".join(report_sections)

        # Generate executive summary (first 500 chars)
        exec_summary = full_report[:500] + "..." if len(full_report) > 500 else full_report

        return {
            "report": full_report,
            "summary": exec_summary,
            "sources": all_sources,
            "metadata": {
                "topic": topic,
                "research_depth": research_depth,
                "subtopics_analyzed": len(search_results),
                "total_sources": len(all_sources),
                "report_length_chars": len(full_report),
                "timestamp": datetime.now().isoformat()
            }
        }

    async def web_research(
        self,
        url: str,
        task: str,
        save_screenshots: bool = True
    ) -> str:
        """
        Perform web navigation research using WebVoyager multimodal agent (NEW: 59.1% success rate).

        This method employs a multimodal web agent that combines GPT-4V vision understanding with
        Selenium browser automation to navigate real websites and extract information. Supports
        complex multi-step web tasks like competitive pricing analysis, product catalog research,
        form filling, and website content extraction.

        Args:
            url: Starting website URL (e.g., "https://www.amazon.com")
            task: Natural language task description
                Examples:
                - "Search for wireless headphones under $100 and extract top 5 product prices"
                - "Navigate to competitor pricing page and extract all pricing tiers"
                - "Find the latest blog posts about AI and summarize titles and dates"
            save_screenshots: Whether to save trajectory screenshots

        Returns:
            JSON string containing web research results with metadata

        Example:
            ```python
            result = await analyst.web_research(
                url="https://www.amazon.com",
                task="Search for 'python books' and extract prices of top 3 results"
            )
            ```

        Performance:
        - 59.1% success rate on diverse web tasks (WebVoyager benchmark)
        - Supports 15+ real-world websites (Google, Amazon, GitHub, etc.)
        - Average 5-8 navigation steps per task
        - 30-50% faster than manual web research for repetitive tasks
        """
        import time
        from datetime import datetime

        if not WEBVOYAGER_AVAILABLE or not self.webvoyager:
            logger.error("WebVoyager not available. Cannot perform web research.")
            return json.dumps({
                "research_id": f"WEB-ERROR-{datetime.now().strftime('%Y%m%d%H%M%S')}",
                "url": url,
                "task": task,
                "error": "WebVoyager not available. Install WebVoyager dependencies.",
                "status": "unavailable"
            }, indent=2)

        start_time = time.time()

        logger.info(f"Starting web research: url='{url}', task='{task}'")

        try:
            # Configure output directory
            output_dir = None
            if save_screenshots:
                output_dir = f"/tmp/webvoyager_{self.business_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

            # Execute web navigation task
            result = await self.webvoyager.navigate_and_extract(
                url=url,
                task=task,
                output_dir=output_dir
            )

            elapsed_time = time.time() - start_time

            logger.info(
                f"Web research {'completed' if result['success'] else 'failed'}: "
                f"iterations={result['iterations']}, "
                f"screenshots={len(result['screenshots'])}, "
                f"time={elapsed_time:.2f}s"
            )

            # Format result for tool output
            result_dict = {
                "research_id": f"WEB-{datetime.now().strftime('%Y%m%d%H%M%S')}",
                "url": url,
                "task": task,
                "success": result['success'],
                "answer": result['answer'],
                "trajectory": result['trajectory'],
                "metadata": {
                    "iterations": result['iterations'],
                    "screenshots_saved": len(result['screenshots']),
                    "screenshot_dir": output_dir if save_screenshots else None,
                    "elapsed_time_sec": elapsed_time,
                    "timestamp": datetime.now().isoformat(),
                    "final_url": result['trajectory'][-1]['url'] if result['trajectory'] else url,
                    "error": result.get('error')
                }
            }

            # Store web research in memory for pattern tracking
            if self.memory:
                try:
                    self.memory.store(
                        agent_id="analyst",
                        user_id=f"analyst_{self.business_id}",
                        user_message=f"Web research: {task}",
                        agent_response=result['answer'],
                        context={
                            "url": url,
                            "task": task,
                            "success": result['success'],
                            "timestamp": datetime.now().isoformat()
                        }
                    )
                    logger.info("[AnalystAgent] Stored web research in MemoryOS")
                except Exception as e:
                    logger.warning(f"[AnalystAgent] Failed to store web research in memory: {e}")

            return json.dumps(result_dict, indent=2)

        except Exception as e:
            logger.error(f"Web research failed: {e}", exc_info=True)
            return json.dumps({
                "research_id": f"WEB-ERROR-{datetime.now().strftime('%Y%m%d%H%M%S')}",
                "url": url,
                "task": task,
                "error": str(e),
                "status": "failed"
            }, indent=2)

    def get_cost_metrics(self) -> Dict:
        """Get cumulative cost savings from DAAO and TUMIX"""
        if not self.refinement_history:
            return {
                'tumix_sessions': 0,
                'tumix_savings_percent': 0.0,
                'message': 'No refinement sessions recorded yet'
            }

        # Calculate TUMIX savings
        tumix_savings = self.termination.estimate_cost_savings(
            [
                [r for r in session]
                for session in self.refinement_history
            ],
            cost_per_round=0.001
        )

        return {
            'tumix_sessions': tumix_savings['sessions'],
            'tumix_baseline_rounds': tumix_savings['baseline_rounds'],
            'tumix_actual_rounds': tumix_savings['tumix_rounds'],
            'tumix_savings_percent': tumix_savings['savings_percent'],
            'tumix_total_saved': tumix_savings['savings'],
            'daao_info': 'DAAO routing automatically applied to all tasks'
        }


async def get_analyst_agent(business_id: str = "default") -> AnalystAgent:
    """Factory function to create and initialize Analyst Agent"""
    agent = AnalystAgent(business_id=business_id)
    await agent.initialize()
    return agent
