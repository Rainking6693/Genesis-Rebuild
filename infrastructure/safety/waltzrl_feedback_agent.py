"""
WaltzRL Feedback Agent - Safety and Helpfulness Analysis
Version: 1.0
Date: October 22, 2025

Analyzes agent responses for safety issues and over-refusals.
Provides constructive feedback for improvement.

Based on: WaltzRL (arXiv:2510.08240v1)
- 89% unsafe reduction (39.0% → 4.6%)
- 78% over-refusal reduction (45.3% → 9.9%)
"""

import json
import logging
import re
from datetime import datetime
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from enum import Enum

logger = logging.getLogger(__name__)


class SafetyCategory(Enum):
    """Safety issue categories"""
    SAFE = "safe"
    HARMFUL_CONTENT = "harmful_content"  # Violence, hate speech, illegal
    PRIVACY_VIOLATION = "privacy_violation"  # PII, credentials
    MALICIOUS_INSTRUCTION = "malicious_instruction"  # Phishing, DoS, exploits
    OVER_REFUSAL = "over_refusal"  # Declining safe requests
    CAPABILITY_DEGRADED = "capability_degraded"  # Poor quality response


@dataclass
class SafetyIssue:
    """Individual safety issue found in response"""
    category: SafetyCategory
    severity: float  # 0.0-1.0 (1.0 = critical)
    description: str
    evidence: str  # Quote from response
    suggestion: str  # How to fix it


@dataclass
class FeedbackResult:
    """Result of safety analysis"""
    safety_score: float  # 0.0-1.0 (1.0 = completely safe)
    helpfulness_score: float  # 0.0-1.0 (1.0 = maximally helpful)
    issues_found: List[SafetyIssue] = field(default_factory=list)
    suggestions: List[str] = field(default_factory=list)
    should_block: bool = False  # Only for critical issues
    analysis_time_ms: float = 0.0
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())

    def to_dict(self) -> Dict:
        """Convert to dictionary for logging/serialization"""
        return {
            'safety_score': self.safety_score,
            'helpfulness_score': self.helpfulness_score,
            'issues_found': [
                {
                    'category': issue.category.value,
                    'severity': issue.severity,
                    'description': issue.description,
                    'evidence': issue.evidence[:100],  # Truncate for logging
                    'suggestion': issue.suggestion
                }
                for issue in self.issues_found
            ],
            'suggestions': self.suggestions,
            'should_block': self.should_block,
            'analysis_time_ms': self.analysis_time_ms,
            'timestamp': self.timestamp
        }


