import { Check, Loader2 } from 'lucide-react';

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
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-12 px-4 relative" data-testid="card-processing-status">
      {/* Low Opacity Breathing Radial Glow */}
      <div className="absolute inset-0 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none animate-pulse" />

      <div className="w-full relative z-10 space-y-8">
        {/* Vertical Pipeline Timeline */}
        <div className="relative pl-6 space-y-10">
          {/* Vertical Connecting Indigo Line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-[#2E3B52]" />
          <div 
            className="absolute left-[19px] top-4 w-0.5 bg-[#6366F1] transition-all duration-500 ease-out" 
            style={{
              height: steps[2].status === 'completed' ? '85%' : steps[1].status === 'completed' || steps[1].status === 'processing' ? '50%' : '15%'
            }}
          />

          {steps.map((step) => {
            const isCompleted = step.status === 'completed';
            const isProcessing = step.status === 'processing';

            return (
              <div key={step.id} className="relative flex items-start gap-4" data-testid={`status-step-${step.id}`}>
                {/* Circle Indicator */}
                <div
                  className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center -ml-6 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#6366F1] text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                      : isProcessing
                      ? 'bg-[#1C2638] border-2 border-[#6366F1] text-[#6366F1] shadow-[0_0_16px_rgba(99,102,241,0.4)]'
                      : 'bg-[#151D2A] border border-[#2E3B52] text-[#94A3B8]'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : isProcessing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-[#2E3B52]" />
                  )}
                </div>

                {/* Text Labels */}
                <div className="space-y-0.5">
                  <h4 className={`text-sm font-semibold tracking-tight ${
                    isCompleted || isProcessing ? 'text-[#F8FAFC]' : 'text-[#94A3B8]/60'
                  }`}>
                    {step.name}
                  </h4>
                  <p className={`text-xs ${
                    isProcessing ? 'text-indigo-300 font-mono' : 'text-[#94A3B8]'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Status Text Footer */}
        <div className="text-center pt-4 border-t border-[#2E3B52]/40">
          <p className="text-xs font-mono text-[#94A3B8] animate-pulse">
            {getDynamicStatusText()}
          </p>
        </div>
      </div>
    </div>
  );
}
