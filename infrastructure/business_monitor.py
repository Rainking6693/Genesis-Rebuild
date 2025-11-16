"""
Business Generation Monitor

Tracks and monitors agent activity for generating 100s of businesses.
Provides real-time metrics, logs, and dashboard data.
"""

import json
import time
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field, asdict
from collections import defaultdict

from monitoring.payment_metrics import record_payment_metrics

logger = logging.getLogger(__name__)


@dataclass
class BusinessGenerationMetrics:
    """Metrics for a single business generation."""
    business_name: str
    business_type: str
    start_time: float
    end_time: Optional[float] = None
    status: str = "in_progress"  # in_progress, completed, failed
    components_requested: int = 0
    components_completed: int = 0
    components_failed: int = 0
    files_generated: int = 0
    lines_of_code: int = 0
    cost_usd: float = 0.0
    quality_score: float = 0.0
    total_revenue: float = 0.0
    errors: List[str] = field(default_factory=list)
    agent_calls: int = 0
    vertex_ai_calls: int = 0
    local_llm_calls: int = 0
    retry_count: int = 0
    payments: List[Dict[str, Any]] = field(default_factory=list)
    
    @property
    def duration_seconds(self) -> float:
        if self.end_time:
            return self.end_time - self.start_time
        return time.time() - self.start_time
    
    @property
    def success_rate(self) -> float:
        total = self.components_completed + self.components_failed
        if total == 0:
            return 0.0
        return (self.components_completed / total) * 100
    
    def to_dict(self) -> Dict[str, Any]:
        data = asdict(self)
        data['duration_seconds'] = self.duration_seconds
        data['success_rate'] = self.success_rate
        return data


