"""
Pipeline Orchestrator — The main query processing pipeline.
Input → Guardrails → Retrieval → Context Engine → Base Agent → Citation Verification → Output Guardrails
"""
from __future__ import annotations
import time
import uuid

from schemas import (
    QueryRequest, QueryResponse, ComparisonResponse,
    PipelineStep, AuditEntry,
    GuardrailDecision,
)
from core.plug_registry import plug_registry
from core.guardrails import guardrails
from core.context_engine import context_engine
from core.citation_verifier import citation_verifier
from core.state_manager import state_manager
from rag.retriever import retriever_service
from agents.base_agent import base_agent


async def process_query(request: QueryRequest, plug_id: str) -> QueryResponse | ComparisonResponse:
    """
    Main middleware pipeline: process a user query through the full SME-Plug system.
    """
    start_time = time.time()
    query_id = str(uuid.uuid4())
    steps: list[PipelineStep] = []

    # --- Step 0: Resolve Plug ---
    plug = plug_registry.get_plug(plug_id)
    if not plug:
        return QueryResponse(
            query_id=query_id,
            response_text=f"Error: Unknown plug ID '{plug_id}'.",
            plug_id=plug_id,
            plug_name="Unknown",
        )

    # --- Step 1: Input Guardrails ---
    step_start = time.time()
    input_result = guardrails.check_input(request.text, plug)
    steps.append(PipelineStep(
        name="Input Guardrails",
        status=input_result.decision.value,
        duration_ms=(time.time() - step_start) * 1000,
        details=f"Checks: {input_result.checks}",
    ))

    if input_result.decision == GuardrailDecision.BLOCKED:
        return QueryResponse(
            query_id=query_id,
            response_text=f"🚫 Query blocked by input guardrails. Reason: {input_result.details}",
            input_guardrail=input_result,
            pipeline_steps=steps,
            plug_id=plug.plug_id,
            plug_name=plug.name,
            total_duration_ms=(time.time() - start_time) * 1000,
        )

    # Redact PII if flagged
    clean_query = request.text
    if input_result.decision == GuardrailDecision.FLAGGED:
        clean_query = guardrails.redact_pii(request.text)

    # --- Step 2: Retrieval ---
    step_start = time.time()
    retrieved = retriever_service.retrieve(clean_query, plug.plug_id, top_k=5)
    sections = [r.section for r in retrieved]
    steps.append(PipelineStep(
        name="Document Retrieval",
        status="passed" if sections else "no_results",
        duration_ms=(time.time() - step_start) * 1000,
        details=f"Retrieved {len(sections)} sections from {len(set(s.filename for s in sections))} documents",
    ))

    # --- Step 3: Context Engine & LLM Generation ---
    step_start = time.time()
    
    # Context Engine builds the augmented prompt and system instructions based on the plug
    augmented_prompt = context_engine.build_prompt(clean_query, sections, "")
    system_prompt = context_engine.build_system_prompt(plug)

    # Base Agent executes the LLM call blindly
    raw_response, llm_duration = base_agent.generate(
        augmented_prompt=augmented_prompt,
        system_prompt=system_prompt,
    )
    
    steps.append(PipelineStep(
        name="LLM Generation",
        status="passed",
        duration_ms=llm_duration,
        details=f"Provider: Groq, Response length: {len(raw_response)} chars",
    ))

    # --- Step 4: Citation Verification ---
    step_start = time.time()
    # verify() takes strings now, wait, no, the old verifier took sections.
    # The citation verifier is the same. Let's see: citation_verifier.verify(raw_response, sections)
    citations = citation_verifier.verify(raw_response, sections)
    steps.append(PipelineStep(
        name="Citation Verification",
        status="passed",
        duration_ms=(time.time() - step_start) * 1000,
        details=f"Verified {len(citations)} citations",
    ))

    # --- Step 5: Output Guardrails ---
    step_start = time.time()
    context_text = "\n\n".join(s.content for s in sections)
    output_result, hallucination_score = guardrails.check_output(
        raw_response, context_text, plug,
    )
    steps.append(PipelineStep(
        name="Output Guardrails",
        status=output_result.decision.value,
        duration_ms=(time.time() - step_start) * 1000,
        details=f"Hallucination score: {hallucination_score:.2f}",
    ))

    total_duration = (time.time() - start_time) * 1000

    # --- Build response ---
    smeplug_response = QueryResponse(
        query_id=query_id,
        response_text=raw_response,
        citations=citations,
        input_guardrail=input_result,
        output_guardrail=output_result,
        pipeline_steps=steps,
        hallucination_score=hallucination_score,
        plug_id=plug.plug_id,
        plug_name=plug.name,
        total_duration_ms=total_duration,
    )

    # --- Audit log ---
    audit_entry = AuditEntry(
        query_id=query_id,
        plug_id=plug.plug_id,
        plug_name=plug.name,
        query_text=request.text,
        retrieved_sections=[
            {"filename": s.filename, "page": s.page, "title": s.title, "node_id": s.node_id}
            for s in sections
        ],
        raw_llm_response=raw_response,
        final_response=raw_response,
        citations=citations,
        input_guardrail=input_result,
        output_guardrail=output_result,
        hallucination_score=hallucination_score,
        pipeline_steps=steps,
    )
    state_manager.add_audit_entry(audit_entry)

    # --- Comparison mode ---
    if request.compare_mode:
        vanilla_response, vanilla_duration = base_agent.generate_vanilla(request.text)
        return ComparisonResponse(
            query_id=query_id,
            vanilla_response=vanilla_response,
            vanilla_duration_ms=vanilla_duration,
            smeplug_response=smeplug_response,
            plug_name=plug.name,
        )

    return smeplug_response
