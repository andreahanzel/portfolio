// src\styles\GlobalStyles.ts
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html {
        scroll-behavior: smooth;
    }


    #root {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        width: 100%;
        background-color: ${props => props.theme.background};
        --heading-font: 'Syne', sans-serif;
        --body-font: 'DM Sans', sans-serif;
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
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: var(--heading-font);
        font-weight: 500; /* Lighter weight for more minimalistic look */
        letter-spacing: -0.02em; /* Slight negative tracking for modern feel */
    }

    section {
    position: relative;
    overflow: visible !important; /* Force overflow to be visible */
    z-index: 2;
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

    /* Futuristic scrollbar */
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    ::-webkit-scrollbar-track {
        background: ${props => props.theme.background};
    }

    ::-webkit-scrollbar-thumb {
        background: ${props => props.theme.accent}80;
        border-radius: 3px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: ${props => props.theme.accent};
    }
`;

export default GlobalStyles;