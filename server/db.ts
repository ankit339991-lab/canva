import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface DbDesign {
  id: string;
  title: string;
  width: number;
  height: number;
  unit: string;
  document: any;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface DbUpload {
  id: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface DatabaseSchema {
  designs: Record<string, DbDesign>;
  uploads: Record<string, DbUpload>;
}

class JsonDatabase {
  private data: DatabaseSchema = {
    designs: {},
    uploads: {}
  };

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        if (!this.data.designs) this.data.designs = {};
        if (!this.data.uploads) this.data.uploads = {};
      } catch (err) {
        console.error('Failed to parse db.json, initializing fresh store', err);
        this.save();
      }
    } else {
      this.save();
    }
  }

  private save() {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Error saving db to disk:', err);
    }
  }

  // --- Designs CRUD ---
  getAllDesigns(): DbDesign[] {
    return Object.values(this.data.designs).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  getDesignById(id: string): DbDesign | null {
    return this.data.designs[id] || null;
  }

  saveDesign(design: DbDesign): DbDesign {
    const existing = this.data.designs[design.id];
    const now = new Date().toISOString();
    
    const record: DbDesign = {
      ...design,
      createdAt: existing ? existing.createdAt : (design.createdAt || now),
      updatedAt: now,
      version: existing ? (existing.version + 1) : 1
    };

    this.data.designs[design.id] = record;
    this.save();
    return record;
  }

  deleteDesign(id: string): boolean {
    if (this.data.designs[id]) {
      delete this.data.designs[id];
      this.save();
      return true;
    }
    return false;
  }

  // --- Uploads ---
  getAllUploads(): DbUpload[] {
    return Object.values(this.data.uploads).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  saveUpload(upload: DbUpload): DbUpload {
    this.data.uploads[upload.id] = upload;
    this.save();
    return upload;
  }
}

export const db = new JsonDatabase();
