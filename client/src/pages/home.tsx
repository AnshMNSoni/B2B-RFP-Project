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

// todo: remove mock functionality - sample RFP data
const SAMPLE_RFP = `RFP Title: Supply of Industrial Power Cables
Due Date: 2025-03-15

Requirements:
- Copper conductor
- XLPE insulation
- Voltage rating: 11kV
- Industrial grade
- IS compliant`;

// todo: remove mock functionality - mock result data
const mockResult = {
  summary: {
    title: 'Supply of Industrial Power Cables',
    dueDate: '2025-03-15',
    voltage: '11kV',
    material: 'Copper',
    insulation: 'XLPE',
    compliance: ['IS Compliant', 'Industrial Grade'],
    requirements: [
      'Copper conductor material',
      'XLPE insulation type',
      'Voltage rating: 11kV',
      'Industrial grade specifications'
    ]
  },
  matches: [
    {
      sku: 'CAB-11KV-CU-XLPE',
      description: '11kV Copper XLPE insulated industrial cable',
      matchPercentage: 100,
      voltage: '11kV',
      material: 'Copper',
      insulation: 'XLPE',
      basePrice: 1200
    },
    {
      sku: 'CAB-11KV-CU-PVC',
      description: '11kV Copper PVC insulated cable',
      matchPercentage: 70,
      voltage: '11kV',
      material: 'Copper',
      insulation: 'PVC',
      basePrice: 1000
    },
    {
      sku: 'CAB-6.6KV-AL-PVC',
      description: '6.6kV Aluminium PVC cable',
      matchPercentage: 40,
      voltage: '6.6kV',
      material: 'Aluminium',
      insulation: 'PVC',
      basePrice: 700
    }
  ],
  pricing: [
    {
      sku: 'CAB-11KV-CU-XLPE',
      description: '11kV Copper XLPE insulated industrial cable',
      basePrice: 1200,
      quantity: 100,
      materialCost: 80000,
      serviceCost: 5000,
      testingCost: 2500,
      totalCost: 207500
    }
  ],
  grandTotal: 207500
};

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
  const [result, setResult] = useState<typeof mockResult | null>(null);
  const [steps, setSteps] = useState<AgentStep[]>([
    { id: 'sales', name: 'Sales Agent', description: 'Extracting and summarizing RFP requirements', status: 'pending' },
    { id: 'technical', name: 'Technical Agent', description: 'Matching specifications with SKU catalog', status: 'pending' },
    { id: 'pricing', name: 'Pricing Agent', description: 'Generating cost estimates', status: 'pending' }
  ]);

  const loadSampleRFP = useCallback(() => {
    setRfpText(SAMPLE_RFP);
    setError(null);
  }, []);

  // todo: remove mock functionality - simulate processing
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

    // Simulate Sales Agent processing
    setSteps(prev => prev.map(s => 
      s.id === 'sales' ? { ...s, status: 'processing' as const } : s
    ));
    await new Promise(r => setTimeout(r, 1500));
    setSteps(prev => prev.map(s => 
      s.id === 'sales' ? { ...s, status: 'completed' as const } : s
    ));

    // Simulate Technical Agent processing
    setSteps(prev => prev.map(s => 
      s.id === 'technical' ? { ...s, status: 'processing' as const } : s
    ));
    await new Promise(r => setTimeout(r, 1500));
    setSteps(prev => prev.map(s => 
      s.id === 'technical' ? { ...s, status: 'completed' as const } : s
    ));

    // Simulate Pricing Agent processing
    setSteps(prev => prev.map(s => 
      s.id === 'pricing' ? { ...s, status: 'processing' as const } : s
    ));
    await new Promise(r => setTimeout(r, 1000));
    setSteps(prev => prev.map(s => 
      s.id === 'pricing' ? { ...s, status: 'completed' as const } : s
    ));

    // Set result
    setResult(mockResult);
    setIsProcessing(false);
  }, [rfpText]);

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

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

            {result && (
              <>
                <RFPSummaryCard summary={result.summary} />
                
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
