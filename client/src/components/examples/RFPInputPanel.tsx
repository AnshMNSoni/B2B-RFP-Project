import { useState } from 'react';
import RFPInputPanel from '../RFPInputPanel';

export default function RFPInputPanelExample() {
  const [rfpText, setRfpText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = () => {
    setIsProcessing(true);
    console.log('Processing RFP:', rfpText);
    setTimeout(() => setIsProcessing(false), 2000);
  };

  const handleLoadSample = () => {
    setRfpText(`RFP Title: Supply of Industrial Power Cables
Due Date: 2025-03-15

Requirements:
- Copper conductor
- XLPE insulation
- Voltage rating: 11kV
- Industrial grade
- IS compliant`);
  };

  return (
    <RFPInputPanel
      rfpText={rfpText}
      onRfpTextChange={setRfpText}
      onProcess={handleProcess}
      onLoadSample={handleLoadSample}
      isProcessing={isProcessing}
    />
  );
}
