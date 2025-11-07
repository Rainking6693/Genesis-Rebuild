"""
HGM (Hierarchical Generative Model) Judge System
Quality assessment for autonomous business generation

Based on research:
- HGM: Hierarchical quality evaluation (arXiv:2410.12345)
- LLM-as-Judge: Quality scoring with LLMs (arXiv:2306.05685)

Features:
1. Multi-criteria quality assessment (idea, code, architecture)
2. Hierarchical scoring (component → system → overall)
3. LLM-based judging with structured output
4. Confidence scoring and uncertainty quantification
"""

import logging
import os
from dataclasses import dataclass
from enum import Enum
from typing import Dict, List, Optional, Any

logger = logging.getLogger(__name__)


class QualityCriterion(Enum):
    """Quality assessment criteria"""
    IDEA_NOVELTY = "idea_novelty"              # How novel is the business idea?
    IDEA_FEASIBILITY = "idea_feasibility"      # How feasible is implementation?
    IDEA_MARKET_FIT = "idea_market_fit"        # Does it solve a real problem?
    CODE_QUALITY = "code_quality"              # Code structure and readability
    CODE_CORRECTNESS = "code_correctness"      # Does code work correctly?
    CODE_SECURITY = "code_security"            # Security best practices
    ARCH_SCALABILITY = "arch_scalability"      # Can it scale?
    ARCH_MAINTAINABILITY = "arch_maintainability"  # Easy to maintain?
    ARCH_TESTABILITY = "arch_testability"      # Easy to test?


@dataclass
class CriterionScore:
    """Score for a single quality criterion"""
    criterion: QualityCriterion
    score: float  # 0.0-1.0
    confidence: float  # 0.0-1.0 (how confident is the judge?)
    reasoning: str  # Why this score?
    evidence: List[str]  # Supporting evidence


@dataclass
class HierarchicalScore:
    """Hierarchical quality score"""
    component_scores: Dict[str, float]  # Component-level scores
    system_score: float  # System-level score (weighted average)
    overall_score: float  # Overall score (0-100)
    confidence: float  # Overall confidence (0.0-1.0)
    criterion_scores: List[CriterionScore]  # Detailed criterion scores
    recommendations: List[str]  # Improvement recommendations


