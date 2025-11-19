import asyncio
import time

from infrastructure.business_monitor import BusinessGenerationMetrics, BusinessMonitor


def test_component_attribution_records_contribution(tmp_path):
    monitor = BusinessMonitor(log_dir=tmp_path / "logs")
    business_id = "testbiz"
    metrics = BusinessGenerationMetrics(
        business_name="Test",
        business_type="demo",
        start_time=time.time()
    )
    monitor.businesses[business_id] = metrics
    monitor.record_component_attribution(
        business_id=business_id,
        component_name="component_lead",
        agent_name="builder_agent",
        quality_score=85.0,
        quality_before=60.0,
    )

    async def check():
        score = await monitor.attribution_tracker.get_contribution_score("builder_agent")
        assert score > 0.0

    asyncio.run(check())
