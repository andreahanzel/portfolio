// src/styles/styled.d.ts
import 'styled-components';

// Extend the DefaultTheme interface from styled-components
// to include custom theme properties
// This allows TypeScript to recognize the custom properties
// defined in the theme object
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
    isDarkMode: boolean; 
    }
}