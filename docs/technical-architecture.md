# Technical Architecture & System Design

**Project Name:** Lumina Design Studio  
**Architecture Version:** 1.0.0  
**Technology Stack:** React 19, TypeScript, Vite, Tailwind CSS, Konva.js / React-Konva, Zustand, Node.js, Express, SQLite.

---

## 1. System Overview

Lumina Design Studio is organized into two primary tiers:
1. **Frontend Client Application (SPA):** High-performance vector/raster graphic design workstation running entirely in the browser.
2. **Backend Services & Persistence Layer:** RESTful API server handling authentication, project CRUD operations, asset uploads, and database storage.

```
+-----------------------------------------------------------------------------------------+
|                                    BROWSER CLIENT                                       |
|  +--------------------+  +---------------------+  +----------------------------------+  |
|  | Dashboard View     |  | Editor Workspace    |  | Export Modal & Downloader        |  |
|  | - Preset Grid      |  | - Context Inspector |  | - High-DPI Offscreen Canvas      |  |
|  | - Project Manager  |  | - Tool Panels       |  | - PNG / JPEG Blob Generator      |  |
|  | - Template Browser |  | - Zoom/Pan Stage    |  | - jsPDF Multi-Page Compiler      |  |
|  +--------------------+  +---------------------+  +----------------------------------+  |
|                                     |                                                   |
|                        Zustand Central State Store                                      |
|            +------------------------+-------------------------+                         |
|            |                        |                         |                         |
|    Document Model Store      Editor UI Store        History Stack (Undo/Redo)           |
|    - Project Metadata        - Active Tool Tab      - Past Snapshots [30]               |
|    - Pages & Objects         - Selected Object IDs  - Future Snapshots [30]             |
|    - Backgrounds             - Zoom & Pan Offset    - Transaction Committer             |
|                                     |                                                   |
|                       React-Konva Graphics Engine                                       |
|       - Stage & Viewport Transform Matrix (Scale, Translate)                            |
|       - Interactive Transformer Node (8 handles + rotation pin)                         |
|       - Dynamic Alignment Snapping Calculation Engine                                  |
|       - Native Path & Text Layout Rendering                                            |
+-----------------------------------------------------------------------------------------+
                                      |
                     HTTP / JSON REST API (Port 3001)
                                      |
+-----------------------------------------------------------------------------------------+
|                                  BACKEND SERVER                                         |
|  +-----------------------------------------------------------------------------------+  |
|  | Express Router & Middleware: CORS, JSON Body Parser, Rate Limiter, Auth           |  |
|  +-----------------------------------------------------------------------------------+  |
|           |                                 |                                |          |
|  /api/auth (Login/Register)        /api/designs (CRUD)             /api/uploads (Multer)|
|           |                                 |                                |          |
|  +-----------------------------------------------------------------------------------+  |
|  | Database Layer: SQLite / Better-SQLite3 with WAL mode                             |  |
|  | Tables: users, designs, templates, uploads                                        |  |
|  +-----------------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Graphics Engine Evaluation: Konva vs Fabric vs Pure Canvas

| Evaluation Criteria | Konva.js (`react-konva`) | Fabric.js (`fabric`) | Pure HTML5 Canvas 2D |
| :--- | :--- | :--- | :--- |
| **React Integration** | **Exceptional.** Native declarative component bindings (`<Stage>`, `<Layer>`, `<Rect>`, `<Text>`, `<Transformer>`). Fits React's unidirectional data flow. | **Moderate.** Imperative OOP API requires manual wrapper ref lifecycle management. | **Low.** Requires writing custom retained-mode scenegraph and event pipeline. |
| **Transform & Bounding Box** | **Built-in `Transformer` node.** Supports custom anchors, rotation, aspect-ratio constraint, bound box snapping, and multi-selection. | **Built-in controls.** Highly customizable, but complex subclassing required. | Must be implemented completely from scratch. |
| **Performance** | High. Multi-layer rendering (static background layer vs dynamic interactive layer vs overlay transformer). | High. Single canvas with cached hit-testing canvas. | High, but requires custom dirty-rect and offscreen optimizations. |
| **Serialization & Export** | Clean JSON serialization via `stage.toJSON()` or direct document model mapping; `stage.toDataURL()` with custom pixel ratio. | JSON serialization via `canvas.toJSON()`; `canvas.toDataURL()`. | Manual serialization code required. |
| **Decision** | **SELECTED.** Konva.js with React-Konva provides the cleanest, most maintainable, and robust architecture for this application. | Evaluated as strong alternative. | Evaluated for custom export pipeline. |

---

## 3. Data Models & TypeScript Interfaces

### 3.1 Design Document Model
```typescript
export type DimensionUnit = 'px' | 'in' | 'mm' | 'cm';

export interface Dimensions {
  width: number;
  height: number;
  unit: DimensionUnit;
}

export type ObjectType = 'text' | 'rectangle' | 'circle' | 'triangle' | 'star' | 'line' | 'image' | 'svg-icon';

