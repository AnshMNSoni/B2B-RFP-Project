import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface RFPInputPanelProps {
  rfpText: string;
  onRfpTextChange: (text: string) => void;
  onProcess: () => void;
  onLoadPreset: (presetText: string) => void;
  isProcessing: boolean;
}

const PRESETS = [
  {
    name: "11kV Industrial Power",
    text: `RFP Title: Supply of Industrial Power Cables
Due Date: 2025-06-30

Requirements:
- Copper conductor (Armored)
- XLPE insulation with PVC inner sheath
- Voltage rating: 11kV
- Industrial grade
- IS 7098 (Part 2) compliant`
  },
  {
    name: "33kV Substation Cable",
    text: `RFP Title: Substation Transmission Cables Supply
Due Date: 2025-08-15

Requirements:
- Aluminium conductor
- XLPE insulation
- Voltage rating: 33kV
- Heavy duty armor protection
- IEC 60502 standard compliance`
  },
  {
    name: "132kV Submarine Cable",
    text: `RFP Title: 132kV Extra High Voltage Sub-Sea Marine Armored Fiber Cable
Due Date: 2025-11-30

Requirements:
- Voltage Rating: 132kV Extra High Voltage (EHV Submarine Grade)
- Conductor Material: Copper-Lead Alloy Composite Core
- Insulation: Wet-curable Synthetic Rubber Submarine Grade
- Integrated Elements: 48-Core Single Mode Optical Fiber Sub-unit
- Sheathing: Extruded Continuous Lead Alloy Sheath + Double Wire Armor
- Standard Compliance: CIGRE 623 & IEC 60840 Subsea Grade`
  }
];

export default function RFPInputPanel({
  rfpText,
  onRfpTextChange,
  onProcess,
  onLoadPreset,
  isProcessing
}: RFPInputPanelProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ filename: string; fileType: string } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/parse-document", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to parse document");
      }

      onRfpTextChange(data.text);
      setUploadStatus({
        filename: data.filename,
        fileType: data.fileType
      });
    } catch (err: any) {
      console.error("File upload error:", err);
      setUploadError(err.message || "Failed to upload and parse file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <Card className="w-full border border-[#2E3B52] bg-[#1C2638] shadow-2xl rounded-2xl overflow-hidden" data-testid="card-rfp-input">
      <CardContent className="p-6 md:p-8 space-y-6">
        {/* Load Sample Presets & File Upload Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2E3B52]/60 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-[#94A3B8] mr-1">Load Sample:</span>
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  setUploadStatus(null);
                  setUploadError(null);
                  onLoadPreset(preset.text);
                }}
                className="px-3 py-1.5 text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC] bg-[#151D2A] hover:bg-[#151D2A]/80 border border-[#2E3B52] hover:border-[#6366F1]/60 rounded-lg transition-all"
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Upload Button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
              accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.txt"
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="h-8 text-xs font-mono text-[#F8FAFC] bg-[#151D2A] border-[#2E3B52] hover:border-[#6366F1]/60 hover:bg-[#151D2A]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-[#6366F1]" />
                  Extracting...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 mr-1.5 text-[#6366F1]" />
                  Upload File (PDF, DOCX, XLSX)
                </>
              )}
            </Button>
          </div>
        </div>


        {/* Upload Status Badge */}
        {uploadStatus && (
          <div className="flex items-center gap-2 p-2.5 bg-[#151D2A] border border-[#6366F1]/40 rounded-xl text-xs font-mono text-indigo-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#6366F1] shrink-0" />
            <span className="truncate">Uploaded & Extracted: <strong>{uploadStatus.filename}</strong> ({uploadStatus.fileType})</span>
          </div>
        )}

        {/* Upload Error Badge */}
        {uploadError && (
          <div className="flex items-center gap-2 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-mono text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Textarea Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-xl transition-all ${
            isDragging ? 'ring-2 ring-[#6366F1] bg-[#6366F1]/5' : ''
          }`}
        >
          {isDragging && (
            <div className="absolute inset-0 z-20 bg-[#1C2638]/90 border-2 border-dashed border-[#6366F1] rounded-xl flex items-center justify-center text-center p-4">
              <div className="space-y-1">
                <FileText className="w-8 h-8 text-[#6366F1] mx-auto animate-bounce" />
                <p className="text-sm font-semibold text-[#F8FAFC]">Drop RFP document here to extract</p>
                <p className="text-xs font-mono text-[#94A3B8]">Supports PDF, Word, Excel, and Text files</p>
              </div>
            </div>
          )}

          <Textarea
            value={rfpText}
            onChange={(e) => onRfpTextChange(e.target.value)}
            placeholder="Paste your RFP text here, select a preset, or drag & drop a PDF / Word / Excel document..."
            className="h-64 font-mono text-xs leading-relaxed bg-[#0B0F17]/70 border border-[#2E3B52]/80 focus:border-[#6366F1] focus:ring-0 text-[#F8FAFC] placeholder:text-[#94A3B8]/60 rounded-xl resize-none p-4"
            data-testid="input-rfp-text"
          />
        </div>

        {/* Process RFP Button */}
        <Button
          onClick={onProcess}
          disabled={isProcessing || isUploading || !rfpText.trim()}
          className="w-full h-12 bg-[#6366F1] hover:bg-[#6366F1]/90 text-white font-medium text-sm rounded-xl cta-indigo-glow border border-indigo-400/20"
          data-testid="button-process-rfp"
        >
          Process RFP with AI
        </Button>
      </CardContent>
    </Card>
  );
}



