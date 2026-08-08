import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { processRfpRequestSchema, type RFPResponse } from "@shared/schema";
import { runSalesAgent } from "./agents/salesAgent";
import { runTechnicalAgent } from "./agents/technicalAgent";
import { runPricingAgent } from "./agents/pricingAgent";
import { parseDocumentBuffer } from "./services/documentParser";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB max file size
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Document File Upload & Parsing Endpoint (PDF, DOCX, XLSX, CSV, TXT)
  app.post("/api/parse-document", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const result = await parseDocumentBuffer(req.file.buffer, req.file.originalname);
      return res.json({
        success: true,
        filename: result.filename,
        fileType: result.fileType,
        text: result.extractedText,
        metadata: result.metadata
      });
    } catch (error: any) {
      console.error("Parse document endpoint error:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to parse document"
      });
    }
  });

  // Health check endpoint

  app.get("/api/health", (_req, res) => {
    res.json({ status: "healthy" });
  });

  // Get SKU catalog
  app.get("/api/sku-catalog", async (_req, res) => {
    try {
      const catalog = await storage.getSkuCatalog();
      res.json(catalog);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch SKU catalog" });
    }
  });

  // Test Groq API connection
  app.get("/api/test-groq", async (_req, res) => {
    try {
      const apiKey = process.env.GROQ_API_KEY;
      
      if (!apiKey) {
        return res.json({ 
          success: false, 
          error: "GROQ_API_KEY not found in environment" 
        });
      }

      const Groq = (await import("groq-sdk")).default;
      const groq = new Groq({ apiKey });
      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: "Say hello in 3 words" }],
        model: "llama-3.3-70b-versatile",
        max_tokens: 20
      });

      return res.json({
        success: true,
        model: "llama-3.3-70b-versatile",
        response: response.choices[0]?.message?.content?.trim()
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || "Groq API test failed" 
      });
    }
  });

  // Test Gemini API connection
  app.get("/api/test-gemini", async (_req, res) => {

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.json({ 
          success: false, 
          error: "GEMINI_API_KEY not found in environment" 
        });
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: "Say hello in 3 words" }]
            }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 100,
            }
          })
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        return res.json({ 
          success: false, 
          error: "Gemini API request failed",
          status: response.status,
          data 
        });
      }
      
      res.json({ 
        success: true, 
        apiKeyExists: true,
        apiKeyPrefix: apiKey.substring(0, 10) + "...",
        response: data 
      });
    } catch (error: any) {
      res.json({ 
        success: false, 
        error: error.message,
        stack: error.stack 
      });
    }
  });

  // Test Hugging Face API connection & Feature Extraction model
  app.get("/api/test-huggingface", async (_req, res) => {
    try {
      const hfToken = process.env.HF_TOKEN;
      
      if (!hfToken || hfToken.trim().length === 0) {
        return res.json({ 
          success: false, 
          error: "HF_TOKEN not found or empty in environment" 
        });
      }

      const { HfInference } = await import("@huggingface/inference");
      const hf = new HfInference(hfToken.trim());
      
      const embedding = await hf.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs: "11kV Copper XLPE Cable Test Embedding",
      });

      res.json({ 
        success: true, 
        tokenExists: true,
        tokenPrefix: hfToken.substring(0, 5) + "...",
        model: "sentence-transformers/all-MiniLM-L6-v2",
        vectorDimensions: Array.isArray(embedding) ? embedding.length : "unknown",
        sampleVectorPreview: Array.isArray(embedding) ? (embedding as number[]).slice(0, 5) : embedding
      });
    } catch (error: any) {
      res.json({ 
        success: false, 
        error: error.message,
        stack: error.stack 
      });
    }
  });

  // Process RFP - Main orchestrator endpoint

  app.post("/api/process-rfp", async (req, res) => {
    try {
      console.log("=== Starting RFP Processing ===");
      console.log("API Key exists:", !!process.env.GEMINI_API_KEY);
      
      // Validate request
      const parseResult = processRfpRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          success: false, 
          error: parseResult.error.errors[0]?.message || "Invalid request" 
        });
      }

      const { rfpText } = parseResult.data;
      console.log("RFP Text length:", rfpText?.length);

      // Run Sales Agent - Extract and summarize RFP (ADDED AWAIT)
      console.log("Starting Sales Agent...");
      const summary = await runSalesAgent(rfpText);
      console.log("Sales Agent completed:", summary);

      // Run Technical Agent - Match specs to SKUs (ADDED AWAIT)
      console.log("Starting Technical Agent...");
      const matches = await runTechnicalAgent(summary);
      console.log("Technical Agent completed, matches:", matches.length);

      // Run Pricing Agent - Generate cost estimates (ADDED AWAIT)
      console.log("Starting Pricing Agent...");
      const pricingResult = await runPricingAgent(matches, rfpText, summary);
      console.log("Pricing Agent completed");


      // Return consolidated RFP response
      const response: RFPResponse = {
        success: true,
        summary,
        matches,
        pricing: pricingResult.items,
        grandTotal: pricingResult.grandTotal,
        analysis: pricingResult.analysis, // Include AI analysis
        valueEngineering: pricingResult.valueEngineering,
        unitOptimization: pricingResult.unitOptimization,
        riskCharts: pricingResult.riskCharts,
      };



      res.json(response);
    } catch (error: any) {
      console.error("=== RFP Processing Error ===");
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to process RFP",
        details: error.stack
      });
    }
  });

  return httpServer;
}