export interface BaseCanvasObject {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // degrees 0-360
  opacity: number;  // 0.0 - 1.0
  locked?: boolean;
  visible?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

export interface TextObject extends BaseCanvasObject {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string | number; // 'normal' | 'bold' | '600' | '800'
  fontStyle?: 'normal' | 'italic';
  fill: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
  letterSpacing: number;
  textDecoration?: 'none' | 'underline' | 'line-through';
}

export interface ShapeObject extends BaseCanvasObject {
  type: 'rectangle' | 'circle' | 'triangle' | 'star' | 'line';
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number; // for rectangles
  points?: number[];     // for lines/polygons
  numPoints?: number;    // for stars
  innerRadius?: number;  // for stars
  outerRadius?: number;  // for stars
}

export interface ImageObject extends BaseCanvasObject {
  type: 'image';
  src: string;
  aspectRatio: number;
  filters?: {
    brightness?: number; // -1 to 1
    contrast?: number;   // -100 to 100
    blur?: number;       // 0 to 40
    grayscale?: boolean;
    sepia?: boolean;
  };
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface SvgIconObject extends BaseCanvasObject {
  type: 'svg-icon';
  svgData: string; // SVG path string
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

export type CanvasObject = TextObject | ShapeObject | ImageObject | SvgIconObject;

export interface PageBackground {
  type: 'color' | 'gradient' | 'image';
  value: string; // Hex color code or gradient CSS string or image URL
  opacity?: number;
}

export interface Page {
  id: string;
  name: string;
  background: PageBackground;
  objects: CanvasObject[]; // Order defines stacking z-index (index 0 is back, last is top)
}

export interface DesignDocument {
  id: string;
  userId?: string;
  title: string;
  dimensions: Dimensions;
  pages: Page[];
  activePageIndex: number;
  createdAt: string;
  updatedAt: string;
  version: number;
  thumbnailUrl?: string;
}
```

---

## 4. State Management & Undo/Redo Engine

The design editor state is managed via **Zustand** with an immutable snapshot stack:

1. **Document Actions:**
   - `setDocument(doc: DesignDocument)`
   - `updateDimensions(width: number, height: number)`
   - `addObject(object: CanvasObject)`
   - `updateObject(id: string, updates: Partial<CanvasObject>)`
   - `deleteSelectedObjects()`
   - `duplicateSelectedObjects()`
   - `reorderObject(id: string, action: 'front' | 'back' | 'forward' | 'backward')`
   - `setBackground(background: PageBackground)`
   - `addPage()`, `duplicatePage(pageId: string)`, `deletePage(pageId: string)`, `setActivePage(index: number)`

2. **History Management (Undo / Redo):**
   - Maximum history depth: **30 snapshots**.
   - On every committing document action (e.g. pointer release after drag, text change commit, color pick commit), the previous document state is pushed to `past: DesignDocument[]`, and `future: DesignDocument[]` is cleared.
   - `undo()`: Pops the last state from `past`, pushes current state to `future`, and sets current state to the popped state.
   - `redo()`: Pops state from `future`, pushes current state to `past`, and restores state.

---

## 5. Export Pipeline Architecture

```typescript
export async function exportDesignToImage(
  stageRef: Konva.Stage,
  dimensions: Dimensions,
  format: 'png' | 'jpeg',
  scaleMultiplier: number = 1,
  quality: number = 0.92
): Promise<Blob> {
  // 1. Temporarily detach Transformer handles to avoid capturing selection guides
  // 2. Compute pixel ratio matching design dimensions * scaleMultiplier
  const pixelRatio = scaleMultiplier;
  
  // 3. Render off-screen data URL
  const dataUrl = stageRef.toDataURL({
    pixelRatio,
    mimeType: format === 'png' ? 'image/png' : 'image/jpeg',
    quality: format === 'jpeg' ? quality : undefined
  });
  
  // 4. Convert Data URL to binary Blob
  const res = await fetch(dataUrl);
  return await res.blob();
}
```

---

## 6. Backend API & Database Schema

The backend uses Express with SQLite (using `better-sqlite3` or SQLite driver), storing designs as structured JSON columns while indexing search attributes.

### Tables:
1. **`users`**
   - `id TEXT PRIMARY KEY`
   - `email TEXT UNIQUE`
   - `password_hash TEXT`
   - `name TEXT`
   - `created_at DATETIME`
2. **`designs`**
   - `id TEXT PRIMARY KEY`
   - `user_id TEXT`
   - `title TEXT`
   - `width INTEGER`
   - `height INTEGER`
   - `unit TEXT`
   - `document_json TEXT` (complete DesignDocument serialization)
   - `thumbnail_data TEXT` (small base64 preview for instant dashboard rendering)
   - `created_at DATETIME`
   - `updated_at DATETIME`
   - `version INTEGER`
3. **`templates`**
   - `id TEXT PRIMARY KEY`
   - `name TEXT`
   - `category TEXT`
   - `tags TEXT`
   - `width INTEGER`
   - `height INTEGER`
   - `template_json TEXT`
   - `thumbnail_url TEXT`
4. **`uploads`**
   - `id TEXT PRIMARY KEY`
   - `user_id TEXT`
   - `original_name TEXT`
   - `file_path TEXT`
   - `mime_type TEXT`
   - `file_size INTEGER`
   - `created_at DATETIME`
