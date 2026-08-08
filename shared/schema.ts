import { z } from "zod";

export const USD_INR_FOREX_RATE = 83.50;
export const LME_COPPER_USD = 9200; // $/tonne
export const LME_ALUMINIUM_USD = 2400; // $/tonne

// SKU Catalog Item
export const skuItemSchema = z.object({
  sku: z.string(),
  description: z.string(),
  voltage: z.string(),
  material: z.string(),
  insulation: z.string(),
  basePrice: z.number(),
  cores: z.string().optional(),
  crossSection: z.string().optional(),
  armoring: z.string().optional(),
});

export type SKUItem = z.infer<typeof skuItemSchema>;

// RFP Processing Request
export const processRfpRequestSchema = z.object({
  rfpText: z.string().min(1, "RFP text is required"),
});

export type ProcessRfpRequest = z.infer<typeof processRfpRequestSchema>;

// Sales Agent Output - RFP Summary
export const rfpSummarySchema = z.object({
  title: z.string(),
  dueDate: z.string().nullable(),
  voltage: z.string().nullable(),
  material: z.string().nullable(),
  insulation: z.string().nullable(),
  quantity: z.number().nullable().optional(),
  compliance: z.array(z.string()),
  requirements: z.array(z.string()),
});

export type RFPSummary = z.infer<typeof rfpSummarySchema>;

// Technical Agent Output - SKU Match (with AI reasoning & technical specs)
export const skuMatchSchema = z.object({
  sku: z.string(),
  description: z.string(),
  matchPercentage: z.number(),
  voltage: z.string(),
  material: z.string(),
  insulation: z.string(),
  basePrice: z.number(),
  cores: z.string().optional(),
  crossSection: z.string().optional(),
  armoring: z.string().optional(),
  reasoning: z.string().optional(),
  materialMismatch: z.boolean().optional(),
});

export type SKUMatch = z.infer<typeof skuMatchSchema>;

// Pricing Agent Output - Pricing Item (with itemized formula audit)
export const pricingItemSchema = z.object({
  sku: z.string(),
  description: z.string(),
  basePrice: z.number(),
  quantity: z.number(),
  baseTotal: z.number(),
  materialCost: z.number(),
  serviceCost: z.number(),
  testingCost: z.number(),
  totalCost: z.number(),
  reasoning: z.string().optional(),
});

export type PricingItem = z.infer<typeof pricingItemSchema>;

// Value Engineering Recommendation Output
export const valueEngineeringSchema = z.object({
  hasOptimization: z.boolean(),
  originalSku: z.string(),
  optimizedSku: z.string(),
  originalTotalCost: z.number(),
  optimizedTotalCost: z.number(),
  savingsAmount: z.number(),
  savingsPercentage: z.number(),
  alternativeMaterial: z.string(),
  technicalJustification: z.string(),
  standardCompliance: z.array(z.string()),
}).optional();

export type ValueEngineeringRecommendation = z.infer<typeof valueEngineeringSchema>;

// Unit & Batch Reel Optimization Output
export const unitOptimizationSchema = z.object({
  hasUnitOptimization: z.boolean(),
  requestedQuantity: z.number(),
  recommendedQuantity: z.number(),
  drumSize: z.number(),
  scrapFeeSaved: z.number(),
  netCostBefore: z.number(),
  netCostAfter: z.number(),
  savingsAmount: z.number(),
  optimizationType: z.enum(['drum_batch', 'volume_tier', 'standard_reel']),
  message: z.string(),
}).optional();

export type UnitOptimization = z.infer<typeof unitOptimizationSchema>;

// Risk Analysis Charts Data
export const riskChartsSchema = z.object({
  commodityTrend: z.array(z.object({
    month: z.string(),
    copperPrice: z.number(),
    aluminiumPrice: z.number(),
  })),
  costDistribution: z.array(z.object({
    category: z.string(),
    value: z.number(),
    color: z.string(),
  })),
  riskScores: z.array(z.object({
    category: z.string(),
    score: z.number(),
    rating: z.enum(['Low', 'Moderate', 'High']),
  })),
}).optional();

export type RiskChartsData = z.infer<typeof riskChartsSchema>;

// Complete RFP Response (with AI analysis)
export const rfpResponseSchema = z.object({
  success: z.boolean(),
  summary: rfpSummarySchema,
  matches: z.array(skuMatchSchema),
  pricing: z.array(pricingItemSchema),
  grandTotal: z.number(),
  analysis: z.string().optional(),
  valueEngineering: valueEngineeringSchema,
  unitOptimization: unitOptimizationSchema,
  riskCharts: riskChartsSchema,
});

export type RFPResponse = z.infer<typeof rfpResponseSchema>;

