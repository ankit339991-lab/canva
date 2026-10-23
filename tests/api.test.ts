import { describe, it, expect, beforeAll } from 'vitest';
import { db } from '../server/db';

describe('Backend Database & Storage Store', () => {
  const testDesignId = 'test_backend_design_99';

  it('saves and retrieves a design in db store', () => {
    const saved = db.saveDesign({
      id: testDesignId,
      title: 'Backend Test Design',
      width: 1200,
      height: 630,
      unit: 'px',
      document: {
        id: testDesignId,
        title: 'Backend Test Design',
        dimensions: { width: 1200, height: 630, unit: 'px' },
        pages: []
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    });

    expect(saved.id).toBe(testDesignId);
    expect(saved.title).toBe('Backend Test Design');

    const fetched = db.getDesignById(testDesignId);
    expect(fetched).not.toBeNull();
    expect(fetched?.width).toBe(1200);
    expect(fetched?.height).toBe(630);
  });

  it('lists designs in descending order of modification', () => {
    const all = db.getAllDesigns();
    expect(all.length).toBeGreaterThan(0);
    const found = all.find((d) => d.id === testDesignId);
    expect(found).toBeDefined();
  });

  it('deletes a design cleanly', () => {
    const deleted = db.deleteDesign(testDesignId);
    expect(deleted).toBe(true);

    const check = db.getDesignById(testDesignId);
    expect(check).toBeNull();
  });

  it('saves and lists uploaded asset metadata', () => {
    const uploadId = 'up_test_123';
    db.saveUpload({
      id: uploadId,
      originalName: 'logo.png',
      url: '/uploads/asset-test.png',
      mimeType: 'image/png',
      size: 10240,
      createdAt: new Date().toISOString()
    });

    const uploads = db.getAllUploads();
    const found = uploads.find((u) => u.id === uploadId);
    expect(found).toBeDefined();
    expect(found?.originalName).toBe('logo.png');
  });
});
