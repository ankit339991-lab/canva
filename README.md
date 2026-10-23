# Lumina Design Studio

> A high-performance, Canva-like online graphic design platform built with React 19, TypeScript, Vite, Tailwind CSS, Konva.js, and an Express/SQLite persistent backend.

---

## 🌟 Overview

**Lumina Design Studio** provides an intuitive, browser-based design experience inspired by Canva. It allows users to create social media posts, presentations, thumbnails, flyers, and custom-dimension artwork with vector precision, real-time transformations, multi-page workflows, and lossless exports.

---

## 🚀 Features

### Core Canvas & Graphics Engine
* **Direct Manipulation Workspace:** Pan and zoom canvas from 20% to 300% with mouse wheel, slider, and fit-to-screen.
* **Interactive Transforms:** 8-point bounding box handles for proportional corner scaling, side resizing, and freeform rotation with angle snapping (0°, 45°, 90°, 180°).
* **Selection & Hit Testing:** Instant click-to-select, drag-to-move, and background click deselect.
* **Smart Keyboard Shortcuts:**
  - `Ctrl + Z`: Undo last action
  - `Ctrl + Y` / `Ctrl + Shift + Z`: Redo
  - `Ctrl + D`: Duplicate selected object
  - `Delete` / `Backspace`: Remove selected object
  - `Arrow Keys`: 1px nudging (`Shift + Arrows`: 10px nudging)
  - `Space + Drag`: Pan the canvas

### Typography & Text Editing
* **Dynamic Inline Editing:** Double-click any text box to edit in-place with real-time canvas synchronization.
* **Rich Web Fonts:** Pre-integrated with Google Fonts: *Inter, Montserrat, Poppins, Outfit, Playfair Display, Anton, Caveat, Pacifico, Roboto Mono*.
* **Typographic Inspector:** Font size (+/- step or direct input), Bold, Italic, Text Alignment (Left, Center, Right), Text Color picker, Letter-spacing, and Line-height.

### Shapes & Vector Elements
* **Primitive Shapes:** Rectangles, Rounded Rectangles (with corner radius slider), Circles, Triangles, Stars (with points and radius controls), and Lines.
* **Curated Vector Icons:** Scalable vector graphics (Sparkles, Heart, Star, Zap, Crown, Shield, Rocket, Music, Shopping Bag).
* **Styling Controls:** Fill color, stroke border width and color, opacity slider (0% to 100%), and drop shadows.

### Image Assets & Uploads
* **File Uploads:** Drag-and-drop or file picker supporting PNG, JPG, WebP, and SVG images up to 15MB.
* **Image Transforms:** Aspect-ratio locked scaling, horizontal flip, vertical flip, and opacity adjustments.

### Multi-Page & Layer Stacking
* **Multi-Page Workflows:** Add blank pages, duplicate existing pages, delete pages, and navigate pages via thumbnail bar.
* **Z-Index Layer Management:** Bring to Front, Send to Back, Move Forward, Move Backward via visual Layer drawer and contextual toolbar.
* **Object Locking:** Lock elements to prevent accidental moves.

### Persistence & Autosave
* **Dual-Layer Storage:** Automatic 1000ms debounced persistence to local storage and SQLite REST API.
* **Visual Status:** Live badge indicating "Saving...", "All changes saved", or offline fallback.
* **Project Dashboard:** Search designs, rename, duplicate, and delete projects.

### Real Multi-Format File Export
* **PNG Export:** Lossless rasterization at 1x or 2x Retina resolution with transparent background support.
* **JPEG Export:** High-performance compressed image with quality slider (50% to 100%).
* **PDF Export:** Multi-page document compilation using `jspdf`.
* **Instant Download:** Real file delivery to browser downloads with confetti celebration.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript | UI component composition & typed state |
| **Build Tool** | Vite 6 | Lightning-fast HMR and production bundling |
| **Graphics Engine** | Konva.js + `react-konva` | 60 FPS HTML5 Canvas scenegraph & transform handles |
| **Styling** | Tailwind CSS | Modern, responsive dark-mode workstation theme |
| **Icons** | Lucide React | Consistent vector iconography |
| **State Management** | Zustand | Centralized store with immutable history stack |
| **Export Engines** | HTML5 Canvas API + `jspdf` | High-DPI rasterization and PDF generation |
| **Backend API** | Node.js + Express | RESTful API for designs and asset uploads |
| **Database** | Persistent JSON store (.data/db.json) | Zero-native dependency, ACID file persistence |
| **Testing** | Vitest | Automated unit and integration test runner |

---

## 📦 Getting Started

### Prerequisites
* Node.js v18+ (tested on Node.js v24.15)
* npm v9+

### Installation & Launch
```bash
# 1. Install dependencies
npm install

# 2. Run both Backend API (port 3001) and Frontend (port 5173) concurrently
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

### Other Scripts
```bash
# Run unit & integration tests
npm test

# Build production bundle
npm run build

# Start only the client
npm run client

# Start only the API server
npm run server
```

---

## 📁 Project Structure

```
├── .data/                  # Persistent SQLite/JSON storage
├── docs/                   # Architectural & reverse engineering reports
│   ├── reverse-engineering-report.md
│   ├── feature-matrix.md
│   ├── user-flows.md
│   ├── technical-architecture.md
│   ├── implementation-roadmap.md
│   └── testing-strategy.md
├── server/                 # Express backend
│   ├── index.ts            # REST API endpoints & static file serving
│   └── db.ts               # Persistent database repository
├── src/                    # Frontend React 19 application
│   ├── components/
│   │   ├── canvas/         # DesignCanvas with Konva Stage & Transformer
│   │   ├── dashboard/      # Project management & preset cards
│   │   ├── export/         # ExportModal (PNG, JPEG, PDF)
│   │   ├── footer/         # BottomPageBar (pages & zoom slider)
│   │   ├── sidebar/        # LeftSidebar (templates, elements, text, uploads)
│   │   └── toolbar/        # TopNavbar & ContextInspector
│   ├── store/              # Zustand useEditorStore
│   ├── templates/          # High-fidelity starter templates
│   ├── types/              # Comprehensive TypeScript interfaces
│   ├── utils/              # Presets, color palettes, fonts
│   ├── App.tsx             # Root router & view switcher
│   ├── index.css           # Tailwind styles & custom scrollbars
│   └── main.tsx            # Application entrypoint
├── tests/                  # Vitest unit & integration test suites
│   ├── api.test.ts
│   └── editorStore.test.ts
├── uploads/                # User uploaded assets directory
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```
