import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export default function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div 
      className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3"
      data-testid="error-message"
    >
      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
      <p className="text-sm text-destructive flex-1" data-testid="text-error">{message}</p>
      {onDismiss && (
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 -mt-1 -mr-1"
          onClick={onDismiss}
          data-testid="button-dismiss-error"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
