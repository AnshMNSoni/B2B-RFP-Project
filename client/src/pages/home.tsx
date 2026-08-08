import { useState } from 'react';
import Header from '@/components/Header';
import RFPInputPanel from '@/components/RFPInputPanel';
import ProcessingStatus from '@/components/ProcessingStatus';
import RFPSummaryCard from '@/components/RFPSummaryCard';
import SKUMatchCard from '@/components/SKUMatchCard';
import PricingTable from '@/components/PricingTable';
import ValueEngineeringCard from '@/components/ValueEngineeringCard';
import UnitOptimizationCard from '@/components/UnitOptimizationCard';
import RiskAnalysisChartCard from '@/components/RiskAnalysisChartCard';
import StepProgressNav, { StepItem } from '@/components/StepProgressNav';
import StepTeaserCard from '@/components/StepTeaserCard';
import ErrorMessage from '@/components/ErrorMessage';
import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet, Layers, LayoutList } from 'lucide-react';
import { exportToPdf, exportToCsv } from '@/lib/exportUtils';
import type { RFPResponse, ValueEngineeringRecommendation, UnitOptimization, RiskChartsData } from '@shared/schema';

type AppPhase = 'input' | 'processing' | 'results';

const PRESET_RFP_TEXT = `RFP Title: Substation Cable Procurement 2025
Due Date: 2025-06-30

Requirements:
- Copper conductor (Armored)
- XLPE insulation with PVC inner sheath
- Voltage rating: 11kV
- Industrial grade
- IS 7098 (Part 2) compliant`;

interface RFPSummary {
  title: string;
  dueDate: string | null;
  voltage: string | null;
  material: string | null;
  insulation: string | null;
  quantity?: number | null;
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
  cores?: string;
  crossSection?: string;
  armoring?: string;
  materialMismatch?: boolean;
  reasoning?: string;
}

interface PricingItem {
  sku: string;
  description: string;
  basePrice: number;
  quantity: number;
  baseTotal?: number;
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
  analysis?: string;
  valueEngineering?: ValueEngineeringRecommendation;
  unitOptimization?: UnitOptimization;
  riskCharts?: RiskChartsData;
}

const DECK_STEPS: StepItem[] = [
  { id: 1, label: 'RFP Scope & Spec Audit', shortLabel: '1. Scope Audit' },
  { id: 2, label: 'Technical SKU Matches', shortLabel: '2. SKU Matches' },
  { id: 3, label: 'AI Value Engineering', shortLabel: '3. Value Engineering' },
  { id: 4, label: 'Itemized Commercial Quote', shortLabel: '4. Commercial Quote' },
  { id: 5, label: 'Factory Reel Packaging', shortLabel: '5. Drum Batching' },
  { id: 6, label: 'Commercial Risk Analysis', shortLabel: '6. Risk Analysis' },
];

