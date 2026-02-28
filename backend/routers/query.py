"""Query router — Main query endpoint with comparison mode."""
from fastapi import APIRouter, HTTPException, Request
from schemas import QueryRequest, QueryResponse, ComparisonResponse
from core.pipeline import process_query
from core.router import request_router

router = APIRouter(prefix="/api", tags=["query"])


@router.post("/query", response_model=QueryResponse | ComparisonResponse)
async def query(request: Request, body: QueryRequest):
    """
    Process a query through the SME-Plug middleware pipeline.
    
    - Extracts X-Plug-ID header to determine the SME configuration.
    - Runs input guardrails → retrieval → context engine → LLM → citation verify → output guardrails
    - If compare_mode=true, also returns a vanilla LLM response.
    """
    try:
        # Step 0: Middleware router extracts plug_id natively from headers
        plug_id = request_router.resolve_plug_id(request, fallback_id="compliance")
        
        # Pass to orchestrator which is unaware of HTTP boundaries
        result = await process_query(body, plug_id=plug_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")
