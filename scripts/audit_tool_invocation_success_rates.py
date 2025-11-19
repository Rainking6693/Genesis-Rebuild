#!/usr/bin/env python3
"""
DeepEyesV2 Phase 1: Measure Current Tool Invocation Success Rates

Audits all 21 agents for tool usage:
- Which tools, how often, success rate
- Track failures: timeout, API errors, invalid parameters, wrong tool selected
- Calculate baseline success rate per agent
"""

import json
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, List, DefaultDict
from collections import defaultdict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

AGENT_TOOLS = {
    "builder_agent": ["code_execution", "file_operations", "git_operations"],
    "research_agent": ["web_search", "document_parsing", "data_extraction"],
    "qa_agent": ["test_execution", "code_analysis", "bug_detection"],
    "deploy_agent": ["railway_api", "vercel_api", "docker_operations"],
    "marketing_agent": ["ad_platform_apis", "social_media_apis", "analytics_apis"],
    "seo_agent": ["ahrefs_api", "semrush_api", "google_search_console"],
    "content_agent": ["stock_image_api", "video_api", "cms_api"],
    "legal_agent": ["document_analysis", "compliance_check"],
    "finance_agent": ["payment_processing", "accounting_apis"],
    "support_agent": ["ticket_system", "email_api"],
    "sales_agent": ["crm_api", "email_marketing"],
    "hr_agent": ["recruitment_apis", "payroll_apis"],
    "product_agent": ["analytics_apis", "feature_flags"],
    "security_agent": ["vulnerability_scanning", "security_audit"],
    "infrastructure_agent": ["cloud_apis", "monitoring_apis"],
    "data_agent": ["database_operations", "data_processing"],
    "ml_agent": ["model_training", "inference_apis"],
    "design_agent": ["design_tools", "image_processing"],
    "mobile_agent": ["mobile_platform_apis"],
    "integration_agent": ["webhook_management", "api_integration"],
    "analytics_agent": ["data_visualization", "reporting_apis"]
}

FAILURE_TYPES = ["timeout", "api_error", "invalid_parameters", "wrong_tool", "network_error", "auth_error"]


def analyze_tool_logs(log_dir: Path) -> Dict[str, any]:
    """Analyze tool invocation logs to extract success rates."""
    agent_stats: DefaultDict[str, Dict] = defaultdict(lambda: {
        "total_invocations": 0,
        "successful": 0,
        "failed": 0,
        "failures_by_type": defaultdict(int),
        "tools_used": defaultdict(int),
        "tools_success": defaultdict(int),
        "tools_failed": defaultdict(int)
    })
    
    # Scan for tool invocation logs
    for log_file in log_dir.glob("**/*.json"):
        try:
            data = json.loads(log_file.read_text())
            if "agent_name" in data and "tool_name" in data:
                agent = data["agent_name"]
                tool = data["tool_name"]
                success = data.get("success", False)
                failure_type = data.get("failure_type", "unknown")
                
                stats = agent_stats[agent]
                stats["total_invocations"] += 1
                stats["tools_used"][tool] += 1
                
                if success:
                    stats["successful"] += 1
                    stats["tools_success"][tool] += 1
                else:
                    stats["failed"] += 1
                    stats["failures_by_type"][failure_type] += 1
                    stats["tools_failed"][tool] += 1
        except Exception as e:
            logger.debug(f"Skipping log file {log_file}: {e}")
    
    # Calculate success rates
    results = {}
    overall_stats = {
        "total_invocations": 0,
        "total_successful": 0,
        "total_failed": 0,
        "overall_success_rate": 0.0
    }
    
    for agent, stats in agent_stats.items():
        success_rate = (stats["successful"] / stats["total_invocations"] * 100) if stats["total_invocations"] > 0 else 0
        
        results[agent] = {
            "total_invocations": stats["total_invocations"],
            "successful": stats["successful"],
            "failed": stats["failed"],
            "success_rate": success_rate,
            "tools_used": dict(stats["tools_used"]),
            "failure_distribution": dict(stats["failures_by_type"]),
            "tool_success_rates": {
                tool: (stats["tools_success"][tool] / stats["tools_used"][tool] * 100)
                if stats["tools_used"][tool] > 0 else 0
                for tool in stats["tools_used"]
            }
        }
        
        overall_stats["total_invocations"] += stats["total_invocations"]
        overall_stats["total_successful"] += stats["successful"]
        overall_stats["total_failed"] += stats["failed"]
    
    overall_stats["overall_success_rate"] = (
        overall_stats["total_successful"] / overall_stats["total_invocations"] * 100
    ) if overall_stats["total_invocations"] > 0 else 0
    
    return {
        "agents": results,
        "overall": overall_stats,
        "timestamp": datetime.now().isoformat()
    }


def main():
    """Audit tool invocation success rates."""
    log_dir = Path("data/tool_logs")
    if not log_dir.exists():
        log_dir = Path("data/agentevolver")  # Fallback
    
    logger.info("Auditing tool invocation success rates...")
    results = analyze_tool_logs(log_dir)
    
    print("\n" + "="*60)
    print("Tool Invocation Success Rate Audit")
    print("="*60)
    print(f"\nOverall Statistics:")
    print(f"  Total Invocations: {results['overall']['total_invocations']}")
    print(f"  Successful: {results['overall']['total_successful']}")
    print(f"  Failed: {results['overall']['total_failed']}")
    print(f"  Success Rate: {results['overall']['overall_success_rate']:.1f}%")
    
    print(f"\nPer-Agent Statistics:")
    for agent, stats in sorted(results["agents"].items(), key=lambda x: x[1]["success_rate"], reverse=True):
        print(f"\n  {agent}:")
        print(f"    Invocations: {stats['total_invocations']}")
        print(f"    Success Rate: {stats['success_rate']:.1f}%")
        if stats["failure_distribution"]:
            print(f"    Failures: {dict(stats['failure_distribution'])}")
        if stats["tool_success_rates"]:
            top_tools = sorted(stats["tool_success_rates"].items(), key=lambda x: x[1], reverse=True)[:3]
            print(f"    Top Tools: {', '.join(f'{t}({r:.0f}%)' for t, r in top_tools)}")
    
    print("="*60)
    
    # Save results
    output_path = Path("data/deepeyes/baseline_tool_success_rates.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(results, indent=2))
    logger.info(f"Results saved to {output_path}")


if __name__ == "__main__":
    main()

