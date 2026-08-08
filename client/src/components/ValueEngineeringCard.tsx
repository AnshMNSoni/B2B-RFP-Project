import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import type { ValueEngineeringRecommendation } from '@shared/schema';

interface ValueEngineeringCardProps {
  data?: ValueEngineeringRecommendation;
}

export default function ValueEngineeringCard({ data }: ValueEngineeringCardProps) {
  if (!data || !data.hasOptimization || data.savingsAmount <= 0) {
    return null;
  }

  return (
    <Card className="w-full border border-[#6366F1]/50 bg-[#1C2638] shadow-2xl rounded-2xl overflow-hidden animate-in fade-in duration-300" data-testid="card-value-engineering">
      <CardHeader className="p-6 bg-[#151D2A] border-b border-[#2E3B52]/60 flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-base font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
          <div className="w-7 h-7 bg-indigo-600/20 border border-indigo-500/40 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.25)]">
            <Sparkles className="w-4 h-4 text-[#6366F1]" />
          </div>
          AI Value Engineering & Cost Optimization
        </CardTitle>

        {/* High-Impact Savings Badge */}
        <div className="px-3.5 py-1.5 bg-[#6366F1]/20 border border-[#6366F1] rounded-xl text-right">
          <span className="text-xs font-mono font-bold text-[#6366F1] uppercase tracking-wider block">Potential Savings</span>
          <span className="text-sm font-extrabold font-mono text-[#F8FAFC]">
            Save ₹{data.savingsAmount.toLocaleString()} ({data.savingsPercentage}%)
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#151D2A] border border-[#2E3B52] rounded-xl">
          {/* Option A: Requested Spec */}
          <div className="space-y-2 p-3 bg-[#1C2638] border border-[#2E3B52]/60 rounded-lg">
            <p className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">Option A: Requested Specification</p>
            <p className="font-mono text-sm font-bold text-[#F8FAFC]">{data.originalSku}</p>
            <p className="text-xs text-[#94A3B8]">Direct match to tender requirements</p>
            <div className="pt-2 border-t border-[#2E3B52]/40 text-right">
              <span className="font-mono text-sm font-bold text-[#F8FAFC]">₹{data.originalTotalCost.toLocaleString()}</span>
            </div>
          </div>

          {/* Option B: Value-Engineered Spec */}
          <div className="space-y-2 p-3 bg-[#6366F1]/10 border border-[#6366F1]/40 rounded-lg relative">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono text-indigo-300 font-semibold uppercase tracking-wider">Option B: Value-Engineered Spec</p>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#6366F1] text-white rounded">RECOMMENDED</span>
            </div>
            <p className="font-mono text-sm font-bold text-[#F8FAFC]">{data.optimizedSku}</p>
            <p className="text-xs text-indigo-200">{data.alternativeMaterial}</p>
            <div className="pt-2 border-t border-[#6366F1]/30 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#6366F1] font-semibold">Ampacity Equivalent</span>
              <span className="font-mono text-sm font-bold text-[#F8FAFC]">₹{data.optimizedTotalCost.toLocaleString()}</span>
            </div>
          </div>
        </div>


        {/* Technical & Standards Justification Box */}
        <div className="space-y-3 p-4 bg-[#151D2A]/60 border border-[#2E3B52]/60 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#F8FAFC]">
            <ShieldCheck className="w-4 h-4 text-[#6366F1]" />
            <span>Technical Compliance & Engineering Justification</span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
            {data.technicalJustification}
          </p>

          {/* Standard Compliance Badges */}
          {data.standardCompliance && data.standardCompliance.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2E3B52]/40">
              <span className="text-[11px] font-mono text-[#94A3B8]">Standards Maintained:</span>
              {data.standardCompliance.map((std, i) => (
                <span key={i} className="px-2 py-0.5 text-[10px] font-mono text-[#6366F1] bg-[#151D2A] border border-[#6366F1]/40 rounded-md">
                  {std}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
