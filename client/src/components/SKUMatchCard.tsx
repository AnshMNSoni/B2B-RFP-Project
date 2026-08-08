import { Card, CardContent } from '@/components/ui/card';

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
    <Card className={`w-full border bg-[#1C2638] shadow-lg rounded-2xl overflow-hidden ${isLowMatch ? 'border-amber-500/60' : 'border-[#2E3B52]'}`} data-testid={`card-sku-match-${rank}`}>
      <CardContent className="p-6 space-y-4">
        {/* Upper Layout: Left Info & Right Large Match Number */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#94A3B8]">#{rank}</span>
              <p className="font-mono font-bold text-sm text-[#F8FAFC]" data-testid={`text-sku-code-${rank}`}>
                {match.sku}
              </p>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed" data-testid={`text-sku-description-${rank}`}>
              {match.description}
            </p>
          </div>

          {/* Dominant Match Percentage Number */}
          <div className="text-right shrink-0">
            <span className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${isLowMatch ? 'text-amber-400' : 'text-[#6366F1]'}`} data-testid={`text-match-percentage-${rank}`}>
              {match.matchPercentage}%
            </span>
            <p className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider block">Match Score</p>
          </div>
        </div>

        {/* Low Match / Material Discrepancy Warning Alert */}
        {isLowMatch && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-mono text-amber-300">
            <strong>Verify Spec:</strong> {match.materialMismatch ? 'Material mismatch detected (RFP requested different conductor material). ' : 'Match score below 80%. '}Review before final quote submission.
          </div>
        )}

        {/* Technical Spec Badges: Voltage, Material, Insulation, Cores, CrossSection, Armoring */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-mono text-[#F8FAFC] bg-[#151D2A] border border-[#2E3B52] rounded-lg" data-testid={`text-voltage-${rank}`}>
            {match.voltage}
          </span>
          <span className="px-2.5 py-1 text-xs font-mono text-[#F8FAFC] bg-[#151D2A] border border-[#2E3B52] rounded-lg" data-testid={`text-material-${rank}`}>
            {match.material}
          </span>
          <span className="px-2.5 py-1 text-xs font-mono text-[#F8FAFC] bg-[#151D2A] border border-[#2E3B52] rounded-lg" data-testid={`text-insulation-${rank}`}>
            {match.insulation}
          </span>
          {match.cores && (
            <span className="px-2.5 py-1 text-xs font-mono text-[#6366F1] bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
              {match.cores}
            </span>
          )}
          {match.crossSection && (
            <span className="px-2.5 py-1 text-xs font-mono text-[#6366F1] bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
              {match.crossSection}
            </span>
          )}
          {match.armoring && (
            <span className="px-2.5 py-1 text-xs font-mono text-sky-400 bg-sky-500/10 border border-sky-500/30 rounded-lg">
              {match.armoring}
            </span>
          )}
        </div>

        {/* Bottom Line Metadata */}
        <div className="pt-3 border-t border-[#2E3B52]/40 flex items-center justify-between text-xs font-mono text-[#94A3B8]">
          <span>Semantic similarity score: {match.matchPercentage.toFixed(1)}%</span>
          <span className="text-[#F8FAFC] font-semibold">₹{match.basePrice.toLocaleString()} / m</span>

        </div>
      </CardContent>
    </Card>
  );
}



