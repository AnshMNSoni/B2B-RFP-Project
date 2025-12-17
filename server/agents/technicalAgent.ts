import type { RFPSummary, SKUMatch } from "@shared/schema";
import { SKU_CATALOG } from "@shared/schema";

/**
 * AI-Powered Technical Agent - Matches RFP specifications to SKU catalog using Gemini AI
 * Uses intelligent reasoning to evaluate matches beyond simple keyword matching
 * API Key is read from environment variable GEMINI_API_KEY
 */
export async function runTechnicalAgent(summary: RFPSummary): Promise<SKUMatch[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not found in environment variables");
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a technical expert in electrical cables. Match the RFP requirements to the best SKUs from our catalog.

RFP Requirements:
- Voltage: ${summary.voltage || "Not specified"}
- Material: ${summary.material || "Not specified"}
- Insulation: ${summary.insulation || "Not specified"}
- Compliance: ${summary.compliance?.length ? summary.compliance.join(", ") : "Not specified"}
- Requirements: ${summary.requirements?.length ? summary.requirements.join("; ") : "Not specified"}

Available SKU Catalog:
${JSON.stringify(SKU_CATALOG, null, 2)}

Analyze each SKU and calculate a match percentage (0-100) based on:
1. Voltage compatibility (40% weight) - exact match = full points, compatible range = partial
2. Material match (30% weight) - exact match required for full points
3. Insulation match (30% weight) - exact match required for full points

Return the top 3 matching SKUs with their match percentages and reasoning.

Respond ONLY with a JSON array in this exact format (no markdown, no backticks):
[
  {
    "sku": "string",
    "matchPercentage": number,
    "reasoning": "string explaining why this SKU matches"
  }
]

Sort by match percentage descending.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1000,
          }
        })
      }
    );

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]) {
      console.error("Gemini API response:", JSON.stringify(data));
      throw new Error("No response from Gemini API");
    }

    const text = data.candidates[0].content.parts[0].text;

    // Parse the JSON response
    const clean = text.replace(/```json|```/g, "").trim();
    const aiMatches = JSON.parse(clean);

    // Enrich with full SKU details
    const matches: SKUMatch[] = aiMatches
      .slice(0, 3)
      .map((match: any) => {
        const sku = SKU_CATALOG.find(s => s.sku === match.sku);
        if (!sku) return null;

        return {
          sku: sku.sku,
          description: sku.description,
          matchPercentage: match.matchPercentage,
          voltage: sku.voltage,
          material: sku.material,
          insulation: sku.insulation,
          basePrice: sku.basePrice,
          reasoning: match.reasoning
        };
      })
      .filter(Boolean);

    return matches.length > 0 ? matches : getFallbackMatches(summary);
  } catch (err) {
    console.error("Technical Agent AI error:", err);
    return getFallbackMatches(summary);
  }
}

/**
 * Fallback matching logic if AI fails
 */
function getFallbackMatches(summary: RFPSummary): SKUMatch[] {
  const matches: SKUMatch[] = [];

  for (const sku of SKU_CATALOG) {
    let score = 0;
    let maxScore = 0;

    if (summary.voltage) {
      maxScore += 40;
      const summaryVoltage = summary.voltage.toLowerCase().replace(/\s/g, '');
      const skuVoltage = sku.voltage.toLowerCase().replace(/\s/g, '');
      
      if (summaryVoltage === skuVoltage) {
        score += 40;
      } else if (summaryVoltage.includes(skuVoltage.replace('kv', '')) || 
                 skuVoltage.includes(summaryVoltage.replace('kv', ''))) {
        score += 20;
      }
    }

    if (summary.material) {
      maxScore += 30;
      if (summary.material.toLowerCase() === sku.material.toLowerCase()) {
        score += 30;
      }
    }

    if (summary.insulation) {
      maxScore += 30;
      if (summary.insulation.toLowerCase() === sku.insulation.toLowerCase()) {
        score += 30;
      }
    }

    const matchPercentage = maxScore === 0 ? 50 : Math.round((score / maxScore) * 100);

    matches.push({
      sku: sku.sku,
      description: sku.description,
      matchPercentage,
      voltage: sku.voltage,
      material: sku.material,
      insulation: sku.insulation,
      basePrice: sku.basePrice,
      reasoning: "Fallback matching used (AI unavailable)"
    });
  }

  matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
  return matches.slice(0, 3);
}