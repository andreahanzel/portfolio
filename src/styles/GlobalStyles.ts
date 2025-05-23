    // src/styles/GlobalStyles.ts
    // This file contains global styles for the application
    // It uses styled-components for styling and theming
    // It includes responsive design, typography scaling, and accessibility improvements
    // It also includes custom scrollbar styles and fixes for mobile issues
    // It uses CSS variables for easy theming and customization
    // It includes media queries for different screen sizes and orientations
    // It includes a custom font and global reset styles
    // It includes styles for various HTML elements and components
    // It includes styles for accessibility and focus states
    // It includes styles for responsive typography and layout
    // It includes styles for mobile and ultra-wide screen handling
    // It includes styles for fixing common issues with position: fixed and sticky elements
    // It includes styles for improving container sizing and spacing
    // It includes styles for improving focus styles and touch-friendly target sizes

    import { createGlobalStyle } from 'styled-components';

    // Global styles for the application
    const GlobalStyles = createGlobalStyle`

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html {
        scroll-behavior: smooth;
        font-size: 16px; /* Base font size */
        scrollbar-width: none;
        -ms-overflow-style: none;
        
        /* Responsive font scaling */
        @media (min-width: 1800px) {
        font-size: 18px; /* Slightly larger base font for very large screens */
        }
        
        @media (max-width: 1200px) {
        font-size: 15px;
        }
        
        @media (max-width: 768px) {
        font-size: 14px;
        }
        
        @media (max-width: 480px) {
        font-size: 13px;
        }
    }

    html::-webkit-scrollbar {
        display: none;
    }

    #root {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        width: 100%;
        background-color: ${props => props.theme.background};
        --heading-font: 'Space Grotesk', sans-serif;
        --body-font: 'Inter', sans-serif;
        
        /* Responsive layout variables */
        --max-content-width: 1440px;
        --section-padding: clamp(4rem, 8vw, 12rem);
        --container-padding: clamp(1rem, 4vw, 2rem);
        --header-margin: clamp(2rem, 6vw, 6rem);
        
        /* Viewport-based spacing for consistent scaling */
        --space-xs: clamp(0.25rem, 0.5vw, 0.5rem);
        --space-sm: clamp(0.5rem, 1vw, 1rem);
        --space-md: clamp(1rem, 2vw, 2rem);
        --space-lg: clamp(1.5rem, 3vw, 3rem);
        --space-xl: clamp(2rem, 4vw, 4rem);
        
        /* Typography scaling */
        --font-size-xs: clamp(0.75rem, 1.5vw, 0.875rem);
        --font-size-sm: clamp(0.875rem, 1.75vw, 1rem);
        --font-size-base: clamp(1rem, 2vw, 1.125rem);
        --font-size-lg: clamp(1.125rem, 2.25vw, 1.25rem);
        --font-size-xl: clamp(1.25rem, 2.5vw, 1.5rem);
        
        /* Ultra-wide screen handling */
        @media (min-width: 2400px) {
        max-width: 2400px;
        margin: 0 auto;
    }
    }

    body {
        font-family: var(--body-font);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: ${props => props.theme.background};
        color: ${props => props.theme.text};
        transition: background-color 0.5s ease, color 0.5s ease;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    body::-webkit-scrollbar {
        display: none;
    }

    /* Improve container sizing for larger screens */
    .content-container {
        width: 100%;
        max-width: var(--max-content-width);
        margin: 0 auto;
        padding: 0 var(--container-padding);
        
        @media (min-width: 1800px) {
        max-width: 1600px; /* Wider container on extra large screens */
        }
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: var(--heading-font);
        font-weight: 500;
        letter-spacing: -0.02em;
        line-height: 1.2;
    }

    /* Responsive typography scale */
    h1 {
        font-size: clamp(2.5rem, 8vw, 6rem);
    }
    
    h2 {
        font-size: clamp(2rem, 6vw, 4rem);
    }
    
    h3 {
        font-size: clamp(1.5rem, 4vw, 2.5rem);
    }
    
    h4 {
        font-size: clamp(1.25rem, 3vw, 1.8rem);
    }
    
    p {
        font-size: clamp(0.9rem, 2.5vw, 1.1rem);
        line-height: 1.6;
    }

    section {
        position: relative;
        overflow: visible !important;
        z-index: 2;
        padding: var(--section-padding) var(--container-padding);
        
        @media (max-width: 768px) {
        padding: clamp(3rem, 6vw, 8rem) var(--container-padding);
        }
        
        @media (max-width: 480px) {
        padding: clamp(2rem, 6vw, 3rem) var(--container-padding);
        }
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    button {
        cursor: pointer;
        border: none;
        outline: none;
        background: none;
        font-family: inherit;
    }

    ::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
    }
    
    /* Fix overflow issues on mobile */
    .overflow-fix {
        overflow-x: hidden;
        width: 100%;
    }
    
    /* Fix for iOS height issues */
    @supports (-webkit-touch-callout: none) {
        .min-height-fix {
        min-height: -webkit-fill-available;
        }
        
        #root, body, html {
        height: -webkit-fill-available;
        }
    }
    
    /* Improved focus styles for accessibility */
    *:focus-visible {
        outline: 2px solid ${props => props.theme.accent};
        outline-offset: 2px;
    }
    
    /* Touch-friendly target sizes for mobile */
    @media (max-width: 768px) {
        button, 
        a, 
        [role="button"],
        input[type="button"],
        input[type="submit"] {
        min-height: 44px;
        min-width: 44px;
        }
    }
    
    /* Fix for position: sticky support */
    .sticky-container {
        position: -webkit-sticky;
        position: sticky;
    }
    
    /* Fix z-index stacking context issues */
    .z-wrapper {
        isolation: isolate;
    }
    
    /* Fix for mobile position: fixed jumps */
    @media (max-width: 768px) {
        .fixed-element {
        position: fixed;
        will-change: transform;
        transform: translateZ(0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        }
    }
    `;

    export default GlobalStyles;