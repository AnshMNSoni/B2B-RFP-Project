import mammoth from "mammoth";
import * as XLSX from "xlsx";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");

export interface ParsedDocumentResult {
  filename: string;
  fileType: string;
  extractedText: string;
  metadata?: Record<string, any>;
}

/**
 * Universal helper for parsing PDF buffers supporting both pdf-parse v1 and v2 API contracts
 */
async function parsePdfBufferHelper(buffer: Buffer): Promise<{ text: string; numpages?: number }> {
  const uint8 = new Uint8Array(buffer);

  // PDFParse v2 Class API
  if (pdfParseModule && pdfParseModule.PDFParse) {
    const parser = new pdfParseModule.PDFParse(uint8);
    const parsed = await parser.getText();
    const textContent = typeof parsed === "string" ? parsed : parsed.text || "";
    return {
      text: textContent,
      numpages: parsed.total || (parsed.pages ? parsed.pages.length : 1)
    };
  }

  // PDFParse v1 Function API
  const pdfFn = typeof pdfParseModule === "function" ? pdfParseModule : pdfParseModule?.default;
  if (typeof pdfFn === "function") {
    const data = await pdfFn(buffer);
    return {
      text: data.text || "",
      numpages: data.numpages
    };
  }

  throw new Error("Unable to initialize PDF parser engine");
}

/**
 * Parses uploaded document buffers (PDF, DOCX, XLSX, CSV, TXT) into normalized text for AI consumption.
 */
export async function parseDocumentBuffer(
  buffer: Buffer,
  originalFilename: string
): Promise<ParsedDocumentResult> {
  const ext = path.extname(originalFilename).toLowerCase();
  let extractedText = "";
  let metadata: Record<string, any> = {};

  try {
    if (ext === ".pdf") {
      const pdfData = await parsePdfBufferHelper(buffer);
      extractedText = pdfData.text || "";
      metadata = { numpages: pdfData.numpages };
    } else if (ext === ".docx" || ext === ".doc") {
      const docResult = await mammoth.extractRawText({ buffer });
      extractedText = docResult.value || "";
    } else if (ext === ".xlsx" || ext === ".xls" || ext === ".csv") {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetTexts: string[] = [];

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        if (worksheet) {
          const csvText = XLSX.utils.sheet_to_csv(worksheet);
          if (csvText.trim()) {
            sheetTexts.push(`--- Sheet: ${sheetName} ---\n${csvText}`);
          }
        }
      });

      extractedText = sheetTexts.join("\n\n");
      metadata = { sheets: workbook.SheetNames };
    } else if (ext === ".txt" || ext === ".md" || ext === ".json" || ext === ".rtf") {
      extractedText = buffer.toString("utf-8");
    } else {
      // Fallback text conversion
      extractedText = buffer.toString("utf-8");
    }

    // Clean and normalize extracted text
    const cleanedText = cleanExtractedText(extractedText);

    if (!cleanedText.trim()) {
      throw new Error("Could not extract readable text from document. File may be empty or password-protected.");
    }

    return {
      filename: originalFilename,
      fileType: ext.replace(".", "").toUpperCase(),
      extractedText: cleanedText,
      metadata
    };
  } catch (err: any) {
    console.error(`Document parsing error for ${originalFilename}:`, err);
    throw new Error(`Failed to parse file '${originalFilename}': ${err.message || "Invalid file format"}`);
  }
}

/**
 * Normalizes text formatting for optimal LLM prompt context
 */
function cleanExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
