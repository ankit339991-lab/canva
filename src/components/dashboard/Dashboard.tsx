import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Home, 
  Folder, 
  LayoutTemplate, 
  Crown, 
  Sparkles, 
  Bell, 
  PanelLeft, 
  Presentation as PresIcon, 
  Heart, 
  Video, 
  ShoppingBag, 
  FileText, 
  SquarePen, 
  Table, 
  Globe, 
  GraduationCap, 
  Layers, 
  Crop, 
  ChevronRight, 
  ChevronDown, 
  ArrowUpDown, 
  Grid3X3, 
  CloudUpload, 
  Copy, 
  Trash2, 
  ExternalLink,
  Sliders,
  Check,
  Settings
} from 'lucide-react';
import { STARTER_TEMPLATES } from '../../templates/starterTemplates';
import { DesignDocument, Template } from '../../types';


interface DashboardProps {
  onOpenDesign: (doc: DesignDocument) => void;
  onCreateNew: (width: number, height: number, title?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenDesign, onCreateNew }) => {
  const [designs, setDesigns] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeNav, setActiveNav] = useState<'home' | 'projects' | 'templates' | 'brand' | 'ai'>('home');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customWidth, setCustomWidth] = useState(1200);
  const [customHeight, setCustomHeight] = useState(630);
  const [customTitle, setCustomTitle] = useState('My Custom Design');
  const [adminTemplates, setAdminTemplates] = useState<Template[]>([]);

  // Load admin-managed templates from localStorage
  const loadAdminTemplates = () => {
    try {
      const raw = localStorage.getItem('lumina_admin_templates');
      if (raw) {
        const parsed = JSON.parse(raw);
        setAdminTemplates(parsed);
      }
    } catch {}
  };

  // Load existing designs from backend & localStorage
  const loadDesigns = async () => {
    setIsLoading(true);
    let loaded: any[] = [];

    try {
      const res = await fetch('/api/designs');
      if (res.ok) {
        const json = await res.json();
        loaded = json.data || [];
      }
    } catch {
      // Fallback: check localStorage
      const localKeys = Object.keys(localStorage).filter((k) => k.startsWith('lumina_design_'));
      loaded = localKeys.map((k) => {
        try {
          return JSON.parse(localStorage.getItem(k) || '{}');
        } catch {
          return null;
        }
      }).filter(Boolean);
    }

    setDesigns(loaded);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDesigns();
    loadAdminTemplates();
  }, []);


  // Delete design
  const handleDeleteDesign = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this design?')) return;

    try {
      await fetch(`/api/designs/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    localStorage.removeItem(`lumina_design_${id}`);
    setDesigns((prev) => prev.filter((d) => d.id !== id));
  };

  // Duplicate design
  const handleDuplicateDesign = async (design: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const doc = design.document || design;
    const duplicated: DesignDocument = {
      ...JSON.parse(JSON.stringify(doc)),
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      title: `${doc.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicated)
      });
    } catch {
      // ignore
    }

    localStorage.setItem(`lumina_design_${duplicated.id}`, JSON.stringify(duplicated));
    loadDesigns();
  };

  // Open Template
  const handleSelectTemplate = (tmpl: typeof STARTER_TEMPLATES[0]) => {
    const doc: DesignDocument = {
      ...JSON.parse(JSON.stringify(tmpl.document)),
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onOpenDesign(doc);
  };

  // Filtered designs
  const filteredDesigns = designs.filter((d) => {
    const title = d.title || d.document?.title || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-row font-sans selection:bg-purple-100 selection:text-purple-900 select-none">
      {/* 1. Left Vertical Navigation Sidebar (Canva Style) */}
      <aside className="w-[74px] bg-white border-r border-slate-200/90 flex flex-col items-center justify-between py-4 fixed top-0 bottom-0 left-0 z-30 shadow-sm">
        <div className="flex flex-col items-center w-full gap-3">
          {/* Top Panel Collapse Toggle */}
          <button 
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Toggle Sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>

          {/* "+ Create" Pill Button */}
          <button
            onClick={() => onCreateNew(1080, 1080, 'Untitled Design')}
            className="flex flex-col items-center group mt-1"
            title="Create a design"
          >
            <div className="w-11 h-11 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white flex items-center justify-center shadow-lg shadow-purple-600/25 transition-all group-hover:scale-105 active:scale-95">
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 mt-1">Create</span>
          </button>

          {/* Navigation Items */}
          <div className="flex flex-col items-center gap-1.5 w-full px-2 mt-2">
            <button
              onClick={() => setActiveNav('home')}
              className={`flex flex-col items-center justify-center w-full py-2.5 rounded-xl transition-all ${
                activeNav === 'home'
                  ? 'bg-[#ede9fe] text-[#7c3aed] font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">Home</span>
            </button>

            <button
              onClick={() => setActiveNav('projects')}
              className={`flex flex-col items-center justify-center w-full py-2.5 rounded-xl transition-all ${
                activeNav === 'projects'
                  ? 'bg-[#ede9fe] text-[#7c3aed] font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Folder className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">Projects</span>
            </button>

            <button
              onClick={() => setActiveNav('templates')}
              className={`flex flex-col items-center justify-center w-full py-2.5 rounded-xl transition-all ${
                activeNav === 'templates'
                  ? 'bg-[#ede9fe] text-[#7c3aed] font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutTemplate className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">Templates</span>
            </button>

            <button
              onClick={() => setActiveNav('brand')}
              className={`flex flex-col items-center justify-center w-full py-2.5 rounded-xl transition-all relative ${
                activeNav === 'brand'
                  ? 'bg-[#ede9fe] text-[#7c3aed] font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="relative">
                <Crown className="w-5 h-5 mb-0.5" />
                <span className="absolute -top-1 -right-2 text-[7px] font-black bg-amber-400 text-amber-950 px-1 py-0.2 rounded-full uppercase leading-none">
                  PRO
                </span>
              </div>
              <span className="text-[10px] font-medium">Brand</span>
            </button>

            <button
              onClick={() => setActiveNav('ai')}
              className={`flex flex-col items-center justify-center w-full py-2.5 rounded-xl transition-all ${
                activeNav === 'ai'
                  ? 'bg-[#ede9fe] text-[#7c3aed] font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">Canva AI</span>
            </button>

            {/* Admin settings button */}
            <button
              onClick={() => { window.location.hash = '#/admin'; }}
              className="flex flex-col items-center justify-center w-full py-2.5 rounded-xl transition-all text-slate-400 hover:text-violet-700 hover:bg-violet-50"
              title="Admin Panel - Manage Templates"
            >
              <Settings className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">Admin</span>
            </button>
          </div>
        </div>


        {/* Bottom Avatar & Notifications */}
        <div className="flex flex-col items-center gap-3">
          <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2 ring-2 ring-white" />
          </button>

          <div 
            onClick={() => setIsCustomModalOpen(true)}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white font-bold text-xs flex items-center justify-center shadow-md cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all"
            title="Dell (User Profile)"
          >
            D
          </div>
        </div>
      </aside>

      {/* 2. Main Page Content (Offset by 74px for sidebar) */}
      <main className="flex-1 ml-[74px] p-6 sm:p-8 max-w-[1400px] w-full mx-auto space-y-8">
        
        {/* === HERO BANNER: Premium Canva-Style === */}
        <section className="relative rounded-3xl overflow-hidden" style={{background: 'linear-gradient(135deg, #1a0533 0%, #2d1065 40%, #4c1d95 70%, #6d28d9 100%)'}}>
          {/* Animated glow orbs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-indigo-400/20 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-8 sm:p-10">
            {/* Left: Text + Search */}
            <div className="flex-1 text-center md:text-left space-y-5">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Lumina Design Studio — Create anything
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05]">
                What will you<br />
                <span className="text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(90deg, #c084fc, #e879f9, #f9a8d4)'}}>
                  design today?
                </span>
              </h1>
              <p className="text-purple-200 text-sm font-medium max-w-md mx-auto md:mx-0">
                Create stunning graphics, presentations, social posts, and more — right in your browser.
              </p>

              {/* Search Bar */}
              <div className="max-w-lg mx-auto md:mx-0 relative group">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                <input
                  type="text"
                  placeholder="Search templates, styles, or dimensions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white rounded-2xl pl-12 pr-5 py-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 border-2 border-transparent focus:border-purple-400 focus:outline-none shadow-xl shadow-black/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick create buttons */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <button
                  onClick={() => onCreateNew(1080, 1080, 'Untitled Design')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white text-violet-700 font-bold rounded-xl text-xs shadow-lg shadow-black/20 hover:bg-violet-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Create blank
                </button>
                <button
                  onClick={() => onCreateNew(1920, 1080, 'Presentation')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl text-xs border border-white/20 backdrop-blur-sm transition-colors"
                >
                  <PresIcon className="w-3.5 h-3.5" /> Presentation
                </button>
                <button
                  onClick={() => onCreateNew(1080, 1080, 'Social Media Post')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl text-xs border border-white/20 backdrop-blur-sm transition-colors"
                >
                  <Heart className="w-3.5 h-3.5" /> Social Post
                </button>
                <button
                  onClick={() => setIsCustomModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl text-xs border border-white/20 backdrop-blur-sm transition-colors"
                >
                  <Crop className="w-3.5 h-3.5" /> Custom size
                </button>
              </div>
            </div>

            {/* Right: Floating Template Previews */}
            <div className="hidden lg:flex flex-col gap-3 flex-shrink-0 relative">
              {/* Stacked mini cards */}
              <div className="flex gap-3">
                <div className="w-32 h-20 rounded-xl overflow-hidden shadow-xl shadow-black/40 ring-2 ring-white/20 rotate-[-3deg] hover:rotate-0 transition-transform duration-300 cursor-pointer" onClick={() => onCreateNew(1080, 1080, 'Summer Sale')}>
                  <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="" />
                </div>
                <div className="w-32 h-20 rounded-xl overflow-hidden shadow-xl shadow-black/40 ring-2 ring-white/20 rotate-[2deg] hover:rotate-0 transition-transform duration-300 cursor-pointer" onClick={() => onCreateNew(1280, 720, 'YouTube Thumbnail')}>
                  <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="" />
                </div>
              </div>
              <div className="flex gap-3 ml-6">
                <div className="w-32 h-20 rounded-xl overflow-hidden shadow-xl shadow-black/40 ring-2 ring-white/20 rotate-[1deg] hover:rotate-0 transition-transform duration-300 cursor-pointer" onClick={() => onCreateNew(1080, 1080, 'Quote Post')}>
                  <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="" />
                </div>
                <div className="w-32 h-20 rounded-xl overflow-hidden shadow-xl shadow-black/40 ring-2 ring-white/20 rotate-[-2deg] hover:rotate-0 transition-transform duration-300 cursor-pointer" onClick={() => onCreateNew(1414, 2000, 'Event Poster')}>
                  <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="" />
                </div>
              </div>
              <p className="text-center text-purple-300 text-[11px] font-semibold mt-1">Click any to start designing</p>
            </div>
          </div>

          {/* Category Scroll Bar at bottom of hero */}
          <div className="border-t border-white/10 px-8 py-3">
            <div className="flex items-center gap-5 overflow-x-auto pb-0.5 custom-scrollbar">
              {[
                { label: 'Templates', icon: LayoutTemplate, color: '#a78bfa', onClick: () => onCreateNew(1080, 1080, 'Templates Design') },
                { label: 'Presentation', icon: PresIcon, color: '#fb923c', onClick: () => onCreateNew(1920, 1080, 'Presentation (16:9)') },
                { label: 'Social media', icon: Heart, color: '#f43f5e', onClick: () => onCreateNew(1080, 1080, 'Social Media Post') },
                { label: 'Video', icon: Video, color: '#c026d3', onClick: () => onCreateNew(1920, 1080, 'Video Project') },
                { label: 'Print Shop', icon: ShoppingBag, color: '#7e22ce', onClick: () => onCreateNew(1414, 2000, 'Print Poster') },
                { label: 'Doc', icon: FileText, color: '#0d9488', onClick: () => onCreateNew(816, 1056, 'Document') },
                { label: 'Whiteboard', icon: SquarePen, color: '#16a34a', onClick: () => onCreateNew(2000, 1200, 'Whiteboard Canvas') },
                { label: 'Website', icon: Globe, color: '#1d4ed8', onClick: () => onCreateNew(1440, 900, 'Website Mockup') },
                { label: 'Education', icon: GraduationCap, color: '#db2777', onClick: () => onCreateNew(1200, 800, 'Education Lesson'), badge: 'New' },
                { label: 'Custom size', icon: Crop, color: '#64748b', onClick: () => setIsCustomModalOpen(true) },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex flex-col items-center group flex-shrink-0 py-1"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform relative"
                    style={{ background: item.color }}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[8px] font-black px-1 rounded-full border border-white">New</span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-purple-200 mt-1 group-hover:text-white transition-colors whitespace-nowrap">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>



          <div className="relative z-10 text-center space-y-6">
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-black text-[#381285] tracking-tight">
              What will you design today?
            </h1>

            {/* Wide Pill Search Input */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-5 top-4" />
              <input
                type="text"
                placeholder="Search anything"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white rounded-full pl-13 pr-6 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 border border-slate-200/90 shadow-lg shadow-purple-900/5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all"
              />
            </div>

            {/* Horizontal Category Carousel (Matching Screenshot) */}
            <div className="flex items-start justify-start md:justify-center gap-6 overflow-x-auto pb-2 pt-4 px-2 custom-scrollbar">
              {/* 1. Templates */}
              <button 
                onClick={() => onCreateNew(1080, 1080, 'Templates Design')}
                className="flex flex-col items-center group flex-shrink-0"
              >
                <div className="w-13 h-13 rounded-full bg-[#7c3aed] text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform">
                  <LayoutTemplate className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-2">Templates</span>
              </button>

              {/* 2. Presentation */}
              <button 
                onClick={() => onCreateNew(1920, 1080, 'Presentation (16:9)')}
                className="flex flex-col items-center group flex-shrink-0"
              >
                <div className="w-13 h-13 rounded-full bg-[#ea580c] text-white flex items-center justify-center shadow-md shadow-orange-600/20 group-hover:scale-105 transition-transform">
                  <PresIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-2">Presentation</span>
              </button>

              {/* 3. Social media */}
              <button 
                onClick={() => onCreateNew(1080, 1080, 'Social Media Post')}
                className="flex flex-col items-center group flex-shrink-0"
              >
                <div className="w-13 h-13 rounded-full bg-[#e11d48] text-white flex items-center justify-center shadow-md shadow-rose-600/20 group-hover:scale-105 transition-transform">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-2">Social media</span>
              </button>

              {/* 4. Video */}
              <button 
                onClick={() => onCreateNew(1920, 1080, 'Video Project')}
                className="flex flex-col items-center group flex-shrink-0"
              >
                <div className="w-13 h-13 rounded-full bg-[#c026d3] text-white flex items-center justify-center shadow-md shadow-fuchsia-600/20 group-hover:scale-105 transition-transform">
                  <Video className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-2">Video</span>
              </button>

              {/* 5. Print Shop */}
              <button 
                onClick={() => onCreateNew(1414, 2000, 'Print Poster')}
                className="flex flex-col items-center group flex-shrink-0"
              >
                <div className="w-13 h-13 rounded-full bg-[#7e22ce] text-white flex items-center justify-center shadow-md shadow-purple-700/20 group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-2">Print Shop</span>
              </button>

              {/* 6. Doc */}
              <button 
                onClick={() => onCreateNew(816, 1056, 'Document')}
                className="flex flex-col items-center group flex-shrink-0"
              >
                <div className="w-13 h-13 rounded-full bg-[#0d9488] text-white flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-2">Doc</span>
              </button>

              {/* 7. Whiteboard */}
              <button 
                onClick={() => onCreateNew(2000, 1200, 'Whiteboard Canvas')}
                className="flex flex-col items-center group flex-shrink-0"
              >
                <div className="w-13 h-13 rounded-full bg-[#16a34a] text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                  <SquarePen className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-2">Whiteboard</span>
              </button>

              {/* 8. Sheet */}
              <button 
                onClick={() => onCreateNew(1600, 1000, 'Spreadsheet Design')}
                className="flex flex-col items-center group flex-shrink-0"
              >
                <div className="w-13 h-13 rounded-full bg-[#2563eb] text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                  <Table className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-2">Sheet</span>
              </button>

              {/* 9. Website */}
              <button 
                onClick={() => onCreateNew(1440, 900, 'Website Mockup')}
                className="flex flex-col items-center group flex-shrink-0"
              >
                <div className="w-13 h-13 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center shadow-md shadow-blue-700/20 group-hover:scale-105 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-2">Website</span>
              </button>

              {/* 10. Education (with "New" badge) */}
              <button 
                onClick={() => onCreateNew(1200, 800, 'Education Lesson')}
                className="flex flex-col items-center group flex-shrink-0 relative"
              >
                <div className="w-13 h-13 rounded-full bg-[#db2777] text-white flex items-center justify-center shadow-md shadow-pink-600/20 group-hover:scale-105 transition-transform relative">
                  <GraduationCap className="w-6 h-6" />
                  <span className="absolute -top-1.5 -right-1 bg-[#db2777] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border-2 border-white uppercase shadow-sm">
                    New
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-2">Education</span>
              </button>

              {/* 11. Magic Layers */}
              <button 
                onClick={() => onCreateNew(1080, 1080, 'Magic Layers Art')}
                className="flex flex-col items-center group flex-shrink-0"
              >
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-purple-600/25 group-hover:scale-105 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-2">Magic Layers</span>
              </button>

              {/* 12. Custom size */}
              <button 
                onClick={() => setIsCustomModalOpen(true)}
                className="flex flex-col items-center group flex-shrink-0"
              >
                <div className="w-13 h-13 rounded-full bg-white border border-slate-200/90 text-slate-700 flex items-center justify-center shadow-sm group-hover:border-purple-500 group-hover:text-purple-600 group-hover:scale-105 transition-all">
                  <Crop className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-2">Custom size</span>
              </button>

              {/* Arrow right to scroll */}
              <button 
                onClick={() => setIsCustomModalOpen(true)}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center shadow-sm flex-shrink-0 self-center transition-all ml-1"
                title="More dimensions"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
        </main>


        {/* === RECENTS SECTION (Matching Screenshot) === */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recents</h2>

            {/* Filter Pills & View Toggles */}
            <div className="flex items-center gap-2 text-xs">
              <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-50 shadow-sm transition-colors">
                <span>Type</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-50 shadow-sm transition-colors">
                <span>Creator</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-full shadow-sm hover:bg-slate-50 transition-colors ml-1">
                <ArrowUpDown className="w-4 h-4" />
              </button>

              <button className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-full shadow-sm hover:bg-slate-50 transition-colors">
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cards Row / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {/* 1. "Live in style" Minimalist Header Card (from screenshot) */}
            <div 
              onClick={() => {
                const tmpl = STARTER_TEMPLATES[0];
                handleSelectTemplate(tmpl);
              }}
              className="group bg-white rounded-2xl border border-slate-200/80 hover:border-purple-400 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col"
            >
              <div className="aspect-[16/10] bg-[#f5f5f7] p-3 flex items-center justify-center overflow-hidden relative">
                <div className="w-full h-24 bg-white rounded-lg shadow-sm border border-slate-200/80 flex items-center justify-between px-3 overflow-hidden">
                  <div className="w-12 h-16 rounded bg-slate-200 overflow-hidden flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=200&q=80" 
                      alt="Interior" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center px-2">
                    <p className="font-['Playfair_Display'] text-sm font-bold text-slate-900 italic tracking-wider">
                      Live in style
                    </p>
                    <p className="text-[8px] text-slate-400 tracking-widest uppercase mt-0.5">Interior Magazine</p>
                  </div>
                  <div className="w-12 h-16 rounded bg-slate-200 overflow-hidden flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80" 
                      alt="Decor" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="p-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Live in style</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Header Banner • 1500 × 500</p>
                </div>
                <span className="p-1.5 text-slate-400 group-hover:text-purple-600">
                  <ExternalLink className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* 2. "TRAVEL PLAYLIST" Poster Card (from screenshot) */}
            <div 
              onClick={() => {
                const tmpl = STARTER_TEMPLATES[1];
                handleSelectTemplate(tmpl);
              }}
              className="group bg-white rounded-2xl border border-slate-200/80 hover:border-purple-400 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col"
            >
              <div className="aspect-[16/10] bg-slate-900 relative overflow-hidden flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&q=80" 
                  alt="Mountain travel" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col items-center justify-center p-3 text-center">
                  <p className="text-white font-black text-sm tracking-widest font-['Montserrat'] uppercase">TRAVEL PLAYLIST</p>
                  <div className="flex items-center gap-2 text-white/90 my-1">
                    <span className="text-[10px]">⏮</span>
                    <span className="text-xs">⏸</span>
                    <span className="text-[10px]">⏭</span>
                  </div>
                  <p className="text-white/70 text-[9px]">Add a subheading</p>
                </div>
              </div>
              <div className="p-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">TRAVEL PLAYLIST</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Story / Poster • 1080 × 1920</p>
                </div>
                <span className="p-1.5 text-slate-400 group-hover:text-purple-600">
                  <ExternalLink className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* 3. Pastel Watercolor Banner (from screenshot) */}
            <div 
              onClick={() => onCreateNew(1200, 630, 'Pastel Watercolor Art')}
              className="group bg-white rounded-2xl border border-slate-200/80 hover:border-purple-400 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col"
            >
              <div className="aspect-[16/10] bg-gradient-to-r from-amber-100 via-rose-100 to-pink-200 p-3 flex flex-col justify-end overflow-hidden relative">
                <div className="w-full h-12 bg-white/90 backdrop-blur rounded-lg shadow-sm border border-white flex items-center justify-center">
                  <span className="text-xs font-semibold text-rose-900 font-['Caveat'] text-lg">Watercolor Elegance</span>
                </div>
              </div>
              <div className="p-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Pastel Watercolor</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Post Card • 1200 × 630</p>
                </div>
                <span className="p-1.5 text-slate-400 group-hover:text-purple-600">
                  <ExternalLink className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* 4. Folder / Cloud Upload Card (from screenshot) */}
            <div 
              onClick={() => setIsCustomModalOpen(true)}
              className="group bg-slate-100/80 rounded-2xl border border-slate-200 hover:border-purple-400 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col relative"
            >
              {/* Folder tab at top */}
              <div className="w-24 h-4 bg-slate-200 rounded-t-lg ml-3 mt-2" />
              <div className="aspect-[16/10] bg-slate-100 flex flex-col items-center justify-center p-4">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center text-slate-500 group-hover:text-purple-600 group-hover:scale-105 transition-all">
                  <CloudUpload className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-slate-700 mt-2.5">Uploads & Files</span>
              </div>
              <div className="p-3 bg-white border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Custom Upload</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Click to choose size</p>
                </div>
                <Plus className="w-4 h-4 text-purple-600" />
              </div>
            </div>

            {/* User Created Designs */}
            {filteredDesigns.map((d) => {
              const doc = d.document || d;
              const width = doc.dimensions?.width || d.width || 1080;
              const height = doc.dimensions?.height || d.height || 1080;
              const pageCount = doc.pages?.length || 1;

              return (
                <div
                  key={d.id}
                  onClick={() => onOpenDesign(doc)}
                  className="group bg-white rounded-2xl border border-slate-200/80 hover:border-purple-400 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col"
                >
                  <div className="aspect-[16/10] bg-slate-50 flex items-center justify-center p-4 relative">
                    <div 
                      className="bg-white rounded-lg shadow-md border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-[10px]"
                      style={{
                        width: `${Math.min(140, (width / height) * 90)}px`,
                        height: `${Math.min(90, (height / width) * 140)}px`
                      }}
                    >
                      {width}×{height}
                    </div>

                    <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 bg-[#7c3aed] text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-1">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="truncate pr-2">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                        {doc.title || 'Untitled Design'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {pageCount} {pageCount === 1 ? 'page' : 'pages'} • {width}×{height}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDuplicateDesign(d, e)}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteDesign(d.id, e)}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* === STARTER TEMPLATES SECTION === */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Explore Templates</h2>
            <div className="flex items-center gap-3">
              {adminTemplates.length > 0 && (
                <span className="text-[11px] px-2.5 py-1 bg-violet-100 text-violet-700 font-bold rounded-full">
                  {adminTemplates.length} custom
                </span>
              )}
              <span className="text-xs text-slate-500 font-medium">{STARTER_TEMPLATES.length + adminTemplates.length} templates available</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {/* Admin-added templates first */}
            {adminTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl as any)}
                className="group bg-white rounded-2xl border border-violet-200 hover:border-violet-500 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col"
              >
                <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                  <img
                    src={tmpl.previewThumbnail}
                    alt={tmpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 bg-violet-600 text-white text-[9px] font-black rounded-full uppercase">Custom</span>
                  </div>
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3.5 py-1.5 bg-[#7c3aed] text-white rounded-xl text-xs font-bold shadow-md">
                      Customize Template
                    </span>
                  </div>
                </div>
                <div className="p-3 border-t border-violet-100">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                    {tmpl.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {tmpl.category} • {tmpl.dimensions.width}×{tmpl.dimensions.height} px
                  </p>
                </div>
              </div>
            ))}

            {/* Built-in starter templates */}
            {STARTER_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-purple-400 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col"
              >
                <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                  <img
                    src={tmpl.previewThumbnail}
                    alt={tmpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3.5 py-1.5 bg-[#7c3aed] text-white rounded-xl text-xs font-bold shadow-md">
                      Customize Template
                    </span>
                  </div>
                </div>

                <div className="p-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                    {tmpl.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {tmpl.category} • {tmpl.dimensions.width}×{tmpl.dimensions.height} px
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Floating Purple Help Button "?" in Bottom Right (Matching Screenshot) */}
      <div 
        onClick={() => {
          alert('Lumina Design Studio: Double click any text to edit on canvas, or select it and type in the top toolbar! Click Export to download PNG/JPEG/PDF.');
        }}
        className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-lg flex items-center justify-center shadow-xl shadow-purple-600/30 cursor-pointer hover:scale-105 active:scale-95 transition-all z-40"
        title="Help & Shortcuts"
      >
        ?
      </div>

      {/* Custom Dimensions Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Custom Dimensions</h3>
              <button 
                onClick={() => setIsCustomModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Project Name</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 rounded-xl px-3.5 py-2.5 border border-slate-200 outline-none focus:border-purple-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Width (px)</label>
                  <input
                    type="number"
                    min="100"
                    max="6000"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(parseInt(e.target.value) || 100)}
                    className="w-full bg-slate-50 text-slate-900 rounded-xl px-3.5 py-2.5 border border-slate-200 outline-none focus:border-purple-500 font-mono font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Height (px)</label>
                  <input
                    type="number"
                    min="100"
                    max="6000"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(parseInt(e.target.value) || 100)}
                    className="w-full bg-slate-50 text-slate-900 rounded-xl px-3.5 py-2.5 border border-slate-200 outline-none focus:border-purple-500 font-mono font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsCustomModalOpen(false);
                  onCreateNew(customWidth, customHeight, customTitle);
                }}
                className="px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/25 transition-all"
              >
                Create new design
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
