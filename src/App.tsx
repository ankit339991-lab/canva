import React, { useState, useEffect } from 'react';
import Konva from 'konva';
import { useEditorStore } from './store/useEditorStore';
import { TopNavbar } from './components/toolbar/TopNavbar';
import { ContextInspector } from './components/toolbar/ContextInspector';
import { LeftSidebar } from './components/sidebar/LeftSidebar';
import { DesignCanvas } from './components/canvas/DesignCanvas';
import { BottomPageBar } from './components/footer/BottomPageBar';
import { ExportModal } from './components/export/ExportModal';
import { Dashboard } from './components/dashboard/Dashboard';
import { AdminPanel } from './components/admin/AdminPanel';
import { DesignDocument } from './types';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor' | 'admin'>('dashboard');
  const [stageInstance, setStageInstance] = useState<Konva.Stage | null>(null);

  const { setDocument } = useEditorStore();

  // Check for admin route via hash
  useEffect(() => {
    const checkRoute = () => {
      if (window.location.hash === '#/admin') {
        setCurrentView('admin');
      }
    };
    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    return () => window.removeEventListener('hashchange', checkRoute);
  }, []);

  const handleOpenDesign = (doc: DesignDocument) => {
    setDocument(doc);
    setCurrentView('editor');
  };

  const handleCreateNew = (width: number, height: number, title?: string) => {
    const pageId = 'page_' + Math.random().toString(36).substring(2, 9);
    const newDoc: DesignDocument = {
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      title: title || 'Untitled Design',
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

    setDocument(newDoc);
    setCurrentView('editor');
  };

  if (currentView === 'admin') {
    return (
      <AdminPanel onBack={() => {
        window.location.hash = '';
        setCurrentView('dashboard');
      }} />
    );
  }

  if (currentView === 'dashboard') {
    return (
      <Dashboard
        onOpenDesign={handleOpenDesign}
        onCreateNew={handleCreateNew}
      />
    );
  }


  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. Header Toolbar */}
      <TopNavbar onBackToDashboard={() => setCurrentView('dashboard')} />

      {/* 2. Contextual Inspector */}
      <ContextInspector />

      {/* 3. Main Workspace Area: Sidebar + Canvas */}
      <div className="flex-1 flex overflow-hidden relative">
        <LeftSidebar />
        <main className="flex-1 h-full relative">
          <DesignCanvas onExportReady={(stage) => setStageInstance(stage)} />
        </main>
      </div>

      {/* 4. Bottom Page Bar */}
      <BottomPageBar />

      {/* 5. Export Modal */}
      <ExportModal stage={stageInstance} />
    </div>
  );
};

export default App;