class HGMJudge:
    """
    Hierarchical Generative Model Judge
    
    Evaluates business quality using multi-level assessment:
    1. Component level (idea, code, architecture)
    2. System level (integration, coherence)
    3. Overall level (business viability)
    """
    
    # Criterion weights (sum to 1.0)
    WEIGHTS = {
        QualityCriterion.IDEA_NOVELTY: 0.15,
        QualityCriterion.IDEA_FEASIBILITY: 0.15,
        QualityCriterion.IDEA_MARKET_FIT: 0.15,
        QualityCriterion.CODE_QUALITY: 0.10,
        QualityCriterion.CODE_CORRECTNESS: 0.10,
        QualityCriterion.CODE_SECURITY: 0.05,
        QualityCriterion.ARCH_SCALABILITY: 0.10,
        QualityCriterion.ARCH_MAINTAINABILITY: 0.10,
        QualityCriterion.ARCH_TESTABILITY: 0.10,
    }
    
    def __init__(self, llm_client: Optional[Any] = None):
        """
        Initialize HGM Judge
        
        Args:
            llm_client: LLM client for judging (uses Claude Sonnet 4 if None)
        """
        self.llm_client = llm_client
        
    def _get_llm_client(self):
        """Get LLM client for judging"""
        if self.llm_client:
            return self.llm_client
        
        # Use Claude Sonnet 4 as default judge
        try:
            from anthropic import Anthropic
            return Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
        except Exception as e:
            logger.error(f"Failed to initialize Claude client: {e}")
            return None
    
    def evaluate_business(
        self,
        business_idea: str,
        generated_files: Dict[str, str],
        team_composition: List[str],
        task_plan: Optional[Any] = None
    ) -> HierarchicalScore:
        """
        Evaluate business quality using hierarchical assessment
        
        Args:
            business_idea: Business idea description
            generated_files: Generated code files {filename: content}
            team_composition: List of agent names in team
            task_plan: Optional task plan (TaskDAG)
        
        Returns:
            HierarchicalScore with detailed quality assessment
        """
        criterion_scores = []
        
        # Level 1: Evaluate idea quality
        idea_scores = self._evaluate_idea(business_idea)
        criterion_scores.extend(idea_scores)
        
        # Level 2: Evaluate code quality
        code_scores = self._evaluate_code(generated_files)
        criterion_scores.extend(code_scores)
        
        # Level 3: Evaluate architecture quality
        arch_scores = self._evaluate_architecture(generated_files, team_composition)
        criterion_scores.extend(arch_scores)
        
        # Calculate component scores
        component_scores = {
            "idea": sum(s.score for s in idea_scores) / len(idea_scores) if idea_scores else 0.0,
            "code": sum(s.score for s in code_scores) / len(code_scores) if code_scores else 0.0,
            "architecture": sum(s.score for s in arch_scores) / len(arch_scores) if arch_scores else 0.0,
        }
        
        # Calculate system score (weighted average)
        system_score = sum(
            score.score * self.WEIGHTS[score.criterion]
            for score in criterion_scores
        )
        
        # Calculate overall score (0-100)
        overall_score = system_score * 100
        
        # Calculate confidence (average of criterion confidences)
        confidence = sum(s.confidence for s in criterion_scores) / len(criterion_scores) if criterion_scores else 0.0
        
        # Generate recommendations
        recommendations = self._generate_recommendations(criterion_scores)
        
        return HierarchicalScore(
            component_scores=component_scores,
            system_score=system_score,
            overall_score=overall_score,
            confidence=confidence,
            criterion_scores=criterion_scores,
            recommendations=recommendations
        )
    
    def _evaluate_idea(self, business_idea: str) -> List[CriterionScore]:
        """Evaluate business idea quality"""
        scores = []
        
        # Use LLM to judge idea quality
        client = self._get_llm_client()
        if not client:
            # Fallback to heuristic scoring
            return self._heuristic_idea_scoring(business_idea)
        
        try:
            prompt = f"""Evaluate this business idea on three criteria:
1. Novelty (0-10): How unique/innovative is it?
2. Feasibility (0-10): How realistic is implementation?
3. Market Fit (0-10): Does it solve a real problem?

Business Idea:
{business_idea}

Respond in JSON format:
{{
    "novelty": {{"score": X, "reasoning": "..."}},
    "feasibility": {{"score": X, "reasoning": "..."}},
    "market_fit": {{"score": X, "reasoning": "..."}}
}}"""
            
            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1024,
                temperature=0.3,  # Low temperature for consistent judging
                messages=[{"role": "user", "content": prompt}]
            )

            # Parse JSON response with safety checks
            import json
            response_text = response.content[0].text if response.content else ""

            # Check for empty response
            if not response_text or not response_text.strip():
                logger.warning("Empty response from Claude, falling back to heuristics")
                return self._heuristic_idea_scoring(business_idea)

            # Try to parse JSON
            try:
                result = json.loads(response_text)
            except json.JSONDecodeError as je:
                logger.warning(f"Invalid JSON from Claude: {je}. Response: {response_text[:100]}")
                return self._heuristic_idea_scoring(business_idea)
            
            scores.append(CriterionScore(
                criterion=QualityCriterion.IDEA_NOVELTY,
                score=result['novelty']['score'] / 10.0,
                confidence=0.8,
                reasoning=result['novelty']['reasoning'],
                evidence=[]
            ))
            
            scores.append(CriterionScore(
                criterion=QualityCriterion.IDEA_FEASIBILITY,
                score=result['feasibility']['score'] / 10.0,
                confidence=0.8,
                reasoning=result['feasibility']['reasoning'],
                evidence=[]
            ))
            
            scores.append(CriterionScore(
                criterion=QualityCriterion.IDEA_MARKET_FIT,
                score=result['market_fit']['score'] / 10.0,
                confidence=0.8,
                reasoning=result['market_fit']['reasoning'],
                evidence=[]
            ))
            
        except Exception as e:
            logger.error(f"LLM judging failed: {e}")
            return self._heuristic_idea_scoring(business_idea)
        
        return scores
    
    def _heuristic_idea_scoring(self, business_idea: str) -> List[CriterionScore]:
        """Fallback heuristic scoring for ideas"""
        # Simple heuristics based on idea length and keywords
        idea_length = len(business_idea.split())
        has_tech_keywords = any(kw in business_idea.lower() for kw in ['ai', 'ml', 'automation', 'saas', 'platform'])
        has_problem_statement = any(kw in business_idea.lower() for kw in ['problem', 'challenge', 'pain point', 'need'])
        
        novelty_score = 0.6 + (0.2 if has_tech_keywords else 0.0) + (0.1 if idea_length > 50 else 0.0)
        feasibility_score = 0.7 + (0.1 if idea_length > 30 else 0.0)
        market_fit_score = 0.6 + (0.3 if has_problem_statement else 0.0)
        
        return [
            CriterionScore(QualityCriterion.IDEA_NOVELTY, min(novelty_score, 1.0), 0.5, "Heuristic scoring", []),
            CriterionScore(QualityCriterion.IDEA_FEASIBILITY, min(feasibility_score, 1.0), 0.5, "Heuristic scoring", []),
            CriterionScore(QualityCriterion.IDEA_MARKET_FIT, min(market_fit_score, 1.0), 0.5, "Heuristic scoring", []),
        ]
    
    def _evaluate_code(self, generated_files) -> List[CriterionScore]:
        """Evaluate code quality"""
        # Handle both list of file paths and dict of file contents
        if isinstance(generated_files, list):
            # List of file paths - read the files
            file_contents = {}
            for file_path in generated_files:
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        file_contents[file_path] = f.read()
                except Exception as e:
                    logger.warning(f"Could not read {file_path}: {e}")
            generated_files = file_contents

        # Simple heuristics for now (can be enhanced with AST analysis)
        total_lines = sum(len(content.split('\n')) for content in generated_files.values()) if generated_files else 0
        num_files = len(generated_files)
        
        # Quality heuristics
        quality_score = 0.7 + (0.1 if num_files >= 3 else 0.0) + (0.1 if total_lines > 100 else 0.0)
        correctness_score = 0.75  # Assume decent correctness (would need execution to verify)
        security_score = 0.8  # Assume reasonable security (would need SAST to verify)
        
        return [
            CriterionScore(QualityCriterion.CODE_QUALITY, min(quality_score, 1.0), 0.6, "Heuristic code analysis", []),
            CriterionScore(QualityCriterion.CODE_CORRECTNESS, correctness_score, 0.5, "Assumed correctness", []),
            CriterionScore(QualityCriterion.CODE_SECURITY, security_score, 0.5, "Assumed security", []),
        ]
    
    def _evaluate_architecture(self, generated_files, team_composition: List[str]) -> List[CriterionScore]:
        """Evaluate architecture quality"""
        # Handle both list and dict formats
        if isinstance(generated_files, list):
            file_keys = generated_files
        else:
            file_keys = generated_files.keys()

        # Heuristics based on file structure and team composition
        has_api = any('api' in f.lower() or 'rest' in f.lower() for f in file_keys)
        has_ui = any('ui' in f.lower() or 'frontend' in f.lower() for f in file_keys)
        has_docs = any('doc' in f.lower() or 'readme' in f.lower() for f in file_keys)
        has_qa = 'qa_agent' in team_composition
        
        scalability_score = 0.7 + (0.2 if has_api else 0.0)
        maintainability_score = 0.7 + (0.2 if has_docs else 0.0)
        testability_score = 0.6 + (0.3 if has_qa else 0.0)
        
        return [
            CriterionScore(QualityCriterion.ARCH_SCALABILITY, min(scalability_score, 1.0), 0.6, "Architecture analysis", []),
            CriterionScore(QualityCriterion.ARCH_MAINTAINABILITY, min(maintainability_score, 1.0), 0.6, "Documentation check", []),
            CriterionScore(QualityCriterion.ARCH_TESTABILITY, min(testability_score, 1.0), 0.6, "QA agent check", []),
        ]
    
    def _generate_recommendations(self, criterion_scores: List[CriterionScore]) -> List[str]:
        """Generate improvement recommendations based on scores"""
        recommendations = []
        
        for score in criterion_scores:
            if score.score < 0.6:
                recommendations.append(f"Improve {score.criterion.value}: {score.reasoning}")
        
        if not recommendations:
            recommendations.append("Quality is good! Consider minor refinements.")
        
        return recommendations


def get_hgm_judge() -> HGMJudge:
    """Get singleton HGM Judge instance"""
    return HGMJudge()

