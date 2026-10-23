import { Preset } from '../types';

export const DESIGN_PRESETS: Preset[] = [
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    category: 'social',
    width: 1080,
    height: 1080,
    unit: 'px',
    icon: 'Square',
    description: '1080 x 1080 px • Square'
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story / Reel',
    category: 'social',
    width: 1080,
    height: 1920,
    unit: 'px',
    icon: 'Smartphone',
    description: '1080 x 1920 px • 9:16 Portrait'
  },
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail',
    category: 'social',
    width: 1280,
    height: 720,
    unit: 'px',
    icon: 'Youtube',
    description: '1280 x 720 px • 16:9 Widescreen'
  },
  {
    id: 'presentation',
    name: 'Presentation (16:9)',
    category: 'marketing',
    width: 1920,
    height: 1080,
    unit: 'px',
    icon: 'Presentation',
    description: '1920 x 1080 px • Full HD Slide'
  },
  {
    id: 'flyer-poster',
    name: 'Flyer / Poster (A4)',
    category: 'print',
    width: 1414,
    height: 2000,
    unit: 'px',
    icon: 'FileText',
    description: '1414 x 2000 px • Portrait Print'
  },
  {
    id: 'facebook-cover',
    name: 'Facebook Cover',
    category: 'social',
    width: 820,
    height: 312,
    unit: 'px',
    icon: 'Layout',
    description: '820 x 312 px • Banner'
  },
  {
    id: 'twitter-banner',
    name: 'Twitter / X Header',
    category: 'social',
    width: 1500,
    height: 500,
    unit: 'px',
    icon: 'Twitter',
    description: '1500 x 500 px • Header'
  },
  {
    id: 'business-card',
    name: 'Business Card',
    category: 'print',
    width: 1050,
    height: 600,
    unit: 'px',
    icon: 'CreditCard',
    description: '1050 x 600 px • 3.5 x 2 in'
  }
];

export const POPULAR_FONTS = [
  'Inter',
  'Poppins',
  'Montserrat',
  'Outfit',
  'Playfair Display',
  'Anton',
  'Caveat',
  'Pacifico',
  'Roboto Mono',
  'Arial',
  'Georgia',
  'Courier New'
];

export const COLOR_PALETTES = [
  // Solids
  '#000000', '#ffffff', '#1e293b', '#334155', '#64748b', '#94a3b8',
  '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6',
  '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e',
  // Trendy hex tones
  '#fecdd3', '#fed7aa', '#fef08a', '#d9f99d', '#a7f3d0', '#bae6fd',
  '#c7d2fe', '#e9d5ff', '#fbcfe8', '#2dd4bf', '#fb7185', '#38bdf8'
];

export const GRADIENT_PALETTES = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #2e0854 0%, #180b22 100%)'
];
