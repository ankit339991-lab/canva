import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Plus, Trash2, Edit3, Save, X, Lock, Eye, EyeOff,
  LayoutTemplate, Sparkles, Search, AlertCircle, CheckCircle2,
  RefreshCw, Shield, Tag
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface AdminTemplate {
  id: string;
  name: string;
  category: string;
  tags: string[];
  dimensions: { width: number; height: number; unit: string };
  previewThumbnail: string;
  description?: string;
  createdAt: string;
  document: any;
}

interface AdminPanelProps {
  onBack: () => void;
}

const ADMIN_PASSWORD = 'lumina2026admin';

const DEFAULT_CATEGORIES = [
  'Social Media', 'Marketing & Print', 'YouTube', 'Presentation',
  'Education', 'Business', 'Personal', 'Custom'
];

function createBlankDocument(title: string, width: number, height: number) {
  return {
    title,
    dimensions: { width, height, unit: 'px' },
    version: 1,
    activePageIndex: 0,
    pages: [{
      id: 'p1',
      name: 'Page 1',
      background: { type: 'color', value: '#ffffff' },
      objects: [
        {
          id: 'txt-title',
          type: 'text',
          x: width * 0.1,
          y: height * 0.4,
          width: width * 0.8,
          height: 80,
          rotation: 0,
          opacity: 1,
          text: title,
          fontFamily: 'Outfit',
          fontSize: Math.max(32, Math.round(width * 0.05)),
          fontWeight: '700',
          fill: '#1e293b',
          textAlign: 'center',
          lineHeight: 1.2,
          letterSpacing: 0
        }
      ]
    }]
  };
}