// Comprehensive Real-World Industrial Cable Catalog (25+ SKUs across 220kV, 132kV, 66kV, 33kV, 22kV, 11kV, 6.6kV, LT)
export const SKU_CATALOG: SKUItem[] = [
  // --- EHV / Subsea & Marine Transmission Cables (132kV & 220kV) ---
  {
    sku: "CAB-132KV-CU-XLPE-SUBSEA",
    description: "132kV Copper XLPE Lead Sheath Wet-Cured Marine Subsea Transmission Cable",
    voltage: "132kV",
    material: "Copper",
    insulation: "XLPE",
    basePrice: 4800,
    cores: "3-Core",
    crossSection: "630 mm²",
    armoring: "Heavy Galvanized Steel Wire Armored (GSWA)",
  },
  {
    sku: "CAB-132KV-AL-XLPE-EHV",
    description: "132kV Aluminium XLPE Heavy-Duty Transmission Grid Power Cable",
    voltage: "132kV",
    material: "Aluminium",
    insulation: "XLPE",
    basePrice: 3100,
    cores: "1-Core",
    crossSection: "800 mm²",
    armoring: "Aluminium Wire Armored (AWA)",
  },
  {
    sku: "CAB-220KV-CU-XLPE-EHV",
    description: "220kV Extra High Voltage Copper XLPE Corrugated Aluminium Sheath Power Cable",
    voltage: "220kV",
    material: "Copper",
    insulation: "XLPE",
    basePrice: 7500,
    cores: "1-Core",
    crossSection: "1000 mm²",
    armoring: "Aluminium Sheathed / Non-Magnetic Armored",
  },
  {
    sku: "CAB-66KV-AL-XLPE-EHV",
    description: "66kV Aluminium XLPE Substation Feeder Power Cable",
    voltage: "66kV",
    material: "Aluminium",
    insulation: "XLPE",
    basePrice: 2200,
    cores: "3-Core",
    crossSection: "400 mm²",
    armoring: "Galvanized Steel Wire Armored (GSWA)",
  },
  {
    sku: "CAB-66KV-CU-XLPE-EHV",
    description: "66kV Copper XLPE Substation Grid Interconnect Cable",
    voltage: "66kV",
    material: "Copper",
    insulation: "XLPE",
    basePrice: 3600,
    cores: "3-Core",
    crossSection: "300 mm²",
    armoring: "Galvanized Steel Wire Armored (GSWA)",
  },

  // --- High Voltage / Medium Voltage Cables (33kV) ---
  {
    sku: "CAB-33KV-AL-XLPE",
    description: "33kV Aluminium XLPE Heavy-Duty Substation Transmission Power Cable",
    voltage: "33kV",
    material: "Aluminium",
    insulation: "XLPE",
    basePrice: 1450,
    cores: "3-Core",
    crossSection: "300 mm²",
    armoring: "Galvanized Steel Wire Armored (GSWA)",
  },
  {
    sku: "CAB-33KV-AL-XLPE-400",
    description: "33kV Stranded Aluminium XLPE Extra Large Conductor Cable",
    voltage: "33kV",
    material: "Aluminium",
    insulation: "XLPE",
    basePrice: 1750,
    cores: "3-Core",
    crossSection: "400 mm²",
    armoring: "Galvanized Steel Wire Armored (GSWA)",
  },
  {
    sku: "CAB-33KV-CU-XLPE",
    description: "33kV Copper XLPE Insulated Heavy Industrial Substation Cable",
    voltage: "33kV",
    material: "Copper",
    insulation: "XLPE",
    basePrice: 2500,
    cores: "3-Core",
    crossSection: "185 mm²",
    armoring: "Galvanized Steel Wire Armored (GSWA)",
  },
  {
    sku: "CAB-33KV-CU-XLPE-300",
    description: "33kV High Ampacity Copper XLPE Industrial Transmission Cable",
    voltage: "33kV",
    material: "Copper",
    insulation: "XLPE",
    basePrice: 3200,
    cores: "3-Core",
    crossSection: "300 mm²",
    armoring: "Galvanized Steel Wire Armored (GSWA)",
  },

  // --- Medium Voltage Cables (22kV & 11kV) ---
  {
    sku: "CAB-22KV-AL-XLPE-240",
    description: "22kV Aluminium XLPE Insulated Distribution Power Cable",
    voltage: "22kV",
    material: "Aluminium",
    insulation: "XLPE",
    basePrice: 1150,
    cores: "3-Core",
    crossSection: "240 mm²",
    armoring: "Steel Wire Armored (GSWA)",
  },
  {
    sku: "CAB-22KV-CU-XLPE",
    description: "22kV Copper XLPE Industrial Feeder Cable",
    voltage: "22kV",
    material: "Copper",
    insulation: "XLPE",
    basePrice: 1800,
    cores: "3-Core",
    crossSection: "150 mm²",
    armoring: "Galvanized Steel Wire Armored (GSWA)",
  },
  {
    sku: "CAB-11KV-AL-XLPE",
    description: "11kV Aluminium XLPE Insulated Medium Voltage Feeder Cable",
    voltage: "11kV",
    material: "Aluminium",
    insulation: "XLPE",
    basePrice: 850,
    cores: "3-Core",
    crossSection: "240 mm²",
    armoring: "Steel Strip Armored (SWA)",
  },
  {
    sku: "CAB-11KV-AL-PVC-300",
    description: "11kV Aluminium PVC Insulated Heavy Duty Utility Cable",
    voltage: "11kV",
    material: "Aluminium",
    insulation: "PVC",
    basePrice: 780,
    cores: "3-Core",
    crossSection: "300 mm²",
    armoring: "Double Steel Tape Armored (DSTA)",
  },
  {
    sku: "CAB-11KV-CU-XLPE",
    description: "11kV Copper XLPE Insulated Industrial Power Cable",
    voltage: "11kV",
    material: "Copper",
    insulation: "XLPE",
    basePrice: 1200,
    cores: "3-Core",
    crossSection: "150 mm²",
    armoring: "Steel Wire Armored (GSWA)",
  },
  {
    sku: "CAB-11KV-CU-XLPE-240",
    description: "11kV Heavy-Duty Copper XLPE High Ampacity Feeder Cable",
    voltage: "11kV",
    material: "Copper",
    insulation: "XLPE",
    basePrice: 1550,
    cores: "3-Core",
    crossSection: "240 mm²",
    armoring: "Steel Wire Armored (GSWA)",
  },
  {
    sku: "CAB-11KV-CU-PVC",
    description: "11kV Copper PVC Insulated Medium Voltage Cable",
    voltage: "11kV",
    material: "Copper",
    insulation: "PVC",
    basePrice: 1000,
    cores: "3-Core",
    crossSection: "120 mm²",
    armoring: "Double Steel Tape Armored (DSTA)",
  },

  // --- Intermediate Voltage (6.6kV) ---
  {
    sku: "CAB-6.6KV-AL-PVC",
    description: "6.6kV Aluminium PVC Insulated Substation Secondary Cable",
    voltage: "6.6kV",
    material: "Aluminium",
    insulation: "PVC",
    basePrice: 700,
    cores: "3-Core",
    crossSection: "185 mm²",
    armoring: "Steel Tape Armored",
  },
  {
    sku: "CAB-6.6KV-AL-XLPE-240",
    description: "6.6kV Aluminium XLPE Heavy Distribution Feeder Cable",
    voltage: "6.6kV",
    material: "Aluminium",
    insulation: "XLPE",
    basePrice: 820,
    cores: "3-Core",
    crossSection: "240 mm²",
    armoring: "Steel Wire Armored",
  },
  {
    sku: "CAB-6.6KV-CU-XLPE",
    description: "6.6kV Copper XLPE Insulated Motor Feeder Cable",
    voltage: "6.6kV",
    material: "Copper",
    insulation: "XLPE",
    basePrice: 950,
    cores: "3-Core",
    crossSection: "95 mm²",
    armoring: "Steel Wire Armored",
  },

  // --- Low Voltage / Low Tension (LV / LT 1.1kV) Cables ---
  {
    sku: "CAB-LV-AL-XLPE-3.5C-185",
    description: "1.1kV LT Aluminium XLPE 3.5 Core Armored Utility Distribution Cable",
    voltage: "LV",
    material: "Aluminium",
    insulation: "XLPE",
    basePrice: 380,
    cores: "3.5-Core",
    crossSection: "185 mm²",
    armoring: "Strip Armored (SWA)",
  },
  {
    sku: "CAB-LV-AL-PVC-4C-120",
    description: "1.1kV LT Aluminium PVC 4-Core Armored Power Distribution Cable",
    voltage: "LV",
    material: "Aluminium",
    insulation: "PVC",
    basePrice: 320,
    cores: "4-Core",
    crossSection: "120 mm²",
    armoring: "Steel Tape Armored (DSTA)",
  },
  {
    sku: "CAB-LV-CU-PVC",
    description: "Low Voltage 1.1kV Copper PVC Insulated 4-Core Armored Feeder Cable",
    voltage: "LV",
    material: "Copper",
    insulation: "PVC",
    basePrice: 450,
    cores: "4-Core",
    crossSection: "50 mm²",
    armoring: "Steel Wire Armored",
  },
  {
    sku: "CAB-LV-CU-XLPE-4C-95",
    description: "1.1kV LT Heavy Duty Copper XLPE 4-Core Main Building Riser Cable",
    voltage: "LV",
    material: "Copper",
    insulation: "XLPE",
    basePrice: 680,
    cores: "4-Core",
    crossSection: "95 mm²",
    armoring: "Steel Wire Armored",
  },
  {
    sku: "CAB-SOLAR-CU-XLPE-4",
    description: "1.5kV DC Solar Photovoltaic Copper XLPE UV-Resistant Dual Core Cable",
    voltage: "LV",
    material: "Copper",
    insulation: "XLPE",
    basePrice: 210,
    cores: "2-Core",
    crossSection: "6 mm²",
    armoring: "Unarmored / UV Sheathed",
  },
];