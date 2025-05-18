// src\theme\theme.ts
import type { DefaultTheme } from 'styled-components';

// Modern minimalist theme with celestial elements
// Dark theme with celestial elements
// Dark theme based on the same palette
export const darkTheme: DefaultTheme = {
  background: '#0A0F1A', // Deep space blue-black
  text: '#F8FAFC', // Bright white with very slight blue tint
  primary: 'rgba(226, 232, 240, 0.15)', // Soft white glow
  secondary: '#1A2B45', // Deep space blue
  accent: '#F8FAFC', // Pure white for eclipse corona 
  surface: '#0F172A', // Deep space surface
  surfaceAlt: '#1E293B', // Slightly lighter space blue
  success: '#9DD6B8', // Keep existing
  warning: '#CBD5E1', // Keep existing
  error: '#F87171', // Keep existing
  info: '#F8FAFC', // Brighter starlight
  celestialGlow: '#F8FAFC', // Pure white eclipse corona glow
  accentAlt: '#F1F5F9', // Lighter white for interactions
  isDarkMode: true,
};

// Light theme based on the same palette
// Light theme with celestial elements
// This theme is designed to be a warm, sun-kissed version of the dark theme
export const lightTheme: DefaultTheme = {
  background: '#FFF6E9', // Warmer sun-kissed white
  text: '#1A1A1A', // Deeper warm charcoal for better contrast
  primary: '#FCEBBD', // Soft sand, like morning light on beach
  secondary: '#FFE678', // Golden sunbeam
  accent: '#FF9800', // Bolder sun gold for better contrast
  surface: '#FFF9F0', // Silky warm white for cards/containers
  surfaceAlt: '#FFF1E0', // Slightly darker for alternate surfaces
  success: '#E8D8BA', // Earthy beige glow
  warning: '#C7D2C8', // Subtle muted sage (cool contrast)
  error: '#FF6B6B', // Coral warmth
  info: '#2E2E2E', // Rich dark for readable highlights
  celestialGlow: '#FFF8E1', // Gentle sunlight halo
  accentAlt: '#FFAB40', // Slightly deeper solar flare for better contrast
  isDarkMode: false, // Flag for light mode
};

// Custom gradient and shadow properties
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
    // Celestial gradients for light/dark modes
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
    fast: '0.4s',
    medium: '0.6s',
    slow: '0.9s',
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