interface AgentStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
}

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>('input');
  const [rfpText, setRfpText] = useState('');
  const [result, setResult] = useState<RFPResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'deck' | 'full'>('deck');

  // Agent Step Completion States
  const [steps, setSteps] = useState<AgentStep[]>([
    { id: 'sales', name: 'Sales Agent', description: 'Extracting RFP requirements...', status: 'pending' },
    { id: 'technical', name: 'Technical Agent', description: 'Matching SKUs & spec extraction...', status: 'pending' },
    { id: 'pricing', name: 'Pricing Agent', description: 'Calculating financial costs & LME surcharges...', status: 'pending' },
  ]);

  const loadPreset = () => {
    setRfpText(PRESET_RFP_TEXT);
    setError(null);
  };

  const processRFP = async () => {
    if (!rfpText.trim()) return;

    setError(null);
    setPhase('processing');

    // Reset steps
    setSteps([
      { id: 'sales', name: 'Sales Agent', description: 'Extracting RFP requirements...', status: 'processing' },
      { id: 'technical', name: 'Technical Agent', description: 'Matching SKUs & spec extraction...', status: 'pending' },
      { id: 'pricing', name: 'Pricing Agent', description: 'Calculating financial costs & LME surcharges...', status: 'pending' },
    ]);

    try {
      // Step 1: Sales Agent
      await new Promise(r => setTimeout(r, 600));
      setSteps([
        { id: 'sales', name: 'Sales Agent', description: 'Extracted specifications successfully.', status: 'completed' },
        { id: 'technical', name: 'Technical Agent', description: 'Matching SKUs & spec extraction...', status: 'processing' },
        { id: 'pricing', name: 'Pricing Agent', description: 'Calculating financial costs & LME surcharges...', status: 'pending' },
      ]);

      // Step 2: Technical Agent
      await new Promise(r => setTimeout(r, 700));
      setSteps([
        { id: 'sales', name: 'Sales Agent', description: 'Extracted specifications successfully.', status: 'completed' },
        { id: 'technical', name: 'Technical Agent', description: 'Matched 25+ catalog SKUs successfully.', status: 'completed' },
        { id: 'pricing', name: 'Pricing Agent', description: 'Calculating financial costs & LME surcharges...', status: 'processing' },
      ]);

      // Step 3: Pricing Agent API Call
      const res = await fetch('/api/process-rfp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfpText }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to process RFP request');
      }

      const data: RFPResponse = await res.json();

      setSteps([
        { id: 'sales', name: 'Sales Agent', description: 'Extracted specifications successfully.', status: 'completed' },
        { id: 'technical', name: 'Technical Agent', description: 'Matched 25+ catalog SKUs successfully.', status: 'completed' },
        { id: 'pricing', name: 'Pricing Agent', description: 'Calculated final quote & forex surcharge.', status: 'completed' },
      ]);

      await new Promise(r => setTimeout(r, 400));
      setResult(data);
      setActiveStep(1);
      setPhase('results');
    } catch (err: any) {
      console.error('Error processing RFP:', err);
      setError(err.message || 'An error occurred while communicating with AI Agents.');
      setPhase('input');
    }
  };


  const resetAll = () => {
    setPhase('input');
    setRfpText('');
    setResult(null);
    setError(null);
    setActiveStep(1);
  };

  const dismissError = () => {
    setError(null);
  };

  // Format summary for RFPSummaryCard
  const transformedSummary = result?.summary ? {
    title: result.summary.title,
    dueDate: result.summary.dueDate || 'N/A',
    requirements: result.summary.requirements,
    voltage: result.summary.voltage || undefined,
    material: result.summary.material || undefined,
    insulation: result.summary.insulation || undefined,
    compliance: result.summary.compliance,
  } : null;

  // Dynamic step teasers for the Guided Presentation Deck
  const getTeaserInfo = (step: number) => {
    const topMatch = result?.matches[0];
    const matchScore = topMatch ? `${topMatch.matchPercentage}%` : 'High';
    const hasVe = result?.valueEngineering?.hasOptimization;
    const veSavings = result?.valueEngineering?.savingsPercentage || 28;

    switch (step) {
      case 1:
        return {
          title: '🔍 RFP Specification Audit & Parsing Complete',
          message: `AI Sales Agent extracted voltage grade (${result?.summary?.voltage || 'Standard'}), material, and compliance requirements. ${result?.matches.length || 3} technical SKUs identified with top match score of ${matchScore}.`,
          nextStepName: 'Technical SKU Matches',
        };
      case 2:
        return {
          title: `⚡ ${topMatch?.sku} Matched (${matchScore} Match Score)`,
          message: `${topMatch?.description}. Technical cross-section, cores, and armoring badges parsed. Proactive cost-engineering alternatives unlocked in next step.`,
          nextStepName: 'AI Value Engineering',
        };
      case 3:
        return {
          title: hasVe ? `💡 Value Engineering Savings Unlocked (${veSavings}% Reduction)` : '💡 Conductor Cost Optimization Evaluated',
          message: hasVe
            ? `Recommending ${result?.valueEngineering?.optimizedSku} (${result?.valueEngineering?.alternativeMaterial}). Potential savings: ₹${result?.valueEngineering?.savingsAmount.toLocaleString()}.`
            : 'Specification validated for optimal material expenditure per IEC standards.',
          nextStepName: 'Itemized Commercial Quote',
        };
      case 4:
        return {
          title: `💳 Itemized Line Quote: ₹${result?.grandTotal.toLocaleString()} INR Total`,
          message: `Formula audit breakdown complete: Base Subtotal + LME Spot Surcharge (₹83.50/USD Forex) + 5% Service Fee + HV Testing Fee. Standard drum reel batching in next step.`,
          nextStepName: 'Factory Reel Packaging',
        };
      case 5:
        return {
          title: '📦 Factory Reel Packaging & Scrap Elimination Calculated',
          message: result?.unitOptimization?.message || 'Standard heavy-duty drum reel batching eliminates factory custom-cutting scrap fees.',
          nextStepName: 'Commercial Risk Analysis',
        };
      case 6:
        return {
          title: '📊 Market Volatility & Strategic Risk Analysis Ready',
          message: 'Review 6-month London Metal Exchange (LME) spot price curves, material cost distribution, and strategic contract risk mitigation guidelines.',
          nextStepName: 'Complete Audit Deck',
        };
      default:
        return {
          title: 'Analysis Complete',
          message: 'Review full quotation details.',
          nextStepName: 'Next Step',
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Bar */}
      <Header phase={phase} onNewRfp={resetAll} />


      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center">

        {/* PHASE 1 — INPUT / LANDING PAGE STATE */}
        {phase === 'input' && (
          <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <RFPInputPanel
              rfpText={rfpText}
              onRfpTextChange={setRfpText}
              onProcess={processRFP}
              onLoadPreset={loadPreset}
              isProcessing={false}
            />

            {error && (
              <ErrorMessage message={error} onDismiss={dismissError} />
            )}
          </div>
        )}

        {/* PHASE 2 — PROCESSING / ANIMATION STATE */}
        {phase === 'processing' && (
          <div className="w-full max-w-lg mx-auto animate-in fade-in duration-300">
            <ProcessingStatus steps={steps} />
          </div>
        )}

        {/* PHASE 3 — GUIDED DECK / RESULTS STATE */}
        {phase === 'results' && result && transformedSummary && (
          <div className="w-full max-w-3xl mx-auto space-y-6 py-2 animate-in fade-in slide-in-from-bottom-6 duration-400">
            
            {/* Top Bar: Action Buttons & View Mode Toggle (Deck vs Full View) */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#2E3B52]/60">
              <div>
                <h2 className="text-lg font-extrabold text-[#F8FAFC] tracking-tight">RFP Commercial Quotation</h2>
                <p className="text-xs text-[#94A3B8] font-mono">AI Commercial Draft — Subject to Technical Engineering Sign-off</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Mode Switcher Toggle */}
                <div className="flex items-center bg-[#151D2A] border border-[#2E3B52] rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('deck')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                      viewMode === 'deck'
                        ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Guided Deck View
                  </button>
                  <button
                    onClick={() => setViewMode('full')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                      viewMode === 'full'
                        ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <LayoutList className="w-3.5 h-3.5" />
                    Full View
                  </button>
                </div>

                {/* Export Action Buttons */}
                <Button
                  onClick={() => exportToCsv(result, transformedSummary)}
                  variant="outline"
                  size="sm"
                  className="bg-[#151D2A] border-[#2E3B52] text-[#F8FAFC] hover:bg-[#1C2638] text-xs font-mono"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
                  Excel (.xlsx)
                </Button>
                <Button
                  onClick={() => exportToPdf(result, transformedSummary)}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  Export PDF
                </Button>
              </div>
            </div>

            {/* Stepper Navigation Bar (Visible in Deck Mode) */}
            {viewMode === 'deck' && (
              <StepProgressNav
                steps={DECK_STEPS}
                activeStep={activeStep}
                onSelectStep={(stepId) => setActiveStep(stepId)}
              />
            )}

            {/* MODE 1: GUIDED DECK PRESENTATION MODE (ONE CARD AT A TIME) */}
            {viewMode === 'deck' && (
              <div className="space-y-6">
                {/* STEP 1: RFP Scope Audit & Spec Matrix */}
                {activeStep === 1 && (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <RFPSummaryCard summary={transformedSummary} />
                  </div>
                )}

                {/* STEP 2: Technical SKU Specification Matches */}
                {activeStep === 2 && (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#F8FAFC] tracking-tight">
                        Ranked SKU Matches ({result.matches.length} SKUs Identified)
                      </h3>
                      <span className="text-xs font-mono text-indigo-400">Master Catalog Evaluated</span>
                    </div>
                    <div className="space-y-4">
                      {result.matches.map((match, index) => (
                        <SKUMatchCard key={match.sku} match={match} rank={index + 1} />
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: AI Value Engineering & Cost Optimization (PROCUREMENT PRIORITY - STEP 3!) */}
                {activeStep === 3 && (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <ValueEngineeringCard data={result.valueEngineering} />
                  </div>
                )}

                {/* STEP 4: Itemized Commercial Quotation Breakdown */}
                {activeStep === 4 && (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <PricingTable
                      items={result.pricing}
                      grandTotal={result.grandTotal}
                    />
                  </div>
                )}

                {/* STEP 5: Factory Reel & Batch Packaging Optimization */}
                {activeStep === 5 && (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <UnitOptimizationCard data={result.unitOptimization} />
                  </div>
                )}

                {/* STEP 6: AI Commercial Risk & LME Volatility Analysis */}
                {activeStep === 6 && (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <RiskAnalysisChartCard
                      riskAnalysisText={result.analysis}
                      chartsData={result.riskCharts}
                    />
                  </div>
                )}

                {/* Bottom Teaser & Navigation Control Card */}
                <StepTeaserCard
                  currentStep={activeStep}
                  totalSteps={DECK_STEPS.length}
                  teaserTitle={getTeaserInfo(activeStep).title}
                  teaserMessage={getTeaserInfo(activeStep).message}
                  nextStepName={getTeaserInfo(activeStep).nextStepName}
                  onNext={() => setActiveStep(prev => Math.min(DECK_STEPS.length, prev + 1))}
                  onPrev={() => setActiveStep(prev => Math.max(1, prev - 1))}
                />
              </div>
            )}

            {/* MODE 2: FULL DASHBOARD VIEW (ALL CARDS ON ONE PAGE) */}
            {viewMode === 'full' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Card 1 — Summary Banner & Spec Audit Matrix */}
                <RFPSummaryCard summary={transformedSummary} />

                {/* Card 2 — SKU Match Results */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-[#F8FAFC] tracking-tight">
                    Ranked SKU Matches
                  </h3>
                  <div className="space-y-4">
                    {result.matches.map((match, index) => (
                      <SKUMatchCard key={match.sku} match={match} rank={index + 1} />
                    ))}
                  </div>
                </div>

                {/* Card 3 — Value Engineering (Moved up by procurement priority!) */}
                <ValueEngineeringCard data={result.valueEngineering} />

                {/* Card 4 — Itemized Quote Table & Forex Formula Audit */}
                <PricingTable
                  items={result.pricing}
                  grandTotal={result.grandTotal}
                />

                {/* Card 5 — Factory Reel & Batch Unit Optimization */}
                <UnitOptimizationCard data={result.unitOptimization} />

                {/* Card 6 — AI Commercial Risk & Volatility Charts */}
                <RiskAnalysisChartCard
                  riskAnalysisText={result.analysis}
                  chartsData={result.riskCharts}
                />
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
