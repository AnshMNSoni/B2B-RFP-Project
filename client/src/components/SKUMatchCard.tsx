import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface SKUMatch {
  sku: string;
  description: string;
  matchPercentage: number;
  voltage: string;
  material: string;
  insulation: string;
  basePrice: number;
  cores?: string;
  crossSection?: string;
  armoring?: string;
  materialMismatch?: boolean;
  reasoning?: string;
}

interface SKUMatchCardProps {
  match: SKUMatch;
  rank: number;
}

export default function SKUMatchCard({ match, rank }: SKUMatchCardProps) {
  const isLowMatch = match.matchPercentage < 80 || match.materialMismatch;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.1, duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className={`w-full border bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden ${isLowMatch ? 'border-amber-300/80 shadow-amber-100/50' : 'border-slate-200'}`} data-testid={`card-sku-match-${rank}`}>
        <CardContent className="p-6 md:p-8 space-y-5">
          {/* Upper Layout: Left Info & Right Large Match Number */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">#{rank}</span>
                <p className="font-mono font-bold text-base text-slate-900 tracking-tight" data-testid={`text-sku-code-${rank}`}>
                  {match.sku}
                </p>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-2xl" data-testid={`text-sku-description-${rank}`}>
                {match.description}
              </p>
            </div>

            {/* Dominant Match Percentage Number */}
            <div className="sm:text-right shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-100/50">
              <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight block ${isLowMatch ? 'text-amber-500' : 'text-blue-600'}`} data-testid={`text-match-percentage-${rank}`}>
                {match.matchPercentage}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Match Score</span>
            </div>
          </div>

          {/* Low Match / Material Discrepancy Warning Alert */}
          {isLowMatch && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">⚠️</span>
              <div>
                <strong>Verify Spec:</strong> {match.materialMismatch ? 'Material mismatch detected (RFP requested different conductor material). ' : 'Match score below 80%. '}Review before final quote submission.
              </div>
            </div>
          )}

          {/* Technical Spec Badges: Voltage, Material, Insulation, Cores, CrossSection, Armoring */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg shadow-sm" data-testid={`text-voltage-${rank}`}>
              {match.voltage}
            </span>
            <span className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg shadow-sm" data-testid={`text-material-${rank}`}>
              {match.material}
            </span>
            <span className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg shadow-sm" data-testid={`text-insulation-${rank}`}>
              {match.insulation}
            </span>
            {match.cores && (
              <span className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
                {match.cores}
              </span>
            )}
            {match.crossSection && (
              <span className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
                {match.crossSection}
              </span>
            )}
            {match.armoring && (
              <span className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg shadow-sm">
                {match.armoring}
              </span>
            )}
          </div>

          {/* Bottom Line Metadata */}
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Semantic similarity score: {match.matchPercentage.toFixed(1)}%</span>
            <span className="text-slate-900 font-bold text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              ₹{match.basePrice.toLocaleString()} / m
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}



