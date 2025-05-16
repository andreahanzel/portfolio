// src\theme\theme.ts
import type { DefaultTheme } from 'styled-components';

// Modern minimalist theme based on the image color palette
export const darkTheme: DefaultTheme = {
  background: '#0A0A12', // True eclipse shadow — deeper than before
  text: '#E0E0E0', // Soft white for calm contrast
  primary: 'rgba(255, 213, 102, 0.12)', // Dimmed corona glow
  secondary: '#1F1F29', // Deep moonlit grey
  accent: '#FFB74D', // Eclipse-orange highlight
  surface: '#151520', // Cosmic glass surface
  surfaceAlt: '#15151D', // Layering depth
  success: '#CDBA97', // Pale beige warmth from the sun’s edge
  warning: '#B39753', // Dusty golden hue
  error: '#FF4C4C', // Rich red glow for danger
  info: '#F0E6D2', // Moonlit parchment
  celestialGlow: '#FFE8B0', // Gentle warm rim light
  accentAlt: '#E6BD78', // Subtle golden amber for interactions
  isDarkMode: true, // Flag for dark mode
};

// Light theme based on the same palette
export const lightTheme: DefaultTheme = {
  background: '#F0EDE6', // Sun-kissed white
  text: '#1A1A1A', // Deep warm charcoal
  primary: '#FCEBBD', // Soft sand, like morning light on beach
  secondary: '#FFE678', // Golden sunbeam
  accent: '#FFA726', // Bold sun gold for CTAs
  surface: '#F8F6F2', // Silky warm white for cards/containers
  surfaceAlt: '#F2F2ED', // Slightly darker for alternate surfaces
  success: '#E8D8BA', // Earthy beige glow
  warning: '#C7D2C8', // Subtle muted sage (cool contrast)
  error: '#FF6B6B', // Coral warmth
  info: '#2E2E2E', // Rich dark for readable highlights
  celestialGlow: '#FFF8E1', // Gentle sunlight halo
  accentAlt: '#FFD54F', // Soft solar flare yellow
  isDarkMode: false, // Flag for light mode

};

// Custom gradient definitions for your components
export const gradients = {
    primaryGradient: 'linear-gradient(90deg, #111f28, #484852)',
    secondaryGradient: 'linear-gradient(90deg, #484852, #afb9c5)',
    surfaceGradient: 'linear-gradient(135deg, #111111, #222222)',
    sunburst: 'radial-gradient(circle at 20% 50%, #FFE082, transparent 60%)',
    eclipse: 'radial-gradient(circle at center, #3E2723, transparent 70%)',
    // Updated glass effect
    glassEffect: `
        background: rgba(17, 17, 17, 0.7);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.05);
    `,
    // Updated text gradient
    textGradient: `
        background: linear-gradient(90deg, #FFFFFF, #afb9c5);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    `,
    // New celestial gradients for light/dark modes
    moonGradient: `
        background: radial-gradient(circle at center, rgba(175, 185, 197, 0.3) 0%, rgba(175, 185, 197, 0) 70%);
    `,
    sunGradient: `
        background: radial-gradient(circle at center, rgba(255, 236, 179, 0.3) 0%, rgba(255, 236, 179, 0) 70%);
    `,
};

// Shadows for depth - updated with celestial glows
export const shadows = {
    small: '0 2px 10px rgba(0, 0, 0, 0.15)',
    medium: '0 5px 25px rgba(0, 0, 0, 0.2)',
    large: '0 10px 50px rgba(0, 0, 0, 0.3)',
    glow: '0 0 20px rgba(175, 185, 197, 0.4)',
    moonGlow: `
        0 0 5px rgba(175, 185, 197, 0.5),
        0 0 20px rgba(175, 185, 197, 0.3)
    `,
    sunGlow: `
        0 0 5px rgba(255, 236, 179, 0.5),
        0 0 20px rgba(255, 236, 179, 0.3)
    `,
};

// Border radiuses for consistency
export const borderRadius = {
    small: '4px',
    medium: '8px',
    large: '12px',
    pill: '9999px',
};

// Animation durations
export const animations = {
    fast: '0.2s',
    medium: '0.4s',
    slow: '0.7s',
};

// Spacing scale
export const spacing = {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '5rem',
};

// Z-index scale for layering
export const zIndex = {
    base: 1,
    above: 10,
    modal: 100,
    tooltip: 200,
};

// Create and export the combined theme object
export const theme = {
    ...darkTheme,
    gradients,
    shadows,
    borderRadius,
    animations,
    spacing,
    zIndex,
};

// Ensure TypeScript recognizes our theme properties
declare module 'styled-components' {
    export interface DefaultTheme {
        background: string;
        text: string;
        primary: string;
        secondary: string;
        accent: string;
        surface: string;
        surfaceAlt: string;
        success: string;
        warning: string;
        error: string;
        info: string;
        celestialGlow?: string;
        accentAlt?: string;
    }
}