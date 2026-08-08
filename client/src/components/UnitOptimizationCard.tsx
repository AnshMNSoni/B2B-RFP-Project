import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShieldCheck } from 'lucide-react';
import type { UnitOptimization } from '@shared/schema';

interface UnitOptimizationCardProps {
  data?: UnitOptimization;
}

export default function UnitOptimizationCard({ data }: UnitOptimizationCardProps) {
  if (!data || !data.hasUnitOptimization || data.savingsAmount <= 0) {
    return null;
  }

  return (
    <Card className="w-full border border-[#2E3B52] bg-[#1C2638] shadow-2xl rounded-2xl overflow-hidden animate-in fade-in duration-300" data-testid="card-unit-optimization">
      <CardHeader className="p-6 bg-[#151D2A] border-b border-[#2E3B52]/60 flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-base font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
          <div className="w-7 h-7 bg-indigo-600/20 border border-indigo-500/40 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.25)]">
            <Package className="w-4 h-4 text-[#6366F1]" />
          </div>
          Factory Reel & Batch Unit Optimization
        </CardTitle>

        {/* Saved Fee Badge */}
        <div className="px-3.5 py-1.5 bg-[#6366F1]/20 border border-[#6366F1] rounded-xl text-right">
          <span className="text-xs font-mono font-bold text-[#6366F1] uppercase tracking-wider block">Scrap Fee Eliminated</span>
          <span className="text-sm font-extrabold font-mono text-[#F8FAFC]">
            Saved ₹{data.scrapFeeSaved.toLocaleString()}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#151D2A] border border-[#2E3B52] rounded-xl">
          {/* Requested Custom Cut */}
          <div className="space-y-2 p-3 bg-[#1C2638] border border-[#2E3B52]/60 rounded-lg">
            <p className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">Requested Batch Order</p>
            <p className="font-mono text-sm font-bold text-[#F8FAFC]">{data.requestedQuantity} Meters (Custom Cut)</p>
            <p className="text-xs text-[#94A3B8]">Includes +15% non-standard factory cutting penalty fee</p>
            <div className="pt-2 border-t border-[#2E3B52]/40 text-right">
              <span className="font-mono text-sm font-bold text-[#F8FAFC]">₹{data.netCostBefore.toLocaleString()}</span>
            </div>
          </div>

          {/* Recommended Standard Drum */}
          <div className="space-y-2 p-3 bg-[#6366F1]/10 border border-[#6366F1]/40 rounded-lg relative">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono text-indigo-300 font-semibold uppercase tracking-wider">Standard Factory Drum Reel</p>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#6366F1] text-white rounded">NET SAVINGS</span>
            </div>
            <p className="font-mono text-sm font-bold text-[#F8FAFC]">{data.recommendedQuantity} Meters (Full Drum)</p>
            <p className="text-xs text-indigo-200">Zero cutting scrap fee (+{data.recommendedQuantity - data.requestedQuantity}m spare cable)</p>
            <div className="pt-2 border-t border-[#6366F1]/30 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#6366F1] font-semibold">Standard Package</span>
              <span className="font-mono text-sm font-bold text-[#F8FAFC]">₹{data.netCostAfter.toLocaleString()}</span>
            </div>
          </div>
        </div>


        {/* Message Explanation Box */}
        <div className="flex items-start gap-3 p-4 bg-[#151D2A]/60 border border-[#2E3B52]/60 rounded-xl">
          <ShieldCheck className="w-5 h-5 text-[#6366F1] shrink-0 mt-0.5" />
          <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
            {data.message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
