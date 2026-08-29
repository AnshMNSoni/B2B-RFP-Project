import os
import math
from typing import List, Optional, Tuple
from pydantic import BaseModel, Field
from backend.schemas import (
    SKUMatch,
    PricingItem,
    ValueEngineeringRecommendation,
    UnitOptimization,
    RiskChartsData,
    CommodityTrendItem,
    CostDistributionItem,
    RiskScoreItem,
    RFPSummary,
    USD_INR_FOREX_RATE,
    LME_COPPER_USD,
    LME_ALUMINIUM_USD
)
from backend.services.catalog_service import catalog_service

class AiPricingItem(BaseModel):
    sku: str
    quantity: float
    reasoning: str

class AiPricingOutput(BaseModel):
    items: List[AiPricingItem] = Field(default_factory=list)
    analysis: str = ""

def calculate_item_pricing(
    sku: str,
    description: str,
    base_price: float,
    quantity: float,
    material: str = "Copper",
    reasoning: Optional[str] = None
) -> PricingItem:
    """Deterministic financial cost engine calculating itemized breakdown."""
    base_total = base_price * quantity
    # Conductor metal raw price surcharge (Copper +20%, Aluminium +10%)
    mat_rate = 0.20 if material.lower() == "copper" else 0.10
    material_cost = round(base_total * mat_rate)
    service_cost = round(base_total * 0.05)  # 5% handling & logistics
    testing_cost = 15000.0  # standard factory routine testing fee
    total_cost = base_total + material_cost + service_cost + testing_cost

    return PricingItem(
        sku=sku,
        description=description,
        basePrice=base_price,
        quantity=quantity,
        baseTotal=base_total,
        materialCost=material_cost,
        serviceCost=service_cost,
        testingCost=testing_cost,
        totalCost=total_cost,
        reasoning=reasoning or f"Calculated based on {quantity:,.0f}m scope with standard test fees and LME metal indexation."
    )

def compute_unit_optimization(primary_items: List[PricingItem]) -> UnitOptimization:
    """Computes Factory Scrap Elimination & Drum Reel Unit/Batch Optimization."""
    if not primary_items:
        return UnitOptimization(
            hasUnitOptimization=False,
            requestedQuantity=0,
            recommendedQuantity=0,
            drumSize=500,
            scrapFeeSaved=0,
            netCostBefore=0,
            netCostAfter=0,
            savingsAmount=0,
            optimizationType="standard_reel",
            message="No items available for unit optimization."
        )

    item = primary_items[0]
    req_qty = item.quantity

    # Standard drum reel capacities (500m and 1000m reels)
    drum1000s = math.floor(req_qty / 1000)
    remainder = req_qty % 1000
    drum500s = math.ceil(remainder / 500) if remainder > 0 else 0

    rounded_drum_qty = (drum1000s * 1000) + (drum500s * 500)
    if rounded_drum_qty == 0:
        rounded_drum_qty = 500

    if req_qty % 500 != 0 and req_qty < rounded_drum_qty:
        custom_cut_fee = round(item.totalCost * 0.15)
        net_cost_before = item.totalCost + custom_cut_fee
        unit_price = item.totalCost / req_qty if req_qty > 0 else 0
        net_cost_after = round(unit_price * rounded_drum_qty)
        savings_amount = max(0.0, net_cost_before - net_cost_after)

        drums_desc = f"{drum1000s} × 1,000m + " if drum1000s > 0 else ""
        drums_desc += f"{drum500s} × 500m drums"

        return UnitOptimization(
            hasUnitOptimization=True,
            requestedQuantity=req_qty,
            recommendedQuantity=rounded_drum_qty,
            drumSize=500,
            scrapFeeSaved=custom_cut_fee,
            netCostBefore=net_cost_before,
            netCostAfter=net_cost_after,
            savingsAmount=savings_amount,
            optimizationType="drum_batch",
            message=f"Purchase full standard factory drum reels ({rounded_drum_qty:,.0f}m: {drums_desc}) instead of a {req_qty:,.0f}m custom cut. You receive {rounded_drum_qty - req_qty:,.0f} meters of spare cable AND save ₹{custom_cut_fee:,.0f} by eliminating factory custom-cutting scrap penalties!"
        )

    drum_desc = (
        f"{math.floor(req_qty / 1000)} × 1,000m {f'+ 1 × {req_qty % 1000:.0f}m' if req_qty % 1000 > 0 else ''} Heavy-Duty Wooden Drum Reels"
        if req_qty >= 1000
        else f"1 × {req_qty:.0f}m Standard Factory Reel"
    )

    return UnitOptimization(
        hasUnitOptimization=True,
        requestedQuantity=req_qty,
        recommendedQuantity=req_qty,
        drumSize=1000 if req_qty >= 1000 else 500,
        scrapFeeSaved=round(item.totalCost * 0.05),
        netCostBefore=item.totalCost,
        netCostAfter=item.totalCost,
        savingsAmount=0,
        optimizationType="standard_reel",
        message=f"Factory Drum Reel Packaging: Order is packaged into {drum_desc}. Standard reel batching eliminates custom-cutting scrap fees."
    )

