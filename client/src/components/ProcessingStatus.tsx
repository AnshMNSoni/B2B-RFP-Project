import { CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  return (
    <Card data-testid="card-processing-status">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Processing Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-start gap-4"
              data-testid={`status-step-${step.id}`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.status === 'completed'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : step.status === 'processing'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : step.status === 'processing' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-0.5 h-8 mt-1 ${
                    step.status === 'completed' ? 'bg-green-300 dark:bg-green-700' : 'bg-border'
                  }`} />
                )}
              </div>
              <div className="flex-1 pb-2">
                <p className={`font-medium ${
                  step.status === 'pending' ? 'text-muted-foreground' : ''
                }`}>
                  {step.name}
                </p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
