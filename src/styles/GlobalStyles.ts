// src\styles\GlobalStyles.ts
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
        --heading-font: 'Syne', sans-serif;
        --body-font: 'DM Sans', sans-serif;
        
        /* Responsive spacing variables */
        --section-padding: clamp(4rem, 8vw, 12rem);
        --container-padding: clamp(1rem, 4vw, 2rem);
        --header-margin: clamp(2rem, 6vw, 6rem);
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
`;

export default GlobalStyles;