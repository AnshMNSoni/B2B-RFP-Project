import pytest
import asyncio
from backend.schemas import RFPSummary, ProcessRfpRequest, RFPResponse
from backend.services.catalog_service import catalog_service
from backend.services.document_parser import parse_document_buffer
from backend.agents.sales_agent import fallback_sales_parsing
from backend.agents.pricing_agent import calculate_item_pricing, compute_unit_optimization, compute_value_engineering
from backend.agents.graph import execute_rfp_graph

def test_catalog_service_loaded():
    catalog = catalog_service.get_catalog()
    assert len(catalog) >= 20
    assert any(s.sku == "CAB-11KV-CU-XLPE" for s in catalog)

def test_fallback_sales_parsing():
    sample_text = """RFP Title: 11kV Substation Procurement
Due Date: 2025-07-15
Requirements:
- 11kV Copper XLPE Armored Cable
- 2,500 meters required
- IS 7098 compliant"""
    summary = fallback_sales_parsing(sample_text)
    assert "11kV Substation" in summary.title
    assert summary.dueDate == "2025-07-15"
    assert summary.voltage == "11kV"
    assert summary.material == "Copper"
    assert summary.insulation == "XLPE"
    assert summary.quantity == 2500

def test_pricing_calculation():
    item = calculate_item_pricing("CAB-11KV-CU-XLPE", "Test Description", 1200, 1000, "Copper")
    assert item.baseTotal == 1200000
    assert item.materialCost == 240000  # 20% copper factor
    assert item.serviceCost == 60000    # 5% service
    assert item.testingCost == 15000    # 15000 test fee
    assert item.totalCost == 1515000

def test_drum_unit_optimization():
    item = calculate_item_pricing("CAB-11KV-CU-XLPE", "Test Description", 1200, 850, "Copper")
    opt = compute_unit_optimization([item])
    assert opt.hasUnitOptimization is True
    assert opt.recommendedQuantity == 1000  # rounded up to next 500m drum

def test_document_parser():
    raw_txt = b"RFP Title: Solar Farm Project\nVoltage: 33kV Aluminium XLPE\nQuantity: 5000 meters"
    res = parse_document_buffer(raw_txt, "spec.txt")
    assert res["success"] is True
    assert "Solar Farm Project" in res["extractedText"]

def test_full_langgraph_execution():
    sample_text = """RFP Title: Express Test Project
Requirements:
- 33kV Aluminium XLPE 3-Core Cable
- Quantity: 1500 meters
- IS 7098 compliant"""
    response = asyncio.run(execute_rfp_graph(sample_text, thread_id="test-thread-1"))
    assert isinstance(response, RFPResponse)
    assert response.success is True
    assert len(response.matches) > 0
    assert len(response.pricing) > 0
    assert response.grandTotal > 0
