import { z } from "zod";

// SKU Catalog Item
export const skuItemSchema = z.object({
  sku: z.string(),
  description: z.string(),
  voltage: z.string(),
  material: z.string(),
  insulation: z.string(),
  basePrice: z.number()
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
  compliance: z.array(z.string()),
  requirements: z.array(z.string()),
});

export type RFPSummary = z.infer<typeof rfpSummarySchema>;

// Technical Agent Output - SKU Match (with AI reasoning)
export const skuMatchSchema = z.object({
  sku: z.string(),
  description: z.string(),
  matchPercentage: z.number(),
  voltage: z.string(),
  material: z.string(),
  insulation: z.string(),
  basePrice: z.number(),
  reasoning: z.string().optional(), // AI-generated reasoning for the match
});

export type SKUMatch = z.infer<typeof skuMatchSchema>;

// Pricing Agent Output - Pricing Item (with AI reasoning)
export const pricingItemSchema = z.object({
  sku: z.string(),
  description: z.string(),
  basePrice: z.number(),
  quantity: z.number(),
  materialCost: z.number(),
  serviceCost: z.number(),
  testingCost: z.number(),
  totalCost: z.number(),
  reasoning: z.string().optional(), // AI-generated reasoning for quantity choice
});

export type PricingItem = z.infer<typeof pricingItemSchema>;

// Complete RFP Response (with AI analysis)
export const rfpResponseSchema = z.object({
  success: z.boolean(),
  summary: rfpSummarySchema,
  matches: z.array(skuMatchSchema),
  pricing: z.array(pricingItemSchema),
  grandTotal: z.number(),
  analysis: z.string().optional(), // AI-generated pricing strategy analysis
});

export type RFPResponse = z.infer<typeof rfpResponseSchema>;

// SKU Catalog Data
export const SKU_CATALOG: SKUItem[] = [
  {
    sku: "CAB-11KV-CU-XLPE",
    description: "11kV Copper XLPE insulated industrial cable",
    voltage: "11kV",
    material: "Copper",
    insulation: "XLPE",
    basePrice: 1200,
  },
  {
    sku: "CAB-6.6KV-AL-PVC",
    description: "6.6kV Aluminium PVC cable",
    voltage: "6.6kV",
    material: "Aluminium",
    insulation: "PVC",
    basePrice: 700,
  },
  {
    sku: "CAB-11KV-CU-PVC",
    description: "11kV Copper PVC insulated cable",
    voltage: "11kV",
    material: "Copper",
    insulation: "PVC",
    basePrice: 1000,
  },
  {
    sku: "CAB-33KV-CU-XLPE",
    description: "33kV Copper XLPE insulated high voltage cable",
    voltage: "33kV",
    material: "Copper",
    insulation: "XLPE",
    basePrice: 2500,
  },
  {
    sku: "CAB-6.6KV-CU-XLPE",
    description: "6.6kV Copper XLPE insulated cable",
    voltage: "6.6kV",
    material: "Copper",
    insulation: "XLPE",
    basePrice: 950,
  },
  {
    sku: "CAB-11KV-AL-XLPE",
    description: "11kV Aluminium XLPE insulated cable",
    voltage: "11kV",
    material: "Aluminium",
    insulation: "XLPE",
    basePrice: 850,
  },
  {
    sku: "CAB-22KV-CU-XLPE",
    description: "22kV Copper XLPE insulated cable",
    voltage: "22kV",
    material: "Copper",
    insulation: "XLPE",
    basePrice: 1800,
  },
  {
    sku: "CAB-LV-CU-PVC",
    description: "Low voltage Copper PVC insulated cable",
    voltage: "LV",
    material: "Copper",
    insulation: "PVC",
    basePrice: 450,
  },
];