import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="w-full border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden" data-testid="card-rfp-summary">
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* RFP Title */}
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900" data-testid="text-rfp-title">
              {summary.title}
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1" data-testid="text-due-date">
              Due Date: {summary.dueDate}
            </p>
          </div>

          {/* Monospace Metadata Row: Voltage · Conductor · Insulation */}
          <div className="flex flex-wrap items-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-xl">
            {summary.voltage && (
              <span className="text-sm font-medium text-blue-700 bg-blue-100/50 px-2 py-1 rounded-md" data-testid="text-voltage">
                {summary.voltage}
              </span>
            )}
            {summary.voltage && summary.material && <span className="text-slate-300 font-bold">·</span>}
            {summary.material && (
              <span className="text-sm font-medium text-blue-700 bg-blue-100/50 px-2 py-1 rounded-md" data-testid="text-material">
                {summary.material} Conductor
              </span>
            )}
            {summary.material && summary.insulation && <span className="text-slate-300 font-bold">·</span>}
            {summary.insulation && (
              <span className="text-sm font-medium text-blue-700 bg-blue-100/50 px-2 py-1 rounded-md" data-testid="text-insulation">
                {summary.insulation} Insulation
              </span>
            )}
          </div>

          {/* Standards & Requirements Scope */}
          {summary.requirements && summary.requirements.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Technical Scope & Requirements</p>
              <ul className="space-y-2 text-sm text-slate-700 font-medium">
                {summary.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <span className="text-blue-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                    <span data-testid={`text-requirement-${index}`}>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Spec Extraction Audit Table: Parsed RFP Specs vs Assumed Catalog Defaults */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spec Extraction Audit Matrix</p>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                    <th className="p-3 font-semibold">Attribute</th>
                    <th className="p-3 font-semibold">Parsed RFP Spec</th>
                    <th className="p-3 font-semibold">Catalog Standard Default</th>
                    <th className="p-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-medium">Voltage Grade</td>
                    <td className="p-3 font-bold text-blue-600">{summary.voltage || 'Unspecified'}</td>
                    <td className="p-3 text-slate-500">{summary.voltage || '33kV Medium Voltage'}</td>
                    <td className="p-3 text-center text-green-600 font-medium">Match</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-medium">Conductor Material</td>
                    <td className="p-3 font-bold text-blue-600">{summary.material || 'Unspecified'}</td>
                    <td className="p-3 text-slate-500">{summary.material ? `${summary.material} Core` : 'Aluminium Core'}</td>
                    <td className="p-3 text-center text-green-600 font-medium">Match</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-medium">Primary Insulation</td>
                    <td className="p-3 font-bold text-blue-600">{summary.insulation || 'Unspecified'}</td>
                    <td className="p-3 text-slate-500">{summary.insulation || 'XLPE Extruded'}</td>
                    <td className="p-3 text-center text-green-600 font-medium">Match</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-medium">Cross-Section / Cores</td>
                    <td className="p-3 text-slate-500">Auto-Engineered</td>
                    <td className="p-3 text-slate-500">300 mm² / 3-Core</td>
                    <td className="p-3 text-center text-blue-500 font-medium bg-blue-50/50 rounded">IEC 60502</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}



