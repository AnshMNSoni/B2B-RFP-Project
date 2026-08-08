import type { ValueEngineeringRecommendation, UnitOptimization, RiskChartsData, SKUMatch } from '@shared/schema';
import * as XLSX from 'xlsx';

export interface ExportPricingItem {
  sku: string;
  description: string;
  basePrice: number;
  quantity: number;
  baseTotal?: number;
  materialCost: number;
  serviceCost: number;
  testingCost: number;
  totalCost: number;
}

export interface ExportRfpResponse {
  success: boolean;
  summary: ExportSummary;
  matches: SKUMatch[];
  pricing: ExportPricingItem[];
  grandTotal: number;
  analysis?: string;
  valueEngineering?: ValueEngineeringRecommendation;
  unitOptimization?: UnitOptimization;
  riskCharts?: RiskChartsData;
}

export interface ExportSummary {
  title: string;
  dueDate?: string | null;
  voltage?: string | null;
  material?: string | null;
  insulation?: string | null;
  compliance?: string[];
  requirements?: string[];
}

/**
 * Triggers PDF export by opening a print-optimized official B2B Quotation report window
 */
export function exportToPdf(result: ExportRfpResponse, summary: ExportSummary) {

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Please allow popups to export the PDF quotation report.");
    return;
  }

  const topMatch = result.matches && result.matches[0];
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const refNo = `QUO-2025-${Math.floor(1000 + Math.random() * 9000)}`;

  const itemsHtml = result.pricing.map((item) => `
    <tr style="border-bottom: 1px solid #E2E8F0;">
      <td style="padding: 10px; font-family: monospace; font-weight: bold; color: #1E293B;">${item.sku}</td>
      <td style="padding: 10px; color: #475569;">${item.description}</td>
      <td style="padding: 10px; text-align: right; font-family: monospace;">₹${item.basePrice.toLocaleString()}</td>
      <td style="padding: 10px; text-align: right; font-family: monospace;">${item.quantity.toLocaleString()} m</td>
      <td style="padding: 10px; text-align: right; font-family: monospace; font-weight: bold; color: #0F172A;">₹${item.totalCost.toLocaleString()}</td>
    </tr>
  `).join('');

  const veHtml = result.valueEngineering && result.valueEngineering.hasOptimization ? `
    <div style="margin-top: 24px; padding: 16px; background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px;">
      <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #166534;">Value Engineering Cost Optimization Recommendation</h3>
      <p style="margin: 0; font-size: 12px; color: #15803D; line-height: 1.5;">
        <strong>Recommended Alternative:</strong> ${result.valueEngineering.optimizedSku} (${result.valueEngineering.alternativeMaterial})<br/>
        <strong>Potential Cost Savings:</strong> Save ₹${result.valueEngineering.savingsAmount.toLocaleString()} (${result.valueEngineering.savingsPercentage}% reduction)<br/>
        <strong>Technical Compliance:</strong> ${result.valueEngineering.technicalJustification}
      </p>
    </div>
  ` : '';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <title>Official B2B Quotation - ${refNo}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 12mm 15mm;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #0F172A;
          background: #FFFFFF;
          margin: 0;
          padding: 0;
          line-height: 1.4;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #6366F1;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .company-name {
          font-size: 22px;
          font-weight: 800;
          color: #4F46E5;
          letter-spacing: -0.5px;
        }
        .doc-title {
          font-size: 14px;
          font-weight: 700;
          color: #1E293B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 14px;
          margin-bottom: 20px;
          font-size: 12px;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 13px;
          font-weight: 700;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 4px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        th {
          background-color: #F1F5F9;
          color: #475569;
          font-weight: 600;
          text-align: left;
          padding: 8px 10px;
          font-family: monospace;
          border-bottom: 1px solid #CBD5E1;
        }
        .grand-total {
          background-color: #4F46E5;
          color: #FFFFFF;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 800;
          font-family: monospace;
          text-align: right;
          margin-top: 12px;
        }
        .sla-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 10px;
        }
        .sla-box {
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          padding: 10px;
          font-size: 11px;
          background-color: #F8FAFC;
        }
        .footer-seal {
          margin-top: 30px;
          padding-top: 12px;
          border-top: 1px solid #E2E8F0;
          font-size: 10px;
          color: #94A3B8;
          text-align: center;
          font-family: monospace;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="company-name">POWERGRID CABLES B2B</div>
          <div style="font-size: 11px; color: #64748B;">Industrial Tender Quotation Engine (USD→INR Forex: ₹83.50)</div>
        </div>
        <div style="text-align: right;">
          <div class="doc-title">AI COMMERCIAL QUOTATION DRAFT</div>
          <div style="font-size: 12px; font-family: monospace; margin-top: 6px; color: #475569;">Ref: ${refNo}</div>
          <div style="font-size: 11px; color: #94A3B8;">Date: ${dateStr}</div>
        </div>
      </div>

      <div class="meta-grid">
        <div>
          <div><strong>Tender Title:</strong> ${summary.title}</div>
          <div><strong>Due Date:</strong> ${summary.dueDate || 'N/A'}</div>
        </div>
        <div>
          <div><strong>Voltage Scope:</strong> ${summary.voltage || 'Standard'}</div>
          <div><strong>Material / Insulation:</strong> ${summary.material || 'Standard'} / ${summary.insulation || 'Standard'}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">1. Technical Specification Matching</div>
        <p style="font-size: 12px; color: #475569; margin: 0 0 8px 0;">
          <strong>Top SKU Match:</strong> <span style="font-family: monospace; font-weight: bold; color: #4F46E5;">${topMatch ? topMatch.sku : 'N/A'}</span> — ${topMatch ? topMatch.description : ''} 
          <span style="display: inline-block; background: #EEF2FF; color: #4F46E5; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-family: monospace; font-size: 11px; margin-left: 8px;">
            ${topMatch ? topMatch.matchPercentage : 0}% Semantic Match Score
          </span>
        </p>
      </div>

      <div class="section">
        <div class="section-title">2. Commercial Price Breakdown</div>
        <table>
          <thead>
            <tr>
              <th>SKU Code</th>
              <th>Description</th>
              <th style="text-align: right;">Unit Price (₹)</th>
              <th style="text-align: right;">Quantity</th>
              <th style="text-align: right;">Total Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <div class="grand-total">
          GRAND TOTAL: ₹${result.grandTotal.toLocaleString()} INR
        </div>
        <div style="font-size: 10px; font-family: monospace; color: #64748B; margin-top: 6px; text-align: right;">
          *Includes LME Raw Metal Spot Surcharge at USD->INR Forex Rate (1 USD = ₹83.50 INR)
        </div>
      </div>

      ${veHtml}

      <div class="section">
        <div class="section-title">4. Commercial Terms & Delivery SLA</div>
        <div class="sla-grid">
          <div class="sla-box">
            <strong style="color: #4F46E5;">Delivery Lead Time</strong><br/>
            2 – 3 Weeks from PO Issuance
          </div>
          <div class="sla-box">
            <strong style="color: #4F46E5;">Payment Terms</strong><br/>
            30 Days Line of Credit against Invoice
          </div>
          <div class="sla-box">
            <strong style="color: #4F46E5;">Quotation Validity</strong><br/>
            14 Days (LME Spot Rate Aligned)
          </div>
        </div>
      </div>

      <div class="footer-seal">
        <strong>AI COMMERCIAL DRAFT — SUBJECT TO ENGINEERING SIGN-OFF</strong><br/>
        Generated by PowerGrid Cables B2B AI Engine. All figures calculated in Indian Rupees (₹) using USD→INR Forex Rate (1 USD = ₹83.50). Requires formal technical verification prior to final tender submission.
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 250);
}

