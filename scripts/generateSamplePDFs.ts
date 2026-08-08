import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

async function createSamplePDFs() {
  const samplesDir = path.join(process.cwd(), "client", "public", "samples");
  if (!fs.existsSync(samplesDir)) {
    fs.mkdirSync(samplesDir, { recursive: true });
  }

  // --- PDF 1: PASS CASE (High Match 33kV Substation Tender) ---
  const pdfPass = await PDFDocument.create();
  const fontPass = await pdfPass.embedFont(StandardFonts.Helvetica);
  const fontBoldPass = await pdfPass.embedFont(StandardFonts.HelveticaBold);
  const page1 = pdfPass.addPage([595, 842]); // A4 size

  page1.drawText("OFFICIAL B2B PROCUREMENT TENDER REQUISITION", {
    x: 50,
    y: 780,
    size: 16,
    font: fontBoldPass,
    color: rgb(0.04, 0.06, 0.09),
  });

  page1.drawText("Document Ref: TND-2025-POWER-33KV", {
    x: 50,
    y: 755,
    size: 10,
    font: fontPass,
    color: rgb(0.39, 0.45, 0.55),
  });

  const passLines = [
    "RFP Title: Supply of 33kV Substation Transmission Power Cables",
    "Issuing Authority: Regional Electrical Grid Authority",
    "Due Date: 2025-08-15",
    "",
    "TECHNICAL SPECIFICATION REQUIREMENT:",
    "- Voltage Rating: 33kV Grade Heavy Duty Transmission Cable",
    "- Conductor Material: Stranded Aluminium Conductor",
    "- Primary Insulation: Extruded Cross-linked Polyethylene (XLPE)",
    "- Inner & Outer Sheath: Extruded Heavy-Duty PVC Sheath",
    "- Mechanical Protection: Galvanized Steel Wire Armored (GSWA)",
    "- Standard Compliance: IEC 60502-2 & IS 7098 (Part 2) Compliant",
    "- Estimated Quantity Required: 500 Meters",
    "",
    "COMMERCIAL CONDITIONS:",
    "Delivery Term: Delivered at Site (Substation Site 4)",
    "Payment Terms: 90 Days Line of Credit against Dispatch Invoice"
  ];

  let yPass = 710;
  for (const line of passLines) {
    const isHeader = line.startsWith("TECHNICAL") || line.startsWith("COMMERCIAL");
    page1.drawText(line, {
      x: 50,
      y: yPass,
      size: isHeader ? 11 : 10,
      font: isHeader ? fontBoldPass : fontPass,
      color: rgb(0.1, 0.15, 0.22),
    });
    yPass -= 20;
  }

  const pdfPassBytes = await pdfPass.save();
  const passPath = path.join(samplesDir, "High_Matching_Tender_33kV.pdf");
  fs.writeFileSync(passPath, pdfPassBytes);
  console.log(`Generated PASS PDF sample: ${passPath}`);

  // --- PDF 2: FAIL / DISCREPANCY CASE (Low Match 132kV Sub-sea Fiber Cable) ---
  const pdfFail = await PDFDocument.create();
  const fontFail = await pdfFail.embedFont(StandardFonts.Helvetica);
  const fontBoldFail = await pdfFail.embedFont(StandardFonts.HelveticaBold);
  const page2 = pdfFail.addPage([595, 842]);

  page2.drawText("SPECIALTY OFFSHORE PROCUREMENT REQUISITION", {
    x: 50,
    y: 780,
    size: 16,
    font: fontBoldFail,
    color: rgb(0.04, 0.06, 0.09),
  });

  page2.drawText("Document Ref: TND-2025-SUBSEA-132KV", {
    x: 50,
    y: 755,
    size: 10,
    font: fontFail,
    color: rgb(0.39, 0.45, 0.55),
  });

  const failLines = [
    "RFP Title: 132kV Extra High Voltage Sub-Sea Marine Armored Fiber Cable",
    "Issuing Authority: Offshore Wind Infrastructure Corp",
    "Due Date: 2025-11-30",
    "",
    "OUT OF CATALOG TECHNICAL REQUIREMENT:",
    "- Voltage Rating: 132kV Extra High Voltage (EHV Submarine Grade)",
    "- Conductor Material: Copper-Lead Alloy Composite Core",
    "- Insulation: Wet-curable Synthetic Rubber Submarine Grade",
    "- Integrated Elements: 48-Core Single Mode Optical Fiber Sub-unit",
    "- Sheathing: Extruded Continuous Lead Alloy Sheath + Double Wire Armor",
    "- Standard Compliance: CIGRE 623 & IEC 60840 Subsea Grade",
    "- Quantity: 2,500 Meters Continuous Unjointed Reel",
    "",
    "DISCREPANCY ALERT NOTE:",
    "This specialty EHV subsea cable rating (132kV) exceeds standard catalog",
    "medium-voltage ratings (11kV - 33kV) and requires custom marine manufacturing."
  ];

  let yFail = 710;
  for (const line of failLines) {
    const isHeader = line.startsWith("OUT OF CATALOG") || line.startsWith("DISCREPANCY");
    page2.drawText(line, {
      x: 50,
      y: yFail,
      size: isHeader ? 11 : 10,
      font: isHeader ? fontBoldFail : fontPass,
      color: isHeader && line.startsWith("DISCREPANCY") ? rgb(0.8, 0.2, 0.2) : rgb(0.1, 0.15, 0.22),
    });
    yFail -= 20;
  }

  const pdfFailBytes = await pdfFail.save();
  const failPath = path.join(samplesDir, "Out_of_Scope_Specialty_Tender_132kV.pdf");
  fs.writeFileSync(failPath, pdfFailBytes);
  console.log(`Generated FAIL/Discrepancy PDF sample: ${failPath}`);
}

createSamplePDFs().catch(console.error);
