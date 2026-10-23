# Testing Strategy & Quality Assurance Plan

This document establishes the verification protocols, test suites, and acceptance criteria for **Lumina Design Studio**.

---

## 1. Testing Pyramid Overview

```
             / \
            / E2E \       Level 3: End-to-End Browser Testing (Playwright / Browser Subagent)
           /-------\      - Complete User Journeys: Create -> Edit -> Export
          /  Integ  \     Level 2: API & Component Integration Testing (Supertest / Vitest)
         /-----------\    - REST Endpoints, Persistence, Upload validation
        /    Unit     \   Level 1: Pure Logic Unit Testing (Vitest)
       /---------------\  - Scenegraph transformations, Undo/Redo stack, Math matrix
```

---

## 2. Test Specifications by Functional Subsystem

### 2.1 Document Model & History State Machine (Unit Tests)
* **`test_document_initialization`:**
  - Verify creating a document with 1080x1080 creates valid dimensions, timestamps, version 1, and 1 blank page.
* **`test_add_and_update_objects`:**
  - Verify adding text, shapes, and images increments object count and sets valid unique IDs.
  - Verify partial updates mutate target properties without mutating sibling objects.
* **`test_layer_reordering`:**
  - Verify `bringToFront` shifts element to index `length - 1`.
  - Verify `sendToBack` shifts element to index `0`.
  - Verify `bringForward` and `sendBackward` handle boundary limits without array overflow.
* **`test_undo_redo_stack`:**
  - Verify adding an element pushes prior state to `past`.
  - Verify executing `undo()` restores prior state and places undone state into `future`.
  - Verify executing `redo()` re-applies the undone action.
  - Verify performing a new mutation after undo clears the `future` stack (branch invalidation).
  - Verify history stack clamps to maximum 30 snapshots to prevent memory leaks.

### 2.2 Canvas Geometry & Hit-Testing (Unit & Integration Tests)
* **`test_proportional_resizing`:**
  - Verify corner handles maintain original aspect ratio when dragged diagonally.
* **`test_rotation_math`:**
  - Verify angle calculation accurately maps 0° to 360° and snaps within 5° threshold of 0°, 45°, 90°, 180°, 270°.
* **`test_alignment_snapping`:**
  - Verify alignment detection returns exact horizontal center (`width / 2`) and vertical center (`height / 2`) snap points.

### 2.3 Backend API & Persistence (Integration Tests)
* **`GET /api/designs`:**
  - Returns array of user designs sorted by `updatedAt DESC`.
* **`POST /api/designs`:**
  - Accepts new design document JSON, writes to SQLite database, returns saved record with HTTP 201.
* **`PUT /api/designs/:id`:**
  - Updates title, dimensions, document JSON, and generates updated timestamp.
* **`DELETE /api/designs/:id`:**
  - Removes design record; subsequent GET returns HTTP 404.
* **`POST /api/uploads`:**
  - Rejects non-image MIME types (e.g. `.exe`, `.js`, `.sh`) with HTTP 400.
  - Rejects files exceeding 15MB with HTTP 413.
  - Accepts `.png`, `.jpg`, `.webp`, `.svg`, returns accessible local URL with HTTP 201.

### 2.4 Export Engine Verification (Integration & E2E Tests)
* **`test_png_export`:**
  - Verifies generated Blob has MIME type `image/png`.
  - Verifies exported bitmap width and height strictly match target design dimensions * scale factor.
* **`test_jpeg_export`:**
  - Verifies generated Blob has MIME type `image/jpeg`.
  - Verifies transparent backgrounds automatically fill with white background for JPEG compatibility.
* **`test_pdf_export`:**
  - Verifies generated Blob has MIME type `application/pdf`.
  - Verifies multi-page designs render sequential pages in the generated PDF file.

---

## 3. End-to-End Acceptance Checklist

| Step # | User Action | Expected Verification Result |
| :---: | :--- | :--- |
| **1** | Open application at `http://localhost:5173` | Dashboard renders with logo, search bar, presets, and project list. |
| **2** | Click "Instagram Post" preset card | Navigates to `/editor/:id`, renders centered 1080x1080 canvas with zoom fitted. |
| **3** | Click "Text" -> "Add Heading" | "Heading" text appears on canvas; contextual text toolbar activates in header. |
| **4** | Change font size to 72 and color to `#4f46e5` | Text visually updates on canvas in real-time. |
| **5** | Click "Elements" -> "Rectangle" | Rectangle appears on canvas with selection handles. |
| **6** | Drag corner handle | Rectangle resizes smoothly. |
| **7** | Click "Position" -> "Send to Back" | Rectangle drops behind the text element. |
| **8** | Press `Ctrl+Z` | Rectangle returns to front position; save badge shows "Saving..." -> "Saved". |
| **9** | Click "+ Add Page" | Page 2 appears; page counter updates to "Page 2 of 2". |
| **10**| Click "Export" -> Select PNG -> "Download" | Real PNG file downloads with correct dimensions and visuals. |
| **11**| Click "Back to Dashboard" | Project appears in Recent Projects grid with thumbnail and title. |
| **12**| Refresh browser | Reopening project restores all pages, text, shapes, and positions accurately. |
