import { create } from 'zustand';
import { 
  DesignDocument, 
  Page, 
  CanvasObject, 
  PageBackground, 
  Dimensions 
} from '../types';

export type SidebarTab = 'templates' | 'elements' | 'text' | 'uploads' | 'background' | 'layers';
export type SaveStatus = 'saved' | 'saving' | 'error';

interface HistoryState {
  past: DesignDocument[];
  future: DesignDocument[];
}

interface EditorState {
  // Document state
  document: DesignDocument;
  selectedId: string | null;
  activeTab: SidebarTab;
  isSidebarOpen: boolean;
  
  // Viewport navigation
  zoom: number; // 0.1 to 3.0
  pan: { x: number; y: number };
  
  // Export modal
  isExportModalOpen: boolean;
  
  // Autosave status
  saveStatus: SaveStatus;
  lastSavedAt: string | null;
  
  // History
  history: HistoryState;
  canUndo: boolean;
  canRedo: boolean;
  
  // Actions: Document
  setDocument: (doc: DesignDocument) => void;
  updateTitle: (title: string) => void;
  updateDimensions: (dimensions: Dimensions) => void;
  
  // Actions: Objects
  addObject: (object: CanvasObject) => void;
  updateObject: (id: string, updates: Partial<CanvasObject>, commit?: boolean) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  reorderObject: (id: string, action: 'front' | 'back' | 'forward' | 'backward') => void;
  toggleLockSelected: () => void;
  
  // Actions: Pages & Background
  setBackground: (bg: PageBackground) => void;
  addPage: () => void;
  duplicatePage: (pageId: string) => void;
  deletePage: (pageId: string) => void;
  setActivePage: (index: number) => void;
  
  // Actions: UI & Workspace
  setSelectedId: (id: string | null) => void;
  setActiveTab: (tab: SidebarTab) => void;
  toggleSidebar: () => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  resetView: (containerWidth: number, containerHeight: number) => void;
  setIsExportModalOpen: (open: boolean) => void;
  
  // Actions: History & Persistence
  undo: () => void;
  redo: () => void;
  commitToHistory: () => void;
  saveNow: () => Promise<void>;
}

const MAX_HISTORY = 30;

