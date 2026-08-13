import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import type { ValueEngineeringRecommendation } from '@shared/schema';
import { motion } from 'framer-motion';

interface ValueEngineeringCardProps {
  data?: ValueEngineeringRecommendation;
}

export default function ValueEngineeringCard({ data }: ValueEngineeringCardProps) {
  if (!data || !data.hasOptimization || data.savingsAmount <= 0) {
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
      <Card className="w-full border border-blue-200 bg-white shadow-md rounded-2xl overflow-hidden" data-testid="card-value-engineering">
        <CardHeader className="p-6 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            AI Value Engineering & Cost Optimization
          </CardTitle>

          {/* High-Impact Savings Badge */}
          <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-right shadow-inner">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Potential Savings</span>
            <span className="text-sm font-extrabold font-mono text-slate-900 mt-0.5 block">
              Save ₹{data.savingsAmount.toLocaleString()} ({data.savingsPercentage}%)
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
            {/* Option A: Requested Spec */}
            <div className="space-y-3 p-5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Option A: Requested Spec</p>
              <p className="font-mono text-base font-bold text-slate-700">{data.originalSku}</p>
              <p className="text-sm text-slate-500 font-medium">Direct match to tender requirements</p>
              <div className="pt-3 mt-2 border-t border-slate-200/60 text-right">
                <span className="font-mono text-base font-bold text-slate-900">₹{data.originalTotalCost.toLocaleString()}</span>
              </div>
            </div>

            {/* Option B: Value-Engineered Spec */}
            <div className="space-y-3 p-5 bg-blue-50/50 border-2 border-blue-400/60 rounded-xl shadow-sm relative">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Option B: Value-Engineered</p>
                <span className="px-2 py-1 text-[10px] font-bold bg-blue-600 text-white rounded-md shadow-sm">RECOMMENDED</span>
              </div>
              <p className="font-mono text-base font-bold text-slate-900">{data.optimizedSku}</p>
              <p className="text-sm text-blue-700 font-medium">{data.alternativeMaterial}</p>
              <div className="pt-3 mt-2 border-t border-blue-200 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 uppercase">Ampacity Equivalent</span>
                <span className="font-mono text-base font-bold text-slate-900">₹{data.optimizedTotalCost.toLocaleString()}</span>
              </div>
            </div>
          </div>


          {/* Technical & Standards Justification Box */}
          <div className="space-y-3 p-5 bg-slate-50 border border-slate-200 rounded-xl shadow-inner">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>Technical Compliance & Engineering Justification</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {data.technicalJustification}
            </p>

            {/* Standard Compliance Badges */}
            {data.standardCompliance && data.standardCompliance.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-3 mt-1 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">Standards Maintained:</span>
                {data.standardCompliance.map((std, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-white border border-blue-200 rounded-lg shadow-sm">
                    {std}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
