import type { RFPSummary } from "@shared/schema";

/**
 * AI-Powered Sales Agent - Extracts and summarizes RFP requirements using Gemini AI
 * Uses natural language understanding to parse RFP text intelligently
 * API Key is read from environment variable GEMINI_API_KEY
 */
export async function runSalesAgent(rfpText: string): Promise<RFPSummary> {
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
                  text: `You are a sales analyst extracting key information from an RFP for electrical cables.

Analyze the following RFP text and extract:
1. Title of the RFP
2. Due date (in YYYY-MM-DD format if possible)
3. Voltage rating (e.g., "11kV", "33kV", "LV")
4. Material type (Copper or Aluminium)
5. Insulation type (XLPE, PVC, etc.)
6. Compliance standards mentioned (e.g., IS compliant, IEC, IEEE, etc.)
7. Key technical requirements (as a list)

RFP Text:
${rfpText}

Respond ONLY with a JSON object in this exact format (no markdown, no backticks):
{
  "title": "string",
  "dueDate": "string or null",
  "voltage": "string or null",
  "material": "string or null",
  "insulation": "string or null",
  "compliance": ["string"],
  "requirements": ["string"]
}`
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
      throw new Error("No response from Gemini API");
    }

    const text = data.candidates[0].content.parts[0].text;

    // Parse the JSON response
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return {
      title: parsed.title || "Untitled RFP",
      dueDate: parsed.dueDate || null,
      voltage: parsed.voltage || null,
      material: parsed.material || null,
      insulation: parsed.insulation || null,
      compliance: Array.isArray(parsed.compliance) ? parsed.compliance : [],
      requirements: Array.isArray(parsed.requirements) ? parsed.requirements : []
    };
  } catch (err) {
    console.error("Sales Agent AI error:", err);
    // Fallback to basic parsing
    return fallbackParsing(rfpText);
  }
}

/**
 * Fallback parsing if AI fails
 */
function fallbackParsing(rfpText: string): RFPSummary {
  const lines = rfpText.split('\n').map(line => line.trim()).filter(Boolean);
  
  let title = "Untitled RFP";
  const titleLine = lines.find(line => 
    line.toLowerCase().includes('rfp title:') || 
    line.toLowerCase().includes('title:') ||
    line.toLowerCase().includes('subject:')
  );
  if (titleLine) {
    title = titleLine.split(':').slice(1).join(':').trim() || title;
  }

  let dueDate: string | null = null;
  const dateLine = lines.find(line => 
    line.toLowerCase().includes('due date:') || 
    line.toLowerCase().includes('deadline:') ||
    line.toLowerCase().includes('submission date:')
  );
  if (dateLine) {
    const dateMatch = dateLine.match(/\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}-\d{2}-\d{4}/);
    if (dateMatch) {
      dueDate = dateMatch[0];
    }
  }

  let voltage: string | null = null;
  const voltagePatterns = [
    /(\d+(?:\.\d+)?)\s*kv/i,
    /voltage[:\s]+(\d+(?:\.\d+)?)\s*kv/i,
    /(\d+(?:\.\d+)?)\s*kv\s*rating/i
  ];
  for (const pattern of voltagePatterns) {
    const match = rfpText.match(pattern);
    if (match) {
      voltage = `${match[1]}kV`;
      break;
    }
  }
  if (!voltage && rfpText.toLowerCase().includes('low voltage')) {
    voltage = 'LV';
  }

  let material: string | null = null;
  if (rfpText.toLowerCase().includes('copper')) {
    material = 'Copper';
  } else if (rfpText.toLowerCase().includes('aluminium') || rfpText.toLowerCase().includes('aluminum')) {
    material = 'Aluminium';
  }

  let insulation: string | null = null;
  if (rfpText.toLowerCase().includes('xlpe')) {
    insulation = 'XLPE';
  } else if (rfpText.toLowerCase().includes('pvc')) {
    insulation = 'PVC';
  }

  const compliance: string[] = [];
  const requirements: string[] = ["Error processing RFP with AI - using basic parsing"];

  return {
    title,
    dueDate,
    voltage,
    material,
    insulation,
    compliance,
    requirements
  };
}