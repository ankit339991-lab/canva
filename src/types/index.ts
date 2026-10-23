export type DimensionUnit = 'px' | 'in' | 'mm' | 'cm';

export interface Dimensions {
  width: number;
  height: number;
  unit: DimensionUnit;
}

export type ObjectType = 
  | 'text' 
  | 'rectangle' 
  | 'circle' 
  | 'triangle' 
  | 'star' 
  | 'line' 
  | 'image' 
  | 'svg-icon';

export interface BaseCanvasObject {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // 0 - 360 degrees
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
  fontWeight: '300' | '400' | '500' | '600' | '700' | '800' | '900';
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
  cornerRadius?: number; // for rectangle
  numPoints?: number;    // for star
  innerRadius?: number;  // for star
  outerRadius?: number;  // for star
  points?: number[];     // for line
}

export interface ImageObject extends BaseCanvasObject {
  type: 'image';
  src: string;
  aspectRatio: number;
  flipX?: boolean;
  flipY?: boolean;
  brightness?: number; // -1 to 1
  contrast?: number;   // -100 to 100
  blur?: number;       // 0 to 40
  grayscale?: boolean;
  sepia?: boolean;
}

export interface SvgIconObject extends BaseCanvasObject {
  type: 'svg-icon';
  iconName: string;
  svgPath: string;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

export type CanvasObject = TextObject | ShapeObject | ImageObject | SvgIconObject;

export interface PageBackground {
  type: 'color' | 'gradient';
  value: string; // hex color or gradient string
  opacity?: number;
}

export interface Page {
  id: string;
  name: string;
  background: PageBackground;
  objects: CanvasObject[]; // Z-order: 0 is back, length-1 is front
}

export interface DesignDocument {
  id: string;
  title: string;
  dimensions: Dimensions;
  pages: Page[];
  activePageIndex: number;
  createdAt: string;
  updatedAt: string;
  version: number;
  thumbnailUrl?: string;
}

export interface Preset {
  id: string;
  name: string;
  category: 'social' | 'marketing' | 'print' | 'custom';
  width: number;
  height: number;
  unit: DimensionUnit;
  icon: string;
  description: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  tags: string[];
  dimensions: Dimensions;
  previewThumbnail: string;
  document: Omit<DesignDocument, 'id' | 'createdAt' | 'updatedAt'>;
}

export interface AlignmentGuide {
  type: 'vertical' | 'horizontal';
  position: number;
}
