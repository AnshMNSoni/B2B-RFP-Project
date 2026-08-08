import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PricingItem {
  sku: string;
  description: string;
  basePrice: number;
  quantity: number;
  materialCost: number;
  serviceCost: number;
  testingCost: number;
  totalCost: number;
}

interface PricingTableProps {
  items: PricingItem[];
  grandTotal: number;
  riskAnalysis?: string;
}

export default function PricingTable({
  items,
  grandTotal,
  riskAnalysis = "Material pricing calibrated for current copper market spot rates (+20% copper factor). Standard testing & 5% service markup included."
}: PricingTableProps) {
  return (
    <div className="space-y-6">
      {/* Card 3 — Itemized Quote Table */}
      <Card className="w-full border border-[#2E3B52] bg-[#1C2638] shadow-xl rounded-2xl overflow-hidden" data-testid="card-pricing-table">
        <CardHeader className="p-6 border-b border-[#2E3B52]/60">
          <CardTitle className="text-base font-bold text-[#F8FAFC] tracking-tight">
            Itemized Quote Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#2E3B52] hover:bg-transparent bg-[#151D2A]/60">
                  <TableHead className="font-mono text-xs text-[#94A3B8] font-semibold py-3.5">Item (SKU)</TableHead>
                  <TableHead className="font-mono text-xs text-[#94A3B8] font-semibold py-3.5">Spec / Description</TableHead>
                  <TableHead className="text-right font-mono text-xs text-[#94A3B8] font-semibold py-3.5">Unit Price</TableHead>
                  <TableHead className="text-right font-mono text-xs text-[#94A3B8] font-semibold py-3.5">Qty (m)</TableHead>
                  <TableHead className="text-right font-mono text-xs text-[#94A3B8] font-semibold py-3.5">Base Subtotal</TableHead>
                  <TableHead className="text-right font-mono text-xs text-[#94A3B8] font-semibold py-3.5">Material Surcharge</TableHead>
                  <TableHead className="text-right font-mono text-xs text-[#94A3B8] font-semibold py-3.5">Service (5%)</TableHead>
                  <TableHead className="text-right font-mono text-xs text-[#94A3B8] font-semibold py-3.5">Testing Fee</TableHead>
                  <TableHead className="text-right font-mono text-xs text-[#94A3B8] font-semibold py-3.5">Total Line Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => {
                  const baseTotal = (item as any).baseTotal || (item.basePrice * item.quantity);
                  return (
                    <TableRow
                      key={item.sku}
                      className={`border-b border-[#2E3B52]/40 hover:bg-[#151D2A]/80 transition-colors ${
                        index % 2 === 0 ? 'bg-[#1C2638]' : 'bg-[#151D2A]'
                      }`}
                      data-testid={`row-pricing-${index}`}
                    >
                      <TableCell className="font-mono text-xs font-semibold text-[#6366F1] py-4">{item.sku}</TableCell>
                      <TableCell className="text-xs text-[#94A3B8] max-w-[200px] truncate py-4 font-sans">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-[#94A3B8] py-4">₹{item.basePrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-[#94A3B8] py-4">{item.quantity.toLocaleString()} m</TableCell>
                      <TableCell className="text-right font-mono text-xs text-[#94A3B8] py-4">₹{baseTotal.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-sky-400 py-4">+₹{item.materialCost.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-[#94A3B8] py-4">+₹{item.serviceCost.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-[#94A3B8] py-4">+₹{item.testingCost.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-xs font-bold text-[#F8FAFC] py-4">
                        ₹{item.totalCost.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Formula Audit Explanation */}
          <div className="p-4 bg-[#151D2A]/80 border-t border-[#2E3B52] text-xs font-mono text-[#94A3B8] space-y-1">
            <span className="text-[#6366F1] font-bold">Calculation Audit Formula:</span>
            <p className="text-[11px] text-[#94A3B8]">
              Total Cost = Base Subtotal (Unit Price × Qty) + LME Raw Material Surcharge (+20% spot rate) + 5% Service & Handling Markup + High-Voltage Testing Fee.
            </p>
          </div>
          
          {/* Grand Total Row with Indigo Bottom Border */}
          <div className="p-6 bg-[#151D2A] border-t-2 border-b-2 border-[#6366F1] flex items-center justify-between">
            <span className="text-sm font-mono font-semibold text-[#94A3B8] uppercase tracking-wider">Grand Total</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#F8FAFC]" data-testid="text-grand-total">
              ₹{grandTotal.toLocaleString()}
            </span>
          </div>



          {/* Commercial Terms & Delivery SLA Footer */}
          <div className="p-4 bg-[#151D2A]/60 border-t border-[#2E3B52] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#94A3B8]">
            <div className="flex items-center gap-1.5">
              <span className="text-[#6366F1]">Delivery:</span>
              <span className="text-[#F8FAFC]">2–3 Wks Lead Time</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#6366F1]">Payment:</span>
              <span className="text-[#F8FAFC]">30 Days Credit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#6366F1]">Quote Validity:</span>
              <span className="text-[#F8FAFC]">14 Days (LME Spot Aligned)</span>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}




