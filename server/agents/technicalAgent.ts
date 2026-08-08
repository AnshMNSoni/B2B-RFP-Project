import type { RFPSummary, SKUMatch } from "@shared/schema";
import { SKU_CATALOG } from "@shared/schema";
import { HfInference } from "@huggingface/inference";

/**
 * Calculates Cosine Similarity between two numeric vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Hugging Face ML Vector Embedding Matcher using Serverless Inference API
 * Model: sentence-transformers/all-MiniLM-L6-v2
 */
export async function runHuggingFaceEmbeddingMatch(summary: RFPSummary, hfToken: string): Promise<SKUMatch[] | null> {
  try {
    console.log("=== Running Hugging Face ML Embedding Match ===");
    const hf = new HfInference(hfToken);
    const queryText = `Voltage: ${summary.voltage || "N/A"}, Material: ${summary.material || "N/A"}, Insulation: ${summary.insulation || "N/A"}, Requirements: ${summary.requirements?.join(" ") || ""}`;

    // 1. Generate embedding vector for the extracted RFP Summary
    const rfpEmbeddingResponse = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: queryText,
    });

    const rfpVector = Array.isArray(rfpEmbeddingResponse) && typeof rfpEmbeddingResponse[0] === 'number'
      ? (rfpEmbeddingResponse as number[])
      : Array.isArray(rfpEmbeddingResponse) && Array.isArray(rfpEmbeddingResponse[0])
      ? (rfpEmbeddingResponse[0] as number[])
      : null;

    if (!rfpVector) {
      throw new Error("Invalid vector format returned from Hugging Face Feature Extraction");
    }

    // 2. Generate embedding vectors for all catalog SKUs
    const skuTexts = SKU_CATALOG.map(sku => `SKU ${sku.sku}: ${sku.description}, Voltage ${sku.voltage}, Material ${sku.material}, Insulation ${sku.insulation}`);

    const skuEmbeddingsResponse = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: skuTexts,
    });

    if (!Array.isArray(skuEmbeddingsResponse)) {
      throw new Error("Invalid catalog embeddings returned from Hugging Face");
    }

    // 3. Compute vector similarity & calculate ranked match scores
    const matches: SKUMatch[] = SKU_CATALOG.map((sku, idx) => {
      const skuVector = Array.isArray(skuEmbeddingsResponse[idx])
        ? (skuEmbeddingsResponse[idx] as number[])
        : [];

      const sim = cosineSimilarity(rfpVector, skuVector);
      
      // Compute specification attribute scores
      let specScore = 0;
      if (summary.voltage) {
        const vClean = summary.voltage.toLowerCase().replace(/\s/g, '');
        const skuVClean = sku.voltage.toLowerCase().replace(/\s/g, '');
        if (vClean === skuVClean) specScore += 40;
        else if (vClean.includes(skuVClean.replace('kv', '')) || skuVClean.includes(vClean.replace('kv', ''))) specScore += 20;
      }
      if (summary.material && summary.material.toLowerCase() === sku.material.toLowerCase()) specScore += 30;
      if (summary.insulation && summary.insulation.toLowerCase() === sku.insulation.toLowerCase()) specScore += 30;

      // Hybrid score combining ML vector similarity (50%) and exact spec attributes (50%)
      const vectorScore = Math.min(100, Math.max(0, Math.round(sim * 100)));
      const finalMatchPercentage = Math.min(100, Math.max(10, Math.round((vectorScore * 0.5) + (specScore * 0.5))));

      const isMaterialMismatch = Boolean(summary.material && summary.material.toLowerCase() !== sku.material.toLowerCase());

      return {
        sku: sku.sku,
        description: sku.description,
        matchPercentage: finalMatchPercentage,
        voltage: sku.voltage,
        material: sku.material,
        insulation: sku.insulation,
        basePrice: sku.basePrice,
        cores: sku.cores,
        crossSection: sku.crossSection,
        armoring: sku.armoring,
        materialMismatch: isMaterialMismatch,
        reasoning: isMaterialMismatch 
          ? `Material Discrepancy Warning: RFP requested ${summary.material}, but catalog matched ${sku.material}. Verify specification before final submission.`
          : `Hugging Face ML (all-MiniLM-L6-v2) semantic similarity vector score: ${(sim * 100).toFixed(1)}%`
      };
    });

    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
    console.log("Hugging Face ML matching succeeded!");
    return matches.slice(0, 3);
  } catch (err: any) {
    console.warn("Hugging Face Embedding matching failed, falling back to Gemini/Rule matching:", err.message);
    return null;
  }
}

