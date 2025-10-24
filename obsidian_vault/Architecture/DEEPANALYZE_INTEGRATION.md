---
title: DeepAnalyze Integration Design
category: Architecture
dg-publish: true
publish: true
tags:
- se
- memory
- deployment
- overview
- otel
- htdag
- halo
- inter
- grafana
source: docs/DEEPANALYZE_INTEGRATION.md
exported: '2025-10-24T22:05:26.928369'
---

# DeepAnalyze Integration Design
**Version:** 1.0
**Date:** October 24, 2025
**Status:** Phase 6 Day 4 - Integration Specification
**Owner:** Cora (Agent Design & Orchestration Expert)

---

## TABLE OF CONTENTS

1. [Overview](#overview)
2. [HTDAG Integration](#htdag-integration)
3. [HALO Integration](#halo-integration)
4. [Memory Store Integration](#memory-store-integration)
5. [OTEL Integration](#otel-integration)
6. [Grafana Integration](#grafana-integration)
7. [SE-Darwin Integration](#se-darwin-integration)
8. [Inter-Agent Communication](#inter-agent-communication)
9. [Deployment Configuration](#deployment-configuration)

---

## 1. OVERVIEW

### Integration Philosophy

DeepAnalyze follows a **plugin architecture pattern**:
- **Non-invasive:** Existing systems call DeepAnalyze optionally (not required for operation)
- **Async-first:** All integrations use async/await to avoid blocking
- **Gradual adoption:** Can be deployed incrementally (Layer 1 first, then Layer 2, etc.)
- **Fail-safe:** If DeepAnalyze unavailable, systems degrade gracefully (fallback to heuristics)

### Communication Protocol

All integrations use one of three patterns:

1. **Direct tool calls** (Sync): For fast queries (<100ms latency)
   - Example: HALO asks "Which agent for this task?" → DeepAnalyze recommends agent
   - Protocol: Python function call

2. **A2A messages** (Async): For longer analysis (100ms-10s latency)
   - Example: SE-Darwin requests convergence prediction → DeepAnalyze analyzes history → responds
   - Protocol: Agent2Agent JSON-RPC

3. **Event streams** (Fire-and-forget): For monitoring and logging
   - Example: Task completes → event logged → DeepAnalyze ingests asynchronously
   - Protocol: Redis pub/sub or Kafka topics (future)

---

## 2. HTDAG INTEGRATION

### Purpose
HTDAG queries DeepAnalyze for **task complexity estimates** before decomposition to make intelligent splitting decisions.

### Integration Point
**File:** `orchestration/htdag_decomposer.py`
**Function:** `decompose_task(task: Task) -> List[Task]`

### Implementation

```python
# orchestration/htdag_decomposer.py

import asyncio
from typing import List, Optional
from agents.deepanalyze_tools import predict_task_success

async def decompose_task(task: Task) -> List[Task]:
    """
    Decompose task into subtasks with DeepAnalyze guidance.

    Integration: Calls DeepAnalyze.predict_task_success for complexity estimate.
    Fallback: If DeepAnalyze unavailable, use rule-based heuristics.
    """

    # Step 1: Query DeepAnalyze for success probability
    try:
        analysis = await asyncio.wait_for(
            predict_task_success(
                task_description=task.description,
                context={
                    "current_load": system_state.agent_loads,
                    "time_of_day": datetime.now().hour,
                    "recent_error_rate": system_state.error_rate_last_hour
                }
            ),
            timeout=2.0  # 2-second timeout
        )

        success_prob = analysis["success_probability"]
        recommended_decomposition_depth = analysis.get("recommended_depth", None)

    except asyncio.TimeoutError:
        logger.warning("DeepAnalyze timeout - falling back to heuristic decomposition")
        success_prob = None
        recommended_decomposition_depth = None

    except Exception as e:
        logger.error(f"DeepAnalyze error: {e} - falling back to heuristic")
        success_prob = None
        recommended_decomposition_depth = None

    # Step 2: Make decomposition decision
    if success_prob is not None:
        # Use DeepAnalyze prediction
        if success_prob > 0.85:
            # High confidence - no decomposition needed
            logger.info(f"Task {task.id}: High success prob ({success_prob:.2f}), no decomposition")
            return [task]
        elif success_prob > 0.60:
            # Medium confidence - shallow decomposition (2-3 subtasks)
            depth = 2
        else:
            # Low confidence - deep decomposition (4-6 subtasks)
            depth = recommended_decomposition_depth or 4
    else:
        # Fallback: Use rule-based heuristics
        depth = _estimate_complexity_heuristic(task)

    # Step 3: Perform decomposition
    subtasks = _decompose_with_depth(task, depth)

    logger.info(f"Task {task.id}: Decomposed into {len(subtasks)} subtasks (depth={depth})")
    return subtasks


def _estimate_complexity_heuristic(task: Task) -> int:
    """Fallback heuristic for complexity estimation."""
    description_length = len(task.description)
    if description_length < 100:
        return 1  # Simple task
    elif description_length < 300:
        return 2  # Medium task
    else:
        return 4  # Complex task
```

### Data Flow

```
┌──────────┐
│  HTDAG   │
└────┬─────┘
     │ 1. Call predict_task_success(task_desc, context)
     ↓
┌────────────────┐
│  DeepAnalyze   │
└────┬───────────┘
     │ 2. Query Memory Store for similar tasks
     │ 3. Run XGBoost success prediction model
     │ 4. Return {success_prob, recommended_depth}
     ↓
┌──────────┐
│  HTDAG   │
└────┬─────┘
     │ 5. Decide: decompose or not
     │ 6. If decompose, split into N subtasks
     ↓
[Subtasks]
```

### Performance Target
- Latency: P95 < 2s (includes DeepAnalyze query)
- Accuracy: 85% of decomposition decisions should be optimal (measured by task success rate)

---

## 3. HALO INTEGRATION

### Purpose
HALO queries DeepAnalyze for **agent performance rankings** during routing decisions to select the best agent for each task.

### Integration Point
**File:** `orchestration/halo_router.py`
**Function:** `select_agent(task: Task) -> Agent`

### Implementation

```python
# orchestration/halo_router.py

import asyncio
from typing import List, Optional
from agents.deepanalyze_tools import recommend_agent_for_task

async def select_agent(task: Task) -> Agent:
    """
    Select best agent for task using HALO rules + DeepAnalyze data.

    Integration: Blends HALO logic-based routing with DeepAnalyze data-driven recommendation.
    Weights: 60% HALO rules, 40% DeepAnalyze data.
    Fallback: If DeepAnalyze unavailable, use 100% HALO rules.
    """

    # Step 1: Get HALO rule-based candidates (top 3)
    candidates = halo_rules.get_candidate_agents(task)  # Returns List[Agent]
    halo_first_choice = candidates[0]

    # Step 2: Query DeepAnalyze for data-driven recommendation
    try:
        recommendation = await asyncio.wait_for(
            recommend_agent_for_task(
                task_description=task.description,
                task_complexity=_estimate_task_complexity(task),
                consider_load=True,
                explain=False  # Don't need explanation (faster)
            ),
            timeout=1.5  # 1.5-second timeout
        )

        deepanalyze_choice = recommendation["recommended_agent"]
        deepanalyze_confidence = recommendation["confidence"]

    except asyncio.TimeoutError:
        logger.warning("DeepAnalyze timeout - using pure HALO routing")
        return halo_first_choice

    except Exception as e:
        logger.error(f"DeepAnalyze error: {e} - using pure HALO routing")
        return halo_first_choice

    # Step 3: Blend HALO + DeepAnalyze recommendations
    if deepanalyze_choice == halo_first_choice.name:
        # Agreement - high confidence
        logger.info(f"HALO + DeepAnalyze agree: {halo_first_choice.name}")
        return halo_first_choice

    elif deepanalyze_confidence > 0.80:
        # DeepAnalyze has high confidence - trust it
        logger.info(f"DeepAnalyze override (confidence={deepanalyze_confidence:.2f}): {deepanalyze_choice}")
        return agent_registry.get_agent(deepanalyze_choice)

    else:
        # DeepAnalyze has low confidence - trust HALO
        logger.info(f"HALO prevails (DeepAnalyze confidence={deepanalyze_confidence:.2f}): {halo_first_choice.name}")
        return halo_first_choice
```

### Data Flow

```
┌──────────┐
│   HALO   │
└────┬─────┘
     │ 1. Apply logic rules → get top 3 candidates
     │ 2. Call recommend_agent_for_task(task_desc)
     ↓
┌────────────────┐
│  DeepAnalyze   │
└────┬───────────┘
     │ 3. Embed task description (sentence-transformers)
     │ 4. Query Memory Store for similar historical tasks
     │ 5. Retrieve agent success rates on similar tasks
     │ 6. Adjust for current load
     │ 7. Return {recommended_agent, confidence}
     ↓
┌──────────┐
│   HALO   │
└────┬─────┘
     │ 8. Blend HALO + DeepAnalyze (60/40 weight)
     │ 9. Select final agent
     ↓
[Selected Agent]
```

### Performance Target
- Latency: P95 < 1.5s (agent selection must be fast)
- Accuracy: 90% agreement with HALO (DeepAnalyze should complement, not contradict)
- Improvement: 10-15% better task success rate vs pure HALO routing

---

## 4. MEMORY STORE INTEGRATION

### Purpose
Memory Store (MongoDB + Redis) is DeepAnalyze's **primary data source** for all analytics.

### MongoDB Collections Used

1. **task_executions** (Read: Heavy, Write: None)
   - Queries: Aggregate by agent, time window, status
   - Indexes: `{agent_name: 1, timestamp: -1}`, `{status: 1, timestamp: -1}`

2. **agent_performance** (Read: Heavy, Write: None)
   - Queries: Time series data for agent metrics
   - Indexes: `{agent_name: 1, timestamp: -1}`

3. **cost_records** (Read: Heavy, Write: None)
   - Queries: Sum costs by agent/model/period
   - Indexes: `{timestamp: -1}`, `{agent_name: 1, timestamp: -1}`

4. **evolution_archives** (Read: Medium, Write: None)
   - Queries: SE-Darwin convergence history
   - Indexes: `{agent_name: 1, timestamp: -1}`

5. **analytics_results** (Read: Medium, Write: Heavy)
   - DeepAnalyze stores computed insights here
   - Indexes: `{analysis_type: 1, timestamp: -1}`

### Redis Keys Used

1. **`agent:<name>:current_load`** (Read: Heavy, Write: None)
   - Real-time agent load percentage (0-100)
   - TTL: 60 seconds

2. **`metrics:cache:<query_hash>`** (Read: Heavy, Write: Heavy)
   - Cached query results (5-minute TTL)
   - Reduces MongoDB load for repeated queries

3. **`system:health_score`** (Read: Heavy, Write: Heavy)
   - Pre-computed system health score (0-10)
   - TTL: 10 seconds

4. **`cost:today:total`** (Read: Heavy, Write: None)
   - Running daily cost total
   - Reset at midnight UTC

### Implementation

```python
# agents/deepanalyze_memory_integration.py

import hashlib
import json
from pymongo import MongoClient
from redis import Redis

class MemoryStoreClient:
    """Wrapper for DeepAnalyze Memory Store access."""

    def __init__(self):
        self.mongo = MongoClient("mongodb://localhost:27017/genesis")
        self.redis = Redis(host="localhost", port=6379, db=0)
        self.db = self.mongo["genesis"]

    def query_with_cache(self, collection: str, query: dict, cache_ttl: int = 300):
        """
        Query MongoDB with Redis caching.

        Args:
            collection: MongoDB collection name
            query: Query dict
            cache_ttl: Cache TTL in seconds (default: 5 minutes)

        Returns:
            Query results (list of dicts)
        """
        # Generate cache key from query
        query_str = json.dumps(query, sort_keys=True)
        cache_key = f"metrics:cache:{hashlib.md5(query_str.encode()).hexdigest()}"

        # Check cache
        cached = self.redis.get(cache_key)
        if cached:
            return json.loads(cached)

        # Query MongoDB
        results = list(self.db[collection].find(query))

        # Store in cache
        self.redis.setex(cache_key, cache_ttl, json.dumps(results, default=str))

        return results

    def get_agent_load(self, agent_name: str) -> float:
        """Get real-time agent load from Redis."""
        load_str = self.redis.get(f"agent:{agent_name}:current_load")
        return float(load_str) if load_str else 0.0

    def store_analysis_result(self, analysis_type: str, result: dict):
        """Store computed analysis result in MongoDB."""
        self.db["analytics_results"].insert_one({
            "analysis_type": analysis_type,
            "timestamp": datetime.utcnow(),
            "result": result
        })
```

### Performance Target
- Query latency: P95 < 500ms for simple aggregations
- Cache hit rate: >70% for repeated queries
- MongoDB connection pool: 10-20 connections

---

## 5. OTEL INTEGRATION

### Purpose
DeepAnalyze scrapes **real-time metrics** from Prometheus (OTEL exporter) for live monitoring.

### Metrics Scraped

1. **task_duration_ms_bucket** (Histogram)
   - P50/P95/P99 latency by agent
   - Query: `histogram_quantile(0.95, sum by (agent, le) (rate(task_duration_ms_bucket[5m])))`

2. **task_errors_total** (Counter)
   - Error rate by agent/type
   - Query: `sum(rate(task_errors_total[5m])) by (agent, error_type)`

3. **llm_api_calls_total** (Counter)
   - LLM API call rate by model
   - Query: `sum(rate(llm_api_calls_total[5m])) by (model)`

4. **agent_cpu_usage_percent** (Gauge)
   - Current CPU usage by agent
   - Query: `agent_cpu_usage_percent`

### Implementation

```python
# agents/deepanalyze_otel_integration.py

from prometheus_api_client import PrometheusConnect

class OTELMetricsClient:
    """Wrapper for Prometheus metrics access."""

    def __init__(self):
        self.prom = PrometheusConnect(url="http://localhost:9090", disable_ssl=True)

    def get_p95_latency(self, agent_name: str, lookback_minutes: int = 5) -> float:
        """Get P95 task latency for an agent."""
        query = f"""
        histogram_quantile(0.95,
            sum by (le) (rate(task_duration_ms_bucket{{agent="{agent_name}"}}[{lookback_minutes}m]))
        )
        """
        result = self.prom.custom_query(query)
        return float(result[0]["value"][1]) if result else 0.0

    def get_error_rate(self, agent_name: str, lookback_minutes: int = 5) -> float:
        """Get error rate (errors/second) for an agent."""
        query = f"""
        sum(rate(task_errors_total{{agent="{agent_name}"}}[{lookback_minutes}m]))
        """
        result = self.prom.custom_query(query)
        return float(result[0]["value"][1]) if result else 0.0
```

### Performance Target
- Query latency: P95 < 200ms (Prometheus is fast)
- Update frequency: Scrape every 10 seconds for dashboards

---

## 6. GRAFANA INTEGRATION

### Purpose
DeepAnalyze provides **JSON data source** for Grafana dashboards.

### Dashboard Panels

1. **System Health Gauge** (0-10 score)
   - Data source: `generate_executive_dashboard().panels[0]`
   - Update: Every 10 seconds

2. **Task Success Rate** (7-day trend line)
   - Data source: `generate_executive_dashboard().panels[1]`
   - Update: Every 30 seconds

3. **Cost Trend** (daily spend + forecast)
   - Data source: `generate_cost_report(period="7d")`
   - Update: Every 5 minutes

4. **Agent Load Heatmap** (16 agents × current load %)
   - Data source: `aggregate_system_metrics().agents`
   - Update: Every 10 seconds

### Implementation

```python
# agents/deepanalyze_grafana_integration.py

from fastapi import FastAPI
from agents.deepanalyze_tools import generate_executive_dashboard, aggregate_system_metrics

app = FastAPI()

@app.get("/api/grafana/system_health")
async def system_health_endpoint():
    """Grafana data source for system health gauge."""
    metrics = await aggregate_system_metrics()
    return {
        "value": metrics["system_health_score"],
        "timestamp": metrics["timestamp"]
    }

@app.get("/api/grafana/dashboard")
async def dashboard_endpoint(period: str = "week"):
    """Grafana data source for full dashboard."""
    dashboard = await generate_executive_dashboard(period=period, format="grafana_json")
    return dashboard["panels"]
```

### Grafana Configuration

```yaml
# grafana/datasources/deepanalyze.yml
apiVersion: 1
datasources:
  - name: DeepAnalyze
    type: simpod-json-datasource
    url: http://localhost:8080/api/grafana
    access: proxy
    isDefault: false
```

---

## 7. SE-DARWIN INTEGRATION

### Purpose
SE-Darwin queries DeepAnalyze for **convergence predictions** and **optimization recommendations**.

### Integration Point
**File:** `agents/se_darwin_agent.py`
**Function:** `evolve_agent(agent_name: str) -> EvolutionResult`

### Implementation

```python
# agents/se_darwin_agent.py (integration snippet)

async def evolve_agent(self, agent_name: str) -> EvolutionResult:
    """
    Evolve agent with DeepAnalyze guidance.

    Integration: Queries DeepAnalyze before evolution to predict convergence time.
    """

    # Step 1: Query DeepAnalyze for convergence prediction
    try:
        prediction = await predict_evolution_convergence(
            agent_name=agent_name,
            task_complexity=self._estimate_complexity(),
            historical_data=True
        )

        predicted_iterations = prediction["predicted_iterations"]
        estimated_cost = prediction["estimated_cost_usd"]

        logger.info(f"DeepAnalyze predicts {predicted_iterations} iterations (${estimated_cost:.2f})")

        # If predicted iterations > 80, enable sparse memory optimization
        if predicted_iterations > 80:
            logger.warning(f"High iteration count predicted - enabling sparse memory finetuning")
            self.enable_sparse_memory_finetuning()

    except Exception as e:
        logger.error(f"DeepAnalyze prediction failed: {e} - proceeding without optimization")
        predicted_iterations = None

    # Step 2: Run evolution loop
    result = await self._evolution_loop(agent_name)

    # Step 3: Report actual results back to DeepAnalyze for learning
    await self._report_evolution_result(result, predicted_iterations)

    return result


async def _report_evolution_result(self, result: EvolutionResult, predicted: Optional[int]):
    """Log evolution result for DeepAnalyze to learn from."""
    actual_iterations = result.iterations

    # Store in analytics_results collection
    memory_client.store_analysis_result(
        analysis_type="evolution_convergence",
        result={
            "agent_name": result.agent_name,
            "predicted_iterations": predicted,
            "actual_iterations": actual_iterations,
            "prediction_error_pct": ((actual_iterations - predicted) / predicted * 100) if predicted else None,
            "cost_usd": result.cost_usd
        }
    )
```

---

## 8. INTER-AGENT COMMUNICATION

### A2A Protocol Usage

DeepAnalyze supports **Agent-to-Agent (A2A) protocol** for async communication:

```json
{
    "jsonrpc": "2.0",
    "method": "analyze_agent_performance",
    "params": {
        "agent_name": "Thon",
        "timeframe": "7d",
        "metrics": ["latency", "success_rate"]
    },
    "id": "req_20251024_001"
}
```

**Response:**
```json
{
    "jsonrpc": "2.0",
    "result": {
        "agent": "Thon",
        "summary": {
            "success_rate": 0.943,
            "avg_latency_ms": 3421
        }
    },
    "id": "req_20251024_001"
}
```

### Universal Agent Query Pattern

Any agent can query DeepAnalyze:

```python
# From any agent
from agents.deepanalyze_tools import analyze_agent_performance

# Self-performance check
my_performance = await analyze_agent_performance(
    agent_name=self.name,
    timeframe="7d"
)

if my_performance["summary"]["success_rate"] < 0.90:
    logger.warning(f"{self.name} success rate below 90% - requesting SE-Darwin evolution")
    await se_darwin_agent.evolve_me()
```

---

## 9. DEPLOYMENT CONFIGURATION

### Service Deployment

```yaml
# docker-compose.yml (DeepAnalyze service)

version: "3.8"
services:
  deepanalyze:
    image: genesis/deepanalyze:latest
    container_name: deepanalyze_agent
    ports:
      - "8080:8080"  # FastAPI server
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/genesis
      - REDIS_URI=redis://redis:6379/0
      - PROMETHEUS_URI=http://prometheus:9090
      - LLM_API_KEY=${LLM_API_KEY}
    depends_on:
      - mongodb
      - redis
      - prometheus
    resources:
      limits:
        cpus: "2.0"
        memory: "4G"
      reservations:
        cpus: "0.5"
        memory: "1G"
    restart: unless-stopped
```

### Environment Variables

```bash
# .env (DeepAnalyze configuration)

# Data sources
MONGODB_URI=mongodb://localhost:27017/genesis
REDIS_URI=redis://localhost:6379/0
PROMETHEUS_URI=http://localhost:9090

# LLM APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...

# Performance tuning
DEEPANALYZE_CACHE_TTL=300  # 5 minutes
DEEPANALYZE_QUERY_TIMEOUT=5  # 5 seconds
DEEPANALYZE_MAX_WORKERS=10  # Async workers

# Feature flags
DEEPANALYZE_ENABLE_PREDICTIONS=true
DEEPANALYZE_ENABLE_GRAFANA_EXPORT=true
DEEPANALYZE_ENABLE_WEEKLY_REPORTS=true
```

### Health Check

```python
# agents/deepanalyze_service.py

from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
async def health_check():
    """Health check endpoint for Kubernetes/Docker."""
    try:
        # Check MongoDB connection
        mongo_client.admin.command("ping")

        # Check Redis connection
        redis_client.ping()

        # Check Prometheus connection
        prom_client.custom_query("up")

        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "services": {
                "mongodb": "up",
                "redis": "up",
                "prometheus": "up"
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }, 503
```

---

## SUMMARY

DeepAnalyze integrates with Genesis via **9 integration points**:

1. **HTDAG:** Task complexity prediction for decomposition decisions
2. **HALO:** Agent recommendation for routing optimization
3. **Memory Store:** Primary data source (MongoDB + Redis)
4. **OTEL:** Real-time metrics scraping (Prometheus)
5. **Grafana:** Dashboard data provider
6. **SE-Darwin:** Evolution convergence prediction
7. **All Agents:** Self-performance monitoring
8. **A2A Protocol:** Inter-agent async communication
9. **Docker:** Containerized deployment with health checks

**Deployment Timeline:**
- Day 5: Tool implementation (Thon/Nova/Vanguard)
- Day 6: Integration testing (Alex)
- Day 7: Production deployment (7-day progressive rollout)

**Expected Impact:**
- 10-15% better task success rate (HALO routing optimization)
- 50% faster evolution convergence (SE-Darwin optimization)
- $20-50/month cost savings (proactive anomaly detection)
- <5s latency (P95) for all analytics queries