class BusinessMonitor:
    """
    Monitor for tracking agent business generation activity.
    
    Stores metrics for all businesses being generated, provides
    real-time stats, and writes logs for dashboard consumption.
    """
    
    def __init__(self, log_dir: Path = None):
        self.log_dir = log_dir or Path("logs/business_generation")
        self.log_dir.mkdir(parents=True, exist_ok=True)
        
        # In-memory tracking
        self.businesses: Dict[str, BusinessGenerationMetrics] = {}
        self.global_stats = {
            "total_businesses": 0,
            "completed": 0,
            "failed": 0,
            "in_progress": 0,
            "total_components": 0,
            "total_files": 0,
            "total_lines_of_code": 0,
            "total_cost_usd": 0.0,
            "start_time": time.time()
        }
        
        # Component tracking by type
        self.component_stats: Dict[str, Dict[str, int]] = defaultdict(lambda: {"attempted": 0, "succeeded": 0, "failed": 0})
        
        # Agent usage tracking
        self.agent_usage = defaultdict(int)
        self.payments: List[Dict[str, Any]] = []
        self.payment_records: List[Dict[str, Any]] = []
        
        logger.info(f"Business monitor initialized (log_dir={self.log_dir})")
    
    def start_business(self, name: str, business_type: str, components: List[str]) -> str:
        """Start tracking a new business generation."""
        business_id = f"{business_type}_{name.lower().replace(' ', '_')}_{int(time.time())}"
        
        metrics = BusinessGenerationMetrics(
            business_name=name,
            business_type=business_type,
            start_time=time.time(),
            components_requested=len(components)
        )
        
        self.businesses[business_id] = metrics
        self.global_stats["total_businesses"] += 1
        self.global_stats["in_progress"] += 1
        
        logger.info(f"Started tracking: {name} (type={business_type}, components={len(components)})")
        self._write_event("business_started", {
            "business_id": business_id,
            "name": name,
            "type": business_type,
            "components": components
        })
        
        return business_id
    
    def record_component_start(self, business_id: str, component_name: str, agent_name: str):
        """Record that a component generation has started."""
        if business_id not in self.businesses:
            logger.warning(f"Unknown business_id: {business_id}")
            return
        
        self.component_stats[component_name]["attempted"] += 1
        self.agent_usage[agent_name] += 1
        self.businesses[business_id].agent_calls += 1
        
        self._write_event("component_started", {
            "business_id": business_id,
            "component": component_name,
            "agent": agent_name
        })
    
    def record_component_complete(self, business_id: str, component_name: str, 
                                 lines_of_code: int, cost: float, used_vertex: bool):
        """Record successful component generation."""
        if business_id not in self.businesses:
            return
        
        biz = self.businesses[business_id]
        biz.components_completed += 1
        biz.files_generated += 1
        biz.lines_of_code += lines_of_code
        biz.cost_usd += cost
        
        if used_vertex:
            biz.vertex_ai_calls += 1
        else:
            biz.local_llm_calls += 1
        
        self.component_stats[component_name]["succeeded"] += 1
        self.global_stats["total_components"] += 1
        self.global_stats["total_files"] += 1
        self.global_stats["total_lines_of_code"] += lines_of_code
        self.global_stats["total_cost_usd"] += cost
        
        self._write_event("component_completed", {
            "business_id": business_id,
            "component": component_name,
            "lines": lines_of_code,
            "cost": cost,
            "vertex_ai": used_vertex
        })
    
    def record_component_failed(self, business_id: str, component_name: str, error: str):
        """Record failed component generation."""
        if business_id not in self.businesses:
            return
        
        biz = self.businesses[business_id]
        biz.components_failed += 1
        biz.errors.append(f"{component_name}: {error}")
        
        self.component_stats[component_name]["failed"] += 1
        
        self._write_event("component_failed", {
            "business_id": business_id,
            "component": component_name,
            "error": error
        })
    
    def record_retry(self, business_id: str, component_name: str, attempt: int):
        """Record a retry attempt."""
        if business_id not in self.businesses:
            return

        self.businesses[business_id].retry_count += 1

        self._write_event("component_retry", {
            "business_id": business_id,
            "component": component_name,
            "attempt": attempt
        })

    def record_quality_score(self, business_id: str, quality_score: float):
        """Record quality score from deployment verification."""
        if business_id not in self.businesses:
            return

        self.businesses[business_id].quality_score = max(0.0, min(100.0, quality_score))

        self._write_event("quality_score_recorded", {
            "business_id": business_id,
            "quality_score": self.businesses[business_id].quality_score
        })

    def complete_business(self, business_id: str, success: bool):
        """Mark a business as completed."""
        if business_id not in self.businesses:
            return
        
        biz = self.businesses[business_id]
        biz.end_time = time.time()
        biz.status = "completed" if success else "failed"
        
        self.global_stats["in_progress"] -= 1
        if success:
            self.global_stats["completed"] += 1
        else:
            self.global_stats["failed"] += 1
        
        logger.info(f"Completed: {biz.business_name} ({biz.duration_seconds:.1f}s, {biz.components_completed}/{biz.components_requested} components)")
        
        self._write_event("business_completed", {
            "business_id": business_id,
            "success": success,
            "duration": biz.duration_seconds,
            "components": biz.components_completed,
            "cost": biz.cost_usd
        })
        
        # Write summary
        self._write_business_summary(business_id, biz)

    def record_rubric_report(self, business_id: str, report: Dict[str, Any]):
        """Log rubric outcomes for dashboard/alerts."""
        if business_id not in self.businesses:
            logger.warning("Rubric report for unknown business %s", business_id)
        self._write_event("rubric_report", {"business_id": business_id, "report": report})
        alerts_path = self.log_dir / "rubric_alerts.jsonl"
        with alerts_path.open("a", encoding="utf-8") as fd:
            fd.write(json.dumps({"business_id": business_id, "report": report}) + "\n")

    def record_ap2_event(self, event: Dict[str, Any]):
        """Record an AP2 event for dashboards, metrics, and compliance reporting."""
        self._write_event("ap2_event", event)

        ap2_dir = Path("logs/ap2")
        ap2_dir.mkdir(parents=True, exist_ok=True)

        metrics_path = ap2_dir / "ap2_metrics.json"
        metrics_payload = {
            "timestamp": time.time(),
            "agent": event.get("agent"),
            "action": event.get("action"),
            "cost_usd": event.get("cost_usd", 0.0),
            "budget_usd": event.get("budget_usd", 0.0),
            "context": event.get("context", {}),
        }
        with metrics_path.open("a", encoding="utf-8") as fd:
            fd.write(json.dumps(metrics_payload) + "\n")

        compliance_path = Path("reports/ap2_compliance.jsonl")
        compliance_path.parent.mkdir(parents=True, exist_ok=True)
        cost = float(event.get("cost_usd", 0.0))
        budget = float(event.get("budget_usd", 0.0)) if event.get("budget_usd") else None
        ratio = (cost / budget) if budget and budget > 0 else None
        compliance_payload = {
            "timestamp": event.get("timestamp") or datetime.now(timezone.utc).isoformat(),
            "agent": event.get("agent"),
            "action": event.get("action"),
            "cost_usd": cost,
            "budget_usd": budget,
            "usage_ratio": round(ratio, 3) if ratio is not None else None,
            "context": event.get("context", {}),
        }
        with compliance_path.open("a", encoding="utf-8") as fd:
            fd.write(json.dumps(compliance_payload) + "\n")

    def log_payment(
        self,
        agent_name: str,
        payment_type: str,
        amount_usd: float,
        transaction_hash: Optional[str] = None,
        resource: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        mandate_id: Optional[str] = None
    ) -> None:
        """Log a payment (x402 or AP2) for auditing."""
        metadata = metadata or {}
        record = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "agent": agent_name,
            "payment_type": payment_type,
            "amount_usd": amount_usd,
            "resource": resource,
            "transaction_hash": transaction_hash,
            "mandate_id": mandate_id,
            "metadata": metadata,
        }
        self.payments.append(record)
        payments_path = self.log_dir / "payments.jsonl"
        with payments_path.open("a", encoding="utf-8") as fd:
            fd.write(json.dumps(record) + "\n")
        if payment_type and payment_type.lower() == "media":
            self.payment_records.append(record)
            try:
                record_payment_metrics(
                    agent_name,
                    metadata.get("vendor") or "unknown",
                    metadata.get("chain") or record.get("metadata", {}).get("chain", "base"),
                    metadata.get("status") or record.get("metadata", {}).get("status", "success"),
                    amount_usd,
                )
            except Exception:
                logger.debug("record_payment_metrics failed", exc_info=True)

        transactions_path = Path("data/x402/transactions.jsonl")
        transactions_path.parent.mkdir(parents=True, exist_ok=True)
        transaction_record = {
            **record,
            "status": metadata.get("status") or record.get("metadata", {}).get("status") or "success"
        }
        with transactions_path.open("a", encoding="utf-8") as fd:
            fd.write(json.dumps(transaction_record) + "\n")

    def get_payment_metrics(self) -> Dict[str, Any]:
        """Return aggregated payment information."""
        total_payments = len(self.payment_records)
        total_amount = sum(float(p.get("amount_usd", p.get("amount", 0.0))) for p in self.payment_records)
        agent_breakdown: Dict[str, float] = {}
        for record in self.payment_records:
            agent = record.get("agent") or "unknown"
            agent_breakdown[agent] = agent_breakdown.get(agent, 0.0) + float(record.get("amount_usd", record.get("amount", 0.0)))

        recent = [
            {
                "agent": entry.get("agent"),
                "amount_usd": float(entry.get("amount_usd", entry.get("amount", 0.0))),
                "resource": entry.get("resource"),
                "timestamp": entry.get("timestamp")
            }
            for entry in self.payment_records[-10:]
        ]

        average_payment = total_amount / total_payments if total_payments else 0.0
        return {
            "total_payments": total_payments,
            "total_amount_usd": total_amount,
            "average_payment": average_payment,
            "agent_breakdown": agent_breakdown,
            "recent_payments": recent
        }
    
    def get_business_metrics(self, business_id: str) -> Optional[Dict[str, Any]]:
        """Get metrics for a specific business."""
        if business_id not in self.businesses:
            return None
        return self.businesses[business_id].to_dict()
    
    def get_global_stats(self) -> Dict[str, Any]:
        """Get global statistics."""
        stats = self.global_stats.copy()
        stats["uptime_seconds"] = time.time() - stats["start_time"]
        stats["avg_cost_per_business"] = (
            stats["total_cost_usd"] / stats["completed"] if stats["completed"] > 0 else 0.0
        )
        stats["avg_components_per_business"] = (
            stats["total_components"] / stats["completed"] if stats["completed"] > 0 else 0.0
        )
        return stats
    
    def get_component_stats(self) -> Dict[str, Dict[str, Any]]:
        """Get per-component statistics."""
        result = {}
        for component, stats in self.component_stats.items():
            total = stats["attempted"]
            result[component] = {
                **stats,
                "success_rate": (stats["succeeded"] / total * 100) if total > 0 else 0.0
            }
        return result
    
    def get_agent_usage(self) -> Dict[str, int]:
        """Get agent usage statistics."""
        return dict(self.agent_usage)
    
    def get_dashboard_data(self) -> Dict[str, Any]:
        """Get all data formatted for dashboard display."""
        return {
            "global_stats": self.get_global_stats(),
            "component_stats": self.get_component_stats(),
            "agent_usage": self.get_agent_usage(),
            "active_businesses": [
                {
                    "id": bid,
                    "name": biz.business_name,
                    "type": biz.business_type,
                    "progress": f"{biz.components_completed}/{biz.components_requested}",
                    "duration": f"{biz.duration_seconds:.1f}s",
                    "status": biz.status
                }
                for bid, biz in self.businesses.items()
                if biz.status == "in_progress"
            ],
            "recent_completions": [
                {
                    "name": biz.business_name,
                    "type": biz.business_type,
                    "duration": f"{biz.duration_seconds:.1f}s",
                    "components": biz.components_completed,
                    "cost": f"${biz.cost_usd:.4f}",
                    "success_rate": f"{biz.success_rate:.1f}%"
                }
                for bid, biz in sorted(
                    self.businesses.items(),
                    key=lambda x: x[1].end_time or 0,
                    reverse=True
                )[:10]
                if biz.status in ["completed", "failed"]
            ],
            "x402_metrics": self.get_x402_metrics()
        }
    
    def _write_event(self, event_type: str, data: Dict[str, Any]):
        """Write an event to the log file."""
        from datetime import timezone
        event = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "event_type": event_type,
            "data": data
        }
        
        # Write to events log (JSONL format)
        events_file = self.log_dir / "events.jsonl"
        with open(events_file, "a") as f:
            f.write(json.dumps(event) + "\n")
    
    def _write_business_summary(self, business_id: str, metrics: BusinessGenerationMetrics):
        """Write a summary file for a completed business."""
        summary_file = self.log_dir / f"{business_id}_summary.json"
        with open(summary_file, "w") as f:
            json.dump(metrics.to_dict(), f, indent=2)
    
    def write_dashboard_snapshot(self):
        """Write current dashboard data to file."""
        snapshot_file = self.log_dir / "dashboard_snapshot.json"
        with open(snapshot_file, "w") as f:
            json.dump(self.get_dashboard_data(), f, indent=2)


# Global monitor instance
_monitor: Optional[BusinessMonitor] = None


def get_monitor() -> BusinessMonitor:
    """Get or create the global monitor instance."""
    global _monitor
    if _monitor is None:
        _monitor = BusinessMonitor()
    return _monitor
