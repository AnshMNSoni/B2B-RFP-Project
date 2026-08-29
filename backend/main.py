import os
import uuid
from typing import Optional
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import JSONResponse, StreamingResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Load environment variables
load_dotenv()

from backend.schemas import ProcessRfpRequest, RFPResponse
from backend.services.catalog_service import catalog_service
from backend.services.document_parser import parse_document_buffer
from backend.agents.graph import execute_rfp_graph, stream_rfp_workflow

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    hf_token = os.getenv("HF_TOKEN")
    if hf_token:
        try:
            catalog_service.ensure_catalog_indexed(hf_token.strip())
        except Exception as e:
            print(f"Startup vector indexing warning: {e}")
    yield

app = FastAPI(
    title="B2B RFP Agent API",
    description="Python & LangGraph Multi-Agent RFP Processing Engine",
    version="2.0.0",
    lifespan=lifespan
)

# Enable CORS for local Vite dev server and production deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "engine": "LangGraph Python Backend"}

@app.get("/api/sku-catalog")
async def get_sku_catalog():
    return catalog_service.get_catalog()

@app.post("/api/parse-document")
async def parse_document(file: UploadFile = File(...)):
    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        result = parse_document_buffer(content, file.filename or "document.txt")
        return {
            "success": True,
            "filename": result["filename"],
            "fileType": result["fileType"],
            "text": result["extractedText"],
            "metadata": result["metadata"]
        }
    except Exception as e:
        print(f"Document parsing error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e) or "Failed to parse document"}
        )

@app.post("/api/process-rfp")
async def process_rfp(request: ProcessRfpRequest):
    try:
        thread_id = str(uuid.uuid4())
        response = await execute_rfp_graph(request.rfpText, thread_id=thread_id)
        return response
    except Exception as e:
        print(f"RFP Processing error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e) or "Failed to process RFP"}
        )

@app.post("/api/process-rfp/stream")
async def process_rfp_stream(request: ProcessRfpRequest):
    thread_id = str(uuid.uuid4())
    return StreamingResponse(
        stream_rfp_workflow(request.rfpText, thread_id=thread_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

# Verification & Test Endpoints
@app.get("/api/test-groq")
async def test_groq():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return {"success": False, "error": "GROQ_API_KEY not found in environment"}
    try:
        from groq import Groq
        client = Groq(api_key=api_key)
        chat = client.chat.completions.create(
            messages=[{"role": "user", "content": "Say hello in 3 words"}],
            model="llama-3.3-70b-versatile",
            max_tokens=20
        )
        return {
            "success": True,
            "model": "llama-3.3-70b-versatile",
            "response": chat.choices[0].message.content.strip()
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

@app.get("/api/test-gemini")
async def test_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"success": False, "error": "GEMINI_API_KEY not found in environment"}
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.0-flash")
        res = model.generate_content("Say hello in 3 words")
        return {
            "success": True,
            "model": "gemini-2.0-flash",
            "response": res.text.strip()
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

@app.get("/api/test-huggingface")
async def test_huggingface():
    token = os.getenv("HF_TOKEN")
    if not token:
        return {"success": False, "error": "HF_TOKEN not found in environment"}
    try:
        emb = catalog_service.fetch_hf_embedding("11kV Copper XLPE Cable Test Embedding", token)
        if emb:
            return {
                "success": True,
                "tokenExists": True,
                "model": "sentence-transformers/all-MiniLM-L6-v2",
                "vectorDimensions": len(emb),
                "sampleVectorPreview": emb[:5]
            }
        return {"success": False, "error": "Failed to generate embedding from Hugging Face"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

# Mount built React static files if present in production
dist_path = os.path.join(os.getcwd(), "dist")
public_dist_path = os.path.join(os.getcwd(), "dist", "public")

if os.path.exists(public_dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(public_dist_path, "assets")), name="assets")
    @app.get("/{full_path:path}")
    async def serve_spa_public(full_path: str):
        file_path = os.path.join(public_dist_path, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(public_dist_path, "index.html"))
elif os.path.exists(dist_path) and os.path.exists(os.path.join(dist_path, "index.html")):
    assets_dir = os.path.join(dist_path, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(dist_path, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_path, "index.html"))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "5000"))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
