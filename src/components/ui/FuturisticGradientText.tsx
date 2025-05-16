// src/components/ui/FuturisticGradientText.tsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface GradientTextProps {
    text: string;
    delay?: number;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
    className?: string;
    textAlign?: string;
    gradient?: 'primary' | 'secondary' | 'custom';
    customGradient?: string;
    split?: boolean;
    isDarkMode?: boolean;

}


const TextWrapper = styled(motion.div)<{
    $fontSize?: string;
    $fontWeight?: string;
    $lineHeight?: string;
    $letterSpacing?: string;
    $textAlign?: string;
}>`
    display: inline-block;
    font-size: ${props => props.$fontSize || '2.5rem'};
    font-weight: ${props => props.$fontWeight || '700'};
    line-height: ${props => props.$lineHeight || '1.2'};
    text-align: ${props => props.$textAlign || 'left'};
    position: relative;
    width: 100%;
    margin-bottom: clamp(1.5rem, 4vh, 2.5rem);
    letter-spacing: -0.02em; // Slight negative tracking for modern look
    
    @media (max-width: 768px) {
        line-height: 1.1;
    }
`;

const GradientTextSpan = styled.span<{
    $gradient: 'primary' | 'secondary' | 'custom';
    $customGradient?: string;
}>`
    display: inline-block;
    background: ${props => {
        switch(props.$gradient) {
            case 'primary':
                return `linear-gradient(
                    90deg,
                    ${props.theme.text},
                    ${props.theme.accent},
                    ${props.theme.text}
                )`;
            case 'secondary':
                return `linear-gradient(
                    90deg,
                    ${props.theme.secondary},
                    ${props.theme.accent},
                    ${props.theme.secondary}
                )`;
            case 'custom':
                return props.$customGradient || `linear-gradient(
                    90deg,
                    ${props.theme.text},
                    ${props.theme.accent}
                )`;
            default:
                return `linear-gradient(
                    90deg,
                    ${props.theme.text},
                    ${props.theme.accent},
                    ${props.theme.text}
                )`;
        }
    }};
        background-size: 200% auto;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-fill-color: transparent;
        
        /* Enhanced text shadow for better effect */
        text-shadow: ${props => props.theme.isDarkMode ? 
            '0 0 30px rgba(226, 232, 240, 0.3), 0 0 10px rgba(226, 232, 240, 0.2)' : 
            '0 0 20px rgba(255, 152, 0, 0.3), 0 0 40px rgba(255, 152, 0, 0.1)'}; /* Increased opacity for light mode */
        
        @media (max-width: 480px) {
            text-shadow: ${props => props.theme.isDarkMode ? 
                '0 0 15px rgba(226, 232, 240, 0.15), 0 0 5px rgba(226, 232, 240, 0.1)' : 
                '0 0 10px rgba(255, 152, 0, 0.2), 0 0 20px rgba(255, 152, 0, 0.1)'};
        }
`;

// Animation variants for character animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: (delay = 0) => ({
        opacity: 1,
        transition: {
            staggerChildren: 0.03,
            delayChildren: delay,
        }
    })
};

const characterVariants = {
    hidden: { 
        opacity: 0,
        y: 10,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            damping: 12,
            stiffness: 200,
        }
    }
};

const FuturisticGradientText: React.FC<GradientTextProps> = ({
    text,
    delay = 0,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    className,
    textAlign,
    gradient = 'primary',
    customGradient,
}) => {
    // Split text into individual characters for animation
    const characters = text.split('');

    return (
        <TextWrapper
            $fontSize={fontSize}
            $fontWeight={fontWeight}
            $lineHeight={lineHeight}
            $letterSpacing={letterSpacing}
            $textAlign={textAlign}
            className={className}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            custom={delay}
        >
            {characters.map((char, index) => (
                <motion.span
                    key={`${char}-${index}`}
                    variants={characterVariants}
                    style={{ display: 'inline-block' }}
                >
                    {char === ' ' ? (
                        // Handle spaces properly
                        <span>&nbsp;</span>
                    ) : (
                        <GradientTextSpan
                            $gradient={gradient}
                            $customGradient={customGradient}
                        >
                            {char}
                        </GradientTextSpan>
                    )}
                </motion.span>
            ))}
        </TextWrapper>
    );
};

export default FuturisticGradientText;