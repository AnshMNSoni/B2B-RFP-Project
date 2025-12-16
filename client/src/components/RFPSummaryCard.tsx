import { FileText, Calendar, Package, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RFPSummary {
  title: string;
  dueDate: string;
  requirements: string[];
  voltage?: string;
  material?: string;
  insulation?: string;
  compliance?: string[];
}

interface RFPSummaryCardProps {
  summary: RFPSummary;
}

export default function RFPSummaryCard({ summary }: RFPSummaryCardProps) {
  return (
    <Card data-testid="card-rfp-summary">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="w-5 h-5 text-primary" />
          RFP Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg" data-testid="text-rfp-title">{summary.title}</h3>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Due Date:</span>
          <span className="font-medium" data-testid="text-due-date">{summary.dueDate}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {summary.voltage && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Voltage</p>
              <p className="font-mono font-medium" data-testid="text-voltage">{summary.voltage}</p>
            </div>
          )}
          {summary.material && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Material</p>
              <p className="font-mono font-medium" data-testid="text-material">{summary.material}</p>
            </div>
          )}
          {summary.insulation && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Insulation</p>
              <p className="font-mono font-medium" data-testid="text-insulation">{summary.insulation}</p>
            </div>
          )}
        </div>

        {summary.compliance && summary.compliance.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Compliance</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {summary.compliance.map((item, index) => (
                <Badge key={index} variant="secondary" data-testid={`badge-compliance-${index}`}>
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {summary.requirements.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Requirements</span>
            </div>
            <ul className="space-y-1 text-sm">
              {summary.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                  <span data-testid={`text-requirement-${index}`}>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
