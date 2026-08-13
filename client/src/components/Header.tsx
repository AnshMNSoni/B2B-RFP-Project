import { Zap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface HeaderProps {
  phase: 'input' | 'processing' | 'results';
  onNewRfp?: () => void;
}

export default function Header({ phase, onNewRfp }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl shadow-sm" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shadow-[0_4px_14px_0_rgba(37,99,235,0.15)]"
          >
            <Zap className="w-5 h-5 text-blue-600" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900" data-testid="text-app-title">
              RFP Agent AI
            </h1>
            <p className="text-sm font-medium text-slate-500">Automated B2B Quote Generation</p>
          </div>
        </div>

        {/* Phase 3 Action: Reset to New RFP */}
        {phase === 'results' && onNewRfp && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={onNewRfp}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-slate-200 transition-colors shadow-sm"
              data-testid="button-new-rfp"
            >
              <ArrowLeft className="w-4 h-4 mr-2 text-blue-600" />
              New RFP
            </Button>
          </motion.div>
        )}
      </div>
    </header>
  );
}