/**
 * AI-Powered Technical Agent - Matches RFP specifications to SKU catalog
 * Priority 1: Hugging Face ML Sentence Transformers (if HF_TOKEN is configured)
 * Priority 2: Google Gemini Pro LLM (if GEMINI_API_KEY is configured)
 * Priority 3: Rule-based fallback matcher
 */
export async function runTechnicalAgent(summary: RFPSummary): Promise<SKUMatch[]> {
  const hfToken = process.env.HF_TOKEN;

  // 1. Try Hugging Face ML Embedding Matcher if HF_TOKEN is available
  if (hfToken && hfToken.trim().length > 0) {
    const hfMatches = await runHuggingFaceEmbeddingMatch(summary, hfToken.trim());
    if (hfMatches && hfMatches.length > 0) {
      return hfMatches;
    }
  }

  // 2. Try Gemini AI LLM Matcher
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
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
      
      if (data.candidates && data.candidates[0]) {
        const text = data.candidates[0].content.parts[0].text;
        const clean = text.replace(/```json|```/g, "").trim();
        const aiMatches = JSON.parse(clean);

        const matches: SKUMatch[] = aiMatches
          .slice(0, 3)
          .map((match: any) => {
            const sku = SKU_CATALOG.find(s => s.sku === match.sku);
            if (!sku) return null;

            const isMaterialMismatch = Boolean(summary.material && summary.material.toLowerCase() !== sku.material.toLowerCase());

            return {
              sku: sku.sku,
              description: sku.description,
              matchPercentage: match.matchPercentage,
              voltage: sku.voltage,
              material: sku.material,
              insulation: sku.insulation,
              basePrice: sku.basePrice,
              cores: sku.cores,
              crossSection: sku.crossSection,
              armoring: sku.armoring,
              materialMismatch: isMaterialMismatch,
              reasoning: isMaterialMismatch 
                ? `Material Discrepancy Warning: RFP requested ${summary.material}, but catalog matched ${sku.material}. Review before final submission.`
                : match.reasoning
            };
          })
          .filter(Boolean);

        if (matches.length > 0) {
          return matches;
        }
      }
    } catch (err) {
      console.error("Technical Agent Gemini AI error:", err);
    }
  }

  // 3. Fallback Rule-based Matching
  return getFallbackMatches(summary);
}

/**
 * Fallback matching logic if AI APIs fail or are unconfigured
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

    const matchPercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 50;
    const isMaterialMismatch = Boolean(summary.material && summary.material.toLowerCase() !== sku.material.toLowerCase());

    matches.push({
      sku: sku.sku,
      description: sku.description,
      matchPercentage,
      voltage: sku.voltage,
      material: sku.material,
      insulation: sku.insulation,
      basePrice: sku.basePrice,
      cores: sku.cores,
      crossSection: sku.crossSection,
      armoring: sku.armoring,
      materialMismatch: isMaterialMismatch,
      reasoning: isMaterialMismatch
        ? `Material Discrepancy Warning: RFP requested ${summary.material}, matched ${sku.material}.`
        : `Match calculated based on voltage (${sku.voltage}), material (${sku.material}), and insulation (${sku.insulation}).`
    });
  }

  matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
  return matches.slice(0, 3);
}