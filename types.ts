export type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';

export interface BrandKit {
  colors: {
    primary: string;
    secondary: string;
    text: string;
  };
  fonts: {
    headline: FontChoice;
    body: FontChoice;
  };
  logo?: string; // base64 data URL
  brandingText?: string;
  brandingStyle?: {
    color: string;
    opacity: number; // 0 to 1
    position: Position;
    fontSize?: number; // in rem
  };
}

export interface TextStyle {
  fontWeight?: 'bold' | 'normal';
  fontStyle?: 'italic' | 'normal';
  textDecorationLine?: string; // e.g., 'underline', 'line-through', or 'underline line-through'
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textTransform?: 'uppercase' | 'none';
  fontSize?: number; // in rem
  textStroke?: { color: string; width: number; };
}

export interface SlideNumberStyle {
  show: boolean;
  color: string;
  opacity: number; // 0 to 1
  position: Position;
  fontSize?: number; // in rem
}

export interface DesignPreferences {
  backgroundColor: string;
  fontColor: string;
  backgroundImage?: string; // Can be an image or video data URL
  backgroundOpacity: number;
  style: DesignStyle;
  font: FontChoice;
  aspectRatio: AspectRatio;
  brandingText?: string;
  brandingStyle: {
    color: string;
    opacity: number; // 0 to 1
    position: Position;
    fontSize?: number; // in rem
  };
  headlineStyle: TextStyle;
  bodyStyle: TextStyle;
  slideNumberStyle?: SlideNumberStyle;
}

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
  niche: string[];
  profileComplete: boolean;
  password?: string;
}

export interface SlideData {
  id: string;
  headline: string;
  body: string;
  visual_prompt: string;
  // Per-slide style overrides
  backgroundColor?: string;
  fontColor?: string;
  backgroundImage?: string; // Can be an image or video data URL
  backgroundOpacity?: number;
  headlineStyle?: TextStyle;
  bodyStyle?: TextStyle;
  headlineColor?: string;
  bodyColor?: string;
}

export interface Carousel {
  id: string;
  title: string;
  createdAt: string;
  slides: SlideData[];
  category: string;
  preferences: DesignPreferences;
}

export type AppView = 'LOGIN' | 'PROFILE_SETUP' | 'DASHBOARD' | 'GENERATOR' | 'SETTINGS' | 'TUTORIAL';

export enum AIModel {
    GEMINI_2_5_FLASH = 'gemini-2.5-flash', // Fast and cost-effective for most tasks.
    GEMINI_2_5_PRO = 'gemini-2.5-pro',     // The most capable model for complex tasks.
}

export interface AppSettings {
  aiModel: AIModel;
  apiKey: string;
  systemPrompt: string;
  brandKit?: BrandKit;
}

export type Language = 'en' | 'id';

export enum DesignStyle {
  MINIMALIST = 'Minimalist',
  BOLD = 'Bold & Punchy',
  COLORFUL = 'Vibrant & Colorful',
  ELEGANT = 'Elegant & Refined',
  VINTAGE = 'Retro & Vintage',
  MODERN = 'Modern & Clean',
  CORPORATE = 'Corporate & Professional',
  ARTISTIC = 'Artistic & Creative',
}

export enum AspectRatio {
    SQUARE = '1:1',
    PORTRAIT = '3:4',
    STORY = '9:16',
}

export enum FontChoice {
  // Original Sans
  SANS = 'Inter',
  LATO = 'Lato',
  MONTSERRAT = 'Montserrat',
  OPEN_SANS = 'Open Sans',
  POPPINS = 'Poppins',
  RALEWAY = 'Raleway',
  ROBOTO = 'Roboto',
  // Original Serif
  SERIF = 'Lora',
  MERRIWEATHER = 'Merriweather',
  PT_SERIF = 'PT Serif',
  PLAYFAIR_DISPLAY = 'Playfair Display',
  // Original Display
  LOBSTER = 'Lobster',
  OSWALD = 'Oswald',
  // Original Mono
  MONO = 'Roboto Mono',
  SOURCE_CODE_PRO = 'Source Code Pro',
  // New Sans
  NUNITO = 'Nunito',
  WORK_SANS = 'Work Sans',
  RUBIK = 'Rubik',
  BEBAS_NEUE = 'Bebas Neue',
  ANTON = 'Anton',
  DM_SANS = 'DM Sans',
  BARLOW = 'Barlow',
  CABIN = 'Cabin',
  TITILLIUM_WEB = 'Titillium Web',
  // New Serif
  CORMORANT_GARAMOND = 'Cormorant Garamond',
  EB_GARAMOND = 'EB Garamond',
  BITTER = 'Bitter',
  CRIMSON_TEXT = 'Crimson Text',
  SPECTRAL = 'Spectral',
  ZILLA_SLAB = 'Zilla Slab',
  CARDO = 'Cardo',
  BREE_SERIF = 'Bree Serif',
  // New Display
  PACIFICO = 'Pacifico',
  CAVEAT = 'Caveat',
  DANCING_SCRIPT = 'Dancing Script',
  PERMANENT_MARKER = 'Permanent Marker',
  ALFA_SLAB_ONE = 'Alfa Slab One',
  RIGHTEOUS = 'Righteous',
  SATISFY = 'Satisfy',
  ABRIL_FATFACE = 'Abril Fatface',
  CHEWY = 'Chewy',
  // New Mono
  SPACE_MONO = 'Space Mono',
  IBM_PLEX_MONO = 'IBM Plex Mono',
  // New Handwriting
  INDIE_FLOWER = 'Indie Flower',
  PATRICK_HAND = 'Patrick Hand',
  PLAYPEN_SANS = 'Playpen Sans',
  BALSAMIQ_SANS = 'Balsamiq Sans',
}