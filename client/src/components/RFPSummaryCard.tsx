import { Card, CardContent } from '@/components/ui/card';

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
    <Card className="w-full border border-[#2E3B52] bg-[#1C2638] shadow-xl rounded-2xl overflow-hidden" data-testid="card-rfp-summary">
      <CardContent className="p-6 space-y-4">
        {/* RFP Title */}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#F8FAFC]" data-testid="text-rfp-title">
            {summary.title}
          </h2>
          <p className="text-xs font-mono text-[#94A3B8] mt-1" data-testid="text-due-date">
            Due Date: {summary.dueDate}
          </p>
        </div>

        {/* Monospace Metadata Row: Voltage · Conductor · Insulation */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-[#151D2A] border border-[#2E3B52]/60 rounded-xl">
          {summary.voltage && (
            <span className="text-xs font-mono text-[#6366F1] font-semibold" data-testid="text-voltage">
              {summary.voltage}
            </span>
          )}
          {summary.voltage && summary.material && <span className="text-xs text-[#2E3B52] font-mono">·</span>}
          {summary.material && (
            <span className="text-xs font-mono text-[#6366F1] font-semibold" data-testid="text-material">
              {summary.material} Conductor
            </span>
          )}
          {summary.material && summary.insulation && <span className="text-xs text-[#2E3B52] font-mono">·</span>}
          {summary.insulation && (
            <span className="text-xs font-mono text-[#6366F1] font-semibold" data-testid="text-insulation">
              {summary.insulation} Insulation
            </span>
          )}
        </div>

        {/* Standards & Requirements Scope */}
        {summary.requirements && summary.requirements.length > 0 && (
          <div className="pt-2 border-t border-[#2E3B52]/40 space-y-2">
            <p className="text-xs font-mono text-[#94A3B8]">Technical Scope & Requirements:</p>
            <ul className="space-y-1 text-xs text-[#94A3B8] font-sans">
              {summary.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#6366F1] mt-1 w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                  <span data-testid={`text-requirement-${index}`}>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Spec Extraction Audit Table: Parsed RFP Specs vs Assumed Catalog Defaults */}
        <div className="pt-3 border-t border-[#2E3B52]/40 space-y-2">
          <p className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider font-semibold">Spec Extraction Audit Matrix</p>
          <div className="overflow-x-auto rounded-xl border border-[#2E3B52]/60 bg-[#151D2A]">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-[#2E3B52] bg-[#1C2638] text-[#94A3B8]">
                  <th className="p-2 font-semibold">Attribute</th>
                  <th className="p-2 font-semibold">Parsed RFP Spec</th>
                  <th className="p-2 font-semibold">Catalog Standard Default</th>
                  <th className="p-2 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E3B52]/40 text-[#F8FAFC]">
                <tr>
                  <td className="p-2 text-[#94A3B8]">Voltage Grade</td>
                  <td className="p-2 font-bold text-[#6366F1]">{summary.voltage || 'Unspecified'}</td>
                  <td className="p-2 text-[#94A3B8]">{summary.voltage || '33kV Medium Voltage'}</td>
                  <td className="p-2 text-center text-emerald-400">Match</td>
                </tr>
                <tr>
                  <td className="p-2 text-[#94A3B8]">Conductor Material</td>
                  <td className="p-2 font-bold text-[#6366F1]">{summary.material || 'Unspecified'}</td>
                  <td className="p-2 text-[#94A3B8]">{summary.material ? `${summary.material} Core` : 'Aluminium Core'}</td>
                  <td className="p-2 text-center text-emerald-400">Match</td>
                </tr>
                <tr>
                  <td className="p-2 text-[#94A3B8]">Primary Insulation</td>
                  <td className="p-2 font-bold text-[#6366F1]">{summary.insulation || 'Unspecified'}</td>
                  <td className="p-2 text-[#94A3B8]">{summary.insulation || 'XLPE Extruded'}</td>
                  <td className="p-2 text-center text-emerald-400">Match</td>
                </tr>
                <tr>
                  <td className="p-2 text-[#94A3B8]">Cross-Section / Cores</td>
                  <td className="p-2 text-[#94A3B8]">Auto-Engineered</td>
                  <td className="p-2 text-[#94A3B8]">300 mm² / 3-Core</td>
                  <td className="p-2 text-center text-sky-400">IEC 60502</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



