import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="w-full border border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden" data-testid="card-rfp-input">
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Load Sample Presets & File Upload Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 mr-1 uppercase tracking-wider">Load Sample:</span>
              {PRESETS.map((preset, i) => (
                <motion.div key={preset.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadStatus(null);
                      setUploadError(null);
                      onLoadPreset(preset.text);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-all shadow-sm"
                  >
                    {preset.name}
                  </button>
                </motion.div>
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
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="h-8 text-xs font-medium text-slate-700 bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 shadow-sm transition-all"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-blue-600" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                      Upload File (PDF, DOCX, XLSX)
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>


          {/* Upload Status Badge */}
          <AnimatePresence>
            {uploadStatus && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs font-medium text-blue-800"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate">Uploaded & Extracted: <strong>{uploadStatus.filename}</strong> ({uploadStatus.fileType})</span>
              </motion.div>
            )}

            {/* Upload Error Badge */}
            {uploadError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-800"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{uploadError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Textarea Drop Zone */}
          <motion.div
            animate={{ scale: isDragging ? 1.01 : 1 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-xl transition-all duration-300 ${
              isDragging ? 'ring-2 ring-blue-500 bg-blue-50/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : ''
            }`}
          >
            <AnimatePresence>
              {isDragging && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm border-2 border-dashed border-blue-400 rounded-xl flex items-center justify-center text-center p-4"
                >
                  <div className="space-y-2">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <FileText className="w-10 h-10 text-blue-500 mx-auto" />
                    </motion.div>
                    <p className="text-sm font-semibold text-slate-800">Drop RFP document here to extract</p>
                    <p className="text-xs font-medium text-slate-500">Supports PDF, Word, Excel, and Text files</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Textarea
              value={rfpText}
              onChange={(e) => onRfpTextChange(e.target.value)}
              placeholder="Paste your RFP text here, select a preset, or drag & drop a PDF / Word / Excel document..."
              className="h-64 font-mono text-sm leading-relaxed bg-slate-50/50 border border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 text-slate-800 placeholder:text-slate-400 rounded-xl resize-none p-5 transition-all shadow-inner"
              data-testid="input-rfp-text"
            />
          </motion.div>

          {/* Process RFP Button */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onProcess}
              disabled={isProcessing || isUploading || !rfpText.trim()}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] border-none transition-all"
              data-testid="button-process-rfp"
            >
              Process RFP with AI
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}



