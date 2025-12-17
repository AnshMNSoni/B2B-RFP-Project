import type { SKUMatch, PricingItem } from "@shared/schema";

/**
 * AI-Powered Pricing Agent - Generates intelligent cost estimates using Gemini AI
 * Considers market factors, material costs, and project complexity
 * API Key is read from environment variable GEMINI_API_KEY
 */
export async function runPricingAgent(
  matches: SKUMatch[],
  rfpContext?: string
): Promise<{ items: PricingItem[]; grandTotal: number; analysis: string }> {
  if (matches.length === 0) {
    return { items: [], grandTotal: 0, analysis: "No matching SKUs to price" };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not found in environment variables");
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
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
                  text: `You are a pricing specialist for electrical cables. Generate a detailed cost estimate.

Matched SKUs:
${JSON.stringify(matches, null, 2)}

RFP Context: ${rfpContext || "Standard project"}

For each SKU (prioritize the top match, include second if match >= 70%), calculate:
1. Recommended quantity (consider project scope, voltage rating)
2. Material cost multiplier (Copper: 1.2x, Aluminium: 0.8x, then 60% of base)
3. Service cost (5% of material cost)
4. Testing cost based on voltage:
   - 33kV: ₹5,000
   - 22kV: ₹3,500
   - 11kV: ₹2,500
   - 6.6kV: ₹2,000
   - LV: ₹1,500

Respond ONLY with a JSON object in this exact format (no markdown, no backticks):
{
  "items": [
    {
      "sku": "string",
      "quantity": number,
      "reasoning": "string explaining quantity choice"
    }
  ],
  "analysis": "string with overall pricing strategy and recommendations"
}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
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
    const clean = text.replace(/```json|```/g, "").trim();
    const aiPricing = JSON.parse(clean);

    const items: PricingItem[] = [];

    for (const aiItem of aiPricing.items) {
      const match = matches.find(m => m.sku === aiItem.sku);
      if (!match) continue;

      const quantity = aiItem.quantity;
      const basePrice = match.basePrice;
      const materialFactor = match.material === 'Copper' ? 1.2 : 0.8;
      const materialCost = Math.round(basePrice * quantity * materialFactor * 0.6);
      const serviceCost = Math.round(materialCost * 0.05);
      
      let testingCost = 1500;
      if (match.voltage.includes('33')) testingCost = 5000;
      else if (match.voltage.includes('22')) testingCost = 3500;
      else if (match.voltage.includes('11')) testingCost = 2500;
      else if (match.voltage.includes('6.6')) testingCost = 2000;

      const totalCost = (basePrice * quantity) + materialCost + serviceCost + testingCost;

      items.push({
        sku: match.sku,
        description: match.description,
        basePrice,
        quantity,
        materialCost,
        serviceCost,
        testingCost,
        totalCost,
        reasoning: aiItem.reasoning
      });
    }

    const grandTotal = items.reduce((sum, item) => sum + item.totalCost, 0);

    return {
      items,
      grandTotal,
      analysis: aiPricing.analysis || "Pricing calculated successfully"
    };
  } catch (err) {
    console.error("Pricing Agent AI error:", err);
    return getFallbackPricing(matches);
  }
}

/**
 * Fallback pricing logic if AI fails
 */
function getFallbackPricing(matches: SKUMatch[]): { items: PricingItem[]; grandTotal: number; analysis: string } {
  const items: PricingItem[] = [];
  
  // Check if matches array is empty or invalid
  if (!matches || matches.length === 0) {
    return {
      items: [],
      grandTotal: 0,
      analysis: "No SKU matches available for pricing"
    };
  }
  
  const topMatch = matches[0];
  
  const quantity = 100;
  const basePrice = topMatch.basePrice;
  const materialFactor = topMatch.material === 'Copper' ? 1.2 : 0.8;
  const materialCost = Math.round(basePrice * quantity * materialFactor * 0.6);
  const serviceCost = Math.round(materialCost * 0.05);
  
  let testingCost = 1500;
  if (topMatch.voltage.includes('33')) testingCost = 5000;
  else if (topMatch.voltage.includes('22')) testingCost = 3500;
  else if (topMatch.voltage.includes('11')) testingCost = 2500;
  else if (topMatch.voltage.includes('6.6')) testingCost = 2000;

  const totalCost = (basePrice * quantity) + materialCost + serviceCost + testingCost;

  items.push({
    sku: topMatch.sku,
    description: topMatch.description,
    basePrice,
    quantity,
    materialCost,
    serviceCost,
    testingCost,
    totalCost,
    reasoning: "Standard estimate (AI unavailable)"
  });

  // Add second match if it has high enough score
  if (matches.length > 1 && matches[1].matchPercentage >= 70) {
    const secondMatch = matches[1];
    const qty2 = 50;
    const matFactor2 = secondMatch.material === 'Copper' ? 1.2 : 0.8;
    const matCost2 = Math.round(secondMatch.basePrice * qty2 * matFactor2 * 0.6);
    const svcCost2 = Math.round(matCost2 * 0.05);
    let testCost2 = 1500;
    if (secondMatch.voltage.includes('33')) testCost2 = 4000;
    else if (secondMatch.voltage.includes('22')) testCost2 = 3000;
    else if (secondMatch.voltage.includes('11')) testCost2 = 2000;
    else if (secondMatch.voltage.includes('6.6')) testCost2 = 1500;

    const total2 = (secondMatch.basePrice * qty2) + matCost2 + svcCost2 + testCost2;

    items.push({
      sku: secondMatch.sku,
      description: secondMatch.description,
      basePrice: secondMatch.basePrice,
      quantity: qty2,
      materialCost: matCost2,
      serviceCost: svcCost2,
      testingCost: testCost2,
      totalCost: total2,
      reasoning: "Alternative option (AI unavailable)"
    });
  }

  const grandTotal = items.reduce((sum, item) => sum + item.totalCost, 0);

  return {
    items,
    grandTotal,
    analysis: "Standard pricing estimate (AI unavailable)"
  };
}