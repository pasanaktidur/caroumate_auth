import type { AppSettings, Position } from '../types';
// FIX: FontChoice and AspectRatio are enums used as values, so they must be imported as values, not types.
import { AIModel, AspectRatio, FontChoice } from '../types';

export const SETTINGS_STORAGE_KEY = 'caroumate-settings';
export const USER_STORAGE_KEY = 'caroumate-user';
export const HISTORY_STORAGE_KEY = 'caroumate-history';
export const DOWNLOADS_STORAGE_KEY = 'caroumate-downloads';


export const defaultSettings: AppSettings = {
    aiModel: AIModel.GEMINI_2_5_FLASH,
    apiKey: '',
    systemPrompt: 'You are an expert social media content strategist specializing in creating viral carousels.',
    brandKit: {
        colors: {
            primary: '#FFFFFF',
            secondary: '#00C2CB',
            text: '#111827',
        },
        fonts: {
            headline: 'Poppins' as FontChoice,
            body: 'Inter' as FontChoice,
        },
        logo: '',
        brandingText: '',
        brandingStyle: {
            color: '#111827',
            opacity: 0.75,
            position: 'bottom-right',
            fontSize: 0.7,
        }
    }
};

export const fontClassMap: { [key in FontChoice]: string } = {
  [FontChoice.SANS]: 'font-sans',
  [FontChoice.SERIF]: 'font-serif',
  [FontChoice.MONO]: 'font-mono',
  [FontChoice.LATO]: 'font-lato',
  [FontChoice.LOBSTER]: 'font-lobster',
  [FontChoice.MERRIWEATHER]: 'font-merriweather',
  [FontChoice.MONTSERRAT]: 'font-montserrat',
  [FontChoice.OPEN_SANS]: 'font-open-sans',
  [FontChoice.OSWALD]: 'font-oswald',
  [FontChoice.PT_SERIF]: 'font-pt-serif',
  [FontChoice.PLAYFAIR_DISPLAY]: 'font-playfair-display',
  [FontChoice.POPPINS]: 'font-poppins',
  [FontChoice.RALEWAY]: 'font-raleway',
  [FontChoice.ROBOTO]: 'font-roboto',
  [FontChoice.SOURCE_CODE_PRO]: 'font-source-code-pro',
  [FontChoice.NUNITO]: 'font-nunito',
  [FontChoice.WORK_SANS]: 'font-work-sans',
  [FontChoice.RUBIK]: 'font-rubik',
  [FontChoice.BEBAS_NEUE]: 'font-bebas-neue',
  [FontChoice.ANTON]: 'font-anton',
  [FontChoice.DM_SANS]: 'font-dm-sans',
  [FontChoice.BARLOW]: 'font-barlow',
  [FontChoice.CABIN]: 'font-cabin',
  [FontChoice.TITILLIUM_WEB]: 'font-titillium-web',
  [FontChoice.CORMORANT_GARAMOND]: 'font-cormorant-garamond',
  [FontChoice.EB_GARAMOND]: 'font-eb-garamond',
  [FontChoice.BITTER]: 'font-bitter',
  [FontChoice.CRIMSON_TEXT]: 'font-crimson-text',
  [FontChoice.SPECTRAL]: 'font-spectral',
  [FontChoice.ZILLA_SLAB]: 'font-zilla-slab',
  [FontChoice.CARDO]: 'font-cardo',
  [FontChoice.BREE_SERIF]: 'font-bree-serif',
  // New Display
  [FontChoice.PACIFICO]: 'font-pacifico',
  [FontChoice.CAVEAT]: 'font-caveat',
  [FontChoice.DANCING_SCRIPT]: 'font-dancing-script',
  [FontChoice.PERMANENT_MARKER]: 'font-permanent-marker',
  [FontChoice.ALFA_SLAB_ONE]: 'font-alfa-slab-one',
  [FontChoice.RIGHTEOUS]: 'font-righteous',
  [FontChoice.SATISFY]: 'font-satisfy',
  [FontChoice.ABRIL_FATFACE]: 'font-abril-fatface',
  [FontChoice.CHEWY]: 'font-chewy',
  // New Mono
  [FontChoice.SPACE_MONO]: 'font-space-mono',
  [FontChoice.IBM_PLEX_MONO]: 'font-ibm-plex-mono',
  // New Handwriting
  [FontChoice.INDIE_FLOWER]: 'font-indie-flower',
  [FontChoice.PATRICK_HAND]: 'font-patrick-hand',
  [FontChoice.PLAYPEN_SANS]: 'font-playpen-sans',
  [FontChoice.BALSAMIQ_SANS]: 'font-balsamiq-sans',
};


export const aspectRatioClassMap: { [key in AspectRatio]: string } = {
    [AspectRatio.SQUARE]: 'aspect-square',
    [AspectRatio.PORTRAIT]: 'aspect-[3/4]',
    [AspectRatio.STORY]: 'aspect-[9/16]',
};

export const aspectRatioDisplayMap: { [key in AspectRatio]: string } = {
    [AspectRatio.SQUARE]: '1:1 (Square)',
    [AspectRatio.PORTRAIT]: '3:4 (Portrait)',
    [AspectRatio.STORY]: '9:16 (Story)',
};

export const positionClassMap: { [key in Position]: string } = {
    'top-left': 'top-3 left-3',
    'top-right': 'top-3 right-3',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-center': 'top-3 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export const positionAlignmentMap: { [key in Position]: string } = {
    'top-left': 'text-left',
    'top-right': 'text-right',
    'bottom-left': 'text-left',
    'bottom-right': 'text-right',
    'top-center': 'text-center',
    'bottom-center': 'text-center',
};