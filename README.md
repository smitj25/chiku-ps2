# SME-Plug Enterprise LLM Architecture

SME-Plug is a deterministically routed, highly auditable orchestration harness for Large Language Models. It establishes a robust "middleware" layer (the steering system) that safely routes user intent to specialized Subject Matter Expert (SME) configurations, applying strict input and output guardrails before and after the underlying LLM engine processes the query.

## Core Philosophy: The Car vs. The Steering System

Many generative AI applications tightly couple their business logic with their LLM framework (e.g., LangChain). SME-Plug decouples these:
*   **The Car (Execution Engine):** LangChain and the underlying LLM (Groq/Gemini). Dumb, powerful, and swappable.
*   **The Steering System (Middleware):** The SME-Plug harness. Smart, deterministic, policy-driven, and highly auditable.

## Directory Structure

```text
chiku/
├── backend/
│   ├── main.py                    # FastAPI entry point
│   ├── schemas.py                 # Pydantic models for API boundary
│   ├── config.py                  # Env vars, model names, threshold settings
│   ├── core/                      # The "Steering System"
│   │   ├── context_engine.py      # Dynamic prompt builder + tool injector
│   │   ├── guardrails.py          # Unified input/output validation + hallucination scoring
│   │   └── state_manager.py       # Conversation state and session memory
│   ├── agents/
│   │   ├── base_agent.py          # The "Car" - Generic LangChain wrapper
│   │   └── plugs/                 # (Future) Code-based tool implementations
│   ├── rag/
│   │   ├── vectorstore.py         # ChromaDB initialization
│   │   ├── ingestor.py            # PDF chunking and embedding logic
│   │   └── retriever.py           # Namespace-aware document retrieval
│   └── data/
│       ├── plugs/                 # Stateless JSON persona configurations
│       └── corporas/              # Raw document sources for RAG
├── frontend/                      # React frontend via Vite
│   ├── src/
│   │   ├── api.js                 # API bindings
│   │   ├── App.jsx                # Main layout (Sidebar, Chat, Topbar)
│   │   └── components/            # AuditPanel, ChatWindow, PersonaSwitcher, PipelineIndicator
└── ...
```

## Setup & Running Locally

### Backend Setup

1.  Navigate into the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Configure Environment Variables:
    Copy `.env.example` to `.env` and fill in your API keys (Gemini or Groq).
    ```bash
    cp .env.example .env
    ```
4.  Run Data Ingestion (Optional, pre-generated if using existing corpora):
    ```bash
    python scripts/generate_large_docs.py
    ```
5.  Start the FastAPI Server:
    ```bash
    uvicorn main:app --reload --port 8000
    ```

### Frontend Setup

1.  Navigate into the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite Development Server:
    ```bash
    npm run dev
    ```

## Key Features

*   **Stateless Plug Architecture:** Personas (Compliance, Advisor) are defined as distinct JSON configurations containing allowed topics, system prompts, specific knowledge bases, and guardrail sensitivities.
*   **Input Guardrails:** Validation against prompt injections, PII leakage, and off-topic queries *before* the LLM is invoked.
*   **Output Guardrails & Citation Verification:** Responses are blocked if hallucination scores (`answer_relevancy` approximation) exceed strict thresholds. Facts must be backed by retrieved citations.
*   **Full Observability:** 100% of pipeline stages (Retrieval -> Guards -> LLM Generation -> Verification) are logged with latency and outcome.
*   **Hot-Swappable:** Changing an active plug via HTTP Header (`X-Plug-ID`) instantly swaps out knowledge context, guardrails, and system prompts without restarting any service.

## API Usage

Query the engine and specify which plug to route to using the `X-Plug-ID` header:

```bash
curl -X POST http://localhost:8000/api/query \
  -H "Content-Type: application/json" \
  -H "X-Plug-ID: compliance" \
  -d '{"text": "Is Alexander Petrov on the OFAC SDN list?"}'
```
