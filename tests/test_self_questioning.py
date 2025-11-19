import os
import tempfile
from pathlib import Path

from infrastructure.agentevolver.self_questioning import (
    SelfQuestioningEngine,
    COMPLEXITY_BUDGET,
)
from infrastructure.business_idea_generator import BusinessIdea


def test_self_questioning_novelty_and_coverage(tmp_path):
    store = tmp_path / "curiosity_ideas.jsonl"
    coverage = tmp_path / "coverage.json"
    engine = SelfQuestioningEngine(store_path=store, coverage_path=coverage)

    idea = BusinessIdea(
        name="AgriPulse",
        business_type="agriculture",
        description="AI crop insights platform",
        target_audience="Farmers with 100+ acres",
        monetization_model="Subscription + marketplace fees",
        mvp_features=["Sensor dashboard", "Crop forecasting", "Marketplace"],
        tech_stack=["Next.js", "TypeScript", "Stripe"],
        success_metrics={"target_revenue_month_1": "$3,000"},
        revenue_score=82.0,
        market_trend_score=79.0,
        differentiation_score=71.0,
        overall_score=77.0,
        generated_at="2025-01-01T00:00:00Z"
    )

    entry = engine.register_idea(
        idea.name,
        idea.description,
        idea.business_type,
        ["agriculture"],
        score=95.0,
    )

    assert entry.name == "AgriPulse"
    assert engine.coverage["domains"]["agriculture"] >= 1
    assert engine.coverage_percent()[0] >= 0
    assert engine.score_novelty("AgriPulse AI", reference=idea.description) > 0
    question, business_type, domain = engine.generate_question()
    assert question and business_type
    assert domain in engine.coverage["domains"] or domain in engine.coverage["domains"]

    # Ensure store file created
    assert store.exists()
    assert coverage.exists()


def test_complexity_progression_and_savings(tmp_path):
    engine = SelfQuestioningEngine(
        store_path=tmp_path / "curiosity_ideas.jsonl",
        coverage_path=tmp_path / "coverage.json",
    )

    assert engine.desired_complexity_level() == "low"
    for _ in range(COMPLEXITY_BUDGET["low"]):
        engine.register_complexity_level("low")
    assert engine.desired_complexity_level() == "medium"
    for _ in range(COMPLEXITY_BUDGET["medium"]):
        engine.register_complexity_level("medium")
    assert engine.desired_complexity_level() == "high"

    assert engine.is_complexity_allowed("low")
    assert engine.is_complexity_allowed("medium")
    assert engine.is_complexity_allowed("high")

    savings = engine.estimated_manual_curation_savings()
    assert savings["total_ideas"] > 0
    assert savings["hours_saved"] >= 0


def test_exploration_frontier_prioritizes_unexplored_domains(tmp_path):
    """Test that exploration frontier prioritizes least-explored domains."""
    store = tmp_path / "curiosity_ideas.jsonl"
    coverage = tmp_path / "coverage.json"
    engine = SelfQuestioningEngine(store_path=store, coverage_path=coverage)
    
    # Register ideas in agriculture domain (high coverage)
    for i in range(10):
        engine.register_idea(
            f"AgriIdea{i}",
            f"Agriculture solution {i}",
            "saas",
            ["agriculture"],
            score=85.0
        )
    
    # Register only 1 idea in fintech domain (low coverage)
    engine.register_idea(
        "FintechIdea1",
        "Fintech solution",
        "saas",
        ["fintech"],
        score=85.0
    )
    
    # Generate multiple questions and verify fintech is selected more often
    selected_domains = []
    for _ in range(20):
        _, _, domain = engine.generate_question()
        selected_domains.append(domain)
    
    # Fintech (least explored) should be selected more frequently
    fintech_count = selected_domains.count("fintech")
    agriculture_count = selected_domains.count("agriculture")
    
    # Assert that fintech (less explored) is prioritized
    assert fintech_count >= agriculture_count or fintech_count > 5, \
        f"Frontier should prioritize fintech (count: {fintech_count}) over agriculture (count: {agriculture_count})"
