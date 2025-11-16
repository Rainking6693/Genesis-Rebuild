"""
DeepEyesV2 Phase 2 - Cold-Start SFT Complete Example

Demonstrates the complete workflow from Phase 1 baseline measurement to Phase 2 SFT.
This example shows:
1. Collecting baseline data from various tools and agents
2. Preparing training data with TrajectoryCollector
3. Creating and balancing datasets
4. Training the model
5. Evaluating improvements
6. Generating comprehensive reports

Based on arXiv:2511.05271 - Two-stage training for improved tool use in language models.
"""

import asyncio
import json
import logging
from pathlib import Path
from datetime import datetime, timezone

from infrastructure.deepeyesv2 import (
    BaselineTracker,
    ToolInvocation,
    ToolStatus,
    TrajectoryCollector,
    SFTDataset,
    ColdStartTrainer,
    run_deepeyesv2_sft,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


async def create_baseline_data() -> BaselineTracker:
    """
    Create sample baseline data simulating Phase 1 measurement.

    In production, this would be real tool invocations from Genesis agents.
    """
    logger.info("Creating baseline data...")

    tracker = BaselineTracker(output_dir=Path("logs/deepeyesv2/baseline"))

    # Define realistic tools and their success rates
    tool_configs = {
        "anthropic_api": {"success_rate": 0.95, "category": "api"},
        "database_query": {"success_rate": 0.92, "category": "database"},
        "stripe_payment": {"success_rate": 0.88, "category": "external_api"},
        "email_send": {"success_rate": 0.90, "category": "external_api"},
        "vector_embedding": {"success_rate": 0.94, "category": "ml"},
        "web_scraping": {"success_rate": 0.85, "category": "external_api"},
        "mongodb_insert": {"success_rate": 0.93, "category": "database"},
        "mongodb_query": {"success_rate": 0.91, "category": "database"},
        "cache_get": {"success_rate": 0.98, "category": "cache"},
        "cache_set": {"success_rate": 0.97, "category": "cache"},
        "file_storage_upload": {"success_rate": 0.89, "category": "storage"},
        "file_storage_download": {"success_rate": 0.91, "category": "storage"},
        "async_job_queue": {"success_rate": 0.87, "category": "queue"},
        "webhook_delivery": {"success_rate": 0.84, "category": "external_api"},
        "auth_validation": {"success_rate": 0.99, "category": "auth"},
        "rate_limiter": {"success_rate": 0.96, "category": "middleware"},
        "config_lookup": {"success_rate": 0.99, "category": "config"},
        "health_check": {"success_rate": 0.97, "category": "health"},
    }

    agents = [
        "MarketingAgent",
        "ContentAgent",
        "AnalyticsAgent",
        "CodeReviewAgent",
        "DatabaseDesignAgent",
    ]

    # Simulate invocations
    invocation_count = 0
    for tool_name, tool_config in tool_configs.items():
        for agent_name in agents:
            for i in range(15):  # 15 invocations per tool per agent
                # Determine success based on configured success rate
                is_success = (
                    (hash(f"{tool_name}_{agent_name}_{i}") % 100)
                    < (tool_config["success_rate"] * 100)
                )

                invocation = ToolInvocation(
                    tool_name=tool_name,
                    agent_name=agent_name,
                    parameters={
                        "tool_category": tool_config["category"],
                        "invocation_num": i,
                        "agent": agent_name,
                    },
                    result={"status": "success", "data": f"result_{i}"}
                    if is_success
                    else None,
                    status=ToolStatus.SUCCESS if is_success else ToolStatus.FAILURE,
                    latency_ms=50.0 + (hash(tool_name) % 100),
                    error_msg=None if is_success else "Tool invocation failed",
                )

                tracker.record_invocation(invocation)
                invocation_count += 1

    # Save baseline stats
    tracker.save_stats("baseline_stats.json")

    logger.info(f"Created baseline data with {invocation_count} invocations")
    logger.info(f"Tools: {len(tool_configs)}, Agents: {len(agents)}")

    return tracker


async def phase_1_summary(tracker: BaselineTracker) -> None:
    """Display Phase 1 baseline summary."""
    logger.info("\n" + "=" * 60)
    logger.info("PHASE 1 - BASELINE MEASUREMENT SUMMARY")
    logger.info("=" * 60)

    summary = tracker.get_summary()
    logger.info(f"Total invocations: {summary['total_invocations']}")
    logger.info(f"Successful: {summary['successful_invocations']}")
    logger.info(f"Failed: {summary['failed_invocations']}")
    logger.info(
        f"Overall success rate: {summary['overall_success_rate_pct']:.2f}%"
    )
    logger.info(f"Unique tools: {summary['unique_tools']}")
    logger.info(f"Invocations/sec: {summary['invocations_per_second']:.2f}")

    # Show per-tool stats
    all_stats = tracker.get_all_stats()
    logger.info(f"\nTop 5 by success rate:")
    sorted_tools = sorted(
        all_stats.items(),
        key=lambda x: x[1].success_rate,
        reverse=True,
    )
    for tool_name, stats in sorted_tools[:5]:
        logger.info(
            f"  {tool_name}: {stats.success_rate:.2f}% "
            f"({stats.successful_calls}/{stats.total_calls})"
        )


async def phase_2_prepare_data(tracker: BaselineTracker) -> SFTDataset:
    """Phase 2: Prepare training data from baseline."""
    logger.info("\n" + "=" * 60)
    logger.info("PHASE 2 - COLD-START SFT PREPARATION")
    logger.info("=" * 60)

    # Collect and filter trajectories
    collector = TrajectoryCollector(
        quality_threshold=0.85,  # Lower threshold for demo
        output_dir=Path("logs/deepeyesv2/sft"),
    )

    logger.info("Collecting trajectories from baseline...")
    trajectories = await collector.collect_trajectories(tracker)
    logger.info(f"Collected {len(trajectories)} trajectories")

    logger.info("Filtering high-quality trajectories...")
    filtered = await collector.filter_quality()
    logger.info(f"Filtered to {len(filtered)} high-quality trajectories")

    logger.info("Generating training examples...")
    examples = await collector.generate_training_examples()
    logger.info(f"Generated {len(examples)} training examples")

    # Show example distribution
    difficulty_counts = {}
    for example in examples:
        difficulty_counts[example.difficulty_level] = (
            difficulty_counts.get(example.difficulty_level, 0) + 1
        )
    logger.info(f"Difficulty distribution: {difficulty_counts}")

    # Create and split dataset
    logger.info("Creating dataset and splitting...")
    dataset = SFTDataset(
        training_examples=examples,
        train_ratio=0.70,
        val_ratio=0.15,
        test_ratio=0.15,
        output_dir=Path("logs/deepeyesv2/sft/datasets"),
    )

    splits = await dataset.split_data()
    logger.info(
        f"Split: train={len(splits['train'])}, "
        f"val={len(splits['val'])}, test={len(splits['test'])}"
    )

    # Balance and get stats
    await dataset.balance_dataset()
    stats = await dataset.get_dataset_stats()
    logger.info(f"Dataset statistics:")
    logger.info(f"  Total examples: {stats['total_examples']}")
    logger.info(f"  Train success rate: {stats['train'].get('success_rate_pct', 0):.2f}%")
    logger.info(f"  Train unique tools: {stats['train'].get('unique_tools', 0)}")
    logger.info(f"  Val success rate: {stats['val'].get('success_rate_pct', 0):.2f}%")
    logger.info(f"  Test success rate: {stats['test'].get('success_rate_pct', 0):.2f}%")

    # Export JSONL files
    logger.info("Exporting training data to JSONL...")
    files = await dataset.export_all_splits()
    for split, path in files.items():
        logger.info(f"  Exported {split}: {path}")

    return dataset


async def phase_2_train(
    trainer: ColdStartTrainer,
) -> dict:
    """Phase 2: Train model with SFT."""
    logger.info("\n" + "=" * 60)
    logger.info("PHASE 2 - MODEL TRAINING")
    logger.info("=" * 60)

    # Generate prompts
    logger.info("Generating model-specific prompts...")
    prompts = await trainer.generate_prompts()
    logger.info(
        f"Generated prompts: "
        f"train={len(prompts['train'])}, "
        f"val={len(prompts['val'])}, "
        f"test={len(prompts['test'])}"
    )

    # Show sample prompt
    if prompts["train"]:
        logger.info("\nSample training prompt (first 200 chars):")
        logger.info(f"  {prompts['train'][0][:200]}...")

    # Train model
    logger.info("\nTraining model (epochs=3)...")
    training_results = await trainer.train_model(
        model_id="claude-3-5-haiku-20241022",
        epochs=3,
        learning_rate=0.001,
        batch_size=8,
    )

    logger.info(f"Training completed:")
    logger.info(f"  Model: {training_results['model_id']}")
    logger.info(f"  Epochs: {training_results['epochs']}")
    logger.info(f"  Training steps: {training_results['training_steps']}")
    logger.info(f"  Total tokens: {training_results['total_tokens']}")

    for epoch_result in training_results["epoch_results"]:
        logger.info(
            f"  Epoch {epoch_result['epoch']}: "
            f"loss={epoch_result['loss']:.4f}, "
            f"accuracy={epoch_result['accuracy']:.4f}"
        )

    return training_results


async def phase_2_evaluate(trainer: ColdStartTrainer) -> dict:
    """Phase 2: Evaluate training results."""
    logger.info("\n" + "=" * 60)
    logger.info("PHASE 2 - EVALUATION & READINESS")
    logger.info("=" * 60)

    evaluation = await trainer.evaluate_improvement()

    logger.info(f"Performance improvement:")
    logger.info(
        f"  Baseline success rate: {evaluation['baseline_success_rate']:.2%}"
    )
    logger.info(
        f"  Post-training success rate: {evaluation['post_training_success_rate']:.2%}"
    )
    logger.info(
        f"  Improvement: {evaluation['improvement_pct']:.1f}% "
        f"({evaluation['improvement_points']:.4f} points)"
    )

    logger.info(f"\nPer-tool improvements (sample):")
    tool_improvements = evaluation.get("tool_improvements", {})
    for tool_name, improvement in list(tool_improvements.items())[:5]:
        logger.info(
            f"  {tool_name}: "
            f"{improvement['baseline_accuracy']:.2%} -> "
            f"{improvement['post_training_accuracy']:.2%}"
        )

    logger.info(f"\nReadiness for RL phase:")
    logger.info(f"  Ready: {evaluation['readiness_for_rl']}")
    logger.info(f"  Recommendations:")
    for rec in evaluation.get("recommendations", []):
        logger.info(f"    - {rec}")

    return evaluation


async def phase_2_report(
    trainer: ColdStartTrainer,
    tracking_info: dict,
) -> None:
    """Generate and display final report."""
    logger.info("\n" + "=" * 60)
    logger.info("PHASE 2 - TRAINING REPORT")
    logger.info("=" * 60)

    report_file = await trainer.export_training_report()
    logger.info(f"Report saved to: {report_file}")

    # Display report summary
    with report_file.open("r") as f:
        report = json.load(f)

    logger.info(f"\nReport timestamp: {report.get('timestamp')}")
    logger.info(f"Phase: {report.get('phase')}")
    logger.info(f"Reference: {report.get('reference')}")

    logger.info("\nDataset statistics:")
    ds_stats = report.get("dataset_stats", {})
    logger.info(f"  Total examples: {ds_stats.get('total_examples')}")

    logger.info("\nTraining summary:")
    tm = report.get("training_metrics", {})
    logger.info(f"  Model: {tm.get('model_id')}")
    logger.info(f"  Steps: {tm.get('training_steps')}")
    logger.info(f"  Total tokens: {tm.get('total_tokens')}")

    return report_file


async def main():
    """Run complete Phase 1 + Phase 2 workflow."""
    logger.info("DeepEyesV2 - Complete Phase 1 & 2 Example")
    logger.info(f"Started at: {datetime.now(timezone.utc).isoformat()}")

    try:
        # Phase 1: Create baseline data
        tracker = await create_baseline_data()
        await phase_1_summary(tracker)

        # Phase 2: Prepare training data
        dataset = await phase_2_prepare_data(tracker)

        # Phase 2: Train model
        trainer = ColdStartTrainer(output_dir=Path("logs/deepeyesv2/sft/training"))
        trainer.dataset = dataset  # Set the dataset directly
        training_results = await phase_2_train(trainer)

        # Phase 2: Evaluate
        evaluation = await phase_2_evaluate(trainer)

        # Phase 2: Generate report
        report_file = await phase_2_report(trainer, {})

        # Final summary
        logger.info("\n" + "=" * 60)
        logger.info("EXECUTION SUMMARY")
        logger.info("=" * 60)
        logger.info(f"✓ Phase 1 Baseline: {tracker.get_summary()['total_invocations']} invocations")
        logger.info(f"✓ Phase 2 Training: {len(dataset.training_examples)} examples")
        logger.info(
            f"✓ Model Improvement: {evaluation['improvement_pct']:.1f}%"
        )
        logger.info(f"✓ Ready for RL: {evaluation['readiness_for_rl']}")
        logger.info(f"✓ Report: {report_file}")
        logger.info("\nWorkflow completed successfully!")

    except Exception as e:
        logger.error(f"Workflow failed: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    asyncio.run(main())
