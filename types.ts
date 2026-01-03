export enum ModelType {
  NANO_BANANA_PRO = 'gemini-3-pro-image-preview',
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9' | '9:21' | '3:2' | '2:3';
export type ImageSize = '1K' | '2K' | '4K';

export type CreateMode = 'product' | 'fashion' | 'portrait' | 'concept' | 'graphic';
export type Language = 'en' | 'vi';

// View State for 3-layer navigation
export type ViewState = 'home' | 'generate_menu' | 'workspace';

export interface ProductParams {
  context: string;
  background: string;
  position: string; // Description of placement
  cameraAngle: string; // New field for Camera Angle
  scale: number; // 1-100 percentage
  lighting: string;
  equipment: string;
  quality: string;
  additional: string;
  negative: string;
}

export interface GenerationConfig {
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  numberOfImages?: number; 
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export type TabId = 'generate' | 'edit' | 'upscale';

export interface TabConfig {
  id: TabId;
  label: string;
  icon: string;
}