// ── Template Form ──────────────────────────────────────────────────────────────
const TemplateForm: React.FC<{
  initial?: AdminTemplate | null;
  onSave: (t: AdminTemplate) => void;
  onCancel: () => void;
}> = ({ initial, onSave, onCancel }) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [category, setCategory] = useState(initial?.category ?? 'Social Media');
  const [customCategory, setCustomCategory] = useState('');
  const [tagsInput, setTagsInput] = useState(initial?.tags?.join(', ') ?? '');
  const [width, setWidth] = useState(initial?.dimensions.width ?? 1080);
  const [height, setHeight] = useState(initial?.dimensions.height ?? 1080);
  const [thumbnail, setThumbnail] = useState(initial?.previewThumbnail ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [error, setError] = useState('');

  const isCustomCat = category === 'Custom';

  const handleSave = () => {
    if (!name.trim()) { setError('Template name is required.'); return; }
    if (!thumbnail.trim()) { setError('Preview thumbnail URL is required.'); return; }
    if (width < 100 || height < 100) { setError('Dimensions must be at least 100px.'); return; }
    const finalCategory = isCustomCat ? customCategory.trim() || 'Custom' : category;
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const tmpl: AdminTemplate = {
      id: initial?.id ?? `tmpl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      category: finalCategory,
      tags,
      dimensions: { width, height, unit: 'px' },
      previewThumbnail: thumbnail.trim(),
      description: description.trim(),
      createdAt: initial?.createdAt ?? new Date().toISOString(),
      document: initial?.document ?? createBlankDocument(name.trim(), width, height)
    };
    onSave(tmpl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0f172a] border border-slate-700/60 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/60 bg-gradient-to-r from-violet-900/40 to-indigo-900/40">
          <div className="flex items-center gap-2.5">
            <LayoutTemplate className="w-5 h-5 text-violet-400" />
            <h2 className="font-bold text-white text-base">{initial ? 'Edit Template' : 'Add New Template'}</h2>
          </div>
          <button onClick={onCancel} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Template Name *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Summer Sale Poster"
              className="w-full bg-slate-800 text-white rounded-xl px-4 py-2.5 text-sm border border-slate-700 focus:border-violet-500 outline-none placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-slate-800 text-white rounded-xl px-4 py-2.5 text-sm border border-slate-700 focus:border-violet-500 outline-none"
            >
              {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {isCustomCat && (
              <input
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value)}
                placeholder="Enter custom category..."
                className="mt-2 w-full bg-slate-800 text-white rounded-xl px-4 py-2.5 text-sm border border-slate-700 focus:border-violet-500 outline-none placeholder:text-slate-500"
              />
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Tags (comma-separated)</label>
            <input
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="e.g. instagram, sale, summer, retail"
              className="w-full bg-slate-800 text-white rounded-xl px-4 py-2.5 text-sm border border-slate-700 focus:border-violet-500 outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Width (px) *</label>
              <input
                type="number" min={100} max={8000}
                value={width}
                onChange={e => setWidth(parseInt(e.target.value) || 100)}
                className="w-full bg-slate-800 text-white rounded-xl px-4 py-2.5 text-sm border border-slate-700 focus:border-violet-500 outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Height (px) *</label>
              <input
                type="number" min={100} max={8000}
                value={height}
                onChange={e => setHeight(parseInt(e.target.value) || 100)}
                className="w-full bg-slate-800 text-white rounded-xl px-4 py-2.5 text-sm border border-slate-700 focus:border-violet-500 outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Instagram Post', w: 1080, h: 1080 },
              { label: 'Story', w: 1080, h: 1920 },
              { label: 'YouTube Thumb', w: 1280, h: 720 },
              { label: 'A4 Portrait', w: 794, h: 1123 },
              { label: 'Presentation', w: 1920, h: 1080 },
            ].map(p => (
              <button
                key={p.label}
                type="button"
                onClick={() => { setWidth(p.w); setHeight(p.h); }}
                className="px-2.5 py-1 bg-slate-700 hover:bg-violet-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Preview Thumbnail URL *</label>
            <input
              value={thumbnail}
              onChange={e => setThumbnail(e.target.value)}
              placeholder="https://images.unsplash.com/photo-... or /uploads/my-image.jpg"
              className="w-full bg-slate-800 text-white rounded-xl px-4 py-2.5 text-sm border border-slate-700 focus:border-violet-500 outline-none placeholder:text-slate-500"
            />
            {thumbnail && (
              <div className="mt-2 rounded-xl overflow-hidden h-28 bg-slate-700 border border-slate-600">
                <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Description (optional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Short description of this template..."
              className="w-full bg-slate-800 text-white rounded-xl px-4 py-2.5 text-sm border border-slate-700 focus:border-violet-500 outline-none resize-none placeholder:text-slate-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-700/40 rounded-xl px-4 py-2.5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-colors shadow-lg shadow-violet-900/40 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {initial ? 'Save Changes' : 'Add Template'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Admin Panel ──────────────────────────────────────────────────────────
export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [search, setSearch] = useState('');
  const [editTarget, setEditTarget] = useState<AdminTemplate | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isNewForm, setIsNewForm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadTemplates = () => {
    try {
      const raw = localStorage.getItem('lumina_admin_templates');
      if (raw) setTemplates(JSON.parse(raw));
    } catch {}
  };

  const saveTemplates = (list: AdminTemplate[]) => {
    localStorage.setItem('lumina_admin_templates', JSON.stringify(list));
    setTemplates(list);
  };

  useEffect(() => {
    if (isAuthenticated) loadTemplates();
  }, [isAuthenticated]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect admin password. Please try again.');
    }
  };

  const handleSaveTemplate = (t: AdminTemplate) => {
    const existing = templates.findIndex(x => x.id === t.id);
    let updated: AdminTemplate[];
    if (existing >= 0) {
      updated = templates.map(x => x.id === t.id ? t : x);
      showToast(`Template "${t.name}" updated successfully!`);
    } else {
      updated = [t, ...templates];
      showToast(`Template "${t.name}" added successfully!`);
    }
    saveTemplates(updated);
    setShowForm(false);
    setEditTarget(null);
    setIsNewForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = templates.filter(t => t.id !== id);
    saveTemplates(updated);
    setDeleteConfirm(null);
    showToast('Template deleted.', 'error');
  };

  const filtered = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase()) ||
    (t.tags || []).some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  // ── Login Screen ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto shadow-2xl shadow-violet-900/50 mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Admin Portal</h1>
            <p className="text-slate-400 text-sm mt-1">Lumina Design Studio</p>
          </div>

          <div className="bg-[#0f172a] border border-slate-700/60 rounded-3xl p-6 shadow-2xl space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-2 block uppercase tracking-wider">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter admin password..."
                  className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm border border-slate-700 focus:border-violet-500 outline-none pr-11 placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-700/40 rounded-xl px-3 py-2 text-xs">
                <AlertCircle className="w-4 h-4" />
                {authError}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-violet-900/40 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Access Admin Panel
            </button>

            <button
              onClick={onBack}
              className="w-full py-2.5 text-slate-400 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>

          <p className="text-center text-slate-600 text-[11px] mt-4">
            Admin access only • Unauthorized access is prohibited
          </p>
        </div>
      </div>
    );
  }

  // ── Admin Dashboard ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold ${
          toast.type === 'success'
            ? 'bg-emerald-900 border border-emerald-600/40 text-emerald-300'
            : 'bg-red-900 border border-red-600/40 text-red-300'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-700/60 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-900/40 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Delete Template?</h3>
              <p className="text-slate-400 text-sm mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 border border-slate-700 text-slate-400 hover:text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Form Modal */}
      {showForm && (
        <TemplateForm
          initial={isNewForm ? null : editTarget}
          onSave={handleSaveTemplate}
          onCancel={() => { setShowForm(false); setEditTarget(null); setIsNewForm(false); }}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#020617]/90 backdrop-blur-xl border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-black text-white text-lg leading-none">Admin Panel</h1>
              <p className="text-slate-500 text-xs mt-0.5">Lumina Template Manager</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadTemplates}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setIsNewForm(true); setEditTarget(null); setShowForm(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-violet-900/30"
            >
              <Plus className="w-4 h-4" />
              Add Template
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Templates', value: templates.length, icon: LayoutTemplate },
            { label: 'Categories', value: [...new Set(templates.map(t => t.category))].length, icon: Tag },
            { label: 'Added This Month', value: templates.filter(t => new Date(t.createdAt) > new Date(Date.now() - 30 * 86400000)).length, icon: Sparkles },
          ].map(stat => (
            <div key={stat.label} className="bg-[#0f172a] border border-slate-800/60 rounded-2xl p-4">
              <div className="w-8 h-8 rounded-lg bg-violet-900/50 flex items-center justify-center mb-3">
                <stat.icon className="w-4 h-4 text-violet-400" />
              </div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search templates by name, category, or tag..."
              className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-violet-500 outline-none placeholder:text-slate-500"
            />
          </div>
          <div className="text-xs text-slate-500 whitespace-nowrap">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto">
              <LayoutTemplate className="w-8 h-8 text-slate-600" />
            </div>
            <div>
              <p className="text-slate-400 font-semibold">{templates.length === 0 ? 'No templates yet' : 'No results found'}</p>
              <p className="text-slate-600 text-sm mt-1">
                {templates.length === 0 ? 'Click "Add Template" to create your first template.' : 'Try a different search query.'}
              </p>
            </div>
            {templates.length === 0 && (
              <button
                onClick={() => { setIsNewForm(true); setEditTarget(null); setShowForm(true); }}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-1.5" />Add First Template
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(t => (
              <div key={t.id} className="group bg-[#0f172a] border border-slate-800/60 hover:border-violet-500/50 rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:shadow-violet-900/20">
                <div className="aspect-video bg-slate-800 relative overflow-hidden">
                  {t.previewThumbnail ? (
                    <img
                      src={t.previewThumbnail}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <LayoutTemplate className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => { setEditTarget(t); setIsNewForm(false); setShowForm(true); }}
                      className="p-2 bg-white/10 hover:bg-violet-600 text-white rounded-lg backdrop-blur-sm transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(t.id)}
                      className="p-2 bg-white/10 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-slate-300 text-[10px] font-mono rounded-md">
                    {t.dimensions.width}×{t.dimensions.height}
                  </div>
                </div>

                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{t.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{t.category}</p>
                    </div>
                  </div>
                  {t.tags && t.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {t.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded-md">{tag}</span>
                      ))}
                      {t.tags.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-500 rounded-md">+{t.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => { setEditTarget(t); setIsNewForm(false); setShowForm(true); }}
                      className="flex-1 py-1.5 border border-slate-700 hover:border-violet-500 text-slate-400 hover:text-violet-400 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(t.id)}
                      className="py-1.5 px-2.5 border border-slate-700 hover:border-red-500 text-slate-400 hover:text-red-400 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Box */}
        <div className="bg-violet-900/10 border border-violet-800/30 rounded-2xl p-5 text-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="font-bold text-violet-300">How Admin Templates Work</span>
          </div>
          <ul className="space-y-1.5 text-slate-400 text-xs list-disc list-inside">
            <li>Templates added here are stored in <code className="text-violet-300 bg-violet-900/30 px-1 rounded">localStorage</code> and appear in the dashboard "Explore Templates" section.</li>
            <li>Use any public image URL (Unsplash, your own uploads) as the preview thumbnail.</li>
            <li>After adding a template, users can click it from the Dashboard to open and customize it.</li>
            <li>Access this panel anytime at <code className="text-violet-300 bg-violet-900/30 px-1 rounded">/#/admin</code></li>
            <li>Admin password: <code className="text-violet-300 bg-violet-900/30 px-1 rounded">lumina2026admin</code></li>
          </ul>
        </div>
      </main>
    </div>
  );
};
