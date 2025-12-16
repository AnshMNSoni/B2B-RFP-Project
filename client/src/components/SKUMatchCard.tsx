import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SKUMatch {
  sku: string;
  description: string;
  matchPercentage: number;
  voltage: string;
  material: string;
  insulation: string;
  basePrice: number;
}

interface SKUMatchCardProps {
  match: SKUMatch;
  rank: number;
}

export default function SKUMatchCard({ match, rank }: SKUMatchCardProps) {
  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getMatchBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (percentage >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-orange-100 dark:bg-orange-900/30';
  };

  return (
    <Card className="relative" data-testid={`card-sku-match-${rank}`}>
      <div className="absolute -top-2 -left-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
        #{rank}
      </div>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <p className="font-mono font-semibold text-sm mb-1" data-testid={`text-sku-code-${rank}`}>
              {match.sku}
            </p>
            <p className="text-sm text-muted-foreground" data-testid={`text-sku-description-${rank}`}>
              {match.description}
            </p>
          </div>
          <div className={`px-3 py-2 rounded-lg ${getMatchBgColor(match.matchPercentage)}`}>
            <span className={`text-2xl font-bold ${getMatchColor(match.matchPercentage)}`} data-testid={`text-match-percentage-${rank}`}>
              {match.matchPercentage}%
            </span>
            <p className="text-xs text-muted-foreground text-center">match</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Voltage</p>
            <Badge variant="outline" className="font-mono text-xs">
              {match.voltage}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Material</p>
            <Badge variant="outline" className="font-mono text-xs">
              {match.material}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Insulation</p>
            <Badge variant="outline" className="font-mono text-xs">
              {match.insulation}
            </Badge>
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Base Price</span>
            <span className="text-xl font-bold font-mono" data-testid={`text-base-price-${rank}`}>
              ${match.basePrice.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
