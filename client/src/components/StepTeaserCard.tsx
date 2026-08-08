import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface StepTeaserCardProps {
  currentStep: number;
  totalSteps: number;
  teaserTitle: string;
  teaserMessage: string;
  nextStepName: string;
  onNext: () => void;
  onPrev: () => void;
}

export default function StepTeaserCard({
  currentStep,
  totalSteps,
  teaserTitle,
  teaserMessage,
  nextStepName,
  onNext,
  onPrev,
}: StepTeaserCardProps) {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="w-full bg-[#151D2A] border border-[#6366F1]/40 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-300">
      <div className="flex items-start gap-3.5">
        <div className="w-8 h-8 bg-indigo-600/20 border border-indigo-500/40 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(99,102,241,0.3)]">
          <Sparkles className="w-4 h-4 text-[#6366F1]" />
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-[#6366F1] uppercase tracking-wider">
              Step {currentStep} of {totalSteps} Insights
            </span>
            <span className="text-xs font-mono text-[#94A3B8]">
              {isLastStep ? 'Final Step Reached' : `Up Next: ${nextStepName}`}
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#F8FAFC] tracking-tight">{teaserTitle}</h4>
          <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">{teaserMessage}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#2E3B52]/60">
        <Button
          onClick={onPrev}
          disabled={currentStep === 1}
          variant="outline"
          size="sm"
          className="bg-[#1C2638] border-[#2E3B52] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151D2A] text-xs font-mono disabled:opacity-40"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Previous Step
        </Button>

        {!isLastStep && (
          <Button
            onClick={onNext}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold shadow-[0_0_14px_rgba(99,102,241,0.4)]"
          >
            Continue to {nextStepName}
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
