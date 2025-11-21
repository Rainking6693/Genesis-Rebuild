"""
MCP Security Monitoring and Metrics

Provides monitoring utilities for MCP security features:
- Audit log parsing and analysis
- Prometheus metrics aggregation
- Security event alerts
"""

import json
import re
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from collections import defaultdict, Counter

logger = logging.getLogger(__name__)

# Try to import Prometheus
try:
    from prometheus_client import Counter, Histogram, Gauge, CollectorRegistry, generate_latest
    PROMETHEUS_AVAILABLE = True
except ImportError:
    PROMETHEUS_AVAILABLE = False
    logger.warning("Prometheus not available, metrics disabled")


class MCPAuditLogParser:
    """Parse and analyze MCP audit logs"""
    
    def __init__(self):
        self.events: List[Dict[str, Any]] = []
    
    def parse_log_line(self, line: str) -> Optional[Dict[str, Any]]:
        """Parse a single audit log line"""
        if "MCP_AUDIT:" not in line:
            return None
        
        try:
            # Extract JSON from log line
            json_start = line.find("{")
            if json_start == -1:
                return None
            
            json_str = line[json_start:]
            event = json.loads(json_str)
            return event
        except (json.JSONDecodeError, ValueError) as e:
            logger.warning(f"Failed to parse audit log line: {e}")
            return None
    
    def load_logs(self, log_file: str, max_lines: Optional[int] = None) -> int:
        """Load audit logs from file"""
        count = 0
        try:
            with open(log_file, 'r') as f:
                for i, line in enumerate(f):
                    if max_lines and i >= max_lines:
                        break
                    event = self.parse_log_line(line)
                    if event:
                        self.events.append(event)
                        count += 1
        except FileNotFoundError:
            logger.warning(f"Log file not found: {log_file}")
        except Exception as e:
            logger.error(f"Error loading logs: {e}")
        
        return count
    
    def get_events_by_type(self, event_type: str) -> List[Dict[str, Any]]:
        """Get all events of a specific type"""
        return [e for e in self.events if e.get("event") == event_type]
    
    def get_tool_call_stats(self) -> Dict[str, Any]:
        """Get statistics about tool calls"""
        tool_calls = self.get_events_by_type("mcp_tool_call")
        
        stats = {
            "total_calls": len(tool_calls),
            "successful": len([e for e in tool_calls if e.get("success")]),
            "failed": len([e for e in tool_calls if not e.get("success")]),
            "by_tool": Counter(),
            "by_user": Counter(),
            "by_agent": Counter(),
            "error_types": Counter(),
            "avg_latency_ms": 0.0,
        }
        
        latencies = []
        for event in tool_calls:
            tool_name = event.get("tool_name", "unknown")
            user_id = event.get("user_id", "anonymous")
            agent_name = event.get("agent_name", "unknown")
            latency = event.get("latency_ms", 0)
            
            stats["by_tool"][tool_name] += 1
            stats["by_user"][user_id] += 1
            stats["by_agent"][agent_name] += 1
            
            if latency:
                latencies.append(latency)
            
            if not event.get("success"):
                error_type = event.get("error_type", "unknown")
                stats["error_types"][error_type] += 1
        
        if latencies:
            stats["avg_latency_ms"] = sum(latencies) / len(latencies)
        
        return stats
    
    def get_security_events(self) -> Dict[str, Any]:
        """Get security-related events"""
        access_denied = self.get_events_by_type("mcp_access_denied")
        rate_limits = self.get_events_by_type("mcp_rate_limit")
        budget_exceeded = self.get_events_by_type("mcp_budget_exceeded")
        
        return {
            "access_denied": {
                "count": len(access_denied),
                "by_tool": Counter(e.get("tool_name") for e in access_denied),
                "by_user": Counter(e.get("user_id") for e in access_denied),
            },
            "rate_limits": {
                "count": len(rate_limits),
                "by_tool": Counter(e.get("tool_name") for e in rate_limits),
                "by_user": Counter(e.get("user_id") for e in rate_limits),
            },
            "budget_exceeded": {
                "count": len(budget_exceeded),
                "by_user": Counter(e.get("user_id") for e in budget_exceeded),
            },
        }
    
    def get_recent_events(self, hours: int = 24) -> List[Dict[str, Any]]:
        """Get events from the last N hours"""
        cutoff = datetime.utcnow() - timedelta(hours=hours)
        
        recent = []
        for event in self.events:
            timestamp_str = event.get("timestamp")
            if timestamp_str:
                try:
                    event_time = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
                    if event_time >= cutoff:
                        recent.append(event)
                except ValueError:
                    continue
        
        return recent


