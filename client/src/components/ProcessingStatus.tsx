import { Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
}

interface ProcessingStatusProps {
  steps: AgentStep[];
}

export default function ProcessingStatus({ steps }: ProcessingStatusProps) {
  const activeStep = steps.find(s => s.status === 'processing') || steps.filter(s => s.status === 'completed').pop() || steps[0];

  const getDynamicStatusText = () => {
    if (activeStep.id === 'sales' && activeStep.status === 'processing') return "Sales Agent active...";
    if (activeStep.id === 'technical' && activeStep.status === 'processing') return "Technical Agent active...";
    if (activeStep.id === 'pricing' && activeStep.status === 'processing') return "Finalizing quote...";
    return "Pipeline processing...";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-12 px-4 relative" 
      data-testid="card-processing-status"
    >
      {/* Low Opacity Breathing Radial Glow */}
      <div className="absolute inset-0 bg-blue-100/50 blur-3xl rounded-full pointer-events-none animate-pulse" />

      <div className="w-full relative z-10 bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-slate-100">
        {/* Vertical Pipeline Timeline */}
        <div className="relative pl-6 space-y-10">
          {/* Vertical Connecting Light Line */}
          <div className="absolute left-[24px] top-4 bottom-4 w-0.5 bg-slate-100" />
          <motion.div 
            className="absolute left-[24px] top-4 w-0.5 bg-blue-500 origin-top" 
            initial={{ height: "0%" }}
            animate={{
              height: steps[2].status === 'completed' ? '100%' : steps[1].status === 'completed' || steps[1].status === 'processing' ? '50%' : '15%'
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {steps.map((step, index) => {
            const isCompleted = step.status === 'completed';
            const isProcessing = step.status === 'processing';

            return (
              <motion.div 
                key={step.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative flex items-start gap-5" 
                data-testid={`status-step-${step.id}`}
              >
                {/* Circle Indicator */}
                <motion.div
                  animate={{
                    scale: isProcessing ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ repeat: isProcessing ? Infinity : 0, duration: 2 }}
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center -ml-[30px] transition-all duration-300 ${
                    isCompleted
                      ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                      : isProcessing
                      ? 'bg-white border-2 border-blue-500 text-blue-600 shadow-[0_0_16px_rgba(37,99,235,0.2)]'
                      : 'bg-slate-50 border border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                  )}
                </motion.div>

                {/* Text Labels */}
                <div className="space-y-1">
                  <h4 className={`text-sm font-semibold tracking-tight ${
                    isCompleted || isProcessing ? 'text-slate-900' : 'text-slate-400'
                  }`}>
                    {step.name}
                  </h4>
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={step.description}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={`text-xs ${
                        isProcessing ? 'text-blue-600 font-medium' : 'text-slate-500'
                      }`}
                    >
                      {step.description}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Status Text Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center pt-6 mt-6 border-t border-slate-100"
        >
          <p className="text-xs font-semibold text-slate-400 animate-pulse">
            {getDynamicStatusText()}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
