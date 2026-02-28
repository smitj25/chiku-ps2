"""SME-Plug FastAPI Application Entry Point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from core.plug_registry import plug_registry

from config import HOST, PORT


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load plugs on startup
    print("Loading SME-Plug configurations...")
    plug_registry.load_plugs()
    print(f"Loaded {len(plug_registry.list_plugs())} plugs.")
    
    yield
    
    # Cleanup on shutdown
    print("Shutting down...")


app = FastAPI(
    title="SME-Plug Enterprise Middleware",
    description="Stateless context engine and governance layer for LLM agents",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok", "plugs_loaded": len(plug_registry.list_plugs())}


# Include API routers
from routers import query, plugs, audit
app.include_router(query.router)
app.include_router(plugs.router)
app.include_router(audit.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
