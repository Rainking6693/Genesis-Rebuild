#!/usr/bin/env python3
"""
Generate AgentEvolver scenarios and ingest them into SE-Darwin.

Runs Phase4 pipeline: self-questioning ideas -> validation -> TrajectoryPool.
"""

import asyncio
import logging
import sys
from pathlib import Path

from infrastructure.agentevolver.ingestion import ScenarioIngestionPipeline
from infrastructure.business_idea_generator import get_idea_generator

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


async def main():
    generator = get_idea_generator()
    pipeline = ScenarioIngestionPipeline()

    logger.info("Generating AgentEvolver curiosity scenarios...")
    results = await generator.generate_curiosity_ideas(count=100, min_revenue_score=60)

    logger.info("Ingesting scenarios into TrajectoryPool...")
    for item in results:
        scenario = {
            "name": item["idea"].name,
            "description": item["idea"].description,
            "business_type": item["idea"].business_type,
            "mvp_features": item["idea"].mvp_features,
            "question": item["question"],
            "novelty_score": item["novelty_score"],
            "coverage": item["coverage"],
            "domains": [item["domain"]],
            "generated_at": item["idea"].generated_at,
        }
        pipeline.ingest_scenario(scenario)

    logger.info("Scenario ingestion complete.")


if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
