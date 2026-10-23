import { Template } from '../types';

export const STARTER_TEMPLATES: Template[] = [
  {
    id: 'tmpl-summer-sale',
    name: 'Summer Mega Sale',
    category: 'Social Media',
    tags: ['instagram', 'sale', 'retail', 'promo', 'minimalist'],
    dimensions: { width: 1080, height: 1080, unit: 'px' },
    previewThumbnail: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80',
    document: {
      title: 'Summer Mega Sale',
      dimensions: { width: 1080, height: 1080, unit: 'px' },
      version: 1,
      activePageIndex: 0,
      pages: [
        {
          id: 'p1',
          name: 'Page 1',
          background: { type: 'color', value: '#0f172a' },
          objects: [
            // Decorative backdrop circle
            {
              id: 'shape-bg-circle',
              type: 'circle',
              x: 540,
              y: 540,
              width: 780,
              height: 780,
              rotation: 0,
              opacity: 0.15,
              fill: '#38bdf8'
            },
            // Border container
            {
              id: 'shape-frame',
              type: 'rectangle',
              x: 60,
              y: 60,
              width: 960,
              height: 960,
              rotation: 0,
              opacity: 1,
              fill: 'transparent',
              stroke: '#334155',
              strokeWidth: 4,
              cornerRadius: 24
            },
            // Tag pill
            {
              id: 'shape-pill',
              type: 'rectangle',
              x: 415,
              y: 180,
              width: 250,
              height: 60,
              rotation: 0,
              opacity: 1,
              fill: '#38bdf8',
              cornerRadius: 30
            },
            {
              id: 'txt-tag',
              type: 'text',
              x: 415,
              y: 195,
              width: 250,
              height: 30,
              rotation: 0,
              opacity: 1,
              text: 'LIMITED TIME',
              fontFamily: 'Montserrat',
              fontSize: 22,
              fontWeight: '800',
              fill: '#0f172a',
              textAlign: 'center',
              lineHeight: 1.2,
              letterSpacing: 2
            },
            // Main headline
            {
              id: 'txt-headline',
              type: 'text',
              x: 100,
              y: 300,
              width: 880,
              height: 140,
              rotation: 0,
              opacity: 1,
              text: 'SUMMER\nCOLLECTION',
              fontFamily: 'Anton',
              fontSize: 108,
              fontWeight: '400',
              fill: '#f8fafc',
              textAlign: 'center',
              lineHeight: 1.05,
              letterSpacing: 3
            },
            // Subtitle
            {
              id: 'txt-sub',
              type: 'text',
              x: 190,
              y: 560,
              width: 700,
              height: 60,
              rotation: 0,
              opacity: 1,
              text: 'UP TO 50% OFF ON SELECTED ITEMS',
              fontFamily: 'Outfit',
              fontSize: 32,
              fontWeight: '600',
              fill: '#94a3b8',
              textAlign: 'center',
              lineHeight: 1.2,
              letterSpacing: 2
            },
            // CTA Button
            {
              id: 'shape-btn',
              type: 'rectangle',
              x: 370,
              y: 690,
              width: 340,
              height: 80,
              rotation: 0,
              opacity: 1,
              fill: '#f43f5e',
              cornerRadius: 16
            },
            {
              id: 'txt-btn',
              type: 'text',
              x: 370,
              y: 715,
              width: 340,
              height: 40,
              rotation: 0,
              opacity: 1,
              text: 'SHOP NOW',
              fontFamily: 'Montserrat',
              fontSize: 26,
              fontWeight: '800',
              fill: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.2,
              letterSpacing: 2
            },
            // Website footer
            {
              id: 'txt-url',
              type: 'text',
              x: 240,
              y: 890,
              width: 600,
              height: 30,
              rotation: 0,
              opacity: 1,
              text: 'WWW.YOURBRAND.COM',
              fontFamily: 'Inter',
              fontSize: 20,
              fontWeight: '500',
              fill: '#64748b',
              textAlign: 'center',
              lineHeight: 1.2,
              letterSpacing: 4
            }
          ]
        }
      ]
    }
  },
  {
    id: 'tmpl-youtube-tech',
    name: 'Tech Video Thumbnail',
    category: 'YouTube',
    tags: ['youtube', 'thumbnail', 'tech', 'coding', 'webdev'],
    dimensions: { width: 1280, height: 720, unit: 'px' },
    previewThumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
    document: {
      title: 'Tech Video Thumbnail',
      dimensions: { width: 1280, height: 720, unit: 'px' },
      version: 1,
      activePageIndex: 0,
      pages: [
        {
          id: 'p1',
          name: 'Page 1',
          background: { type: 'color', value: '#111827' },
          objects: [
            // Decorative angle shape
            {
              id: 'shape-accent',
              type: 'rectangle',
              x: 80,
              y: 80,
              width: 600,
              height: 560,
              rotation: -4,
              opacity: 0.1,
              fill: '#8b5cf6',
              cornerRadius: 24
            },
            // Badge
            {
              id: 'shape-badge',
              type: 'rectangle',
              x: 100,
              y: 110,
              width: 220,
              height: 54,
              rotation: 0,
              opacity: 1,
              fill: '#f59e0b',
              cornerRadius: 12
            },
            {
              id: 'txt-badge',
              type: 'text',
              x: 100,
              y: 124,
              width: 220,
              height: 30,
              rotation: 0,
              opacity: 1,
              text: 'NEW IN 2026',
              fontFamily: 'Montserrat',
              fontSize: 22,
              fontWeight: '800',
              fill: '#111827',
              textAlign: 'center',
              lineHeight: 1.2,
              letterSpacing: 2
            },
            // Catchy title
            {
              id: 'txt-catchy',
              type: 'text',
              x: 100,
              y: 200,
              width: 780,
              height: 180,
              rotation: 0,
              opacity: 1,
              text: 'MASTER\nREACT 19',
              fontFamily: 'Anton',
              fontSize: 120,
              fontWeight: '400',
              fill: '#38bdf8',
              textAlign: 'left',
              lineHeight: 1.0,
              letterSpacing: 1
            },
            // Sub headline
            {
              id: 'txt-subhead',
              type: 'text',
              x: 100,
              y: 460,
              width: 740,
              height: 80,
              rotation: 0,
              opacity: 1,
              text: 'The Complete Step-by-Step Guide',
              fontFamily: 'Poppins',
              fontSize: 36,
              fontWeight: '600',
              fill: '#f3f4f6',
              textAlign: 'left',
              lineHeight: 1.2,
              letterSpacing: 1
            },
            // Star badge
            {
              id: 'star-accent',
              type: 'star',
              x: 1050,
              y: 280,
              width: 280,
              height: 280,
              rotation: 12,
              opacity: 0.95,
              fill: '#8b5cf6',
              numPoints: 5,
              innerRadius: 70,
              outerRadius: 140
            },
            {
              id: 'txt-star-callout',
              type: 'text',
              x: 950,
              y: 250,
              width: 200,
              height: 60,
              rotation: 0,
              opacity: 1,
              text: '100%\nFREE',
              fontFamily: 'Montserrat',
              fontSize: 32,
              fontWeight: '900',
              fill: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.1,
              letterSpacing: 1
            }
          ]
        }
      ]
    }
  },
  {
    id: 'tmpl-daily-quote',
    name: 'Daily Inspiration Quote',
    category: 'Social Media',
    tags: ['instagram', 'quote', 'inspiration', 'lifestyle', 'minimalist'],
    dimensions: { width: 1080, height: 1080, unit: 'px' },
    previewThumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    document: {
      title: 'Daily Inspiration Quote',
      dimensions: { width: 1080, height: 1080, unit: 'px' },
      version: 1,
      activePageIndex: 0,
      pages: [
        {
          id: 'p1',
          name: 'Page 1',
          background: { type: 'color', value: '#18181b' },
          objects: [
            // Gold border
            {
              id: 'quote-border',
              type: 'rectangle',
              x: 100,
              y: 100,
              width: 880,
              height: 880,
              rotation: 0,
              opacity: 0.8,
              fill: 'transparent',
              stroke: '#d97706',
              strokeWidth: 2
            },
            // Quote mark
            {
              id: 'quote-mark',
              type: 'text',
              x: 160,
              y: 180,
              width: 150,
              height: 100,
              rotation: 0,
              opacity: 0.5,
              text: '“',
              fontFamily: 'Playfair Display',
              fontSize: 160,
              fontWeight: '700',
              fill: '#f59e0b',
              textAlign: 'left',
              lineHeight: 0.8,
              letterSpacing: 0
            },
            // Quote body
            {
              id: 'quote-body',
              type: 'text',
              x: 160,
              y: 350,
              width: 760,
              height: 300,
              rotation: 0,
              opacity: 1,
              text: 'Design is not just what it looks like and feels like. Design is how it works.',
              fontFamily: 'Playfair Display',
              fontSize: 52,
              fontWeight: '600',
              fill: '#fef3c7',
              textAlign: 'center',
              lineHeight: 1.4,
              letterSpacing: 1
            },
            // Divider line
            {
              id: 'quote-divider',
              type: 'line',
              x: 440,
              y: 720,
              width: 200,
              height: 4,
              rotation: 0,
              opacity: 0.7,
              fill: '#d97706',
              stroke: '#d97706',
              strokeWidth: 3,
              points: [0, 0, 200, 0]
            },
            // Author
            {
              id: 'quote-author',
              type: 'text',
              x: 240,
              y: 760,
              width: 600,
              height: 50,
              rotation: 0,
              opacity: 1,
              text: 'STEVE JOBS',
              fontFamily: 'Montserrat',
              fontSize: 24,
              fontWeight: '700',
              fill: '#f59e0b',
              textAlign: 'center',
              lineHeight: 1.2,
              letterSpacing: 6
            }
          ]
        }
      ]
    }
  },
  {
    id: 'tmpl-conference-flyer',
    name: 'Modern Tech Conference',
    category: 'Marketing & Print',
    tags: ['flyer', 'poster', 'event', 'conference', 'print'],
    dimensions: { width: 1414, height: 2000, unit: 'px' },
    previewThumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80',
    document: {
      title: 'Modern Tech Conference',
      dimensions: { width: 1414, height: 2000, unit: 'px' },
      version: 1,
      activePageIndex: 0,
      pages: [
        {
          id: 'p1',
          name: 'Page 1',
          background: { type: 'color', value: '#030712' },
          objects: [
            // Header backdrop
            {
              id: 'shape-hdr',
              type: 'rectangle',
              x: 0,
              y: 0,
              width: 1414,
              height: 450,
              rotation: 0,
              opacity: 1,
              fill: '#4c1d95'
            },
            {
              id: 'txt-year',
              type: 'text',
              x: 100,
              y: 120,
              width: 1214,
              height: 50,
              rotation: 0,
              opacity: 1,
              text: 'GLOBAL INNOVATION SUMMIT 2026',
              fontFamily: 'Montserrat',
              fontSize: 32,
              fontWeight: '800',
              fill: '#c4b5fd',
              textAlign: 'left',
              lineHeight: 1.2,
              letterSpacing: 4
            },
            {
              id: 'txt-title',
              type: 'text',
              x: 100,
              y: 200,
              width: 1214,
              height: 180,
              rotation: 0,
              opacity: 1,
              text: 'FUTURE OF AI & DESIGN',
              fontFamily: 'Anton',
              fontSize: 130,
              fontWeight: '400',
              fill: '#ffffff',
              textAlign: 'left',
              lineHeight: 1.05,
              letterSpacing: 2
            },
            // Date container card
            {
              id: 'shape-card-1',
              type: 'rectangle',
              x: 100,
              y: 560,
              width: 580,
              height: 240,
              rotation: 0,
              opacity: 1,
              fill: '#1f2937',
              cornerRadius: 20,
              stroke: '#374151',
              strokeWidth: 2
            },
            {
              id: 'txt-date-label',
              type: 'text',
              x: 140,
              y: 600,
              width: 500,
              height: 40,
              rotation: 0,
              opacity: 1,
              text: 'WHEN & WHERE',
              fontFamily: 'Montserrat',
              fontSize: 24,
              fontWeight: '700',
              fill: '#a78bfa',
              textAlign: 'left',
              lineHeight: 1.2,
              letterSpacing: 3
            },
            {
              id: 'txt-date-val',
              type: 'text',
              x: 140,
              y: 660,
              width: 500,
              height: 100,
              rotation: 0,
              opacity: 1,
              text: 'NOVEMBER 14-16, 2026\nSAN FRANCISCO, CA',
              fontFamily: 'Outfit',
              fontSize: 34,
              fontWeight: '700',
              fill: '#f9fafb',
              textAlign: 'left',
              lineHeight: 1.3,
              letterSpacing: 1
            },
            // Keynote card
            {
              id: 'shape-card-2',
              type: 'rectangle',
              x: 734,
              y: 560,
              width: 580,
              height: 240,
              rotation: 0,
              opacity: 1,
              fill: '#1f2937',
              cornerRadius: 20,
              stroke: '#374151',
              strokeWidth: 2
            },
            {
              id: 'txt-keynote-label',
              type: 'text',
              x: 774,
              y: 600,
              width: 500,
              height: 40,
              rotation: 0,
              opacity: 1,
              text: 'KEYNOTE SPEAKERS',
              fontFamily: 'Montserrat',
              fontSize: 24,
              fontWeight: '700',
              fill: '#a78bfa',
              textAlign: 'left',
              lineHeight: 1.2,
              letterSpacing: 3
            },
            {
              id: 'txt-keynote-val',
              type: 'text',
              x: 774,
              y: 660,
              width: 500,
              height: 100,
              rotation: 0,
              opacity: 1,
              text: '40+ INDUSTRY LEADERS\n120+ TECHNICAL SESSIONS',
              fontFamily: 'Outfit',
              fontSize: 34,
              fontWeight: '700',
              fill: '#f9fafb',
              textAlign: 'left',
              lineHeight: 1.3,
              letterSpacing: 1
            },
            // Register CTA banner
            {
              id: 'shape-cta',
              type: 'rectangle',
              x: 100,
              y: 1650,
              width: 1214,
              height: 180,
              rotation: 0,
              opacity: 1,
              fill: '#7c3aed',
              cornerRadius: 24
            },
            {
              id: 'txt-cta',
              type: 'text',
              x: 100,
              y: 1705,
              width: 1214,
              height: 70,
              rotation: 0,
              opacity: 1,
              text: 'GET YOUR PASS • WWW.TECHSUMMIT2026.COM',
              fontFamily: 'Montserrat',
              fontSize: 40,
              fontWeight: '800',
              fill: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.2,
              letterSpacing: 3
            }
          ]
        }
      ]
    }
  }
];
