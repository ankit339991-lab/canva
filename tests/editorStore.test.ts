import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '../src/store/useEditorStore';
import { TextObject, ShapeObject, PageBackground } from '../src/types';

describe('Editor Store & Document Model', () => {
  beforeEach(() => {
    // Reset store before each test
    const { setDocument } = useEditorStore.getState();
    setDocument({
      id: 'test_proj_1',
      title: 'Test Design',
      dimensions: { width: 1080, height: 1080, unit: 'px' },
      activePageIndex: 0,
      pages: [
        {
          id: 'p1',
          name: 'Page 1',
          background: { type: 'color', value: '#ffffff' },
          objects: []
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    });
  });

  it('initializes with default design dimensions', () => {
    const state = useEditorStore.getState();
    expect(state.document.dimensions.width).toBe(1080);
    expect(state.document.dimensions.height).toBe(1080);
    expect(state.document.pages.length).toBe(1);
    expect(state.document.title).toBe('Test Design');
  });

  it('updates project title', () => {
    useEditorStore.getState().updateTitle('Brand New Campaign');
    expect(useEditorStore.getState().document.title).toBe('Brand New Campaign');
  });

  it('adds and selects a text object', () => {
    const textObj: TextObject = {
      id: 'txt_test_1',
      type: 'text',
      x: 100,
      y: 100,
      width: 400,
      height: 60,
      rotation: 0,
      opacity: 1,
      text: 'Hello World',
      fontFamily: 'Inter',
      fontSize: 48,
      fontWeight: '700',
      fill: '#000000',
      textAlign: 'center',
      lineHeight: 1.2,
      letterSpacing: 0
    };

    useEditorStore.getState().addObject(textObj);
    const page = useEditorStore.getState().document.pages[0];

    expect(page.objects.length).toBe(1);
    expect(page.objects[0].id).toBe('txt_test_1');
    expect(useEditorStore.getState().selectedId).toBe('txt_test_1');
  });

  it('updates object properties', () => {
    const shapeObj: ShapeObject = {
      id: 'shape_rect_1',
      type: 'rectangle',
      x: 50,
      y: 50,
      width: 200,
      height: 200,
      rotation: 0,
      opacity: 1,
      fill: '#38bdf8'
    };

    useEditorStore.getState().addObject(shapeObj);
    useEditorStore.getState().updateObject('shape_rect_1', { fill: '#ec4899', width: 350 });

    const updated = useEditorStore.getState().document.pages[0].objects[0] as ShapeObject;
    expect(updated.fill).toBe('#ec4899');
    expect(updated.width).toBe(350);
  });

  it('supports undo and redo transaction history', () => {
    const store = useEditorStore.getState();
    expect(store.canUndo).toBe(false);

    // 1. Add object A
    store.addObject({
      id: 'item_a',
      type: 'rectangle',
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      rotation: 0,
      opacity: 1,
      fill: '#ffffff'
    });

    expect(useEditorStore.getState().canUndo).toBe(true);
    expect(useEditorStore.getState().document.pages[0].objects.length).toBe(1);

    // 2. Undo
    useEditorStore.getState().undo();
    expect(useEditorStore.getState().document.pages[0].objects.length).toBe(0);
    expect(useEditorStore.getState().canRedo).toBe(true);

    // 3. Redo
    useEditorStore.getState().redo();
    expect(useEditorStore.getState().document.pages[0].objects.length).toBe(1);
    expect(useEditorStore.getState().document.pages[0].objects[0].id).toBe('item_a');
  });

  it('manages multiple pages (add, duplicate, delete)', () => {
    const store = useEditorStore.getState();
    expect(store.document.pages.length).toBe(1);

    // Add page
    store.addPage();
    expect(useEditorStore.getState().document.pages.length).toBe(2);
    expect(useEditorStore.getState().document.activePageIndex).toBe(1);

    // Duplicate current page
    const page2Id = useEditorStore.getState().document.pages[1].id;
    store.duplicatePage(page2Id);
    expect(useEditorStore.getState().document.pages.length).toBe(3);

    // Delete page
    store.deletePage(page2Id);
    expect(useEditorStore.getState().document.pages.length).toBe(2);
  });

  it('reorders object layer stacking (bring to front / send to back)', () => {
    const store = useEditorStore.getState();
    store.addObject({
      id: 'layer_1',
      type: 'rectangle',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotation: 0,
      opacity: 1,
      fill: '#111111'
    });
    store.addObject({
      id: 'layer_2',
      type: 'circle',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotation: 0,
      opacity: 1,
      fill: '#222222'
    });
    store.addObject({
      id: 'layer_3',
      type: 'star',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotation: 0,
      opacity: 1,
      fill: '#333333'
    });

    const page = useEditorStore.getState().document.pages[0];
    expect(page.objects.map((o) => o.id)).toEqual(['layer_1', 'layer_2', 'layer_3']);

    // Send layer_3 to back
    useEditorStore.getState().reorderObject('layer_3', 'back');
    const afterBack = useEditorStore.getState().document.pages[0];
    expect(afterBack.objects.map((o) => o.id)).toEqual(['layer_3', 'layer_1', 'layer_2']);

    // Bring layer_3 to front
    useEditorStore.getState().reorderObject('layer_3', 'front');
    const afterFront = useEditorStore.getState().document.pages[0];
    expect(afterFront.objects.map((o) => o.id)).toEqual(['layer_1', 'layer_2', 'layer_3']);
  });

  it('customizes page background color', () => {
    const bg: PageBackground = { type: 'color', value: '#6366f1' };
    useEditorStore.getState().setBackground(bg);
    expect(useEditorStore.getState().document.pages[0].background.value).toBe('#6366f1');
  });
});