class MCPMetricsCollector:
    """Collect and aggregate MCP metrics"""
    
    def __init__(self):
        self.registry = CollectorRegistry() if PROMETHEUS_AVAILABLE else None
        self._setup_metrics()
    
    def _setup_metrics(self):
        """Setup Prometheus metrics"""
        if not PROMETHEUS_AVAILABLE:
            return
        
        self.tool_calls_total = Counter(
            'mcp_tool_calls_total',
            'Total MCP tool calls',
            ['tool_name', 'server_id', 'status', 'user_id'],
            registry=self.registry
        )
        
        self.tool_call_duration = Histogram(
            'mcp_tool_call_duration_seconds',
            'MCP tool call duration',
            ['tool_name', 'server_id'],
            registry=self.registry
        )
        
        self.errors_total = Counter(
            'mcp_tool_call_errors_total',
            'Total MCP errors',
            ['tool_name', 'error_type'],
            registry=self.registry
        )
        
        self.rate_limit_hits = Counter(
            'mcp_rate_limit_hits_total',
            'Total rate limit hits',
            ['tool_name', 'user_id'],
            registry=self.registry
        )
        
        self.budget_exceeded = Counter(
            'mcp_budget_exceeded_total',
            'Total budget exceeded events',
            ['user_id'],
            registry=self.registry
        )
    
    def export_metrics(self) -> str:
        """Export metrics in Prometheus format"""
        if not PROMETHEUS_AVAILABLE:
            return "# Prometheus not available\n"
        
        return generate_latest(self.registry).decode('utf-8')
    
    def get_summary(self) -> Dict[str, Any]:
        """Get metrics summary"""
        if not PROMETHEUS_AVAILABLE:
            return {"error": "Prometheus not available"}
        
        # Note: This is a simplified summary
        # In production, you'd query the actual metrics
        return {
            "status": "metrics_collected",
            "prometheus_available": True,
        }


class MCPSecurityMonitor:
    """Monitor MCP security events and generate alerts"""
    
    def __init__(self, alert_thresholds: Optional[Dict[str, int]] = None):
        self.alert_thresholds = alert_thresholds or {
            "access_denied_per_hour": 10,
            "rate_limit_hits_per_hour": 20,
            "budget_exceeded_per_hour": 5,
            "error_rate_percent": 10,
        }
        self.alerts: List[Dict[str, Any]] = []
    
    def check_security_events(
        self,
        parser: MCPAuditLogParser,
        hours: int = 1
    ) -> List[Dict[str, Any]]:
        """Check for security events and generate alerts"""
        recent = parser.get_recent_events(hours=hours)
        security = parser.get_security_events()
        
        alerts = []
        
        # Check access denied rate
        access_denied_count = security["access_denied"]["count"]
        if access_denied_count >= self.alert_thresholds["access_denied_per_hour"]:
            alerts.append({
                "type": "high_access_denied",
                "severity": "warning",
                "message": f"High access denied rate: {access_denied_count} in last {hours}h",
                "count": access_denied_count,
            })
        
        # Check rate limit hits
        rate_limit_count = security["rate_limits"]["count"]
        if rate_limit_count >= self.alert_thresholds["rate_limit_hits_per_hour"]:
            alerts.append({
                "type": "high_rate_limits",
                "severity": "info",
                "message": f"High rate limit hits: {rate_limit_count} in last {hours}h",
                "count": rate_limit_count,
            })
        
        # Check budget exceeded
        budget_count = security["budget_exceeded"]["count"]
        if budget_count >= self.alert_thresholds["budget_exceeded_per_hour"]:
            alerts.append({
                "type": "high_budget_exceeded",
                "severity": "warning",
                "message": f"High budget exceeded events: {budget_count} in last {hours}h",
                "count": budget_count,
            })
        
        # Check error rate
        stats = parser.get_tool_call_stats()
        if stats["total_calls"] > 0:
            error_rate = (stats["failed"] / stats["total_calls"]) * 100
            if error_rate >= self.alert_thresholds["error_rate_percent"]:
                alerts.append({
                    "type": "high_error_rate",
                    "severity": "error",
                    "message": f"High error rate: {error_rate:.1f}%",
                    "error_rate": error_rate,
                })
        
        self.alerts.extend(alerts)
        return alerts
    
    def get_alerts_summary(self) -> Dict[str, Any]:
        """Get summary of all alerts"""
        by_severity = Counter(a.get("severity") for a in self.alerts)
        by_type = Counter(a.get("type") for a in self.alerts)
        
        return {
            "total_alerts": len(self.alerts),
            "by_severity": dict(by_severity),
            "by_type": dict(by_type),
            "recent_alerts": self.alerts[-10:],  # Last 10 alerts
        }


def monitor_mcp_security(log_file: str = "autonomous_run.log") -> Dict[str, Any]:
    """
    Monitor MCP security from log file.
    
    Args:
        log_file: Path to log file
    
    Returns:
        Monitoring report
    """
    parser = MCPAuditLogParser()
    parser.load_logs(log_file)
    
    monitor = MCPSecurityMonitor()
    alerts = monitor.check_security_events(parser, hours=1)
    
    stats = parser.get_tool_call_stats()
    security = parser.get_security_events()
    
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "tool_call_stats": stats,
        "security_events": security,
        "alerts": alerts,
        "alerts_summary": monitor.get_alerts_summary(),
    }


if __name__ == "__main__":
    # Example usage
    report = monitor_mcp_security("autonomous_run.log")
    print(json.dumps(report, indent=2))

