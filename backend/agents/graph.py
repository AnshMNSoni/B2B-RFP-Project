import json
import asyncio
from typing import AsyncGenerator, Dict, Any
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

from backend.schemas import (
    AgentState,
    RFPSummary,
    SKUMatch,
    RFPResponse,
    PricingItem,
    ValueEngineeringRecommendation,
    UnitOptimization,
    RiskChartsData
)
from backend.agents.sales_agent import run_sales_agent
from backend.agents.technical_agent import run_technical_agent
from backend.agents.pricing_agent import run_pricing_agent

# Node 1: Sales Agent Node
async def sales_node(state: AgentState) -> Dict[str, Any]:
    rfp_text = state.get("rfp_text", "")
    summary = await run_sales_agent(rfp_text)
    return {
        "summary": summary.model_dump(),
        "current_node": "sales_agent"
    }

# Node 2: Technical Agent Node
async def technical_node(state: AgentState) -> Dict[str, Any]:
    summary_dict = state.get("summary") or {}
    summary = RFPSummary(**summary_dict)
    matches = await run_technical_agent(summary)
    return {
        "matches": [m.model_dump() for m in matches],
        "current_node": "technical_agent"
    }

# Node 3: Pricing Agent Node
async def pricing_node(state: AgentState) -> Dict[str, Any]:
    matches_list = state.get("matches") or []
    matches = [SKUMatch(**m) for m in matches_list]
    summary_dict = state.get("summary") or {}
    summary = RFPSummary(**summary_dict)
    rfp_text = state.get("rfp_text", "")

    pricing_items, grand_total, analysis, ve, uo, rc = await run_pricing_agent(
        matches=matches,
        rfp_context=rfp_text,
        summary=summary
    )

    return {
        "pricing_items": [p.model_dump() for p in pricing_items],
        "grand_total": grand_total,
        "analysis": analysis,
        "value_engineering": ve.model_dump() if ve else None,
        "unit_optimization": uo.model_dump() if uo else None,
        "risk_charts": rc.model_dump() if rc else None,
        "current_node": "pricing_agent"
    }

# Node 4: Consolidation Node
async def consolidation_node(state: AgentState) -> Dict[str, Any]:
    return {
        "current_node": "completed"
    }

# Build LangGraph StateGraph
builder = StateGraph(AgentState)
builder.add_node("sales_agent", sales_node)
builder.add_node("technical_agent", technical_node)
builder.add_node("pricing_agent", pricing_node)
builder.add_node("consolidation", consolidation_node)

builder.add_edge(START, "sales_agent")
builder.add_edge("sales_agent", "technical_agent")
builder.add_edge("technical_agent", "pricing_agent")
builder.add_edge("pricing_agent", "consolidation")
builder.add_edge("consolidation", END)

# In-Memory Checkpointer for session state preservation
checkpointer = MemorySaver()
rfp_graph = builder.compile(checkpointer=checkpointer)

async def execute_rfp_graph(rfp_text: str, thread_id: str = "default") -> RFPResponse:
    """Executes the complete LangGraph workflow synchronously / non-streamed."""
    initial_state: AgentState = {
        "rfp_text": rfp_text,
        "thread_id": thread_id,
        "retries": 0
    }
    config = {"configurable": {"thread_id": thread_id}}
    final_state = await rfp_graph.ainvoke(initial_state, config=config)

    summary = RFPSummary(**(final_state.get("summary") or {}))
    matches = [SKUMatch(**m) for m in (final_state.get("matches") or [])]
    pricing = [PricingItem(**p) for p in (final_state.get("pricing_items") or [])]
    grand_total = final_state.get("grand_total", 0.0)
    analysis = final_state.get("analysis")
    ve = ValueEngineeringRecommendation(**final_state["value_engineering"]) if final_state.get("value_engineering") else None
    uo = UnitOptimization(**final_state["unit_optimization"]) if final_state.get("unit_optimization") else None
    rc = RiskChartsData(**final_state["risk_charts"]) if final_state.get("risk_charts") else None

    return RFPResponse(
        success=True,
        summary=summary,
        matches=matches,
        pricing=pricing,
        grandTotal=grand_total,
        analysis=analysis,
        valueEngineering=ve,
        unitOptimization=uo,
        riskCharts=rc
    )

async def stream_rfp_workflow(rfp_text: str, thread_id: str = "default") -> AsyncGenerator[str, None]:
    """
    Asynchronous Server-Sent Events (SSE) generator streaming true graph node transitions.
    """
    initial_state: AgentState = {
        "rfp_text": rfp_text,
        "thread_id": thread_id,
        "retries": 0
    }
    config = {"configurable": {"thread_id": thread_id}}

    yield f"data: {json.dumps({'event': 'start', 'message': 'Initializing LangGraph Multi-Agent Workflow...'})}\n\n"

    try:
        async for event in rfp_graph.astream(initial_state, config=config, stream_mode="updates"):
            for node_name, node_state in event.items():
                if node_name == "sales_agent":
                    yield f"data: {json.dumps({'event': 'node_completed', 'node': 'sales_agent', 'summary': node_state.get('summary'), 'message': 'Sales Agent extracted specifications.'})}\n\n"
                elif node_name == "technical_agent":
                    yield f"data: {json.dumps({'event': 'node_completed', 'node': 'technical_agent', 'matches': node_state.get('matches'), 'message': 'Technical Agent completed SKU vector matching.'})}\n\n"
                elif node_name == "pricing_agent":
                    yield f"data: {json.dumps({'event': 'node_completed', 'node': 'pricing_agent', 'pricing': node_state.get('pricing_items'), 'grandTotal': node_state.get('grand_total'), 'message': 'Pricing Agent computed itemized quotes and risk analysis.'})}\n\n"

        # Final complete response
        final_state = await rfp_graph.aget_state(config=config)
        state_values = final_state.values if final_state else {}

        summary = RFPSummary(**(state_values.get("summary") or {}))
        matches = [SKUMatch(**m) for m in (state_values.get("matches") or [])]
        pricing = [PricingItem(**p) for p in (state_values.get("pricing_items") or [])]
        grand_total = state_values.get("grand_total", 0.0)
        analysis = state_values.get("analysis")
        ve = ValueEngineeringRecommendation(**state_values["value_engineering"]) if state_values.get("value_engineering") else None
        uo = UnitOptimization(**state_values["unit_optimization"]) if state_values.get("unit_optimization") else None
        rc = RiskChartsData(**state_values["risk_charts"]) if state_values.get("risk_charts") else None

        response = RFPResponse(
            success=True,
            summary=summary,
            matches=matches,
            pricing=pricing,
            grandTotal=grand_total,
            analysis=analysis,
            valueEngineering=ve,
            unitOptimization=uo,
            riskCharts=rc
        )

        yield f"data: {json.dumps({'event': 'complete', 'result': response.model_dump()})}\n\n"

    except Exception as e:
        yield f"data: {json.dumps({'event': 'error', 'error': str(e)})}\n\n"
