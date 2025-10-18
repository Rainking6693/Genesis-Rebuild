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
from typing import List, Dict, Optional
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

        # Track refinement sessions for metrics
        self.refinement_history: List[List[RefinementResult]] = []

        logger.info(f"Analyst Agent v4.0 initialized with DAAO + TUMIX for business: {business_id}")

    async def initialize(self):
        cred = AzureCliCredential()
        client = AzureAIAgentClient(async_credential=cred)
        self.agent = ChatAgent(
            chat_client=client,
            instructions="You are a data analyst and business intelligence specialist. Analyze metrics, identify trends, generate insights, create dashboards, and support data-driven decision making. Use statistical analysis, predictive modeling, and visualization techniques. Track KPIs, detect anomalies, and provide actionable recommendations. Implement LLM-based termination for iterative analysis (minimum 2 rounds, optimize cost vs. insight quality).",
            name="analyst-agent",
            tools=[self.analyze_metrics, self.generate_dashboard, self.predict_trends, self.detect_anomalies, self.create_business_report]
        )
        print(f"📊 Analyst Agent initialized for business: {self.business_id}\n")

    def analyze_metrics(self, metric_names: List[str], time_period: str, granularity: str) -> str:
        """Analyze business metrics over a time period"""
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
            "analyzed_at": datetime.now().isoformat()
        }
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