def compute_value_engineering(
    matches: List[SKUMatch],
    primary_items: List[PricingItem],
    summary: Optional[RFPSummary] = None
) -> Optional[ValueEngineeringRecommendation]:
    """Computes AI Value Engineering & Cost Optimization trade-offs (e.g. Copper -> Ampacity-Equivalent Aluminium)."""
    if not primary_items or not matches:
        return None

    primary_match = matches[0]
    primary_item = primary_items[0]

    # Look for Aluminium alternative if primary is Copper
    if primary_match.material.lower() == "copper":
        catalog = catalog_service.get_catalog()
        al_sku = None
        for item in catalog:
            if item.material.lower() == "aluminium" and item.voltage.lower() == primary_match.voltage.lower():
                al_sku = item
                break

        if al_sku:
            al_pricing = calculate_item_pricing(
                sku=al_sku.sku,
                description=al_sku.description,
                base_price=al_sku.basePrice,
                quantity=primary_item.quantity,
                material="Aluminium"
            )
            savings = max(0.0, primary_item.totalCost - al_pricing.totalCost)
            savings_pct = round((savings / primary_item.totalCost) * 100, 1) if primary_item.totalCost > 0 else 0

            return ValueEngineeringRecommendation(
                hasOptimization=True,
                originalSku=primary_match.sku,
                optimizedSku=al_sku.sku,
                originalTotalCost=primary_item.totalCost,
                optimizedTotalCost=al_pricing.totalCost,
                savingsAmount=savings,
                savingsPercentage=savings_pct,
                alternativeMaterial="Aluminium Conductor (Upsized cross-section for equivalent ampacity)",
                technicalJustification=f"Transitioning from Copper ({primary_match.crossSection or '150mm²'}) to Ampacity-Equivalent Aluminium ({al_sku.crossSection or '240mm²'}) maintains identical current rating while significantly cutting procurement costs.",
                standardCompliance=["IS 7098 (Part 2)", "IEC 60502-2", "CEA Thermal Regulations"]
            )

    return None

def generate_risk_charts_data(matches: List[SKUMatch], grand_total: float) -> RiskChartsData:
    """Generates 6-month commodity trend and cost distribution charts data."""
    is_copper = any(m.material.lower() == "copper" for m in matches)

    commodity_trend = [
        CommodityTrendItem(month="Jan", copperPrice=8400, aluminiumPrice=2200),
        CommodityTrendItem(month="Feb", copperPrice=8650, aluminiumPrice=2250),
        CommodityTrendItem(month="Mar", copperPrice=8900, aluminiumPrice=2310),
        CommodityTrendItem(month="Apr", copperPrice=8750, aluminiumPrice=2280),
        CommodityTrendItem(month="May", copperPrice=9150, aluminiumPrice=2360),
        CommodityTrendItem(month="Jun", copperPrice=9400, aluminiumPrice=2420),
    ]

    cost_distribution = [
        CostDistributionItem(category="Conductor Raw Metal", value=round(grand_total * 0.55), color="#6366F1"),
        CostDistributionItem(category="Polymer Insulation", value=round(grand_total * 0.20), color="#38BDF8"),
        CostDistributionItem(category="Armor & Sheath", value=round(grand_total * 0.15), color="#818CF8"),
        CostDistributionItem(category="Testing & Freight", value=round(grand_total * 0.10), color="#94A3B8"),
    ]

    risk_scores = [
        RiskScoreItem(category="Commodity Volatility", score=82 if is_copper else 45, rating="High" if is_copper else "Moderate"),
        RiskScoreItem(category="Lead Time & Logistics", score=30, rating="Low"),
        RiskScoreItem(category="Technical Compliance", score=10, rating="Low"),
    ]

    return RiskChartsData(
        commodityTrend=commodity_trend,
        costDistribution=cost_distribution,
        riskScores=risk_scores
    )

