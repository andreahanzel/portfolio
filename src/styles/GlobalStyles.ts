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

    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
        background-color: ${props => props.theme.background};
        color: ${props => props.theme.text};
        transition: background-color 0.3s ease, color 0.3s ease;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    #root {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        width: 100%;
        background-color: ${props => props.theme.background};
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