/**
 * Triggers Excel (.xlsx) file download for the quotation with proper cell formatting and column widths
 */
export function exportToCsv(result: ExportRfpResponse, summary: ExportSummary) {

  const dateStr = new Date().toISOString().split('T')[0];
  const refNo = `QUO-2025-${Math.floor(1000 + Math.random() * 9000)}`;

  const aoaData: any[][] = [
    ['B2B AI COMMERCIAL QUOTATION DRAFT (INR)'],
    ['Quotation Ref', refNo],
    ['Tender Title', summary.title],
    ['Due Date', summary.dueDate || 'N/A'],
    ['Voltage Scope', summary.voltage || 'N/A'],
    ['Forex Conversion', '1 USD = ₹83.50 INR'],
    ['Date Generated', dateStr],
    [],
    ['SKU Code', 'Description', 'Base Unit Price (₹)', 'Quantity (m)', 'Material Cost (₹)', 'Service Fee (₹)', 'Testing Fee (₹)', 'Total Cost (₹)'],
  ];


  result.pricing.forEach(item => {
    aoaData.push([
      item.sku,
      item.description,
      item.basePrice,
      item.quantity,
      item.materialCost,
      item.serviceCost,
      item.testingCost,
      item.totalCost
    ]);
  });

  aoaData.push([]);
  aoaData.push(['GRAND TOTAL QUOTATION (₹)', '', '', '', '', '', '', result.grandTotal]);
  aoaData.push([]);
  aoaData.push(['COMMERCIAL TERMS & SLA']);
  aoaData.push(['Delivery Lead Time', '2 - 3 Weeks from PO Issuance']);
  aoaData.push(['Payment Terms', '30 Days Line of Credit against Invoice']);
  aoaData.push(['Quotation Validity', '14 Days (LME Spot Rate Aligned)']);

  const worksheet = XLSX.utils.aoa_to_sheet(aoaData);

  // Set explicit column widths so no cells show '########'
  worksheet['!cols'] = [
    { wch: 25 }, // Col A: SKU Code / Field Name
    { wch: 45 }, // Col B: Description / Field Value
    { wch: 18 }, // Col C: Base Unit Price
    { wch: 15 }, // Col D: Quantity
    { wch: 18 }, // Col E: Material Cost
    { wch: 16 }, // Col F: Service Fee
    { wch: 16 }, // Col G: Testing Fee
    { wch: 22 }, // Col H: Total Cost
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'RFP Quotation');

  const cleanTitle = (summary.title || 'Quotation').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  XLSX.writeFile(workbook, `RFP_Quotation_${cleanTitle}.xlsx`);
}
