import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShieldCheck } from 'lucide-react';
import type { UnitOptimization } from '@shared/schema';
import { motion } from 'framer-motion';

interface UnitOptimizationCardProps {
  data?: UnitOptimization;
}

export default function UnitOptimizationCard({ data }: UnitOptimizationCardProps) {
  if (!data || !data.hasUnitOptimization || data.savingsAmount <= 0) {
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
      <Card className="w-full border border-blue-200 bg-white shadow-md rounded-2xl overflow-hidden" data-testid="card-unit-optimization">
        <CardHeader className="p-6 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center shadow-sm">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            Factory Reel & Batch Unit Optimization
          </CardTitle>

          {/* Saved Fee Badge */}
          <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-right shadow-inner">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Scrap Fee Eliminated</span>
            <span className="text-sm font-extrabold font-mono text-slate-900 mt-0.5 block">
              Saved ₹{data.scrapFeeSaved.toLocaleString()}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
            {/* Requested Custom Cut */}
            <div className="space-y-3 p-5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Requested Batch Order</p>
              <p className="font-mono text-base font-bold text-slate-700">{data.requestedQuantity} Meters (Custom Cut)</p>
              <p className="text-sm text-slate-500 font-medium">Includes +15% non-standard factory cutting penalty fee</p>
              <div className="pt-3 mt-2 border-t border-slate-200/60 text-right">
                <span className="font-mono text-base font-bold text-slate-900">₹{data.netCostBefore.toLocaleString()}</span>
              </div>
            </div>

            {/* Recommended Standard Drum */}
            <div className="space-y-3 p-5 bg-blue-50/50 border-2 border-blue-400/60 rounded-xl shadow-sm relative">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Standard Factory Drum Reel</p>
                <span className="px-2 py-1 text-[10px] font-bold bg-blue-600 text-white rounded-md shadow-sm">NET SAVINGS</span>
              </div>
              <p className="font-mono text-base font-bold text-slate-900">{data.recommendedQuantity} Meters (Full Drum)</p>
              <p className="text-sm text-blue-700 font-medium">Zero cutting scrap fee (+{data.recommendedQuantity - data.requestedQuantity}m spare cable)</p>
              <div className="pt-3 mt-2 border-t border-blue-200 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 uppercase">Standard Package</span>
                <span className="font-mono text-base font-bold text-slate-900">₹{data.netCostAfter.toLocaleString()}</span>
              </div>
            </div>
          </div>


          {/* Message Explanation Box */}
          <div className="flex items-start gap-3 p-5 bg-slate-50 border border-slate-200 rounded-xl shadow-inner">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {data.message}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
