import { Check } from 'lucide-react';

export interface StepItem {
  id: number;
  label: string;
  shortLabel: string;
}

interface StepProgressNavProps {
  steps: StepItem[];
  activeStep: number;
  onSelectStep: (stepId: number) => void;
}

export default function StepProgressNav({ steps, activeStep, onSelectStep }: StepProgressNavProps) {
  return (
    <div className="w-full bg-[#151D2A] border border-[#2E3B52]/80 rounded-2xl p-3 shadow-xl overflow-x-auto">
      <div className="flex items-center justify-between min-w-[600px] gap-2">
        {steps.map((step, idx) => {
          const isCompleted = step.id < activeStep;
          const isActive = step.id === activeStep;

          return (
            <div key={step.id} className="flex items-center flex-1 gap-2">
              <button
                onClick={() => onSelectStep(step.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-[0_0_14px_rgba(99,102,241,0.45)] border border-indigo-400'
                    : isCompleted
                    ? 'bg-[#1C2638] text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60'
                    : 'bg-[#1C2638]/60 text-[#94A3B8] border border-[#2E3B52]/40 hover:text-[#F8FAFC] hover:border-[#2E3B52]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-white text-indigo-700'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-[#151D2A] text-[#94A3B8]'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : step.id}
                </span>
                <span className="truncate">{step.shortLabel}</span>
              </button>

              {idx < steps.length - 1 && (
                <div className={`h-[2px] flex-1 rounded-full ${isCompleted ? 'bg-emerald-500/50' : 'bg-[#2E3B52]/40'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
