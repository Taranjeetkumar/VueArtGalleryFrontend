export interface Template {
  id: string;
  title: string;
  description: string;
  category: 'digital-art' | 'illustration' | 'abstract' | 'landscape' | 'portrait' | 'minimal';
  preview: string;
  colors: string[];
  canvasSize: {
    width: number;
    height: number;
  };
  backgroundColor: string;
  layers: Array<{
    id: string;
    name: string;
    data: string;
    visible: boolean;
    opacity: number;
  }>;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
}

export const templates: Template[] = [
  {
    id: 'blank-canvas',
    title: 'Blank Canvas',
    description: 'Start from scratch with a clean white canvas',
    category: 'digital-art',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23ffffff"/%3E%3C/svg%3E',
    colors: ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'],
    canvasSize: { width: 1200, height: 800 },
    backgroundColor: '#ffffff',
    layers: [{ id: 'layer-1', name: 'Layer 1', data: '', visible: true, opacity: 1 }],
    tags: ['basic', 'starter'],
    difficulty: 'beginner',
    estimatedTime: 'Unlimited'
  },
  {
    id: 'sunset-landscape',
    title: 'Sunset Landscape',
    description: 'Warm gradient background perfect for landscapes',
    category: 'landscape',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Cdefs%3E%3ClinearGradient id="sunset" x1="0%25" y1="0%25" x2="0%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B6B;stop-opacity:1" /%3E%3Cstop offset="50%25" style="stop-color:%23FFA07A;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23FFD93D;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23sunset)"/%3E%3C/svg%3E',
    colors: ['#FF6B6B', '#FFA07A', '#FFD93D', '#4ECDC4', '#45B7D1'],
    canvasSize: { width: 1920, height: 1080 },
    backgroundColor: '#FFD93D',
    layers: [
      { id: 'layer-1', name: 'Background', data: '', visible: true, opacity: 1 },
      { id: 'layer-2', name: 'Landscape', data: '', visible: true, opacity: 1 }
    ],
    tags: ['landscape', 'sunset', 'nature'],
    difficulty: 'beginner',
    estimatedTime: '30-60 min'
  },
  {
    id: 'ocean-blue',
    title: 'Ocean Blue',
    description: 'Cool blue tones for ocean and water scenes',
    category: 'landscape',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Cdefs%3E%3ClinearGradient id="ocean" x1="0%25" y1="0%25" x2="0%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2345B7D1;stop-opacity:1" /%3E%3Cstop offset="50%25" style="stop-color:%234ECDC4;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2398D8C8;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23ocean)"/%3E%3C/svg%3E',
    colors: ['#45B7D1', '#4ECDC4', '#98D8C8', '#06B6D4', '#0891B2'],
    canvasSize: { width: 1920, height: 1080 },
    backgroundColor: '#98D8C8',
    layers: [
      { id: 'layer-1', name: 'Sky', data: '', visible: true, opacity: 1 },
      { id: 'layer-2', name: 'Ocean', data: '', visible: true, opacity: 1 }
    ],
    tags: ['ocean', 'water', 'blue', 'nature'],
    difficulty: 'beginner',
    estimatedTime: '30-60 min'
  },
  {
    id: 'portrait-base',
    title: 'Portrait Base',
    description: 'Vertical canvas with guides for portrait drawing',
    category: 'portrait',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"%3E%3Crect width="400" height="500" fill="%23F5F5F5"/%3E%3Cellipse cx="200" cy="200" rx="80" ry="100" fill="none" stroke="%23CCCCCC" stroke-width="2" stroke-dasharray="5,5"/%3E%3Cline x1="200" y1="0" x2="200" y2="500" stroke="%23CCCCCC" stroke-width="1" stroke-dasharray="5,5"/%3E%3C/svg%3E',
    colors: ['#2C3E50', '#E8D5C4', '#F5CBA7', '#D98880', '#A569BD'],
    canvasSize: { width: 1024, height: 1536 },
    backgroundColor: '#F5F5F5',
    layers: [
      { id: 'layer-1', name: 'Sketch', data: '', visible: true, opacity: 0.5 },
      { id: 'layer-2', name: 'Base Colors', data: '', visible: true, opacity: 1 },
      { id: 'layer-3', name: 'Details', data: '', visible: true, opacity: 1 }
    ],
    tags: ['portrait', 'face', 'character'],
    difficulty: 'intermediate',
    estimatedTime: '1-2 hours'
  },
  {
    id: 'abstract-modern',
    title: 'Abstract Modern',
    description: 'Bold colors for abstract expressionism',
    category: 'abstract',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23F0F0F0"/%3E%3Ccircle cx="100" cy="100" r="60" fill="%23FF6B6B" opacity="0.7"/%3E%3Crect x="200" y="200" width="150" height="150" fill="%234ECDC4" opacity="0.7"/%3E%3Cpolygon points="300,50 350,150 250,150" fill="%23FFD93D" opacity="0.7"/%3E%3C/svg%3E',
    colors: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#A855F7', '#EC4899'],
    canvasSize: { width: 1200, height: 1200 },
    backgroundColor: '#F0F0F0',
    layers: [
      { id: 'layer-1', name: 'Background', data: '', visible: true, opacity: 1 },
      { id: 'layer-2', name: 'Shapes 1', data: '', visible: true, opacity: 0.8 },
      { id: 'layer-3', name: 'Shapes 2', data: '', visible: true, opacity: 0.8 }
    ],
    tags: ['abstract', 'modern', 'colorful'],
    difficulty: 'intermediate',
    estimatedTime: '45-90 min'
  },
  {
    id: 'minimalist-dark',
    title: 'Minimalist Dark',
    description: 'Dark mode canvas for minimal artwork',
    category: 'minimal',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%231A1A1A"/%3E%3Ccircle cx="200" cy="150" r="40" fill="none" stroke="%23FFFFFF" stroke-width="2"/%3E%3C/svg%3E',
    colors: ['#FFFFFF', '#E0E0E0', '#A0A0A0', '#606060', '#1A1A1A'],
    canvasSize: { width: 1200, height: 800 },
    backgroundColor: '#1A1A1A',
    layers: [
      { id: 'layer-1', name: 'Base', data: '', visible: true, opacity: 1 },
      { id: 'layer-2', name: 'Elements', data: '', visible: true, opacity: 1 }
    ],
    tags: ['minimal', 'dark', 'simple'],
    difficulty: 'beginner',
    estimatedTime: '20-40 min'
  },
  {
    id: 'neon-city',
    title: 'Neon Cityscape',
    description: 'Vibrant neon colors for cyberpunk scenes',
    category: 'digital-art',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%230A0A0A"/%3E%3Crect x="50" y="100" width="60" height="200" fill="%23FF00FF" opacity="0.8"/%3E%3Crect x="150" y="80" width="60" height="220" fill="%2300FFFF" opacity="0.8"/%3E%3Crect x="250" y="120" width="60" height="180" fill="%23FFFF00" opacity="0.8"/%3E%3C/svg%3E',
    colors: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF1744', '#00E676'],
    canvasSize: { width: 1920, height: 1080 },
    backgroundColor: '#0A0A0A',
    layers: [
      { id: 'layer-1', name: 'Background', data: '', visible: true, opacity: 1 },
      { id: 'layer-2', name: 'Buildings', data: '', visible: true, opacity: 1 },
      { id: 'layer-3', name: 'Neon Lights', data: '', visible: true, opacity: 1 }
    ],
    tags: ['cyberpunk', 'neon', 'city', 'futuristic'],
    difficulty: 'advanced',
    estimatedTime: '2-3 hours'
  },
  {
    id: 'pastel-dream',
    title: 'Pastel Dream',
    description: 'Soft pastel colors for dreamy illustrations',
    category: 'illustration',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Cdefs%3E%3ClinearGradient id="pastel" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FFB3E6;stop-opacity:1" /%3E%3Cstop offset="50%25" style="stop-color:%23B3D9FF;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23FFE5B3;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23pastel)"/%3E%3C/svg%3E',
    colors: ['#FFB3E6', '#B3D9FF', '#FFE5B3', '#D4E157', '#FFB74D'],
    canvasSize: { width: 1200, height: 800 },
    backgroundColor: '#FFF8F0',
    layers: [
      { id: 'layer-1', name: 'Background', data: '', visible: true, opacity: 1 },
      { id: 'layer-2', name: 'Illustration', data: '', visible: true, opacity: 1 }
    ],
    tags: ['pastel', 'soft', 'dreamy', 'cute'],
    difficulty: 'beginner',
    estimatedTime: '30-60 min'
  },
  {
    id: 'social-media',
    title: 'Social Media Post',
    description: 'Perfect square format for Instagram and social media',
    category: 'digital-art',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23FFFFFF"/%3E%3Ctext x="200" y="200" font-family="Arial" font-size="24" fill="%23999999" text-anchor="middle"%3E1080x1080%3C/text%3E%3C/svg%3E',
    colors: ['#000000', '#FFFFFF', '#06B6D4', '#EC4899', '#F59E0B'],
    canvasSize: { width: 1080, height: 1080 },
    backgroundColor: '#FFFFFF',
    layers: [
      { id: 'layer-1', name: 'Background', data: '', visible: true, opacity: 1 },
      { id: 'layer-2', name: 'Content', data: '', visible: true, opacity: 1 },
      { id: 'layer-3', name: 'Text/Logo', data: '', visible: true, opacity: 1 }
    ],
    tags: ['social', 'instagram', 'square'],
    difficulty: 'beginner',
    estimatedTime: '20-30 min'
  },
  {
    id: 'retro-vintage',
    title: 'Retro Vintage',
    description: 'Warm vintage tones for retro aesthetics',
    category: 'illustration',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23E8D5C4"/%3E%3Ccircle cx="200" cy="150" r="80" fill="%23D4A574" opacity="0.8"/%3E%3Ccircle cx="200" cy="150" r="50" fill="%23A67C52" opacity="0.8"/%3E%3C/svg%3E',
    colors: ['#D4A574', '#A67C52', '#8B6F47', '#E8D5C4', '#C85A54'],
    canvasSize: { width: 1200, height: 800 },
    backgroundColor: '#E8D5C4',
    layers: [
      { id: 'layer-1', name: 'Base', data: '', visible: true, opacity: 1 },
      { id: 'layer-2', name: 'Vintage Filter', data: '', visible: true, opacity: 0.7 }
    ],
    tags: ['retro', 'vintage', 'classic', 'warm'],
    difficulty: 'intermediate',
    estimatedTime: '45-90 min'
  }
];

export const categories = [
  { id: 'all', label: 'All Templates', icon: '🎨' },
  { id: 'digital-art', label: 'Digital Art', icon: '💻' },
  { id: 'illustration', label: 'Illustration', icon: '✏️' },
  { id: 'abstract', label: 'Abstract', icon: '🌀' },
  { id: 'landscape', label: 'Landscape', icon: '🏞️' },
  { id: 'portrait', label: 'Portrait', icon: '👤' },
  { id: 'minimal', label: 'Minimal', icon: '⚪' }
];

export const difficulties = [
  { id: 'all', label: 'All Levels', color: 'text-slate-400' },
  { id: 'beginner', label: 'Beginner', color: 'text-green-400' },
  { id: 'intermediate', label: 'Intermediate', color: 'text-yellow-400' },
  { id: 'advanced', label: 'Advanced', color: 'text-red-400' }
];
