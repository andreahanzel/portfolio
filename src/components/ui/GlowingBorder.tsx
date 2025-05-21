// src/components/ui/GlowingBorder.tsx 

import React from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import { motion } from 'framer-motion';

// This component is responsible for rendering a glowing border around its children
interface GlowingBorderProps {
    children: React.ReactNode;
    borderWidth?: string;
    borderRadius?: string;
    glowColor?: string;
    borderColor?: string;
    glowIntensity?: 'low' | 'medium' | 'high';
    pulsate?: boolean;
    className?: string;
    onClick?: () => void;
}

// Keyframes for pulsating effect - updated with theme-appropriate colors
const pulsate = keyframes`
    0% {
        box-shadow: 0 0 5px 0px rgba(255, 217, 102, 0.2), 0 0 20px 0px rgba(255, 217, 102, 0.1);
    }
    50% {
        box-shadow: 0 0 10px 3px rgba(255, 217, 102, 0.3), 0 0 30px 5px rgba(255, 217, 102, 0.2);
    }
    100% {
        box-shadow: 0 0 5px 0px rgba(255, 217, 102, 0.2), 0 0 20px 0px rgba(255, 217, 102, 0.1);
    }
`;

// Dark mode pulsate effect
const pulsateDark = keyframes`
    0% {
        box-shadow: 0 0 5px 0px rgba(226, 232, 240, 0.2), 0 0 20px 0px rgba(226, 232, 240, 0.1);
    }
    50% {
        box-shadow: 0 0 10px 3px rgba(226, 232, 240, 0.3), 0 0 30px 5px rgba(226, 232, 240, 0.2);
    }
    100% {
        box-shadow: 0 0 5px 0px rgba(226, 232, 240, 0.2), 0 0 20px 0px rgba(226, 232, 240, 0.1);
    }
`;

// Border animation for light mode
const getBorderAnimation = (color: string) => keyframes`
    0% {
        border-image: linear-gradient(0deg, ${color}10, ${color}) 1;
    }
    25% {
        border-image: linear-gradient(90deg, ${color}10, ${color}) 1;
    }
    50% {
        border-image: linear-gradient(180deg, ${color}10, ${color}) 1;
    }
    75% {
        border-image: linear-gradient(270deg, ${color}10, ${color}) 1;
    }
    100% {
        border-image: linear-gradient(360deg, ${color}10, ${color}) 1;
    }
`;
// Border animation for dark mode
const GlowingBorderContainer = styled(motion.div)<{
    $borderWidth: string;
    $borderRadius: string;
    $glowColor: string;
    $borderColor: string;
    $glowIntensity: 'low' | 'medium' | 'high';
    $pulsate: boolean;
    $isDarkMode?: boolean;
}>`
    position: relative;
    border-width: ${props => props.$borderWidth};
    border-style: solid;
    border-radius: ${props => props.$borderRadius};
    backdrop-filter: blur(4px);

    /* Define different intensities based on theme */
    ${props => {
        const color = props.$glowColor;
        
        const intensityMap = {
            low: `
                border-color: ${props.$borderColor}80;
                box-shadow: 0 0 5px 0px ${color}30, 0 0 10px 0px ${color}10;
            `,
            medium: `
                border-color: ${props.$borderColor}90;
                box-shadow: 0 0 8px 1px ${color}40, 0 0 15px 0px ${color}20;
            `,
            high: `
                border-color: ${props.$borderColor};
                box-shadow: 0 0 10px 2px ${color}50, 0 0 20px 2px ${color}30;
            `
        };

        return intensityMap[props.$glowIntensity];
    }}

    /* Add animation if pulsate is true, with theme-appropriate colors */
    animation: ${props => {
        if (props.$pulsate) {
            return props.$isDarkMode 
                ? `${pulsateDark} 3s infinite ease-in-out, ${getBorderAnimation(props.$glowColor)} 8s infinite linear` 
                : `${pulsate} 3s infinite ease-in-out, ${getBorderAnimation(props.$glowColor)} 8s infinite linear`;
        } else {
            return `${getBorderAnimation(props.$glowColor)} 8s infinite linear`;
        }
    }};

    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 0 15px 3px ${props => props.$glowColor}60;
        transform: translateY(-3px);
    }
`;
// Styled component for the glowing border
const GlowingBorder: React.FC<GlowingBorderProps> = ({
    children,
    borderWidth = '1px',
    borderRadius = '16px',
    glowColor,
    borderColor,
    glowIntensity = 'medium',
    pulsate = false,
    className,
    onClick
}) => {
    interface Theme {
        isDarkMode: boolean;
        accent?: string;
    }

    const theme = useTheme() as Theme; // Type assertion for isDarkMode access

    // Get appropriate color values based on theme
    let actualGlowColor, actualBorderColor;
    
    if (theme.isDarkMode) {
        actualGlowColor = glowColor || theme.accent || '#F8FAFC';
        actualBorderColor = borderColor || `${theme.accent}80` || 'rgba(226, 232, 240, 0.5)';
    } else {
        actualGlowColor = glowColor || theme.accent || '#FF9800';
        actualBorderColor = borderColor || `${theme.accent}80` || 'rgba(255, 152, 0, 0.5)';
    }

    return (
        <GlowingBorderContainer
            $borderWidth={borderWidth}
            $borderRadius={borderRadius}
            $glowColor={actualGlowColor}
            $borderColor={actualBorderColor}
            $glowIntensity={glowIntensity}
            $pulsate={pulsate}
            $isDarkMode={theme.isDarkMode}
            className={className}
            onClick={onClick}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
            {children}
        </GlowingBorderContainer>
    );
};

export default GlowingBorder;