function createBlankDocument(title = 'Untitled Design', width = 1080, height = 1080): DesignDocument {
  const pageId = 'page_' + Math.random().toString(36).substring(2, 9);
  return {
    id: 'proj_' + Math.random().toString(36).substring(2, 9),
    title,
    dimensions: { width, height, unit: 'px' },
    activePageIndex: 0,
    pages: [
      {
        id: pageId,
        name: 'Page 1',
        background: { type: 'color', value: '#ffffff' },
        objects: []
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  };
}

export const useEditorStore = create<EditorState>((set, get) => ({
  document: createBlankDocument(),
  selectedId: null,
  activeTab: 'templates',
  isSidebarOpen: true,
  zoom: 1,
  pan: { x: 0, y: 0 },
  isExportModalOpen: false,
  saveStatus: 'saved',
  lastSavedAt: new Date().toLocaleTimeString(),
  history: { past: [], future: [] },
  canUndo: false,
  canRedo: false,

  setDocument: (doc) => {
    set({
      document: doc,
      selectedId: null,
      history: { past: [], future: [] },
      canUndo: false,
      canRedo: false
    });
  },

  updateTitle: (title) => {
    const doc = get().document;
    const updated = { ...doc, title, updatedAt: new Date().toISOString() };
    set({ document: updated });
    get().saveNow();
  },

  updateDimensions: (dimensions) => {
    get().commitToHistory();
    const doc = get().document;
    const updated = { ...doc, dimensions, updatedAt: new Date().toISOString() };
    set({ document: updated });
    get().saveNow();
  },

  commitToHistory: () => {
    const { document, history } = get();
    // Deep clone document
    const clone = JSON.parse(JSON.stringify(document));
    const newPast = [...history.past, clone].slice(-MAX_HISTORY);
    set({
      history: {
        past: newPast,
        future: [] // invalidate redo branch
      },
      canUndo: newPast.length > 0,
      canRedo: false
    });
  },

  undo: () => {
    const { history, document } = get();
    if (history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);
    const currentClone = JSON.parse(JSON.stringify(document));

    set({
      document: previous,
      selectedId: null,
      history: {
        past: newPast,
        future: [currentClone, ...history.future]
      },
      canUndo: newPast.length > 0,
      canRedo: true
    });
    get().saveNow();
  },

  redo: () => {
    const { history, document } = get();
    if (history.future.length === 0) return;

    const next = history.future[0];
    const newFuture = history.future.slice(1);
    const currentClone = JSON.parse(JSON.stringify(document));

    set({
      document: next,
      selectedId: null,
      history: {
        past: [...history.past, currentClone],
        future: newFuture
      },
      canUndo: true,
      canRedo: newFuture.length > 0
    });
    get().saveNow();
  },

  addObject: (object) => {
    get().commitToHistory();
    const doc = get().document;
    const activePage = doc.pages[doc.activePageIndex] || doc.pages[0];
    
    const updatedPage: Page = {
      ...activePage,
      objects: [...activePage.objects, object]
    };

    const newPages = [...doc.pages];
    newPages[doc.activePageIndex] = updatedPage;

    set({
      document: { ...doc, pages: newPages, updatedAt: new Date().toISOString() },
      selectedId: object.id
    });
    get().saveNow();
  },

  updateObject: (id, updates, commit = true) => {
    if (commit) {
      get().commitToHistory();
    }
    const doc = get().document;
    const pageIndex = doc.activePageIndex;
    const page = doc.pages[pageIndex];

    const updatedObjects = page.objects.map((obj) => {
      if (obj.id === id) {
        return { ...obj, ...updates } as CanvasObject;
      }
      return obj;
    });

    const newPages = [...doc.pages];
    newPages[pageIndex] = { ...page, objects: updatedObjects };

    set({
      document: { ...doc, pages: newPages, updatedAt: new Date().toISOString() }
    });
    get().saveNow();
  },

  deleteSelected: () => {
    const { selectedId, document } = get();
    if (!selectedId) return;

    get().commitToHistory();
    const pageIndex = document.activePageIndex;
    const page = document.pages[pageIndex];
    const filtered = page.objects.filter((obj) => obj.id !== selectedId);

    const newPages = [...document.pages];
    newPages[pageIndex] = { ...page, objects: filtered };

    set({
      document: { ...document, pages: newPages, updatedAt: new Date().toISOString() },
      selectedId: null
    });
    get().saveNow();
  },

  duplicateSelected: () => {
    const { selectedId, document } = get();
    if (!selectedId) return;

    const pageIndex = document.activePageIndex;
    const page = document.pages[pageIndex];
    const target = page.objects.find((obj) => obj.id === selectedId);
    if (!target) return;

    get().commitToHistory();
    const duplicate: CanvasObject = {
      ...JSON.parse(JSON.stringify(target)),
      id: 'obj_' + Math.random().toString(36).substring(2, 9),
      x: target.x + 20,
      y: target.y + 20
    };

    const newPages = [...document.pages];
    newPages[pageIndex] = { ...page, objects: [...page.objects, duplicate] };

    set({
      document: { ...document, pages: newPages, updatedAt: new Date().toISOString() },
      selectedId: duplicate.id
    });
    get().saveNow();
  },

  reorderObject: (id, action) => {
    get().commitToHistory();
    const doc = get().document;
    const pageIndex = doc.activePageIndex;
    const page = doc.pages[pageIndex];
    const index = page.objects.findIndex((o) => o.id === id);
    if (index === -1) return;

    const objects = [...page.objects];
    const [target] = objects.splice(index, 1);

    if (action === 'front') {
      objects.push(target);
    } else if (action === 'back') {
      objects.unshift(target);
    } else if (action === 'forward') {
      const newIdx = Math.min(index + 1, objects.length);
      objects.splice(newIdx, 0, target);
    } else if (action === 'backward') {
      const newIdx = Math.max(index - 1, 0);
      objects.splice(newIdx, 0, target);
    }

    const newPages = [...doc.pages];
    newPages[pageIndex] = { ...page, objects };

    set({
      document: { ...doc, pages: newPages, updatedAt: new Date().toISOString() }
    });
    get().saveNow();
  },

  toggleLockSelected: () => {
    const { selectedId, document } = get();
    if (!selectedId) return;
    const page = document.pages[document.activePageIndex];
    const target = page.objects.find((o) => o.id === selectedId);
    if (!target) return;

    get().updateObject(selectedId, { locked: !target.locked });
  },

  setBackground: (bg) => {
    get().commitToHistory();
    const doc = get().document;
    const pageIndex = doc.activePageIndex;
    const page = doc.pages[pageIndex];

    const newPages = [...doc.pages];
    newPages[pageIndex] = { ...page, background: bg };

    set({
      document: { ...doc, pages: newPages, updatedAt: new Date().toISOString() }
    });
    get().saveNow();
  },

  addPage: () => {
    get().commitToHistory();
    const doc = get().document;
    const newPage: Page = {
      id: 'page_' + Math.random().toString(36).substring(2, 9),
      name: `Page ${doc.pages.length + 1}`,
      background: { type: 'color', value: '#ffffff' },
      objects: []
    };

    set({
      document: {
        ...doc,
        pages: [...doc.pages, newPage],
        activePageIndex: doc.pages.length,
        updatedAt: new Date().toISOString()
      },
      selectedId: null
    });
    get().saveNow();
  },

  duplicatePage: (pageId) => {
    get().commitToHistory();
    const doc = get().document;
    const targetIndex = doc.pages.findIndex((p) => p.id === pageId);
    if (targetIndex === -1) return;

    const source = doc.pages[targetIndex];
    // Deep clone objects with new unique IDs
    const clonedObjects = source.objects.map((obj) => ({
      ...JSON.parse(JSON.stringify(obj)),
      id: 'obj_' + Math.random().toString(36).substring(2, 9)
    }));

    const clonedPage: Page = {
      id: 'page_' + Math.random().toString(36).substring(2, 9),
      name: `${source.name} (Copy)`,
      background: JSON.parse(JSON.stringify(source.background)),
      objects: clonedObjects
    };

    const newPages = [...doc.pages];
    newPages.splice(targetIndex + 1, 0, clonedPage);

    set({
      document: {
        ...doc,
        pages: newPages,
        activePageIndex: targetIndex + 1,
        updatedAt: new Date().toISOString()
      },
      selectedId: null
    });
    get().saveNow();
  },

  deletePage: (pageId) => {
    const doc = get().document;
    if (doc.pages.length <= 1) return; // Keep at least one page

    get().commitToHistory();
    const filtered = doc.pages.filter((p) => p.id !== pageId);
    const newActiveIndex = Math.min(doc.activePageIndex, filtered.length - 1);

    set({
      document: {
        ...doc,
        pages: filtered,
        activePageIndex: newActiveIndex,
        updatedAt: new Date().toISOString()
      },
      selectedId: null
    });
    get().saveNow();
  },

  setActivePage: (index) => {
    const doc = get().document;
    if (index >= 0 && index < doc.pages.length) {
      set({
        document: { ...doc, activePageIndex: index },
        selectedId: null
      });
    }
  },

  setSelectedId: (id) => set({ selectedId: id }),
  setActiveTab: (tab) => set({ activeTab: tab, isSidebarOpen: true }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 0.1), 3.0) }),
  setPan: (pan) => set({ pan }),

  resetView: (containerWidth, containerHeight) => {
    const { document } = get();
    const margin = 80;
    const availW = containerWidth - margin * 2;
    const availH = containerHeight - margin * 2;

    const scaleW = availW / document.dimensions.width;
    const scaleH = availH / document.dimensions.height;
    const zoom = Math.min(Math.max(Math.min(scaleW, scaleH), 0.15), 1.5);

    // Center in container
    const x = (containerWidth - document.dimensions.width * zoom) / 2;
    const y = (containerHeight - document.dimensions.height * zoom) / 2;

    set({ zoom, pan: { x, y } });
  },

  setIsExportModalOpen: (open) => set({ isExportModalOpen: open }),

  saveNow: async () => {
    const { document } = get();
    set({ saveStatus: 'saving' });

    // 1. Instant local persistence fallback
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(`lumina_design_${document.id}`, JSON.stringify(document));
        localStorage.setItem('lumina_recent_design_id', document.id);
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
    }

    // 2. Server persistence via REST API
    if (typeof fetch !== 'undefined') {
      try {
        const res = await fetch('/api/designs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(document)
        });
        if (res.ok) {
          set({
            saveStatus: 'saved',
            lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        } else {
          set({ saveStatus: 'saved' }); // Local fallback saved successfully
        }
      } catch {
        set({ saveStatus: 'saved' }); // Local fallback saved successfully
      }
    } else {
      set({ saveStatus: 'saved' });
    }
  }
}));
