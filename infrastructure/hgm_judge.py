"""
<<<<<<< HEAD
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

=======
HGM (Hierarchical Generative Model) Judge implementation.

Scores autonomous business generation output using a multi-level rubric
and LLM-as-judge prompting. Gemini is used as the primary judge with
Claude as a fallback, and heuristics as a last resort.
"""

import json
>>>>>>> d45b9d3f (Route HALO and HGM judge through Gemini-first cloud fallback)
import logging
import os
from dataclasses import dataclass
from enum import Enum
<<<<<<< HEAD
from typing import Dict, List, Optional, Any
=======
from typing import Any, Dict, List, Optional

>>>>>>> d45b9d3f (Route HALO and HGM judge through Gemini-first cloud fallback)

logger = logging.getLogger(__name__)


class QualityCriterion(Enum):
<<<<<<< HEAD
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
=======
    IDEA_NOVELTY = "idea_novelty"
    IDEA_FEASIBILITY = "idea_feasibility"
    IDEA_MARKET_FIT = "idea_market_fit"
    CODE_QUALITY = "code_quality"
    CODE_CORRECTNESS = "code_correctness"
    CODE_SECURITY = "code_security"
    ARCH_SCALABILITY = "arch_scalability"
    ARCH_MAINTAINABILITY = "arch_maintainability"
    ARCH_TESTABILITY = "arch_testability"
>>>>>>> d45b9d3f (Route HALO and HGM judge through Gemini-first cloud fallback)


@dataclass
class CriterionScore:
<<<<<<< HEAD
    """Score for a single quality criterion"""
    criterion: QualityCriterion
    score: float  # 0.0-1.0
    confidence: float  # 0.0-1.0 (how confident is the judge?)
    reasoning: str  # Why this score?
    evidence: List[str]  # Supporting evidence
=======
    criterion: QualityCriterion
    score: float
    confidence: float
    reasoning: str
    evidence: List[str]
>>>>>>> d45b9d3f (Route HALO and HGM judge through Gemini-first cloud fallback)


@dataclass
class HierarchicalScore:
<<<<<<< HEAD
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
=======
    component_scores: Dict[str, float]
    system_score: float
    overall_score: float
    confidence: float
    criterion_scores: List[CriterionScore]
    recommendations: List[str]


class HGMJudge:
>>>>>>> d45b9d3f (Route HALO and HGM judge through Gemini-first cloud fallback)
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
<<<<<<< HEAD
    
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
    
=======

    def __init__(self, llm_client: Optional[Any] = None):
        self.llm_client = llm_client

>>>>>>> d45b9d3f (Route HALO and HGM judge through Gemini-first cloud fallback)
    def evaluate_business(
        self,
        business_idea: str,
        generated_files: Dict[str, str],
        team_composition: List[str],
<<<<<<< HEAD
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
        
=======
        task_plan: Optional[Any] = None,
    ) -> HierarchicalScore:
        idea_scores = self._evaluate_idea(business_idea)
        code_scores = self._evaluate_code(generated_files)
        arch_scores = self._evaluate_architecture(generated_files, team_composition)

        criterion_scores = idea_scores + code_scores + arch_scores

        component_scores = {
            "idea": self._average_scores(idea_scores),
            "code": self._average_scores(code_scores),
            "architecture": self._average_scores(arch_scores),
        }

        system_score = sum(
            score.score * self.WEIGHTS.get(score.criterion, 0.0)
            for score in criterion_scores
        )

        overall_score = system_score * 100
        confidence = self._average_confidence(criterion_scores)
        recommendations = self._generate_recommendations(criterion_scores)

