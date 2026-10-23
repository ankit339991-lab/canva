import React, { useState } from 'react';
import { X, Download, FileImage, FileText, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import Konva from 'konva';
import { useEditorStore } from '../../store/useEditorStore';

interface ExportModalProps {
  stage: Konva.Stage | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({ stage }) => {
  const { document, isExportModalOpen, setIsExportModalOpen } = useEditorStore();

  const [format, setFormat] = useState<'png' | 'jpeg' | 'pdf'>('png');
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(1);
  const [quality, setQuality] = useState<number>(92);
  const [transparentBg, setTransparentBg] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isExportModalOpen) return null;

  const handleDownload = async () => {
    if (!stage) {
      alert('Editor canvas is not initialized yet.');
      return;
    }

    setIsExporting(true);
    setIsCompleted(false);

    try {
      const sanitizedTitle = document.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'lumina-design';

      // 1. Temporarily deselect transformer handles so they don't appear in the download
      const originalSelectedId = useEditorStore.getState().selectedId;
      useEditorStore.getState().setSelectedId(null);

      // Allow Konva to redraw without transformer
      await new Promise((r) => setTimeout(r, 60));

      const { width, height } = document.dimensions;

      // Handle PDF Export
      if (format === 'pdf') {
        const orientation = width > height ? 'landscape' : 'portrait';
        const pdf = new jsPDF({
          orientation,
          unit: 'px',
          format: [width, height]
        });

        // Capture current stage
        const dataUrl = stage.toDataURL({
          pixelRatio: scaleMultiplier,
          mimeType: 'image/jpeg',
          quality: 0.95
        });

        pdf.addImage(dataUrl, 'JPEG', 0, 0, width, height);
        pdf.save(`${sanitizedTitle}.pdf`);
      } else {
        // PNG or JPEG Export
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const dataUrl = stage.toDataURL({
          pixelRatio: scaleMultiplier,
          mimeType,
          quality: format === 'jpeg' ? quality / 100 : undefined
        });

        // Trigger native download
        const link = window.document.createElement('a');
        link.download = `${sanitizedTitle}.${format}`;
        link.href = dataUrl;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
      }

      // Restore selection
      if (originalSelectedId) {
        useEditorStore.getState().setSelectedId(originalSelectedId);
      }

      // Confetti celebration!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      setIsCompleted(true);
      setTimeout(() => {
        setIsExportModalOpen(false);
        setIsCompleted(false);
      }, 1500);
    } catch (err: any) {
      console.error('Export failed:', err);
      alert('Failed to generate export file: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">Download Your Design</h3>
          </div>
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          {/* Format Selector */}
          <div>
            <label className="block text-xs font-semibold text-white mb-2">File Format</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFormat('png')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  format === 'png'
                    ? 'bg-brand-600/20 border-brand-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-750'
                }`}
              >
                <FileImage className="w-5 h-5 mb-1" />
                <span className="font-bold text-xs">PNG</span>
                <span className="text-[10px] text-slate-400">High quality image</span>
              </button>

              <button
                onClick={() => setFormat('jpeg')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  format === 'jpeg'
                    ? 'bg-brand-600/20 border-brand-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-750'
                }`}
              >
                <FileImage className="w-5 h-5 mb-1" />
                <span className="font-bold text-xs">JPEG</span>
                <span className="text-[10px] text-slate-400">Small file size</span>
              </button>

              <button
                onClick={() => setFormat('pdf')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  format === 'pdf'
                    ? 'bg-brand-600/20 border-brand-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-750'
                }`}
              >
                <FileText className="w-5 h-5 mb-1" />
                <span className="font-bold text-xs">PDF</span>
                <span className="text-[10px] text-slate-400">Standard document</span>
              </button>
            </div>
          </div>

          {/* Size / Resolution Multiplier */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-white">Size Scale</label>
              <span className="text-slate-400 font-mono text-[11px]">
                {document.dimensions.width * scaleMultiplier} × {document.dimensions.height * scaleMultiplier} px
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setScaleMultiplier(1)}
                className={`py-2 px-3 rounded-lg border text-center transition-all ${
                  scaleMultiplier === 1
                    ? 'bg-brand-600 text-white border-brand-500'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                1x (Standard)
              </button>
              <button
                onClick={() => setScaleMultiplier(2)}
                className={`py-2 px-3 rounded-lg border text-center transition-all ${
                  scaleMultiplier === 2
                    ? 'bg-brand-600 text-white border-brand-500'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                2x (Retina / Print)
              </button>
            </div>
          </div>

          {/* Quality Slider (JPEG only) */}
          {format === 'jpeg' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-white">Image Quality</label>
                <span className="font-mono text-brand-400">{quality}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer"
              />
            </div>
          )}

          {/* Output info box */}
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="flex justify-between">
              <span>Title:</span>
              <span className="text-white font-medium truncate max-w-[200px]">{document.title}</span>
            </p>
            <p className="flex justify-between">
              <span>Pages included:</span>
              <span className="text-white font-medium">Page {document.activePageIndex + 1} of {document.pages.length}</span>
            </p>
          </div>
        </div>

        {/* Modal Footer / Action Button */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={() => setIsExportModalOpen(false)}
            disabled={isExporting}
            className="px-4 py-2 text-slate-400 hover:text-white rounded-lg transition-colors text-xs font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download {format.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
