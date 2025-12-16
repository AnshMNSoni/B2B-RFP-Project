import { FileSearch } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({ 
  title = 'No Results Yet',
  description = 'Enter your RFP text and click "Process RFP" to get started.'
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center" data-testid="empty-state">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <FileSearch className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2" data-testid="text-empty-title">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm" data-testid="text-empty-description">
        {description}
      </p>
    </div>
  );
}