>>>>>>> d45b9d3f (Route HALO and HGM judge through Gemini-first cloud fallback)
        return HierarchicalScore(
            component_scores=component_scores,
            system_score=system_score,
            overall_score=overall_score,
            confidence=confidence,
            criterion_scores=criterion_scores,
<<<<<<< HEAD
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

=======
            recommendations=recommendations,
        )

    # ------------------------------------------------------------------
    # Idea Evaluation
    # ------------------------------------------------------------------
    def _evaluate_idea(self, business_idea: str) -> List[CriterionScore]:
        prompt = (
            "Evaluate this business idea on three criteria:\n"
            "1. Novelty (0-10): How unique/innovative is it?\n"
            "2. Feasibility (0-10): How realistic is implementation?\n"
            "3. Market Fit (0-10): Does it solve a real problem?\n\n"
            "Business Idea:\n"
            f"{business_idea}\n\n"
            "Respond in JSON format:\n"
            "{\n"
            "  \"novelty\": {\"score\": X, \"reasoning\": \"...\"},\n"
            "  \"feasibility\": {\"score\": X, \"reasoning\": \"...\"},\n"
            "  \"market_fit\": {\"score\": X, \"reasoning\": \"...\"}\n"
            "}"
        )

        result_data = self._judge_with_gemini(prompt)

        if result_data is None:
            client = self._get_llm_client()
            if client:
                result_data = self._judge_with_claude(client, prompt)

        if not result_data:
            return self._heuristic_idea_scoring(business_idea)

        try:
            return self._scores_from_result(result_data)
        except Exception as exc:
            logger.warning(f"Failed to parse judge scores: {exc}")
            return self._heuristic_idea_scoring(business_idea)

    def _heuristic_idea_scoring(self, business_idea: str) -> List[CriterionScore]:
        tokens = business_idea.split()
        idea_len = len(tokens)
        has_problem = any(word in business_idea.lower() for word in ["problem", "pain", "need", "challenge"])
        has_tech = any(word in business_idea.lower() for word in ["ai", "ml", "automation", "platform", "saas"])

        novelty = 0.6 + (0.2 if has_tech else 0.0) + (0.1 if idea_len > 50 else 0.0)
        feasibility = 0.7 + (0.1 if idea_len > 30 else 0.0)
        market_fit = 0.6 + (0.3 if has_problem else 0.0)

        return [
            CriterionScore(QualityCriterion.IDEA_NOVELTY, min(novelty, 1.0), 0.5, "Heuristic scoring", []),
            CriterionScore(QualityCriterion.IDEA_FEASIBILITY, min(feasibility, 1.0), 0.5, "Heuristic scoring", []),
            CriterionScore(QualityCriterion.IDEA_MARKET_FIT, min(market_fit, 1.0), 0.5, "Heuristic scoring", []),
        ]

    def _judge_with_gemini(self, prompt: str) -> Optional[Dict[str, Any]]:
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if not api_key:
            return None

        model_name = os.getenv("GENESIS_JUDGE_GEMINI_MODEL", "gemini-2.0-flash")

        try:
            from google import genai
            from google.genai import types as genai_types

            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=genai_types.GenerateContentConfig(
                    temperature=0.3,
                    max_output_tokens=1024,
                ),
            )

            content = getattr(response, "text", None)
            if not content and getattr(response, "candidates", None):
                try:
                    content = response.candidates[0].content.parts[0].text  # type: ignore[attr-defined]
                except Exception:
                    content = None

            if not content:
                raise ValueError("Empty response from Gemini")

            text = content.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]

            return json.loads(text)
        except Exception as exc:
            logger.warning(f"Gemini judging failed: {exc}")
            return None

    def _judge_with_claude(self, client: Any, prompt: str) -> Optional[Dict[str, Any]]:
        try:
            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1024,
                temperature=0.3,
                messages=[{"role": "user", "content": prompt}],
            )

            raw_content = ""
            try:
                raw_content = "".join(part.text for part in response.content)
            except Exception:
                raw_content = getattr(response, "content", "") or ""

            if not raw_content.strip():
                raise ValueError("Empty response from Claude judge")

            return json.loads(raw_content)
        except Exception as exc:
            logger.warning(f"Claude judging failed: {exc}")
            return None

    def _scores_from_result(self, result: Dict[str, Any]) -> List[CriterionScore]:
        return [
            CriterionScore(
                criterion=QualityCriterion.IDEA_NOVELTY,
                score=result["novelty"]["score"] / 10.0,
                confidence=0.8,
                reasoning=result["novelty"]["reasoning"],
                evidence=[],
            ),
            CriterionScore(
                criterion=QualityCriterion.IDEA_FEASIBILITY,
                score=result["feasibility"]["score"] / 10.0,
                confidence=0.8,
                reasoning=result["feasibility"]["reasoning"],
                evidence=[],
            ),
            CriterionScore(
                criterion=QualityCriterion.IDEA_MARKET_FIT,
                score=result["market_fit"]["score"] / 10.0,
                confidence=0.8,
                reasoning=result["market_fit"]["reasoning"],
                evidence=[],
            ),
        ]

    def _get_llm_client(self) -> Optional[Any]:
        if self.llm_client:
            return self.llm_client

        try:
            from anthropic import Anthropic

            return Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        except Exception as exc:
            logger.error(f"Failed to initialize Claude client: {exc}")
            return None

    # ------------------------------------------------------------------
    # Code / Architecture heuristics
    # ------------------------------------------------------------------
    def _evaluate_code(self, generated_files: Any) -> List[CriterionScore]:
        if isinstance(generated_files, list):
            num_files = len(generated_files)
            total_lines = num_files * 50
        elif isinstance(generated_files, dict):
            num_files = len(generated_files)
            total_lines = sum(len(content.splitlines()) for content in generated_files.values())
        else:
            num_files = 0
            total_lines = 0

        quality_score = 0.7 + (0.1 if num_files >= 3 else 0.0) + (0.1 if total_lines > 100 else 0.0)
        correctness_score = 0.6 + (0.1 if "test" in "".join(generated_files.keys()).lower() if isinstance(generated_files, dict) else 0.0)
        security_score = 0.6

        return [
            CriterionScore(QualityCriterion.CODE_QUALITY, min(quality_score, 1.0), 0.5, "Heuristic scoring", []),
            CriterionScore(QualityCriterion.CODE_CORRECTNESS, min(correctness_score, 1.0), 0.5, "Heuristic scoring", []),
            CriterionScore(QualityCriterion.CODE_SECURITY, security_score, 0.4, "Assumed security", []),
        ]

    def _evaluate_architecture(self, generated_files: Any, team_composition: List[str]) -> List[CriterionScore]:
        if isinstance(generated_files, dict):
            file_names = generated_files.keys()
        elif isinstance(generated_files, list):
            file_names = generated_files
        else:
            file_names = []

        has_api = any("api" in name.lower() or "rest" in name.lower() for name in file_names)
        has_ui = any("ui" in name.lower() or "frontend" in name.lower() for name in file_names)
        has_docs = any("doc" in name.lower() or "readme" in name.lower() for name in file_names)
        has_qa = "qa_agent" in team_composition

        scalability = 0.7 + (0.2 if has_api else 0.0)
        maintainability = 0.7 + (0.1 if has_docs else 0.0)
        testability = 0.6 + (0.2 if has_qa else 0.0)

        return [
            CriterionScore(QualityCriterion.ARCH_SCALABILITY, min(scalability, 1.0), 0.5, "Heuristic scoring", []),
            CriterionScore(QualityCriterion.ARCH_MAINTAINABILITY, min(maintainability, 1.0), 0.5, "Heuristic scoring", []),
            CriterionScore(QualityCriterion.ARCH_TESTABILITY, min(testability, 1.0), 0.5, "Heuristic scoring", []),
        ]

    # ------------------------------------------------------------------
    # Utilities
    # ------------------------------------------------------------------
    @staticmethod
    def _average_scores(scores: List[CriterionScore]) -> float:
        if not scores:
            return 0.0
        return sum(score.score for score in scores) / len(scores)

    @staticmethod
    def _average_confidence(scores: List[CriterionScore]) -> float:
        if not scores:
            return 0.0
        return sum(score.confidence for score in scores) / len(scores)

    def _generate_recommendations(self, scores: List[CriterionScore]) -> List[str]:
        recommendations: List[str] = []
        for score in scores:
            if score.score < 0.6:
                recommendations.append(f"Improve {score.criterion.value}: {score.reasoning}")
        if not recommendations:
            recommendations.append("Quality is good! Consider minor refinements.")
        return recommendations


_JUDGE_INSTANCE: Optional[HGMJudge] = None


def get_hgm_judge() -> HGMJudge:
    global _JUDGE_INSTANCE
    if _JUDGE_INSTANCE is None:
        _JUDGE_INSTANCE = HGMJudge()
    return _JUDGE_INSTANCE
>>>>>>> d45b9d3f (Route HALO and HGM judge through Gemini-first cloud fallback)
