import { 
  Type,
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Trash2, 
  Copy, 
  Lock, 
  Unlock, 
  ArrowUp, 
  ArrowDown, 
  FlipHorizontal, 
  FlipVertical,
  Palette
} from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { POPULAR_FONTS, COLOR_PALETTES } from '../../utils/presets';
import { TextObject, ShapeObject, ImageObject } from '../../types';

export const ContextInspector: React.FC = () => {
  const {
    document,
    selectedId,
    updateObject,
    deleteSelected,
    duplicateSelected,
    reorderObject,
    toggleLockSelected,
    setBackground
  } = useEditorStore();

  const activePage = document.pages[document.activePageIndex] || document.pages[0];
  const selectedObject = activePage.objects.find((o) => o.id === selectedId);

  // If no object is selected, show Canvas Background settings
  if (!selectedObject) {
    return (
      <div className="h-11 bg-slate-900/90 border-b border-slate-800 flex items-center px-4 gap-3 text-xs select-none">
        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <Palette className="w-4 h-4 text-brand-400" />
          <span>Canvas Background:</span>
        </div>

        {/* Color picker input */}
        <div className="flex items-center gap-1.5">
          <input
            type="color"
            value={activePage.background.type === 'color' ? activePage.background.value : '#ffffff'}
            onChange={(e) => setBackground({ type: 'color', value: e.target.value })}
            className="w-6 h-6 rounded cursor-pointer border border-slate-700 bg-transparent p-0"
            title="Custom Canvas Color"
          />
          <span className="font-mono text-slate-300 uppercase">
            {activePage.background.value}
          </span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* Palette quick picks */}
        <div className="flex items-center gap-1.5">
          {COLOR_PALETTES.slice(0, 10).map((color) => (
            <button
              key={color}
              onClick={() => setBackground({ type: 'color', value: color })}
              className="w-5 h-5 rounded-full border border-slate-700 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    );
  }

  // --- Object is Selected ---
  const isLocked = selectedObject.locked || false;

  return (
    <div className="h-11 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between px-4 text-xs select-none">
      <div className="flex items-center gap-3">
        {/* === TEXT CONTROLS === */}
        {selectedObject.type === 'text' && (() => {
          const textObj = selectedObject as TextObject;
          return (
            <>
              {/* Direct Live Text Content Input */}
              <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded border border-brand-500/60 shadow-sm shadow-brand-500/10">
                <Type className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                <input
                  type="text"
                  value={textObj.text}
                  onChange={(e) => updateObject(textObj.id, { text: e.target.value })}
                  placeholder="Type your text here..."
                  className="bg-transparent text-white font-medium outline-none text-xs w-36 sm:w-56"
                  title="Direct Text Input"
                />
              </div>

              {/* Font Family */}
              <select
                value={textObj.fontFamily}
                onChange={(e) => updateObject(textObj.id, { fontFamily: e.target.value })}
                className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 outline-none font-medium hover:border-slate-600 transition-colors"
              >
                {POPULAR_FONTS.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>

              {/* Font Size */}
              <div className="flex items-center bg-slate-800 rounded border border-slate-700">
                <button
                  onClick={() => updateObject(textObj.id, { fontSize: Math.max(8, textObj.fontSize - 4) })}
                  className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded-l"
                >
                  -
                </button>
                <input
                  type="number"
                  value={textObj.fontSize}
                  onChange={(e) => updateObject(textObj.id, { fontSize: Math.max(6, parseInt(e.target.value) || 12) })}
                  className="w-12 bg-transparent text-center font-mono font-medium text-white outline-none"
                />
                <button
                  onClick={() => updateObject(textObj.id, { fontSize: Math.min(240, textObj.fontSize + 4) })}
                  className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded-r"
                >
                  +
                </button>
              </div>

              {/* Text Color */}
              <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                <span className="text-slate-400">Color:</span>
                <input
                  type="color"
                  value={textObj.fill}
                  onChange={(e) => updateObject(textObj.id, { fill: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                />
              </div>

              {/* Bold & Italic */}
              <div className="flex items-center bg-slate-800 rounded border border-slate-700 p-0.5">
                <button
                  onClick={() => updateObject(textObj.id, { 
                    fontWeight: textObj.fontWeight >= '700' ? '400' : '800' 
                  })}
                  className={`p-1 rounded ${
                    textObj.fontWeight >= '700' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateObject(textObj.id, { 
                    fontStyle: textObj.fontStyle === 'italic' ? 'normal' : 'italic' 
                  })}
                  className={`p-1 rounded ${
                    textObj.fontStyle === 'italic' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Alignment */}
              <div className="flex items-center bg-slate-800 rounded border border-slate-700 p-0.5">
                <button
                  onClick={() => updateObject(textObj.id, { textAlign: 'left' })}
                  className={`p-1 rounded ${textObj.textAlign === 'left' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:text-white'}`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateObject(textObj.id, { textAlign: 'center' })}
                  className={`p-1 rounded ${textObj.textAlign === 'center' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:text-white'}`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateObject(textObj.id, { textAlign: 'right' })}
                  className={`p-1 rounded ${textObj.textAlign === 'right' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:text-white'}`}
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          );
        })()}

        {/* === SHAPE CONTROLS === */}
        {['rectangle', 'circle', 'triangle', 'star', 'line'].includes(selectedObject.type) && (() => {
          const shape = selectedObject as ShapeObject;
          return (
            <>
              {/* Fill Color */}
              <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                <span className="text-slate-400">Fill:</span>
                <input
                  type="color"
                  value={shape.fill || '#38bdf8'}
                  onChange={(e) => updateObject(shape.id, { fill: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                />
              </div>

              {/* Stroke Color */}
              <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                <span className="text-slate-400">Border:</span>
                <input
                  type="color"
                  value={shape.stroke || '#ffffff'}
                  onChange={(e) => updateObject(shape.id, { stroke: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={shape.strokeWidth || 0}
                  onChange={(e) => updateObject(shape.id, { strokeWidth: parseInt(e.target.value) || 0 })}
                  className="w-10 bg-slate-900 text-center font-mono text-white rounded border border-slate-700 outline-none"
                  title="Border width (px)"
                />
              </div>

              {/* Corner Radius (Rectangle only) */}
              {shape.type === 'rectangle' && (
                <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                  <span className="text-slate-400">Radius:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shape.cornerRadius || 0}
                    onChange={(e) => updateObject(shape.id, { cornerRadius: parseInt(e.target.value) || 0 })}
                    className="w-16 accent-brand-500 cursor-pointer"
                  />
                  <span className="font-mono text-slate-300 w-6 text-right">{shape.cornerRadius || 0}</span>
                </div>
              )}
            </>
          );
        })()}

        {/* === IMAGE CONTROLS === */}
        {selectedObject.type === 'image' && (() => {
          const img = selectedObject as ImageObject;
          return (
            <>
              {/* Flip Horizontal / Vertical */}
              <div className="flex items-center bg-slate-800 rounded border border-slate-700 p-0.5">
                <button
                  onClick={() => updateObject(img.id, { flipX: !img.flipX })}
                  className={`p-1 rounded ${img.flipX ? 'bg-brand-600 text-white' : 'text-slate-300 hover:text-white'}`}
                  title="Flip Horizontal"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateObject(img.id, { flipY: !img.flipY })}
                  className={`p-1 rounded ${img.flipY ? 'bg-brand-600 text-white' : 'text-slate-300 hover:text-white'}`}
                  title="Flip Vertical"
                >
                  <FlipVertical className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          );
        })()}

        {/* === OPACITY SLIDER (ALL OBJECTS) === */}
        <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
          <span className="text-slate-400">Opacity:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round((selectedObject.opacity !== undefined ? selectedObject.opacity : 1) * 100)}
            onChange={(e) => updateObject(selectedObject.id, { opacity: parseInt(e.target.value) / 100 })}
            className="w-16 accent-brand-500 cursor-pointer"
          />
          <span className="font-mono text-slate-300 w-8 text-right">
            {Math.round((selectedObject.opacity !== undefined ? selectedObject.opacity : 1) * 100)}%
          </span>
        </div>
      </div>

      {/* Right Controls: Layering, Duplicate, Delete, Lock */}
      <div className="flex items-center gap-2">
        {/* Position / Layering */}
        <div className="flex items-center bg-slate-800 rounded border border-slate-700 p-0.5">
          <button
            onClick={() => reorderObject(selectedObject.id, 'forward')}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded"
            title="Bring Forward"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => reorderObject(selectedObject.id, 'backward')}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded"
            title="Send Backward"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lock / Unlock */}
        <button
          onClick={toggleLockSelected}
          className={`p-1.5 rounded border border-slate-700 transition-colors ${
            isLocked ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
          title={isLocked ? 'Unlock Object' : 'Lock Object'}
        >
          {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>

        {/* Duplicate */}
        <button
          onClick={duplicateSelected}
          className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-700 hover:bg-slate-700 transition-colors"
          title="Duplicate Object (Ctrl+D)"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {/* Delete */}
        <button
          onClick={deleteSelected}
          className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded border border-red-500/20 transition-colors"
          title="Delete Object (Delete)"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
