from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field
from typing_extensions import TypedDict

USD_INR_FOREX_RATE = 83.50
LME_COPPER_USD = 9200  # $/tonne
LME_ALUMINIUM_USD = 2400  # $/tonne

class SKUItem(BaseModel):
    sku: str
    description: str
    voltage: str
    material: str
    insulation: str
    basePrice: float
    cores: Optional[str] = None
    crossSection: Optional[str] = None
    armoring: Optional[str] = None

class ProcessRfpRequest(BaseModel):
    rfpText: str = Field(..., min_length=1, description="RFP text is required")

class RFPSummary(BaseModel):
    title: str = Field(default="Untitled RFP", description="Title of the RFP")
    dueDate: Optional[str] = Field(default=None, description="Due date in YYYY-MM-DD format if available")
    voltage: Optional[str] = Field(default=None, description="Voltage rating (e.g. 11kV, 33kV, LV)")
    material: Optional[str] = Field(default=None, description="Conductor material (Copper or Aluminium)")
    insulation: Optional[str] = Field(default=None, description="Insulation type (XLPE, PVC, Rubber)")
    quantity: Optional[float] = Field(default=None, description="Quantity in meters if specified")
    compliance: List[str] = Field(default_factory=list, description="Compliance standards (e.g. IS 7098, IEC 60502)")
    requirements: List[str] = Field(default_factory=list, description="Key technical requirements")

class SKUMatch(BaseModel):
    sku: str
    description: str
    matchPercentage: float
    voltage: str
    material: str
    insulation: str
    basePrice: float
    cores: Optional[str] = None
    crossSection: Optional[str] = None
    armoring: Optional[str] = None
    reasoning: Optional[str] = None
    materialMismatch: Optional[bool] = False

class PricingItem(BaseModel):
    sku: str
    description: str
    basePrice: float
    quantity: float
    baseTotal: Optional[float] = None
    materialCost: float
    serviceCost: float
    testingCost: float
    totalCost: float
    reasoning: Optional[str] = None

class ValueEngineeringRecommendation(BaseModel):
    hasOptimization: bool = False
    originalSku: str = ""
    optimizedSku: str = ""
    originalTotalCost: float = 0.0
    optimizedTotalCost: float = 0.0
    savingsAmount: float = 0.0
    savingsPercentage: float = 0.0
    alternativeMaterial: str = ""
    technicalJustification: str = ""
    standardCompliance: List[str] = Field(default_factory=list)

class UnitOptimization(BaseModel):
    hasUnitOptimization: bool = False
    requestedQuantity: float = 0.0
    recommendedQuantity: float = 0.0
    drumSize: float = 500.0
    scrapFeeSaved: float = 0.0
    netCostBefore: float = 0.0
    netCostAfter: float = 0.0
    savingsAmount: float = 0.0
    optimizationType: Literal['drum_batch', 'volume_tier', 'standard_reel'] = 'standard_reel'
    message: str = ""

class CommodityTrendItem(BaseModel):
    month: str
    copperPrice: float
    aluminiumPrice: float

class CostDistributionItem(BaseModel):
    category: str
    value: float
    color: str

class RiskScoreItem(BaseModel):
    category: str
    score: float
    rating: Literal['Low', 'Moderate', 'High']

class RiskChartsData(BaseModel):
    commodityTrend: List[CommodityTrendItem] = Field(default_factory=list)
    costDistribution: List[CostDistributionItem] = Field(default_factory=list)
    riskScores: List[RiskScoreItem] = Field(default_factory=list)

class RFPResponse(BaseModel):
    success: bool = True
    summary: RFPSummary
    matches: List[SKUMatch] = Field(default_factory=list)
    pricing: List[PricingItem] = Field(default_factory=list)
    grandTotal: float = 0.0
    analysis: Optional[str] = None
    valueEngineering: Optional[ValueEngineeringRecommendation] = None
    unitOptimization: Optional[UnitOptimization] = None
    riskCharts: Optional[RiskChartsData] = None

# LangGraph State Definition
class AgentState(TypedDict, total=False):
    rfp_text: str
    thread_id: str
    summary: Optional[Dict[str, Any]]
    matches: Optional[List[Dict[str, Any]]]
    pricing_items: Optional[List[Dict[str, Any]]]
    grand_total: Optional[float]
    analysis: Optional[str]
    value_engineering: Optional[Dict[str, Any]]
    unit_optimization: Optional[Dict[str, Any]]
    risk_charts: Optional[Dict[str, Any]]
    current_node: Optional[str]
    error: Optional[str]
    retries: Optional[int]
