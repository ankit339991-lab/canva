# Reverse Engineering Report: Canva-Like Graphic Design Platform

**Platform Analyzed:** Canva ([https://www.canva.com/](https://www.canva.com/)) & Canva AI ([https://www.canva.com/en_in/canva-ai/](https://www.canva.com/en_in/canva-ai/))  
**Analysis Date:** 2026-10-18  
**Author:** Antigravity Engineering & Architecture Team  
**Scope:** Public observable behavior, UX flow, layout mechanics, scene graph data models, and clean-room implementation architecture.

---

## 1. Executive Summary

Canva is a web-first graphic design and visual communication platform. Its core value proposition is democratizing design by eliminating the steep learning curve of desktop publishing tools (such as Adobe Illustrator or InDesign). It accomplishes this through:
1. **Instant Design Initiation:** Dimension presets, searchable curated templates, and instant project instantiation.
2. **Direct Manipulation Canvas:** WYSIWYG editing surface with interactive selection bounding boxes, 8-point scaling handles, rotation levers, smart alignment guides, and layer ordering.
3. **Structured Scene Graph:** Hierarchical, serializable document tree representing pages, vector paths, text nodes, images, and grouping containers.
4. **Contextual Toolbars:** Clean interface that reveals formatting controls (font, color, alignment, effects, position) dynamically depending on the active selection.
5. **Lossless Multi-Format Export:** High-DPI rasterization (PNG, JPEG), vector representation (SVG), and multi-page packaging.

This report documents our reverse engineering analysis of Canva's observable functionality and translates those observations into a clean-room, production-grade architecture for our application: **Lumina Design Studio** (code-named *Aura Canvas*).

---

## 2. Observable Architectural Anatomy

### 2.1 The Dashboard & Navigation Layer
* **Top Navigation:** Brand identity, global asset search ("Search templates or designs"), notifications, user profile menu, and prominent "Create a design" action button.
* **Hero Presets Carousel:** Categorized visual buttons for standard canvas sizes:
  - Instagram Post (1080 x 1080)
  - Instagram Story (1080 x 1920)
  - YouTube Thumbnail (1280 x 720)
  - Presentation (1920 x 1080, 16:9)
  - Flyer / Poster (A4: 2480 x 3508 / 1414 x 2000)
  - Custom Dimensions modal (Width, Height, Units: px, in, mm, cm)
* **Recent Projects Grid:** Live project cards showing thumbnail previews, project title, last modified timestamp, and a contextual 3-dot dropdown (Rename, Duplicate, Open in new tab, Delete).
* **Template Inspiration Feeds:** Segmented category tabs with hoverable preview cards that clone a template into a user-owned project upon click.

### 2.2 The Design Editor Layout
Canva uses a 4-tier desktop workstation layout:
```
+-----------------------------------------------------------------------------+
| Top Navigation Bar: [Back] [Title/Rename] [Cloud Save Status] [Undo/Redo] [Export/Share] |
+-----------------------------------------------------------------------------+
| Contextual Inspector: Dynamic options based on selection (Text/Shape/Image) |
+------------+----------------------------------------------------------------+
| Tool Tabs  | Central Workspace                                              |
| (60px)     | - Neutral gray background (#f1f2f6)                            |
| Templates  | - Zoom & Pan viewport                                          |
| Elements   | - White canvas with drop shadow                                |
| Text       | - Multi-page vertical stack or slide switcher                  |
| Uploads    | - Selection bounding box & transformation handles               |
| Background | - Dynamic snapping/alignment guide lines                       |
+------------+                                                                |
| Expanded   | Bottom Bar: Page thumbnails, page counter, zoom slider         |
| Panel      +----------------------------------------------------------------+
| (320px)    |                                                                |
+------------+----------------------------------------------------------------+
```

---

## 3. Deep Dive: Core Functional Subsystems

### 3.1 Canvas Interaction & Object Manipulation
* **Hit Testing & Selection:** Clicking an object casts a bounding box around it. Clicking the canvas background clears active selection. Shift-clicking supports multi-selection.
* **Transform Handles:**
  - 4 corner handles: Proportional / aspect-ratio locked scaling.
  - 4 edge handles: Non-uniform scaling (width/height independently).
  - Rotation pill/handle: Extending below or above the bottom edge; enables rotational dragging with angle snapping at 0°, 45°, 90°, 180°, etc.
* **Keyboard Direct Controls:**
  - Arrow keys: 1px nudging (Shift + Arrow: 10px nudging).
  - Delete / Backspace: Removes selected elements.
  - Ctrl+C / Ctrl+V / Ctrl+D: Copy, paste, and duplicate.
  - Ctrl+Z / Ctrl+Y: Undo / Redo.
  - Ctrl+[ and Ctrl+]: Layer down / Layer up.

### 3.2 Text Editing & Typography
* **Object Structure:** Contains `text`, `fontFamily`, `fontSize`, `fontWeight`, `fontStyle`, `fill` (color), `textAlign` (left, center, right, justify), `lineHeight`, `letterSpacing`, `opacity`, `textDecoration`.
* **Interaction Lifecycle:**
  - Single click selects the text box for moving and resizing with word-wrap reflow.
  - Double click or click-to-edit converts the node into an active typing state with a cursor.
  - Font picker supports standard system and Google Web Fonts (Inter, Roboto, Montserrat, Playfair Display, Outfit, Poppins, etc.).

### 3.3 Elements, Shapes & Vector Graphics
* Supported primitive shapes: Rectangles, rounded rectangles, circles, ellipses, triangles, stars, polygons, lines, and arrows.
* Shape styling attributes:
  - Fill color (solid, gradient)
  - Stroke / border (color, width, dash pattern)
  - Corner radius for rectangles
  - Shadow effects (blur, color, offset x/y)
  - Opacity (0 to 1)

### 3.4 Image Upload & Manipulation
* File input handling: Drag-and-drop onto canvas or via the Uploads sidebar tab.
* Client-side validation: MIME type check (image/png, image/jpeg, image/webp, image/svg+xml), file size limits (< 15MB).
* Rendering & Processing:
  - Canvas bitmap loading with crossOrigin management.
  - Aspect ratio preservation during insertion.
  - Flipping (horizontal, vertical).
  - Basic image adjustments/filters: brightness, contrast, saturation, blur, grayscale, sepia.

### 3.5 Layer Ordering & Grouping
* Z-Index representation: Serialized array order in the page's `objects` list.
* Actions:
  - **Bring to Front:** Shifts object to the last index of the array.
  - **Send to Back:** Shifts object to index 0.
  - **Bring Forward:** Swaps index with `index + 1`.
  - **Send Backward:** Swaps index with `index - 1`.
* Lock / Unlock: Prevents accidental dragging or editing when active.

### 3.6 Multi-Page Management
* Each design document contains an array of `pages: Page[]`.
* Page actions:
  - Add new blank page (matching project dimensions).
  - Duplicate active page (deep clone of objects).
  - Delete page (with safeguard against deleting the last page).
  - Reorder pages up/down.
  - Page naming (e.g. "Page 1 - Cover", "Page 2 - Content").

### 3.7 Autosave & State Management
* **State Separation:**
  - *Document State:* Design JSON (dimensions, pages, objects, background).
  - *Editor UI State:* Active tool tab, zoom level, pan coordinates, selection IDs, history index.
* **Debounced Persistence:** 1000ms debounce timer triggers local storage + API backend synchronization after document mutations.
* **Save Status Indicator:** "Saving...", "All changes saved", or "Offline / Save error" badge in top header.

### 3.8 Real Export Engine
* Format options:
  - **PNG:** Lossless raster, transparent background toggle, scalable resolution multiplier (1x, 2x for Retina).
  - **JPEG:** Compressed raster with quality slider (0.7 to 1.0).
  - **SVG:** Scalable vector markup representation.
  - **PDF:** Multi-page printable document.
* Client-side direct download: Canvas rendering to data URL / Blob, triggered via programmatic anchor element with RFC-safe filenames.

---

## 4. Reverse Engineered Document Schema (JSON)

```json
{
  "id": "proj_a91b2c3d",
  "version": "1.0.0",
  "title": "Summer Sale Instagram Post",
  "dimensions": {
    "width": 1080,
    "height": 1080,
    "unit": "px"
  },
  "createdAt": "2026-10-18T12:00:00.000Z",
  "updatedAt": "2026-10-18T12:05:30.000Z",
  "pages": [
    {
      "id": "page_001",
      "name": "Page 1",
      "background": {
        "type": "color",
        "value": "#1e293b",
        "opacity": 1.0
      },
      "objects": [
        {
          "id": "obj_rect_1",
          "type": "rectangle",
          "x": 80,
          "y": 80,
          "width": 920,
          "height": 920,
          "rotation": 0,
          "fill": "#0f172a",
          "stroke": "#38bdf8",
          "strokeWidth": 4,
          "cornerRadius": 16,
          "opacity": 1.0,
          "locked": false
        },
        {
          "id": "obj_txt_1",
          "type": "text",
          "x": 140,
          "y": 200,
          "width": 800,
          "height": 120,
          "rotation": 0,
          "text": "BIG SUMMER SALE",
          "fontFamily": "Inter",
          "fontSize": 64,
          "fontWeight": "800",
          "fill": "#f8fafc",
          "textAlign": "center",
          "lineHeight": 1.2,
          "letterSpacing": 2,
          "opacity": 1.0,
          "locked": false
        }
      ]
    }
  ]
}
```

---

## 5. Clean-Room Implementation Plan

To respect IP boundaries while delivering a high-quality alternative:
1. **Original Visual Identity:** Modern dark/light glassmorphism aesthetics, custom icons via Lucide, and unique color palette.
2. **Original Codebase:** React 19 + TypeScript + Vite + Fabric.js / Konva / HTML5 Canvas + Tailwind CSS.
3. **Curated Original Templates:** Hand-crafted, royalty-free starter designs spanning social media, marketing, and banners.
4. **Resilient Local & Remote Persistence:** SQLite/IndexedDB persistence engine with zero-dependency instant startup.
