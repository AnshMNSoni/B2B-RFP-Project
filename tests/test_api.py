import io
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_api_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "LangGraph" in data["engine"]

def test_api_sku_catalog():
    response = client.get("/api/sku-catalog")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 20

def test_api_parse_document():
    dummy_text = b"RFP Title: Substation Procurement 2025\nVoltage: 11kV Copper XLPE\nQuantity: 2500m"
    files = {"file": ("test_rfp.txt", dummy_text, "text/plain")}
    response = client.post("/api/parse-document", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "Substation Procurement" in data["text"]

def test_api_process_rfp_blocking():
    payload = {
        "rfpText": "RFP Title: Industrial Grid Project\nVoltage: 11kV\nMaterial: Copper\nInsulation: XLPE\nQuantity: 1000 meters"
    }
    response = client.post("/api/process-rfp", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "summary" in data
    assert "matches" in data
    assert "pricing" in data
    assert data["grandTotal"] > 0

def test_api_process_rfp_stream():
    payload = {
        "rfpText": "RFP Title: Solar Connection\nVoltage: 33kV\nMaterial: Aluminium\nInsulation: XLPE\nQuantity: 500 meters"
    }
    response = client.post("/api/process-rfp/stream", json=payload)
    assert response.status_code == 200
    assert "text/event-stream" in response.headers.get("content-type", "")
    content = response.text
    assert "data:" in content
    assert "sales_agent" in content or "start" in content
