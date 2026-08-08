import { Zap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  phase: 'input' | 'processing' | 'results';
  onNewRfp?: () => void;
}

export default function Header({ phase, onNewRfp }: HeaderProps) {
  return (
    <header className="w-full border-b border-[#2E3B52]/50 bg-[#0B0F17]/80 backdrop-blur-md" data-testid="header">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600/20 border border-indigo-500/40 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.25)]">
            <Zap className="w-4 h-4 text-[#6366F1]" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-[#F8FAFC]" data-testid="text-app-title">
              RFP Agent AI
            </h1>
            <p className="text-xs text-[#94A3B8]">Automated B2B Multi-Agent Quote Generation</p>
          </div>
        </div>

        {/* Phase 3 Action: Reset to New RFP */}
        {phase === 'results' && onNewRfp && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewRfp}
            className="text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1C2638] border border-[#2E3B52]/60 transition-colors"
            data-testid="button-new-rfp"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 text-[#6366F1]" />
            New RFP
          </Button>
        )}
      </div>
    </header>
  );
}


