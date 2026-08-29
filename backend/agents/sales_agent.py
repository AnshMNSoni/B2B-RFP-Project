import os
import re
import json
from typing import Optional
from backend.schemas import RFPSummary

def fallback_sales_parsing(rfp_text: str) -> RFPSummary:
    """Regex & heuristic rule-based parsing if LLM is unavailable."""
    lines = [line.strip() for line in rfp_text.split('\n') if line.strip()]

    title = "Untitled RFP"
    for line in lines:
        lower = line.lower()
        if 'rfp title:' in lower or 'title:' in lower or 'subject:' in lower:
            parts = line.split(':', 1)
            if len(parts) > 1 and parts[1].strip():
                title = parts[1].strip()
                break

    due_date = None
    for line in lines:
        lower = line.lower()
        if 'due date:' in lower or 'deadline:' in lower or 'submission date:' in lower:
            match = re.search(r'\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4}|\d{2}-\d{2}-\d{4}', line)
            if match:
                due_date = match.group(0)
                break

    voltage = None
    voltage_match = re.search(r'(\d+(?:\.\d+)?)\s*kv', rfp_text, re.IGNORECASE)
    if voltage_match:
        voltage = f"{voltage_match.group(1)}kV"
    elif 'low voltage' in rfp_text.lower() or ' 1.1kv' in rfp_text.lower() or ' lt ' in rfp_text.lower():
        voltage = "LV"

    material = None
    if 'copper' in rfp_text.lower():
        material = 'Copper'
    elif 'aluminium' in rfp_text.lower() or 'aluminum' in rfp_text.lower():
        material = 'Aluminium'

    insulation = None
    if 'xlpe' in rfp_text.lower():
        insulation = 'XLPE'
    elif 'pvc' in rfp_text.lower():
        insulation = 'PVC'
    elif 'rubber' in rfp_text.lower():
        insulation = 'Rubber'

    quantity = None
    qty_match = re.search(r'(?:quantity|qty|length|required)[:\s]+([\d,]+)\s*(?:meters|m|metres)?', rfp_text, re.IGNORECASE) or \
                re.search(r'([\d,]+)\s*(?:meters|m|metres)\s*(?:required|continuous|reel)?', rfp_text, re.IGNORECASE)
    if qty_match:
        try:
            qty_num = float(qty_match.group(1).replace(',', ''))
            if qty_num > 0:
                quantity = qty_num
        except ValueError:
            pass

    compliance = []
    for std in ["IS 7098", "IS 1554", "IEC 60502", "IEC 60840", "IEEE", "CIGRE", "BS 6622"]:
        if std.lower() in rfp_text.lower():
            compliance.append(std)

    requirements = []
    for line in lines:
        if line.startswith('-') or line.startswith('*') or line.startswith('•'):
            requirements.append(line.lstrip('-*• ').strip())

    if not requirements:
        requirements = ["Industrial grade power cable requirement extracted via rule engine."]

    return RFPSummary(
        title=title,
        dueDate=due_date,
        voltage=voltage,
        material=material,
        insulation=insulation,
        quantity=quantity,
        compliance=compliance,
        requirements=requirements
    )

async def run_sales_agent(rfp_text: str) -> RFPSummary:
    """
    AI-Powered Sales Agent - Extracts and summarizes RFP requirements.
    Priority: 1. Groq (llama-3.3-70b) -> 2. Gemini (gemini-2.0-flash / 1.5-flash) -> 3. Rule Fallback
    """
    groq_api_key = os.getenv("GROQ_API_KEY")
    gemini_api_key = os.getenv("GEMINI_API_KEY")

    prompt = f"""You are an expert sales analyst extracting technical requirements from an RFP for electrical and transmission cables.

Analyze the following RFP text and extract:
1. title: Title of the RFP (string)
2. dueDate: Due date in YYYY-MM-DD format if specified, else null
3. voltage: Voltage rating (e.g., "11kV", "33kV", "132kV", "LV", "220kV") or null
4. material: Conductor material ("Copper" or "Aluminium") or null
5. insulation: Insulation type ("XLPE", "PVC", "Rubber", etc.) or null
6. quantity: Required quantity in meters as a number (e.g., 2500), or null
7. compliance: List of compliance standards (e.g. ["IS 7098", "IEC 60502"])
8. requirements: List of key technical specifications

RFP Text:
{rfp_text}

Respond ONLY with a valid JSON object matching this schema."""

    # Priority 1: Groq (llama-3.3-70b-versatile)
    if groq_api_key and groq_api_key.strip():
        try:
            from langchain_groq import ChatGroq
            llm = ChatGroq(
                api_key=groq_api_key.strip(),
                model_name="llama-3.3-70b-versatile",
                temperature=0.1,
            )
            structured_llm = llm.with_structured_output(RFPSummary)
            res = await structured_llm.ainvoke(prompt)
            if isinstance(res, RFPSummary):
                return res
        except Exception as err:
            print(f"Sales Agent Groq error, attempting Gemini fallback: {err}")

    # Priority 2: Gemini
    if gemini_api_key and gemini_api_key.strip():
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            llm = ChatGoogleGenerativeAI(
                google_api_key=gemini_api_key.strip(),
                model="gemini-2.0-flash",
                temperature=0.1,
            )
            structured_llm = llm.with_structured_output(RFPSummary)
            res = await structured_llm.ainvoke(prompt)
            if isinstance(res, RFPSummary):
                return res
        except Exception as err:
            print(f"Sales Agent Gemini error: {err}")

    # Priority 3: Fallback Rule Parser
    return fallback_sales_parsing(rfp_text)
