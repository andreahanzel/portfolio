// src/utils/faviconUtils.ts
// This file contains utility functions for managing favicons
// It includes functions to create and update favicons based on the theme
// It uses SVG format for the favicons to allow for dynamic styling and animations
// It includes functions to create favicons for both light and dark themes
// It uses TypeScript for type safety and ensures that the functions are reusable and maintainable

// Eclipse favicon for dark mode
    export const createEclipseFavicon = () => {
    return `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <defs>
        <!-- Eclipse core gradient -->
        <radialGradient id="eclipseCore" cx="50%" cy="50%" r="60%">
            <stop offset="0%" style="stop-color:#64748B"/>
            <stop offset="30%" style="stop-color:#475569"/>
            <stop offset="70%" style="stop-color:#334155"/>
            <stop offset="100%" style="stop-color:#1E293B"/>
        </radialGradient>
        
        <!-- Eclipse glow -->
        <radialGradient id="eclipseGlow" cx="50%" cy="50%" r="80%">
            <stop offset="0%" style="stop-color:#E2E8F0;stop-opacity:0.6"/>
            <stop offset="50%" style="stop-color:#CBD5E1;stop-opacity:0.4"/>
            <stop offset="100%" style="stop-color:#94A3B8;stop-opacity:0.2"/>
        </radialGradient>
        
        <!-- Corona effect -->
        <radialGradient id="corona" cx="50%" cy="50%" r="100%">
            <stop offset="0%" style="stop-color:#F1F5F9;stop-opacity:0.1"/>
            <stop offset="40%" style="stop-color:#E2E8F0;stop-opacity:0.05"/>
            <stop offset="100%" style="stop-color:#CBD5E1;stop-opacity:0"/>
        </radialGradient>
        
        <!-- Eclipse animation -->
        <style>
            .eclipse-core {
            animation: eclipsePulse 4s ease-in-out infinite;
            transform-origin: center;
            }
            
            .eclipse-glow {
            animation: eclipseGlow 4s ease-in-out infinite;
            transform-origin: center;
            }
            
            @keyframes eclipsePulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
            }
            
            @keyframes eclipseGlow {
            0% { transform: scale(1); opacity: 0.4; }
            50% { transform: scale(1.1); opacity: 0.6; }
            100% { transform: scale(1); opacity: 0.4; }
            }
        </style>
        </defs>
        
        <!-- Corona (outermost) -->
        <circle cx="16" cy="16" r="15" fill="url(#corona)" class="eclipse-glow" opacity="0.3"/>
        
        <!-- Eclipse glow -->
        <circle cx="16" cy="16" r="12" fill="url(#eclipseGlow)" class="eclipse-glow" opacity="0.5"/>
        
        <!-- Eclipse core -->
        <circle cx="16" cy="16" r="8" fill="url(#eclipseCore)" class="eclipse-core"/>
        
        <!-- Eclipse shadow overlay -->
        <path d="M8 16 A8 8 0 0 1 24 16 A6 6 0 0 0 8 16" fill="rgba(0,0,0,0.6)" class="eclipse-core"/>
        
        <!-- Corona rays -->
        <g class="eclipse-glow" opacity="0.4">
        <path d="M16 4 L16 7" stroke="#E2E8F0" stroke-width="0.8" stroke-linecap="round"/>
        <path d="M16 25 L16 28" stroke="#E2E8F0" stroke-width="0.8" stroke-linecap="round"/>
        <path d="M4 16 L7 16" stroke="#E2E8F0" stroke-width="0.8" stroke-linecap="round"/>
        <path d="M25 16 L28 16" stroke="#E2E8F0" stroke-width="0.8" stroke-linecap="round"/>
        </g>
    </svg>`;
    };

    // Sun favicon for light mode
    export const createSunFavicon = () => {
    return `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <defs>
        <!-- Sun core gradient -->
        <radialGradient id="sunCore" cx="50%" cy="50%" r="60%">
            <stop offset="0%" style="stop-color:#FFD966"/>
            <stop offset="30%" style="stop-color:#FFB74D"/>
            <stop offset="70%" style="stop-color:#FF9800"/>
            <stop offset="100%" style="stop-color:#E65100"/>
        </radialGradient>
        
        <!-- Inner glow -->
        <radialGradient id="innerGlow" cx="50%" cy="50%" r="80%">
            <stop offset="0%" style="stop-color:#FFF8E1;stop-opacity:0.9"/>
            <stop offset="50%" style="stop-color:#FFE0B2;stop-opacity:0.6"/>
            <stop offset="100%" style="stop-color:#FF9800;stop-opacity:0.3"/>
        </radialGradient>
        
        <!-- Outer glow -->
        <radialGradient id="outerGlow" cx="50%" cy="50%" r="100%">
            <stop offset="0%" style="stop-color:#FFF3E0;stop-opacity:0.4"/>
            <stop offset="40%" style="stop-color:#FFECB3;stop-opacity:0.2"/>
            <stop offset="100%" style="stop-color:#FF9800;stop-opacity:0"/>
        </radialGradient>
        
        <!-- Pulsing animation -->
        <style>
            .sun-core {
            animation: sunPulse 3s ease-in-out infinite;
            transform-origin: center;
            }
            
            .sun-glow {
            animation: glowPulse 3s ease-in-out infinite;
            transform-origin: center;
            }
            
            @keyframes sunPulse {
            0% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 0.9; }
            }
            
            @keyframes glowPulse {
            0% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.2); opacity: 0.8; }
            100% { transform: scale(1); opacity: 0.6; }
            }
        </style>
        </defs>
        
        <!-- Outer glow (largest) -->
        <circle cx="16" cy="16" r="15" fill="url(#outerGlow)" class="sun-glow" opacity="0.6"/>
        
        <!-- Middle glow -->
        <circle cx="16" cy="16" r="12" fill="url(#innerGlow)" class="sun-glow" opacity="0.7"/>
        
        <!-- Sun core -->
        <circle cx="16" cy="16" r="8" fill="url(#sunCore)" class="sun-core"/>
        
        <!-- Inner highlight -->
        <circle cx="14" cy="14" r="3" fill="rgba(255,255,255,0.4)" opacity="0.8"/>
        
        <!-- Subtle rays -->
        <g class="sun-core" opacity="0.6">
        <path d="M16 2 L16 6" stroke="#FFD54F" stroke-width="1" stroke-linecap="round"/>
        <path d="M16 26 L16 30" stroke="#FFD54F" stroke-width="1" stroke-linecap="round"/>
        <path d="M2 16 L6 16" stroke="#FFD54F" stroke-width="1" stroke-linecap="round"/>
        <path d="M26 16 L30 16" stroke="#FFD54F" stroke-width="1" stroke-linecap="round"/>
        <path d="M6.34 6.34 L8.93 8.93" stroke="#FFD54F" stroke-width="0.8" stroke-linecap="round"/>
        <path d="M23.07 23.07 L25.66 25.66" stroke="#FFD54F" stroke-width="0.8" stroke-linecap="round"/>
        <path d="M6.34 25.66 L8.93 23.07" stroke="#FFD54F" stroke-width="0.8" stroke-linecap="round"/>
        <path d="M23.07 8.93 L25.66 6.34" stroke="#FFD54F" stroke-width="0.8" stroke-linecap="round"/>
        </g>
    </svg>`;
    };

    // Function to update favicon based on theme
    export const updateFavicon = (isDarkMode: boolean) => {
    // Remove existing favicon
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
        existingFavicon.remove();
    }
    
    // Create new favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    
    // Create SVG data URL
    const svgContent = isDarkMode ? createEclipseFavicon() : createSunFavicon();
    const svgDataUrl = `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
    favicon.href = svgDataUrl;
    
    // Add to head
    document.head.appendChild(favicon);
    };