class WaltzRLFeedbackAgent:
    """
    WaltzRL Feedback Agent - Analyzes responses for safety and helpfulness.

    This is a rule-based implementation (Stage 1).
    Stage 2 will use fine-tuned LLM for more nuanced analysis.
    """

    def __init__(
        self,
        safety_threshold: float = 0.7,
        helpfulness_threshold: float = 0.5,
        block_critical_only: bool = True
    ):
        """
        Initialize WaltzRL Feedback Agent.

        Args:
            safety_threshold: Minimum safety score (0.0-1.0)
            helpfulness_threshold: Minimum helpfulness score (0.0-1.0)
            block_critical_only: Only block critical safety issues
        """
        self.safety_threshold = safety_threshold
        self.helpfulness_threshold = helpfulness_threshold
        self.block_critical_only = block_critical_only

        # Harmful content patterns (Stage 1 - rule-based)
        self.harmful_patterns = [
            (r'\b(kill|murder|assault|attack|harm)\s+(someone|person|people)', 0.9, "violence"),
            (r'\b(hate|discriminate)\s+.{0,20}\b(race|gender|religion|sexuality)', 0.8, "hate_speech"),
            (r'\b(bomb|explosive|weapon)\s+.{0,30}\b(how to|tutorial|guide|instructions)', 0.9, "dangerous_instructions"),
            (r'\b(steal|rob|fraud|scam)\s+.{0,30}\b(how to|method|technique)', 0.8, "illegal_activity"),
            (r'\b(cocaine|heroin|meth|fentanyl)\s+.{0,30}\b(buy|sell|make|produce)', 0.9, "drug_trafficking"),
        ]

        # Privacy violation patterns
        self.privacy_patterns = [
            (r'\b\d{3}-\d{2}-\d{4}\b', 0.9, "SSN"),  # Social Security Number
            (r'\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b', 0.8, "credit_card"),  # Credit card
            (r'\b[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', 0.3, "email"),  # Email (lower severity)
            (r'\bpassword\s*[:=]\s*[\w!@#$%^&*]+', 0.9, "password"),
            (r'\bapi[_-]?key\s*[:=]\s*[\w-]+', 0.9, "api_key"),
        ]

        # Malicious instruction patterns
        self.malicious_patterns = [
            (r'\b(phishing|spear-phishing)\s+.{0,30}\b(campaign|email|attack)', 0.9, "phishing"),
            (r'\bSQL\s+injection\s+.{0,30}\b(exploit|attack|payload)', 0.8, "sql_injection"),
            (r'\b(DDoS|DoS)\s+.{0,30}\b(attack|tool|script)', 0.9, "dos_attack"),
            (r'\b(ransomware|malware|trojan)\s+.{0,30}\b(create|develop|deploy)', 0.9, "malware_development"),
        ]

        # Over-refusal patterns (agent declining safe requests)
        self.over_refusal_patterns = [
            (r'I cannot|I can\'t|I\'m unable to|I am unable to', 0.3, "refusal_language"),
            (r'I don\'t have the ability|I lack the capability', 0.4, "capability_denial"),
            (r'This request .{0,20}\b(violates|against)\b.{0,20}(policy|guidelines)', 0.5, "policy_citation"),
            (r'I cannot provide .{0,30} as it .{0,30}(harmful|dangerous|unsafe)', 0.6, "safety_excuse"),
        ]

        logger.info(f"WaltzRLFeedbackAgent initialized (threshold: {safety_threshold})")

    def analyze_response(
        self,
        query: str,
        response: str,
        agent_type: str = "unknown",
        agent_metadata: Optional[Dict] = None
    ) -> FeedbackResult:
        """
        Analyze agent response for safety and helpfulness.

        Args:
            query: User's original query
            response: Agent's response to analyze
            agent_type: Type of agent (e.g., "support-agent")
            agent_metadata: Additional agent context

        Returns:
            FeedbackResult with scores, issues, and suggestions
        """
        import time
        start_time = time.time()

        issues = []
        suggestions = []

        # Check for harmful content
        harmful_issues = self._check_harmful_content(response)
        issues.extend(harmful_issues)

        # Check for privacy violations
        privacy_issues = self._check_privacy_violations(response)
        issues.extend(privacy_issues)

        # Check for malicious instructions
        malicious_issues = self._check_malicious_instructions(response)
        issues.extend(malicious_issues)

        # Check for over-refusal (agent declining safe request)
        over_refusal_issues = self._check_over_refusal(query, response)
        issues.extend(over_refusal_issues)

        # Check for capability degradation
        degradation_issues = self._check_capability_degradation(response, agent_metadata)
        issues.extend(degradation_issues)

        # Calculate safety score (inverse of issue severity)
        safety_score = self._calculate_safety_score(issues)

        # Calculate helpfulness score
        helpfulness_score = self._calculate_helpfulness_score(response, over_refusal_issues)

        # Generate suggestions based on issues
        for issue in issues:
            suggestions.append(issue.suggestion)

        # Decide if response should be blocked
        should_block = self._should_block_response(issues, safety_score)

        analysis_time_ms = (time.time() - start_time) * 1000

        result = FeedbackResult(
            safety_score=safety_score,
            helpfulness_score=helpfulness_score,
            issues_found=issues,
            suggestions=suggestions,
            should_block=should_block,
            analysis_time_ms=analysis_time_ms
        )

        logger.info(
            f"WaltzRL analysis complete: safety={safety_score:.2f}, "
            f"helpfulness={helpfulness_score:.2f}, issues={len(issues)}, "
            f"block={should_block}, time={analysis_time_ms:.1f}ms"
        )

        return result

    def _check_harmful_content(self, response: str) -> List[SafetyIssue]:
        """Check for harmful content (violence, hate speech, illegal activity)"""
        issues = []

        for pattern, severity, content_type in self.harmful_patterns:
            matches = re.finditer(pattern, response, re.IGNORECASE)
            for match in matches:
                issues.append(SafetyIssue(
                    category=SafetyCategory.HARMFUL_CONTENT,
                    severity=severity,
                    description=f"Harmful content detected: {content_type}",
                    evidence=match.group(0),
                    suggestion=f"Remove or rephrase content related to {content_type}. "
                               f"Decline request if it seeks harmful information."
                ))

        return issues

    def _check_privacy_violations(self, response: str) -> List[SafetyIssue]:
        """Check for privacy violations (PII, credentials)"""
        issues = []

        for pattern, severity, data_type in self.privacy_patterns:
            matches = re.finditer(pattern, response, re.IGNORECASE)
            for match in matches:
                issues.append(SafetyIssue(
                    category=SafetyCategory.PRIVACY_VIOLATION,
                    severity=severity,
                    description=f"Privacy violation: {data_type} exposed",
                    evidence=match.group(0),
                    suggestion=f"Redact {data_type} from response. Use placeholder like '[REDACTED]'."
                ))

        return issues

    def _check_malicious_instructions(self, response: str) -> List[SafetyIssue]:
        """Check for malicious instructions (phishing, exploits, DoS)"""
        issues = []

        for pattern, severity, attack_type in self.malicious_patterns:
            matches = re.finditer(pattern, response, re.IGNORECASE)
            for match in matches:
                issues.append(SafetyIssue(
                    category=SafetyCategory.MALICIOUS_INSTRUCTION,
                    severity=severity,
                    description=f"Malicious instruction: {attack_type}",
                    evidence=match.group(0),
                    suggestion=f"Do not provide instructions for {attack_type}. "
                               f"Decline request and explain it's against policy."
                ))

        return issues

    def _check_over_refusal(self, query: str, response: str) -> List[SafetyIssue]:
        """Check for over-refusal (declining safe requests)"""
        issues = []

        # Only check if response contains refusal language
        refusal_detected = False
        for pattern, _, _ in self.over_refusal_patterns:
            if re.search(pattern, response, re.IGNORECASE):
                refusal_detected = True
                break

        if not refusal_detected:
            return issues

        # Analyze if refusal is justified
        # Simple heuristic: If query contains no harmful patterns, refusal might be unjustified
        query_is_safe = True
        for pattern, _, _ in self.harmful_patterns + self.malicious_patterns:
            if re.search(pattern, query, re.IGNORECASE):
                query_is_safe = False
                break

        if query_is_safe and refusal_detected:
            issues.append(SafetyIssue(
                category=SafetyCategory.OVER_REFUSAL,
                severity=0.5,
                description="Possible over-refusal: declined safe request",
                evidence=response[:100],
                suggestion="Reconsider if this request is actually harmful. "
                           "If safe, provide a helpful response instead of declining."
            ))

        return issues

    def _check_capability_degradation(
        self,
        response: str,
        agent_metadata: Optional[Dict]
    ) -> List[SafetyIssue]:
        """Check for capability degradation (poor quality response)"""
        issues = []

        # Simple heuristics for quality
        if len(response) < 20:
            issues.append(SafetyIssue(
                category=SafetyCategory.CAPABILITY_DEGRADED,
                severity=0.3,
                description="Response too short (possible degradation)",
                evidence=response,
                suggestion="Provide a more detailed and helpful response."
            ))

        # Check for generic/unhelpful responses
        generic_phrases = ["I'm not sure", "I don't know", "Maybe", "Possibly"]
        if any(phrase.lower() in response.lower() for phrase in generic_phrases):
            if len(response) < 50:
                issues.append(SafetyIssue(
                    category=SafetyCategory.CAPABILITY_DEGRADED,
                    severity=0.2,
                    description="Response appears generic/unhelpful",
                    evidence=response[:50],
                    suggestion="Provide more specific and actionable information."
                ))

        return issues

    def _calculate_safety_score(self, issues: List[SafetyIssue]) -> float:
        """
        Calculate overall safety score from issues.

        Formula: 1.0 - (weighted average of issue severities)
        """
        if not issues:
            return 1.0

        # Filter only safety-related issues (not over-refusal or degradation)
        safety_issues = [
            issue for issue in issues
            if issue.category in [
                SafetyCategory.HARMFUL_CONTENT,
                SafetyCategory.PRIVACY_VIOLATION,
                SafetyCategory.MALICIOUS_INSTRUCTION
            ]
        ]

        if not safety_issues:
            return 1.0

        # Weighted average of severities
        total_severity = sum(issue.severity for issue in safety_issues)
        avg_severity = total_severity / len(safety_issues)

        # Safety score is inverse of severity
        safety_score = 1.0 - avg_severity

        # Cap at 0.0
        return max(0.0, safety_score)

    def _calculate_helpfulness_score(
        self,
        response: str,
        over_refusal_issues: List[SafetyIssue]
    ) -> float:
        """
        Calculate helpfulness score.

        Factors:
        - Response length (longer = more helpful, up to a point)
        - Over-refusal penalty
        - Actionable content (code, steps, examples)
        """
        score = 0.5  # Base score

        # Length bonus (up to +0.3)
        length_bonus = min(0.3, len(response) / 1000)
        score += length_bonus

        # Actionable content bonus (+0.2 if present)
        actionable_indicators = ['```', 'step ', 'example:', 'try this', 'you can']
        if any(indicator in response.lower() for indicator in actionable_indicators):
            score += 0.2

        # Over-refusal penalty (-0.5 per issue)
        over_refusal_penalty = len(over_refusal_issues) * 0.5
        score -= over_refusal_penalty

        # Clamp to [0.0, 1.0]
        return max(0.0, min(1.0, score))

    def _should_block_response(
        self,
        issues: List[SafetyIssue],
        safety_score: float
    ) -> bool:
        """
        Decide if response should be blocked.

        Policy:
        - Block if safety score < threshold
        - Block if critical issues (severity >= 0.9)
        - Allow if only over-refusal or degradation issues
        """
        if safety_score < self.safety_threshold:
            return True

        # Check for critical issues
        if self.block_critical_only:
            critical_issues = [
                issue for issue in issues
                if issue.severity >= 0.9 and issue.category in [
                    SafetyCategory.HARMFUL_CONTENT,
                    SafetyCategory.PRIVACY_VIOLATION,
                    SafetyCategory.MALICIOUS_INSTRUCTION
                ]
            ]
            return len(critical_issues) > 0

        return False


def get_waltzrl_feedback_agent(
    safety_threshold: float = 0.7,
    helpfulness_threshold: float = 0.5,
    block_critical_only: bool = True
) -> WaltzRLFeedbackAgent:
    """
    Factory function to get WaltzRL Feedback Agent.

    Args:
        safety_threshold: Minimum safety score (0.0-1.0)
        helpfulness_threshold: Minimum helpfulness score (0.0-1.0)
        block_critical_only: Only block critical safety issues

    Returns:
        Configured WaltzRLFeedbackAgent instance
    """
    return WaltzRLFeedbackAgent(
        safety_threshold=safety_threshold,
        helpfulness_threshold=helpfulness_threshold,
        block_critical_only=block_critical_only
    )
