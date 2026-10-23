import React, { useState } from 'react';
import { 
  LayoutTemplate, 
  Shapes, 
  Type, 
  UploadCloud, 
  Palette, 
  Layers, 
  ChevronLeft, 
  Search, 
  Plus, 
  Square, 
  Circle as CircleIcon, 
  Triangle as TriangleIcon, 
  Star as StarIcon, 
  Minus,
  Sparkles,
  Lock,
  Trash2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useEditorStore, SidebarTab } from '../../store/useEditorStore';
import { STARTER_TEMPLATES } from '../../templates/starterTemplates';
import { COLOR_PALETTES, GRADIENT_PALETTES } from '../../utils/presets';
import { CanvasObject, TextObject, ShapeObject, SvgIconObject } from '../../types';

// Curated SVG Vector Icons
const CURATED_ICONS = [
  { name: 'Sparkles', path: 'M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83' },
  { name: 'Heart', path: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' },
  { name: 'Star', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { name: 'Zap', path: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
  { name: 'Crown', path: 'M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z' },
  { name: 'Shield', path: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { name: 'Rocket', path: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z' },
  { name: 'Shopping Bag', path: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0' },
  { name: 'Music', path: 'M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' },
  { name: 'Smile', path: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm-4-12h.01M16 10h.01m-10.02 5a6 6 0 0 0 12.02 0' }
];

export const LeftSidebar: React.FC = () => {
  const {
    document,
    activeTab,
    setActiveTab,
    isSidebarOpen,
    toggleSidebar,
    addObject,
    setBackground,
    setDocument,
    reorderObject,
    deleteSelected,
    selectedId,
    setSelectedId,
    toggleLockSelected
  } = useEditorStore();

  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategory, setTemplateCategory] = useState('All');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; url: string; name: string }>>([
    { id: 'sample-1', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80', name: 'Artistic Splash' },
    { id: 'sample-2', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', name: 'Ocean Beach' }
  ]);
  const [isUploading, setIsUploading] = useState(false);

  const activePage = document.pages[document.activePageIndex] || document.pages[0];

  // Apply template
  const handleApplyTemplate = (tmpl: typeof STARTER_TEMPLATES[0]) => {
    const shouldReplace = window.confirm(
      `Apply "${tmpl.name}" template? This will replace the content of current page.`
    );
    if (!shouldReplace) return;

    // Deep clone template page objects with fresh IDs
    const clonedObjects = tmpl.document.pages[0].objects.map((obj) => ({
      ...JSON.parse(JSON.stringify(obj)),
      id: 'obj_' + Math.random().toString(36).substring(2, 9)
    }));

    const newPage = {
      ...activePage,
      background: JSON.parse(JSON.stringify(tmpl.document.pages[0].background)),
      objects: clonedObjects
    };

    const newPages = [...document.pages];
    newPages[document.activePageIndex] = newPage;

    setDocument({
      ...document,
      title: tmpl.name,
      dimensions: JSON.parse(JSON.stringify(tmpl.dimensions)),
      pages: newPages,
      updatedAt: new Date().toISOString()
    });
  };

  // Add Primitive Shape
  const handleAddShape = (type: ShapeObject['type']) => {
    const center = {
      x: document.dimensions.width / 2 - 100,
      y: document.dimensions.height / 2 - 100
    };

    const shapeId = 'shape_' + Math.random().toString(36).substring(2, 9);
    const newShape: ShapeObject = {
      id: shapeId,
      type,
      x: center.x,
      y: center.y,
      width: 200,
      height: type === 'line' ? 4 : 200,
      rotation: 0,
      opacity: 1,
      fill: type === 'line' ? '#8b5cf6' : '#8b5cf6',
      stroke: '#ffffff',
      strokeWidth: 0,
      cornerRadius: type === 'rectangle' ? 12 : 0,
      numPoints: 5,
      points: type === 'line' ? [0, 0, 200, 0] : undefined
    };

    addObject(newShape);
  };

  // Add SVG Icon
  const handleAddIcon = (icon: typeof CURATED_ICONS[0]) => {
    const iconId = 'icon_' + Math.random().toString(36).substring(2, 9);
    const newIcon: SvgIconObject = {
      id: iconId,
      type: 'svg-icon',
      iconName: icon.name,
      svgPath: icon.path,
      x: document.dimensions.width / 2 - 60,
      y: document.dimensions.height / 2 - 60,
      width: 120,
      height: 120,
      rotation: 0,
      opacity: 1,
      fill: '#8b5cf6',
      stroke: '#8b5cf6',
      strokeWidth: 1.5
    };

    addObject(newIcon);
  };

  // Add Text
  const handleAddText = (type: 'heading' | 'subheading' | 'body') => {
    const textId = 'txt_' + Math.random().toString(36).substring(2, 9);
    let newText: TextObject;

    if (type === 'heading') {
      newText = {
        id: textId,
        type: 'text',
        x: document.dimensions.width / 2 - 250,
        y: document.dimensions.height / 2 - 60,
        width: 500,
        height: 120,
        rotation: 0,
        opacity: 1,
        text: 'Add a heading',
        fontFamily: 'Montserrat',
        fontSize: 64,
        fontWeight: '800',
        fill: '#ffffff',
        textAlign: 'center',
        lineHeight: 1.2,
        letterSpacing: 1
      };
    } else if (type === 'subheading') {
      newText = {
        id: textId,
        type: 'text',
        x: document.dimensions.width / 2 - 200,
        y: document.dimensions.height / 2 - 40,
        width: 400,
        height: 80,
        rotation: 0,
        opacity: 1,
        text: 'Add a subheading',
        fontFamily: 'Poppins',
        fontSize: 36,
        fontWeight: '600',
        fill: '#cbd5e1',
        textAlign: 'center',
        lineHeight: 1.2,
        letterSpacing: 0
      };
    } else {
      newText = {
        id: textId,
        type: 'text',
        x: document.dimensions.width / 2 - 150,
        y: document.dimensions.height / 2 - 20,
        width: 300,
        height: 60,
        rotation: 0,
        opacity: 1,
        text: 'Add a little bit of body text for details.',
        fontFamily: 'Inter',
        fontSize: 20,
        fontWeight: '400',
        fill: '#94a3b8',
        textAlign: 'center',
        lineHeight: 1.4,
        letterSpacing: 0
      };
    }

    addObject(newText);
  };

  // Handle Image Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const json = await res.json();
        setUploadedFiles((prev) => [
          { id: json.data.id, url: json.data.url, name: json.data.originalName },
          ...prev
        ]);
      } else {
        // Fallback to FileReader if server fails
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setUploadedFiles((prev) => [
              { id: 'local_' + Date.now(), url: ev.target!.result as string, name: file.name },
              ...prev
            ]);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      // Fallback to client FileReader
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setUploadedFiles((prev) => [
            { id: 'local_' + Date.now(), url: ev.target!.result as string, name: file.name },
            ...prev
          ]);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Add Image onto Canvas
  const handleAddImage = (src: string) => {
    const imgId = 'img_' + Math.random().toString(36).substring(2, 9);
    const newImage: CanvasObject = {
      id: imgId,
      type: 'image',
      src,
      aspectRatio: 1,
      x: document.dimensions.width / 2 - 200,
      y: document.dimensions.height / 2 - 150,
      width: 400,
      height: 300,
      rotation: 0,
      opacity: 1
    };

    addObject(newImage);
  };

  // Filter templates
  const filteredTemplates = STARTER_TEMPLATES.filter((t) => {
    const matchesCat = templateCategory === 'All' || t.category === templateCategory;
    const matchesQuery = t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(templateSearch.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="flex h-[calc(100vh-3.5rem)] z-30 select-none">
      {/* 1. Main Icon Tab Bar (68px wide) */}
      <div className="w-[68px] bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4 gap-2 z-20">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === 'templates' && isSidebarOpen
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Templates"
        >
          <LayoutTemplate className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium">Design</span>
        </button>

        <button
          onClick={() => setActiveTab('elements')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === 'elements' && isSidebarOpen
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Elements & Shapes"
        >
          <Shapes className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium">Elements</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === 'text' && isSidebarOpen
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Text & Typography"
        >
          <Type className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium">Text</span>
        </button>

        <button
          onClick={() => setActiveTab('uploads')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === 'uploads' && isSidebarOpen
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Upload Images"
        >
          <UploadCloud className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium">Uploads</span>
        </button>

        <button
          onClick={() => setActiveTab('background')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === 'background' && isSidebarOpen
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Canvas Background"
        >
          <Palette className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium">Color</span>
        </button>

        <button
          onClick={() => setActiveTab('layers')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === 'layers' && isSidebarOpen
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Layer Stacking"
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium">Layers</span>
        </button>
      </div>

      {/* 2. Expandable Content Drawer (330px wide) */}
      {isSidebarOpen && (
        <div className="w-[330px] bg-slate-900/95 border-r border-slate-800 flex flex-col h-full overflow-hidden shadow-2xl z-10 animate-in slide-in-from-left duration-200">
          {/* Header of Drawer */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white capitalize flex items-center gap-2">
              {activeTab === 'templates' && <LayoutTemplate className="w-4 h-4 text-brand-400" />}
              {activeTab === 'elements' && <Shapes className="w-4 h-4 text-brand-400" />}
              {activeTab === 'text' && <Type className="w-4 h-4 text-brand-400" />}
              {activeTab === 'uploads' && <UploadCloud className="w-4 h-4 text-brand-400" />}
              {activeTab === 'background' && <Palette className="w-4 h-4 text-brand-400" />}
              {activeTab === 'layers' && <Layers className="w-4 h-4 text-brand-400" />}
              <span>{activeTab}</span>
            </h2>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Collapse Panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
            {/* === TEMPLATES DRAWER === */}
            {activeTab === 'templates' && (
              <div className="space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    className="w-full bg-slate-800 text-white rounded-lg pl-9 pr-3 py-2 text-xs border border-slate-700 outline-none focus:border-brand-500"
                  />
                </div>

                {/* Category Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                  {['All', 'Social Media', 'YouTube', 'Marketing & Print'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setTemplateCategory(cat)}
                      className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                        templateCategory === cat
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {filteredTemplates.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="group relative rounded-xl overflow-hidden border border-slate-800 hover:border-brand-500 transition-all text-left bg-slate-800/50 hover:shadow-xl hover:shadow-brand-500/10"
                    >
                      <div className="aspect-[4/3] bg-slate-800 overflow-hidden relative">
                        <img
                          src={tmpl.previewThumbnail}
                          alt={tmpl.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-brand-600 text-white font-semibold text-[11px] px-2.5 py-1 rounded-full shadow">
                            Use Template
                          </span>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-white font-semibold text-xs truncate">{tmpl.name}</p>
                        <p className="text-slate-400 text-[10px]">{tmpl.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* === ELEMENTS DRAWER === */}
            {activeTab === 'elements' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-slate-300 font-semibold mb-2">Shapes</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleAddShape('rectangle')}
                      className="flex flex-col items-center justify-center p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-brand-500 rounded-xl transition-all"
                    >
                      <Square className="w-6 h-6 text-brand-400 mb-1" />
                      <span className="text-[11px] text-slate-300">Rectangle</span>
                    </button>
                    <button
                      onClick={() => handleAddShape('circle')}
                      className="flex flex-col items-center justify-center p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-brand-500 rounded-xl transition-all"
                    >
                      <CircleIcon className="w-6 h-6 text-brand-400 mb-1" />
                      <span className="text-[11px] text-slate-300">Circle</span>
                    </button>
                    <button
                      onClick={() => handleAddShape('star')}
                      className="flex flex-col items-center justify-center p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-brand-500 rounded-xl transition-all"
                    >
                      <StarIcon className="w-6 h-6 text-brand-400 mb-1" />
                      <span className="text-[11px] text-slate-300">Star</span>
                    </button>
                    <button
                      onClick={() => handleAddShape('triangle')}
                      className="flex flex-col items-center justify-center p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-brand-500 rounded-xl transition-all"
                    >
                      <TriangleIcon className="w-6 h-6 text-brand-400 mb-1" />
                      <span className="text-[11px] text-slate-300">Triangle</span>
                    </button>
                    <button
                      onClick={() => handleAddShape('line')}
                      className="flex flex-col items-center justify-center p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-brand-500 rounded-xl transition-all"
                    >
                      <Minus className="w-6 h-6 text-brand-400 mb-1" />
                      <span className="text-[11px] text-slate-300">Line</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-slate-300 font-semibold mb-2">Graphics & Vector Icons</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {CURATED_ICONS.map((icon) => (
                      <button
                        key={icon.name}
                        onClick={() => handleAddIcon(icon)}
                        className="p-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-brand-500 rounded-xl flex items-center justify-center transition-all group"
                        title={icon.name}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-5 h-5 stroke-current text-slate-300 group-hover:text-brand-400 group-hover:scale-110 transition-transform"
                          fill="none"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d={icon.path} />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* === TEXT DRAWER === */}
            {activeTab === 'text' && (
              <div className="space-y-3">
                <button
                  onClick={() => handleAddText('heading')}
                  className="w-full text-left p-3.5 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 hover:border-brand-500 rounded-xl transition-all group"
                >
                  <p className="text-2xl font-extrabold text-white group-hover:text-brand-300 font-['Montserrat']">
                    Add a heading
                  </p>
                  <p className="text-slate-400 text-[10px] mt-0.5">Big, bold title for announcements</p>
                </button>

                <button
                  onClick={() => handleAddText('subheading')}
                  className="w-full text-left p-3.5 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 hover:border-brand-500 rounded-xl transition-all group"
                >
                  <p className="text-lg font-semibold text-slate-200 group-hover:text-brand-300 font-['Poppins']">
                    Add a subheading
                  </p>
                  <p className="text-slate-400 text-[10px] mt-0.5">Medium copy for sub-sections</p>
                </button>

                <button
                  onClick={() => handleAddText('body')}
                  className="w-full text-left p-3.5 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 hover:border-brand-500 rounded-xl transition-all group"
                >
                  <p className="text-sm text-slate-300 group-hover:text-brand-300 font-['Inter']">
                    Add a little bit of body text
                  </p>
                  <p className="text-slate-400 text-[10px] mt-0.5">Paragraphs, bullet points, and descriptions</p>
                </button>

                {/* Pre-made typography styles */}
                <div className="pt-2">
                  <h3 className="text-slate-400 font-semibold mb-2">Creative Typography Presets</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        handleAddText('heading');
                      }}
                      className="w-full p-3 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-xl text-left hover:border-purple-500 transition-colors"
                    >
                      <p className="font-['Anton'] text-2xl tracking-wider text-purple-300 uppercase">
                        BOLD IMPACT
                      </p>
                      <p className="text-[10px] text-slate-400">High-contrast poster title</p>
                    </button>

                    <button
                      onClick={() => {
                        const id = 'txt_' + Math.random().toString(36).substring(2, 9);
                        addObject({
                          id,
                          type: 'text',
                          x: document.dimensions.width / 2 - 180,
                          y: document.dimensions.height / 2 - 40,
                          width: 360,
                          height: 80,
                          rotation: 0,
                          opacity: 1,
                          text: 'Handcrafted With Love',
                          fontFamily: 'Caveat',
                          fontSize: 48,
                          fontWeight: '600',
                          fill: '#f43f5e',
                          textAlign: 'center',
                          lineHeight: 1.2,
                          letterSpacing: 0
                        });
                      }}
                      className="w-full p-3 bg-gradient-to-r from-rose-900/40 to-pink-900/40 border border-rose-500/30 rounded-xl text-left hover:border-rose-500 transition-colors"
                    >
                      <p className="font-['Caveat'] text-2xl text-rose-300">
                        Handcrafted With Love
                      </p>
                      <p className="text-[10px] text-slate-400">Casual script typography</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* === UPLOADS DRAWER === */}
            {activeTab === 'uploads' && (
              <div className="space-y-4">
                {/* Upload Button */}
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-brand-500 rounded-xl cursor-pointer bg-slate-800/40 hover:bg-slate-800/70 transition-all text-center">
                  <UploadCloud className="w-8 h-8 text-brand-400 mb-2" />
                  <span className="text-white font-semibold text-xs">Upload Image</span>
                  <span className="text-slate-400 text-[10px] mt-1">PNG, JPG, WEBP or SVG up to 15MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {isUploading && (
                  <p className="text-center text-xs text-brand-400 animate-pulse">
                    Uploading image...
                  </p>
                )}

                {/* Gallery of Uploaded Files */}
                <div>
                  <h3 className="text-slate-300 font-semibold mb-2">Your Assets</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {uploadedFiles.map((file) => (
                      <button
                        key={file.id}
                        onClick={() => handleAddImage(file.url)}
                        className="group aspect-square rounded-lg overflow-hidden border border-slate-800 hover:border-brand-500 relative bg-slate-800 transition-all text-left"
                      >
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                          <span className="text-white text-[10px] font-semibold">Click to Insert</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* === BACKGROUND DRAWER === */}
            {activeTab === 'background' && (
              <div className="space-y-4">
                {/* Custom Color */}
                <div>
                  <h3 className="text-slate-300 font-semibold mb-2">Custom Color</h3>
                  <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
                    <input
                      type="color"
                      value={activePage.background.type === 'color' ? activePage.background.value : '#ffffff'}
                      onChange={(e) => setBackground({ type: 'color', value: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                    <span className="font-mono text-white text-xs uppercase">
                      {activePage.background.value}
                    </span>
                  </div>
                </div>

                {/* Solid Palettes */}
                <div>
                  <h3 className="text-slate-300 font-semibold mb-2">Solid Colors</h3>
                  <div className="grid grid-cols-6 gap-2">
                    {COLOR_PALETTES.map((color) => (
                      <button
                        key={color}
                        onClick={() => setBackground({ type: 'color', value: color })}
                        className="w-9 h-9 rounded-lg border border-slate-700 hover:scale-110 transition-transform shadow"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Gradients */}
                <div>
                  <h3 className="text-slate-300 font-semibold mb-2">Modern Gradients</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {GRADIENT_PALETTES.map((grad, i) => (
                      <button
                        key={i}
                        onClick={() => setBackground({ type: 'gradient', value: grad })}
                        className="h-16 rounded-xl border border-slate-700 hover:border-brand-500 hover:scale-105 transition-all shadow"
                        style={{ background: grad }}
                        title={`Gradient ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* === LAYERS DRAWER === */}
            {activeTab === 'layers' && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400 mb-2">
                  Top elements appear in front. Click an item to select it on the canvas.
                </p>

                {activePage.objects.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No elements on this page yet</p>
                  </div>
                ) : (
                  [...activePage.objects].reverse().map((obj, revIdx) => {
                    const isSelected = obj.id === selectedId;
                    const originalIdx = activePage.objects.length - 1 - revIdx;

                    return (
                      <div
                        key={obj.id}
                        onClick={() => setSelectedId(obj.id)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-brand-600/20 border-brand-500 text-white'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-[10px] font-mono text-slate-500 w-4">
                            #{originalIdx + 1}
                          </span>
                          <span className="font-medium text-xs truncate">
                            {obj.type === 'text' ? (obj as TextObject).text || 'Empty Text' : `${obj.type}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              reorderObject(obj.id, 'forward');
                            }}
                            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              reorderObject(obj.id, 'backward');
                            }}
                            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