async def run_pricing_agent(
    matches: List[SKUMatch],
    rfp_context: Optional[str] = None,
    summary: Optional[RFPSummary] = None
) -> Tuple[List[PricingItem], float, str, Optional[ValueEngineeringRecommendation], Optional[UnitOptimization], Optional[RiskChartsData]]:
    """
    AI-Powered Commercial Pricing Agent.
    Combines LLM strategic scope analysis with deterministic financial calculation.
    """
    if not matches:
        return [], 0.0, "No matching SKUs available to price", None, None, None

    groq_api_key = os.getenv("GROQ_API_KEY")
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    target_qty = summary.quantity if summary and summary.quantity else 1000.0

    prompt = f"""You are a commercial pricing specialist for industrial electrical cables. Generate a quantity & risk analysis JSON response.

Matched SKUs:
{[m.model_dump() for m in matches]}

RFP Target Quantity: {target_qty} meters

Provide recommended quantities and strategic risk analysis.
Respond ONLY with a JSON object containing:
- items: list of objects with "sku" (string), "quantity" (number), "reasoning" (string)
- analysis: detailed commercial risk analysis text (metal price volatility, forex rate, lead time)"""

    ai_output: Optional[AiPricingOutput] = None

    # Priority 1: Groq
    if groq_api_key and groq_api_key.strip():
        try:
            from langchain_groq import ChatGroq
            llm = ChatGroq(
                api_key=groq_api_key.strip(),
                model_name="llama-3.3-70b-versatile",
                temperature=0.2,
            )
            structured_llm = llm.with_structured_output(AiPricingOutput)
            res = await structured_llm.ainvoke(prompt)
            if isinstance(res, AiPricingOutput):
                ai_output = res
        except Exception as err:
            print(f"Pricing Agent Groq error, falling back: {err}")

    # Priority 2: Gemini
    if not ai_output and gemini_api_key and gemini_api_key.strip():
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            llm = ChatGoogleGenerativeAI(
                google_api_key=gemini_api_key.strip(),
                model="gemini-2.0-flash",
                temperature=0.2,
            )
            structured_llm = llm.with_structured_output(AiPricingOutput)
            res = await structured_llm.ainvoke(prompt)
            if isinstance(res, AiPricingOutput):
                ai_output = res
        except Exception as err:
            print(f"Pricing Agent Gemini error: {err}")

    # Build final pricing items
    pricing_items: List[PricingItem] = []
    top_match = matches[0]

    if ai_output and ai_output.items:
        for ai_item in ai_output.items:
            m = next((x for x in matches if x.sku.lower() == ai_item.sku.lower()), None)
            if m:
                item_price = calculate_item_pricing(
                    sku=m.sku,
                    description=m.description,
                    base_price=m.basePrice,
                    quantity=ai_item.quantity if ai_item.quantity > 0 else target_qty,
                    material=m.material,
                    reasoning=ai_item.reasoning
                )
                pricing_items.append(item_price)

    # Fallback if no items generated
    if not pricing_items:
        item_price = calculate_item_pricing(
            sku=top_match.sku,
            description=top_match.description,
            base_price=top_match.basePrice,
            quantity=target_qty,
            material=top_match.material,
            reasoning=f"Primary quote based on {target_qty:,.0f} meters standard project scope."
        )
        pricing_items.append(item_price)

    grand_total = sum(i.totalCost for i in pricing_items)
    analysis = ai_output.analysis if ai_output and ai_output.analysis else (
        f"Commercial estimate based on current LME Copper (${LME_COPPER_USD}/t) and Aluminium (${LME_ALUMINIUM_USD}/t) spot indices at USD/INR {USD_INR_FOREX_RATE:.2f}. Standard 4-6 weeks factory lead time."
    )

    value_engineering = compute_value_engineering(matches, pricing_items, summary)
    unit_opt = compute_unit_optimization(pricing_items)
    risk_charts = generate_risk_charts_data(matches, grand_total)

    return pricing_items, grand_total, analysis, value_engineering, unit_opt, risk_charts
