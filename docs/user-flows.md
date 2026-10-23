# User Flows & Interaction Specifications

This document maps the primary user journeys and interaction states within **Lumina Design Studio**.

---

## 1. Flow: Create New Design (Presets vs Custom)

```mermaid
graph TD
    A[User on Dashboard] --> B{Click Action}
    B -->|Select Preset Card| C[Select: Instagram, Story, Thumbnail, Flyer, etc.]
    B -->|Click 'Custom Size'| D[Input Width, Height & Unit: px, in, mm]
    D --> E[Validate Dimensions > 40px and < 8000px]
    C --> F[Initialize Design Document State]
    E --> F
    F --> G[Generate Unique Project ID & Initial Blank Page]
    G --> H[Redirect to Editor: /editor/:projectId]
    H --> I[Mount Canvas Viewport Centered with 100% Fit]
```

### Steps:
1. User arrives on Dashboard (`/`).
2. User clicks a preset button (e.g., "Instagram Post 1080x1080") or clicks "Custom Size".
3. If custom, user inputs width and height (e.g., `1200` x `630` px).
4. System validates dimensions, creates a new document model with 1 default blank page, and persists it to local storage / DB.
5. Router navigates to `/editor/:id`.
6. Canvas automatically calculates initial zoom scale to fit comfortably inside the viewport with margins.

---

## 2. Flow: Template Discovery & Selection

```mermaid
graph TD
    A[User in Editor] --> B[Click 'Templates' Tab in Left Sidebar]
    B --> C[Browse Categorized Grid or Search Keyword]
    C --> D[Hover Template Card: Preview Details]
    D --> E{Click Template Card}
    E -->|If Blank Design| F[Apply Template Instantly to Current Page]
    E -->|If Canvas Has Objects| G[Modal Prompt: 'Replace Page' or 'Add as New Page']
    G -->|Replace| F
    G -->|Add as New Page| H[Append New Page with Cloned Template Objects]
    F --> I[Canvas Re-renders with Full Editable Elements]
    H --> I
    I --> J[Push State to History Stack for Undo Support]
```

### Steps:
1. From the left sidebar, user clicks "Templates".
2. System loads categorized templates (Social, Marketing, Cards, Thumbnails).
3. Clicking a template clones the structured JSON objects into the page model.
4. All text nodes, shapes, and images from the template become fully editable immediately.

---

## 3. Flow: Direct Object Manipulation & Contextual Toolbars

```mermaid
graph TD
    A[Pointer Down on Canvas Object] --> B[Hit Test Evaluates Topmost Element]
    B --> C[Set selectedObjectId in Store]
    C --> D[Render Selection Bounding Box & 8 Handles]
    C --> E[Contextual Inspector Updates Top Toolbar]
    E -->|If Text Selected| F[Show: Font Family, Size, B/I/U, Color, Alignment, Spacing]
    E -->|If Shape Selected| G[Show: Fill Color, Stroke Color, Border Width, Corner Radius, Opacity]
    E -->|If Image Selected| H[Show: Replace, Opacity, Filters, Flip, Bring Forward/Back]
    D --> I{User Drags Handle}
    I -->|Corner Handle| J[Proportional Scale: Update W & H by Aspect Ratio]
    I -->|Edge Handle| K[Non-uniform Scale: Update Width or Height]
    I -->|Center Body| L[Translate: Update X & Y]
    I -->|Rotation Pin| M[Rotate: Calculate atan2 angle delta & Snap to 0, 45, 90]
    J --> N[Pointer Up: Commit Transaction to Undo/Redo Stack]
    K --> N
    L --> N
    M --> N
```

---

## 4. Flow: Multi-Page Management

```mermaid
graph TD
    A[User Views Bottom Page Bar or Top Controls] --> B{Page Action}
    B -->|Click '+ Add Page'| C[Append New Blank Page with Project Dimensions]
    B -->|Click 'Duplicate Page'| D[Deep Clone Active Page Objects & Stacking Order]
    B -->|Click 'Delete Page'| E{Is Total Pages > 1?}
    E -->|Yes| F[Remove Active Page & Switch to Adjacent Page]
    E -->|No| G[Show Toast: 'Designs must contain at least one page']
    B -->|Click Page Thumbnail| H[Set activePageIndex & Render Target Page Objects]
```

---

## 5. Flow: Autosave & Persistence Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Editor as Editor Store (Zustand)
    participant Timer as Debounce Timer (1000ms)
    participant Local as IndexedDB / LocalStorage
    participant API as Backend Server API
    participant UI as Save Indicator Badge

    User->>Editor: Modifies object (moves, edits text, changes color)
    Editor->>Editor: Update document state & increment version counter
    Editor->>UI: Show status "Saving..." (Amber icon)
    Editor->>Timer: Reset & start 1000ms debounce
    Timer-->>Local: Write complete document JSON (instant fallback)
    Timer-->>API: POST /api/designs/:id (JSON payload)
    API-->>Timer: HTTP 200 OK (updatedAt timestamp)
    Timer->>UI: Show status "All changes saved" (Green checkmark)
```

---

## 6. Flow: Real File Export (PNG, JPEG, PDF)

```mermaid
graph TD
    A[User clicks 'Export' Button] --> B[Open Export Modal Dialog]
    B --> C[Select Format: PNG, JPEG, or PDF]
    C --> D[Select Resolution Scale: 1x, 2x (High-DPI Retina)]
    D --> E{Format Specific Settings}
    E -->|PNG| F[Toggle 'Transparent Background']
    E -->|JPEG| G[Adjust Quality Slider: 70% - 100%]
    E -->|PDF| H[Select Pages: All Pages or Current Page]
    F --> I[Click 'Download' Button]
    G --> I
    H --> I
    I --> J[Render Target Canvas at Exact Scaled Dimensions Offscreen]
    J --> K[Generate Blob using canvas.toBlob or jsPDF]
    K --> L[Create Object URL & Trigger Programmatic Download Link]
    L --> M[File Saved to User's Download Folder with Sanitize Title]
```
