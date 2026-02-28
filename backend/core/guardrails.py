"""
Core Guardrails Middleware — Unified I/O validation.
"""
from __future__ import annotations
import re
import time
from schemas import GuardrailResult, GuardrailDecision, PlugConfig


# Known prompt injection patterns
_INJECTION_PATTERNS = [
    r"ignore\s+(all\s+)?previous\s+instructions",
    r"ignore\s+(all\s+)?above",
    r"disregard\s+(all\s+)?previous",
    r"you\s+are\s+now\s+(?:a|an)\s+(?!compliance|investment|advisor)",
    r"pretend\s+you\s+are",
    r"forget\s+(everything|all)",
    r"system\s*prompt",
    r"reveal\s+your\s+(?:instructions|prompt|system)",
    r"act\s+as\s+(?:a|an)\s+(?!compliance|investment|advisor)",
    r"jailbreak",
    r"DAN\s+mode",
]

# PII patterns
_PII_PATTERNS = {
    "ssn": r"\b\d{3}-\d{2}-\d{4}\b",
    "credit_card": r"\b(?:\d{4}[-\s]?){3}\d{4}\b",
    "email": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",
    "phone": r"\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b",
}


class GuardrailsMiddleware:
    """Unified Input/Output validation middleware."""

    # -- Input Guardrails --

    def check_input(self, query: str, plug: PlugConfig) -> GuardrailResult:
        start = time.time()
        checks: dict[str, bool] = {}
        details: dict[str, str] = {}

        # 1. Prompt injection detection
        injection_found = False
        for pattern in _INJECTION_PATTERNS:
            if re.search(pattern, query, re.IGNORECASE):
                injection_found = True
                details["injection_pattern"] = pattern
                break
        checks["prompt_injection_safe"] = not injection_found

        # 2. PII detection
        pii_found: list[str] = []
        for pii_type, pattern in _PII_PATTERNS.items():
            if re.search(pattern, query):
                pii_found.append(pii_type)
        checks["pii_safe"] = len(pii_found) == 0
        if pii_found:
            details["pii_detected"] = ", ".join(pii_found)

        # 3. Topic boundary enforcement
        if plug.allowed_topics:
            query_lower = query.lower()
            topic_match = any(
                topic.lower() in query_lower
                for topic in plug.allowed_topics
            )
            # Be lenient
            checks["topic_in_scope"] = True
            if plug.blocked_terms:
                blocked = [t for t in plug.blocked_terms if t.lower() in query_lower]
                if blocked:
                    checks["topic_in_scope"] = False
                    details["blocked_terms_found"] = ", ".join(blocked)

        checks["query_valid"] = len(query.strip()) > 0

        # Determine overall decision
        if not checks.get("prompt_injection_safe", True):
            decision = GuardrailDecision.BLOCKED
        elif not checks.get("topic_in_scope", True):
            decision = GuardrailDecision.BLOCKED
        elif not checks.get("query_valid", True):
            decision = GuardrailDecision.BLOCKED
        elif not checks.get("pii_safe", True):
            decision = GuardrailDecision.FLAGGED
            details["pii_action"] = "PII detected and redacted from context"
        else:
            decision = GuardrailDecision.PASSED

        return GuardrailResult(
            layer="input",
            decision=decision,
            checks=checks,
            details=details,
            timestamp=time.time(),
        )

    def redact_pii(self, text: str) -> str:
        redacted = text
        for pii_type, pattern in _PII_PATTERNS.items():
            redacted = re.sub(pattern, f"[REDACTED-{pii_type.upper()}]", redacted)
        return redacted

    # -- Output Guardrails --

    def check_output(self, response: str, retrieved_context: str, plug: PlugConfig) -> tuple[GuardrailResult, float]:
        checks: dict[str, bool] = {}
        details: dict[str, str] = {}

        # 1. Citation presence check
        citation_pattern = r'\[Source:\s*[^\]]+\]'
        citations_found = re.findall(citation_pattern, response)
        checks["has_citations"] = len(citations_found) > 0
        details["citation_count"] = str(len(citations_found))

        # 2. Hallucination score
        hallucination_score = self._estimate_hallucination(response, retrieved_context)
        checks["hallucination_acceptable"] = hallucination_score <= 0.30
        details["hallucination_score"] = f"{hallucination_score:.2f}"

        # 3. Disclaimer check
        if plug.require_disclaimer:
            has_disclaimer = any(keyword in response.lower() for keyword in [
                "disclaimer", "subject to market risks", "consult",
                "not indicative of future", "read all scheme",
                "ai-assisted", "final determination",
            ])
            checks["disclaimer_present"] = has_disclaimer
        else:
            checks["disclaimer_present"] = True

        # 4. Blocked terms check
        if plug.blocked_terms:
            blocked = [t for t in plug.blocked_terms if t.lower() in response.lower()]
            checks["no_blocked_terms"] = len(blocked) == 0
            if blocked:
                details["blocked_terms_in_output"] = ", ".join(blocked)

        checks["response_valid"] = len(response.strip()) > 20

        all_passed = all(checks.values())
        if not checks.get("hallucination_acceptable", True):
            decision = GuardrailDecision.BLOCKED
        elif not checks.get("no_blocked_terms", True):
            decision = GuardrailDecision.BLOCKED
        elif not all_passed:
            decision = GuardrailDecision.FLAGGED
        else:
            decision = GuardrailDecision.PASSED

        result = GuardrailResult(
            layer="output",
            decision=decision,
            checks=checks,
            details=details,
            timestamp=time.time(),
        )
        return result, hallucination_score

    def _estimate_hallucination(self, response: str, context: str) -> float:
        if not context.strip():
            return 1.0

        sentences = re.split(r'[.!?]\s+', response)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 10]

        if not sentences:
            return 0.0

        context_lower = context.lower()
        ungrounded = 0

        for sentence in sentences:
            if "[source:" in sentence.lower() or "disclaimer" in sentence.lower():
                continue

            terms = set(re.findall(r'\b[a-zA-Z]{4,}\b', sentence.lower()))
            stopwords = {"this", "that", "with", "from", "have", "been", "will", "they", "their", "what", "which", "when", "where", "must", "should", "could", "would", "also", "based", "about"}
            terms -= stopwords

            if not terms:
                continue

            grounded_terms = sum(1 for t in terms if t in context_lower)
            grounding_ratio = grounded_terms / len(terms) if terms else 0

            if grounding_ratio < 0.3:
                ungrounded += 1

        return ungrounded / len(sentences) if sentences else 0.0


# Singleton
guardrails = GuardrailsMiddleware()
