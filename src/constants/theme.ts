/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

/**
 * Each feature category gets its own pastel hue. `bg` is the tile surface,
 * `fg` is the readable text on that surface, `accent` is the saturated
 * companion used for icons, headers, and action buttons.
 *
 * Display order here is the order categories appear on the home screen.
 */
export const CategoryMeta = {
  sensors: { label: 'Sensors' },
  'device-info': { label: 'Device Info' },
  hardware: { label: 'Hardware' },
  'location-motion': { label: 'Location & Motion' },
  'audio-media': { label: 'Audio & Media' },
  'system-display': { label: 'System & Display' },
  privacy: { label: 'Privacy' },
  network: { label: 'Network' },
  wireless: { label: 'Wireless' },
  storage: { label: 'Storage' },
} as const;

export type CategoryId = keyof typeof CategoryMeta;

type CategoryColors = { bg: string; fg: string; accent: string };

export const CategoryPalette: Record<CategoryId, { light: CategoryColors; dark: CategoryColors }> = {
  sensors: {
    light: { bg: '#FFE8D6', fg: '#3D2914', accent: '#C97B3F' },
    dark: { bg: '#3A2A1E', fg: '#FFE8D6', accent: '#E8A86F' },
  },
  'device-info': {
    light: { bg: '#E0F2FE', fg: '#0C2A3E', accent: '#3F88C5' },
    dark: { bg: '#1B2C3A', fg: '#E0F2FE', accent: '#7AB8E8' },
  },
  hardware: {
    light: { bg: '#FCE7F3', fg: '#3F1F36', accent: '#C75B96' },
    dark: { bg: '#3A1F2E', fg: '#FCE7F3', accent: '#E892C0' },
  },
  'location-motion': {
    light: { bg: '#DCFCE7', fg: '#14361F', accent: '#4FA467' },
    dark: { bg: '#1C3024', fg: '#DCFCE7', accent: '#86D49E' },
  },
  'audio-media': {
    light: { bg: '#EDE9FE', fg: '#2A1F47', accent: '#7C5FC9' },
    dark: { bg: '#28223D', fg: '#EDE9FE', accent: '#A78BE8' },
  },
  'system-display': {
    light: { bg: '#F1F5F9', fg: '#1E293B', accent: '#64748B' },
    dark: { bg: '#252A33', fg: '#F1F5F9', accent: '#94A3B8' },
  },
  privacy: {
    light: { bg: '#FEF3C7', fg: '#3B2A0A', accent: '#B88534' },
    dark: { bg: '#332A14', fg: '#FEF3C7', accent: '#E0BC6F' },
  },
  network: {
    light: { bg: '#CFFAFE', fg: '#0F3033', accent: '#3FA0A8' },
    dark: { bg: '#1A2D30', fg: '#CFFAFE', accent: '#7FCFD4' },
  },
  wireless: {
    light: { bg: '#E0E7FF', fg: '#1E1B4B', accent: '#5B6BC9' },
    dark: { bg: '#1F1F3A', fg: '#E0E7FF', accent: '#94A3FF' },
  },
  storage: {
    light: { bg: '#F5F0E1', fg: '#3B2F14', accent: '#A38442' },
    dark: { bg: '#2E281A', fg: '#F5F0E1', accent: '#D4B872' },
  },
};

export const CategoryDisplayOrder = Object.keys(CategoryMeta) as readonly CategoryId[];
