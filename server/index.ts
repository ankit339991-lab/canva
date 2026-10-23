import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db, DbDesign } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `asset-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Please upload PNG, JPEG, WEBP, or SVG images.'));
    }
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Lumina Design Studio API', timestamp: new Date().toISOString() });
});

// --- Designs API ---

// List all designs
app.get('/api/designs', (_req, res) => {
  try {
    const designs = db.getAllDesigns();
    res.json({ success: true, count: designs.length, data: designs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single design
app.get('/api/designs/:id', (req, res) => {
  try {
    const design = db.getDesignById(req.params.id);
    if (!design) {
      return res.status(404).json({ success: false, error: 'Design not found' });
    }
    res.json({ success: true, data: design });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create or Save design
app.post('/api/designs', (req, res) => {
  try {
    const { id, title, dimensions, pages, thumbnailUrl, version, activePageIndex } = req.body;
    if (!id || !title || !dimensions) {
      return res.status(400).json({ success: false, error: 'Missing required design fields' });
    }

    const saved = db.saveDesign({
      id,
      title,
      width: dimensions.width,
      height: dimensions.height,
      unit: dimensions.unit || 'px',
      document: {
        id,
        title,
        dimensions,
        pages: pages || [],
        activePageIndex: activePageIndex || 0,
        thumbnailUrl
      },
      thumbnailUrl,
      createdAt: req.body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: version || 1
    });

    res.status(201).json({ success: true, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update design
app.put('/api/designs/:id', (req, res) => {
  try {
    const existing = db.getDesignById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Design not found' });
    }

    const { title, dimensions, pages, thumbnailUrl, activePageIndex } = req.body;
    const updated = db.saveDesign({
      ...existing,
      title: title || existing.title,
      width: dimensions ? dimensions.width : existing.width,
      height: dimensions ? dimensions.height : existing.height,
      unit: dimensions ? dimensions.unit : existing.unit,
      thumbnailUrl: thumbnailUrl || existing.thumbnailUrl,
      document: {
        id: existing.id,
        title: title || existing.title,
        dimensions: dimensions || existing.document.dimensions,
        pages: pages || existing.document.pages,
        activePageIndex: activePageIndex !== undefined ? activePageIndex : existing.document.activePageIndex,
        thumbnailUrl: thumbnailUrl || existing.thumbnailUrl
      }
    });

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete design
app.delete('/api/designs/:id', (req, res) => {
  try {
    const deleted = db.deleteDesign(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Design not found' });
    }
    res.json({ success: true, message: 'Design deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Uploads API ---

// Upload image asset
app.post('/api/uploads', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const record = db.saveUpload({
      id: `up_${Date.now()}`,
      originalName: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype,
      size: req.file.size,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ success: true, data: record });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// List uploaded assets
app.get('/api/uploads', (_req, res) => {
  try {
    const uploads = db.getAllUploads();
    res.json({ success: true, data: uploads });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Lumina Server] REST API running at http://localhost:${PORT}`);
});
