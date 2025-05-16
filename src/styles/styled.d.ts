// src/styles/styled.d.ts
import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        background: string;
        text: string;
        primary: string;
        secondary: string;
        accent: string;
        surface: string;
    }
}