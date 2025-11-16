"""
DeepEyesV2 - Tool Reliability and Supervised Fine-Tuning

Based on arXiv:2511.05271: Two-stage training for improved tool use in language models.

This module provides infrastructure for:
- Phase 1: Baseline measurement of tool reliability
- Phase 2: Cold-start supervised fine-tuning for tool use improvement
- Phase 3: RL refinement (future)

Components:
Phase 1:
- ToolInvocation: Captures single tool call metadata
- BaselineTracker: Aggregates statistics across tool invocations
- ToolReliabilityMonitor: Real-time monitoring with alerting
- BaselineMeasurement: Orchestrates baseline measurement campaigns

Phase 2:
- TrainingExample: SFT training data with task descriptions and tool sequences
- TrajectoryCollector: Collects and filters high-quality trajectories
- SFTDataset: Organizes examples into train/val/test splits with balancing
- ColdStartTrainer: Orchestrates SFT training pipeline
"""

from .tool_baseline import (
    ToolStatus,
    ToolInvocation,
    ToolStats,
    BaselineTracker,
    ToolReliabilityMonitor,
    BaselineMeasurement,
    run_deepeyesv2_baseline,
)

from .cold_start_sft import (
    TrainingExample,
    TrajectoryCollector,
    SFTDataset,
    ColdStartTrainer,
    ToolCategory,
    run_deepeyesv2_sft,
)

__all__ = [
    # Phase 1
    'ToolStatus',
    'ToolInvocation',
    'ToolStats',
    'BaselineTracker',
    'ToolReliabilityMonitor',
    'BaselineMeasurement',
    'run_deepeyesv2_baseline',
    # Phase 2
    'TrainingExample',
    'TrajectoryCollector',
    'SFTDataset',
    'ColdStartTrainer',
    'ToolCategory',
    'run_deepeyesv2_sft',
]

__version__ = '0.2.0'
__author__ = 'Genesis Team'
__description__ = 'DeepEyesV2 Phase 1-2 - Baseline Measurement and Cold-Start SFT'
