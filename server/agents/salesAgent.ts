import type { RFPSummary } from "@shared/schema";
import Groq from "groq-sdk";

/**
 * AI-Powered Sales Agent - Extracts and summarizes RFP requirements using Groq API or Gemini AI
 * Priority: 1. Groq API (llama-3.3-70b-versatile) -> 2. Gemini API -> 3. Fallback Regex
 */
export async function runSalesAgent(rfpText: string): Promise<RFPSummary> {
  const groqApiKey = process.env.GROQ_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  const prompt = `You are a sales analyst extracting key information from an RFP for electrical cables.

Analyze the following RFP text and extract:
1. Title of the RFP
2. Due date (in YYYY-MM-DD format if possible)
3. Voltage rating (e.g., "11kV", "33kV", "132kV", "LV")
4. Material type (Copper or Aluminium)
5. Insulation type (XLPE, PVC, Rubber, etc.)
6. Quantity in meters if specified (as a number, e.g. 2500, 500)
7. Compliance standards mentioned (e.g., IS compliant, IEC, IEEE, CIGRE, etc.)
8. Key technical requirements (as a list)

RFP Text:
${rfpText}

Respond ONLY with a valid JSON object in this exact format:
{
  "title": "string",
  "dueDate": "string or null",
  "voltage": "string or null",
  "material": "string or null",
  "insulation": "string or null",
  "quantity": number or null,
  "compliance": ["string"],
  "requirements": ["string"]
}`;

  // Priority 1: Groq API (llama-3.3-70b-versatile - Ultra Fast Sub-Second Inference)
  if (groqApiKey) {
    try {
      const groq = new Groq({ apiKey: groqApiKey });
      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
        response_format: { type: "json_object" }
      });

      const text = response.choices[0]?.message?.content || "";
      const parsed = JSON.parse(text);

      return {
        title: parsed.title || "Untitled RFP",
        dueDate: parsed.dueDate || null,
        voltage: parsed.voltage || null,
        material: parsed.material || null,
        insulation: parsed.insulation || null,
        quantity: typeof parsed.quantity === 'number' ? parsed.quantity : null,
        compliance: Array.isArray(parsed.compliance) ? parsed.compliance : [],
        requirements: Array.isArray(parsed.requirements) ? parsed.requirements : []
      };
    } catch (err) {
      console.error("Sales Agent Groq API error, attempting Gemini fallback:", err);
    }
  }

  // Priority 2: Gemini API Fallback
  if (geminiApiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 1000 }
          })
        }
      );

      const data = await response.json();
      if (data.candidates && data.candidates[0]) {
        const text = data.candidates[0].content.parts[0].text;
        const clean = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);

        return {
          title: parsed.title || "Untitled RFP",
          dueDate: parsed.dueDate || null,
          voltage: parsed.voltage || null,
          material: parsed.material || null,
          insulation: parsed.insulation || null,
          quantity: typeof parsed.quantity === 'number' ? parsed.quantity : null,
          compliance: Array.isArray(parsed.compliance) ? parsed.compliance : [],
          requirements: Array.isArray(parsed.requirements) ? parsed.requirements : []
        };
      }
    } catch (err) {
      console.error("Sales Agent Gemini API error:", err);
    }
  }

  // Priority 3: Basic Regex Fallback
  return fallbackParsing(rfpText);
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

  let quantity: number | null = null;
  const qtyMatch = rfpText.match(/(?:quantity|qty|length|required)[:\s]+([\d,]+)\s*(?:meters|m|metres)?/i) ||
                   rfpText.match(/([\d,]+)\s*(?:meters|m|metres)\s*(?:required|continuous|reel)?/i);
  if (qtyMatch) {
    const num = parseInt(qtyMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(num) && num > 0) quantity = num;
  }

  const compliance: string[] = [];
  const requirements: string[] = ["Error processing RFP with AI - using basic parsing"];

  return {
    title,
    dueDate,
    voltage,
    material,
    insulation,
    quantity,
    compliance,
    requirements
  };
}