import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import RFPInputPanel from '@/components/RFPInputPanel';
import ProcessingStatus from '@/components/ProcessingStatus';
import RFPSummaryCard from '@/components/RFPSummaryCard';
import SKUMatchCard from '@/components/SKUMatchCard';
import PricingTable from '@/components/PricingTable';
import HowItWorks from '@/components/HowItWorks';
import ErrorMessage from '@/components/ErrorMessage';
import EmptyState from '@/components/EmptyState';
import { apiRequest } from '@/lib/queryClient';

const SAMPLE_RFP = `RFP Title: Supply of Industrial Power Cables
Due Date: 2025-03-15

Requirements:
- Copper conductor
- XLPE insulation
- Voltage rating: 11kV
- Industrial grade
- IS compliant`;

interface RFPSummary {
  title: string;
  dueDate: string | null;
  voltage: string | null;
  material: string | null;
  insulation: string | null;
  compliance: string[];
  requirements: string[];
}

interface SKUMatch {
  sku: string;
  description: string;
  matchPercentage: number;
  voltage: string;
  material: string;
  insulation: string;
  basePrice: number;
}

interface PricingItem {
  sku: string;
  description: string;
  basePrice: number;
  quantity: number;
  materialCost: number;
  serviceCost: number;
  testingCost: number;
  totalCost: number;
}

interface RFPResult {
  success: boolean;
  summary: RFPSummary;
  matches: SKUMatch[];
  pricing: PricingItem[];
  grandTotal: number;
}

interface AgentStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
}

export default function Home() {
  const [rfpText, setRfpText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RFPResult | null>(null);
  const [steps, setSteps] = useState<AgentStep[]>([
    { id: 'sales', name: 'Sales Agent', description: 'Extracting and summarizing RFP requirements', status: 'pending' },
    { id: 'technical', name: 'Technical Agent', description: 'Matching specifications with SKU catalog', status: 'pending' },
    { id: 'pricing', name: 'Pricing Agent', description: 'Generating cost estimates', status: 'pending' }
  ]);

  const loadSampleRFP = useCallback(() => {
    setRfpText(SAMPLE_RFP);
    setError(null);
  }, []);

  const processRFP = useCallback(async () => {
    if (!rfpText.trim()) {
      setError('Please enter RFP text');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);
    
    // Reset steps
    setSteps(prev => prev.map(s => ({ ...s, status: 'pending' as const })));

    // Animate Sales Agent
    setSteps(prev => prev.map(s => 
      s.id === 'sales' ? { ...s, status: 'processing' as const } : s
    ));

    try {
      // Call the real API
      const response = await apiRequest('POST', '/api/process-rfp', { rfpText });
      const data: RFPResult = await response.json();

      // Animate through remaining steps quickly for visual feedback
      setSteps(prev => prev.map(s => 
        s.id === 'sales' ? { ...s, status: 'completed' as const } : s
      ));
      
      await new Promise(r => setTimeout(r, 300));
      setSteps(prev => prev.map(s => 
        s.id === 'technical' ? { ...s, status: 'processing' as const } : s
      ));
      
      await new Promise(r => setTimeout(r, 300));
      setSteps(prev => prev.map(s => 
        s.id === 'technical' ? { ...s, status: 'completed' as const } : s
      ));
      
      await new Promise(r => setTimeout(r, 300));
      setSteps(prev => prev.map(s => 
        s.id === 'pricing' ? { ...s, status: 'processing' as const } : s
      ));
      
      await new Promise(r => setTimeout(r, 300));
      setSteps(prev => prev.map(s => 
        s.id === 'pricing' ? { ...s, status: 'completed' as const } : s
      ));

      if (data.success) {
        setResult(data);
      } else {
        setError('Failed to process RFP');
      }
    } catch (err) {
      console.error('RFP processing error:', err);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [rfpText]);

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  // Transform summary for component
  const transformedSummary = result?.summary ? {
    title: result.summary.title,
    dueDate: result.summary.dueDate || 'Not specified',
    voltage: result.summary.voltage || undefined,
    material: result.summary.material || undefined,
    insulation: result.summary.insulation || undefined,
    compliance: result.summary.compliance,
    requirements: result.summary.requirements
  } : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Panel - Input */}
          <div className="lg:col-span-2 space-y-6">
            <RFPInputPanel
              rfpText={rfpText}
              onRfpTextChange={setRfpText}
              onProcess={processRFP}
              onLoadSample={loadSampleRFP}
              isProcessing={isProcessing}
            />

            {error && (
              <ErrorMessage message={error} onDismiss={dismissError} />
            )}

            {isProcessing && (
              <ProcessingStatus steps={steps} />
            )}

            <HowItWorks />
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-3 space-y-6">
            {!result && !isProcessing && (
              <EmptyState />
            )}

            {result && transformedSummary && (
              <>
                <RFPSummaryCard summary={transformedSummary} />
                
                <div>
                  <h2 className="text-lg font-semibold mb-4">Top SKU Matches</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {result.matches.map((match, index) => (
                      <SKUMatchCard key={match.sku} match={match} rank={index + 1} />
                    ))}
                  </div>
                </div>

                <PricingTable items={result.pricing} grandTotal={result.grandTotal} />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
