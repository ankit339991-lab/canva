import React, { useState } from 'react';
import { 
  ChevronLeft, 
  RotateCcw, 
  RotateCw, 
  Download, 
  Cloud, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Sparkles
} from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';

interface TopNavbarProps {
  onBackToDashboard: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onBackToDashboard }) => {
  const {
    document,
    updateTitle,
    undo,
    redo,
    canUndo,
    canRedo,
    saveStatus,
    lastSavedAt,
    zoom,
    setZoom,
    resetView,
    setIsExportModalOpen
  } = useEditorStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(document.title);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim() && titleInput !== document.title) {
      updateTitle(titleInput.trim());
    } else {
      setTitleInput(document.title);
    }
  };

  const zoomPercent = Math.round(zoom * 100);

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-40 select-none">
      {/* Left: Brand, Back, Title, Save Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
          title="Back to Dashboard"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Home</span>
        </button>

        <div className="h-4 w-px bg-slate-700" />

        {/* Project Title */}
        {isEditingTitle ? (
          <input
            autoFocus
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSubmit();
              if (e.key === 'Escape') {
                setIsEditingTitle(false);
                setTitleInput(document.title);
              }
            }}
            className="bg-slate-800 text-white text-sm font-semibold px-2 py-1 rounded border border-brand-500 outline-none w-64"
          />
        ) : (
          <button
            onClick={() => {
              setTitleInput(document.title);
              setIsEditingTitle(true);
            }}
            className="text-white text-sm font-semibold hover:bg-slate-800 px-2.5 py-1 rounded transition-colors text-left truncate max-w-xs"
            title="Click to rename design"
          >
            {document.title}
          </button>
        )}

        {/* Dimensions badge */}
        <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
          {document.dimensions.width} × {document.dimensions.height} {document.dimensions.unit}
        </span>

        {/* Cloud Save Status */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 pl-2">
          {saveStatus === 'saving' ? (
            <div className="flex items-center gap-1 text-amber-400">
              <Cloud className="w-3.5 h-3.5 animate-pulse" />
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span className="text-slate-400">Saved {lastSavedAt && `at ${lastSavedAt}`}</span>
            </div>
          )}
        </div>
      </div>

      {/* Center: Undo, Redo, Zoom Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition-colors ${
              canUndo ? 'text-slate-200 hover:text-white hover:bg-slate-700' : 'text-slate-600 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition-colors ${
              canRedo ? 'text-slate-200 hover:text-white hover:bg-slate-700' : 'text-slate-600 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        {/* Zoom controls */}
        <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-xs">
          <button
            onClick={() => setZoom(zoom - 0.1)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 font-mono font-medium text-slate-300 min-w-[48px] text-center">
            {zoomPercent}%
          </span>
          <button
            onClick={() => setZoom(zoom + 0.1)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => resetView(window.innerWidth - 380, window.innerHeight - 110)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors ml-0.5"
            title="Fit to Screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Export Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
