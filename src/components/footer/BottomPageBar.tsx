import React from 'react';
import { Plus, Copy, Trash2, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';

export const BottomPageBar: React.FC = () => {
  const {
    document,
    addPage,
    duplicatePage,
    deletePage,
    setActivePage,
    zoom,
    setZoom,
    resetView
  } = useEditorStore();

  const totalPages = document.pages.length;
  const activeIndex = document.activePageIndex;
  const activePage = document.pages[activeIndex] || document.pages[0];

  return (
    <footer className="h-12 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-4 z-40 select-none text-xs">
      {/* Left: Page Navigator */}
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        <span className="text-slate-400 font-medium whitespace-nowrap mr-2">
          Page {activeIndex + 1} of {totalPages}
        </span>

        {document.pages.map((page, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={page.id}
              onClick={() => setActivePage(index)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-medium transition-all ${
                isActive
                  ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-500/20'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span>{page.name || `Page ${index + 1}`}</span>
            </button>
          );
        })}

        {/* Add Page Button */}
        <button
          onClick={addPage}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors whitespace-nowrap"
          title="Add Blank Page"
        >
          <Plus className="w-3.5 h-3.5 text-brand-400" />
          <span>Add page</span>
        </button>
      </div>

      {/* Right: Page Actions & Quick Zoom */}
      <div className="flex items-center gap-3">
        {/* Page Actions: Duplicate & Delete */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => duplicatePage(activePage.id)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
            title="Duplicate Current Page"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => deletePage(activePage.id)}
            disabled={totalPages <= 1}
            className={`p-1.5 rounded transition-colors ${
              totalPages > 1
                ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20'
                : 'text-slate-600 cursor-not-allowed'
            }`}
            title={totalPages > 1 ? 'Delete Current Page' : 'Cannot delete the only page'}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* Zoom Slider */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(zoom - 0.1)}
            className="text-slate-400 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <input
            type="range"
            min="20"
            max="250"
            value={Math.round(zoom * 100)}
            onChange={(e) => setZoom(parseInt(e.target.value) / 100)}
            className="w-20 accent-brand-500 cursor-pointer h-1"
          />

          <button
            onClick={() => setZoom(zoom + 0.1)}
            className="text-slate-400 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <span className="font-mono text-slate-300 w-10 text-right">
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>
    </footer>
  );
};
