import { FileText, Zap, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface RFPInputPanelProps {
  rfpText: string;
  onRfpTextChange: (text: string) => void;
  onProcess: () => void;
  onLoadSample: () => void;
  isProcessing: boolean;
}

export default function RFPInputPanel({
  rfpText,
  onRfpTextChange,
  onProcess,
  onLoadSample,
  isProcessing
}: RFPInputPanelProps) {
  return (
    <Card data-testid="card-rfp-input">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="w-5 h-5 text-primary" />
          RFP Input
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLoadSample}
          data-testid="button-load-sample"
        >
          <Upload className="w-4 h-4 mr-2" />
          Load Sample
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={rfpText}
          onChange={(e) => onRfpTextChange(e.target.value)}
          placeholder="Paste your RFP text here or click 'Load Sample' to see an example..."
          className="h-64 font-mono text-sm resize-none"
          data-testid="input-rfp-text"
        />
        <Button
          onClick={onProcess}
          disabled={isProcessing || !rfpText.trim()}
          className="w-full h-12"
          data-testid="button-process-rfp"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Process RFP
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
