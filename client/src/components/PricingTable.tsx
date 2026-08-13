import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { motion } from 'framer-motion';

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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Card 3 — Itemized Quote Table */}
      <Card className="w-full border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden" data-testid="card-pricing-table">
        <CardHeader className="p-6 border-b border-slate-100 bg-slate-50">
          <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Itemized Quote Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200 hover:bg-transparent bg-white">
                  <TableHead className="font-semibold text-xs text-slate-500 py-4 uppercase tracking-wider">Item (SKU)</TableHead>
                  <TableHead className="font-semibold text-xs text-slate-500 py-4 uppercase tracking-wider">Spec / Description</TableHead>
                  <TableHead className="text-right font-semibold text-xs text-slate-500 py-4 uppercase tracking-wider">Unit Price</TableHead>
                  <TableHead className="text-right font-semibold text-xs text-slate-500 py-4 uppercase tracking-wider">Qty (m)</TableHead>
                  <TableHead className="text-right font-semibold text-xs text-slate-500 py-4 uppercase tracking-wider">Base Subtotal</TableHead>
                  <TableHead className="text-right font-semibold text-xs text-slate-500 py-4 uppercase tracking-wider">Material Surcharge</TableHead>
                  <TableHead className="text-right font-semibold text-xs text-slate-500 py-4 uppercase tracking-wider">Service (5%)</TableHead>
                  <TableHead className="text-right font-semibold text-xs text-slate-500 py-4 uppercase tracking-wider">Testing Fee</TableHead>
                  <TableHead className="text-right font-semibold text-xs text-slate-500 py-4 uppercase tracking-wider">Total Line Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => {
                  const baseTotal = (item as any).baseTotal || (item.basePrice * item.quantity);
                  return (
                    <TableRow
                      key={item.sku}
                      className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                      data-testid={`row-pricing-${index}`}
                    >
                      <TableCell className="font-mono text-sm font-semibold text-blue-600 py-4">{item.sku}</TableCell>
                      <TableCell className="text-sm text-slate-600 max-w-[200px] truncate py-4 font-sans font-medium">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-slate-600 py-4">₹{item.basePrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-slate-600 py-4">{item.quantity.toLocaleString()} m</TableCell>
                      <TableCell className="text-right font-mono text-sm text-slate-600 py-4">₹{baseTotal.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-blue-500 py-4">+₹{item.materialCost.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-slate-500 py-4">+₹{item.serviceCost.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-slate-500 py-4">+₹{item.testingCost.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-sm font-bold text-slate-900 py-4">
                        ₹{item.totalCost.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Formula Audit Explanation */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-sm font-medium text-slate-500 space-y-1">
            <span className="text-blue-600 font-bold">Calculation Audit Formula:</span>
            <p className="text-xs text-slate-400 mt-1">
              Total Cost = Base Subtotal (Unit Price × Qty) + LME Raw Material Surcharge (+20% spot rate) + 5% Service & Handling Markup + High-Voltage Testing Fee.
            </p>
          </div>
          
          {/* Grand Total Row with Indigo Bottom Border */}
          <div className="p-6 bg-slate-50 border-t-2 border-b-2 border-blue-500 flex items-center justify-between shadow-inner">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Grand Total</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-700" data-testid="text-grand-total">
              ₹{grandTotal.toLocaleString()}
            </span>
          </div>

          {/* Commercial Terms & Delivery SLA Footer */}
          <div className="p-5 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="text-blue-500 bg-blue-50 px-2 py-1 rounded">Delivery:</span>
              <span className="text-slate-700">2–3 Wks Lead Time</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500 bg-blue-50 px-2 py-1 rounded">Payment:</span>
              <span className="text-slate-700">30 Days Credit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500 bg-blue-50 px-2 py-1 rounded">Quote Validity:</span>
              <span className="text-slate-700">14 Days (LME Spot)</span>
            </div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}




