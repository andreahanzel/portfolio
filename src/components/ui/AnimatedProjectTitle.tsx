// src\components\ui\AnimatedProjectTitle.tsx
// This component is responsible for rendering the animated project title
// It uses styled-components for styling and framer-motion for animations
// It allows for customizable title text, font size, and animation effects
// It also includes a responsive design for different screen sizes
// It uses the useEffect hook to handle animation triggers


// Imports 
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// This component is responsible for rendering the animated project title
interface AnimatedProjectTitleProps {
    isDarkMode: boolean;
}

// Styled component for the title container
const TitleContainer = styled.div`
    position: relative;
    width: 100%;
    padding: clamp(0.5rem, 2vw, 1rem) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: clamp(1rem, 3vw, 3rem);
    min-height: clamp(10vh, 20vh, 30vh);
    z-index: 25;
    overflow: hidden;
`;

// Styled component for the giant title
interface GiantTitleProps {
    isDarkMode: boolean;
}

// This component is responsible for rendering the giant title
// It uses the motion library for animations and styled-components for styling
const GiantTitle = styled(motion.h1)<GiantTitleProps>`
    font-family: var(--heading-font);
    font-size: clamp(2rem, 8vw, 10rem);
    font-weight: 300;
    line-height: 0.9;
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 0.25em;
    margin: 0;
    padding: 0 clamp(0.5rem, 2vw, 1rem);
    overflow: visible;
    white-space: nowrap;
    
    
    color: ${props => props.isDarkMode ? '#FFFFFF' : '#FF9800'}; 
    
    
    @media (max-width: 768px) {
        font-size: clamp(1.2rem, 8vw, 4rem);
        line-height: 1;
        letter-spacing: 0.25em;
        text-shadow: ${props => props.isDarkMode
            ? '0 0 15px rgba(255, 255, 255, 0.7), 0 1px 2px rgba(0, 0, 0, 0.8)'
            : '0 0 15px rgba(255, 107, 0, 0.6), 0 1px 2px rgba(0, 0, 0, 0.3)'};
            margin-top: 2.5rem;
    }
    
`;

// Styled component for the letter wrapper
// This component is responsible for wrapping each letter of the title
const LetterWrapper = styled(motion.span)`
    display: inline-block;
    position: relative;
    transform-origin: center bottom;
    perspective: 1000px;       
    transform-style: preserve-3d;
`;

// AnimatedProjectTitle component
// This component is responsible for rendering the animated project title
const AnimatedProjectTitle: React.FC<AnimatedProjectTitleProps> = ({ isDarkMode }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: false,
        threshold: 0.2, // Reduced threshold for better mobile detection
    });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else {
            controls.start('hidden');
        }
    }, [controls, inView]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.2,
                duration: 1.5,
            },
        },
    };

    // Animation variants for each letter
    const letterVariants = {
    hidden: {
        y: 100,
        opacity: 0,
        rotateX: -90, 
        scale: 0.5,
    },
    visible: (i: number) => ({
        y: 0,
        opacity: 1,
        rotateX: 0,        
        scale: 1,         
        transition: {
            type: 'spring',
            damping: 15,
            stiffness: 80,
            delay: i * 0.06,
            duration: 1.5,
        },
        }),
    };

    // Split the title into an array of characters
    // This allows for individual animation of each character
    const titleText = 'PROJECTS';
    const titleArray = titleText.split('');

    return (
        <TitleContainer ref={ref}>
            <GiantTitle isDarkMode={isDarkMode}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                    style={{
                        
                    }}
                >
                    {titleArray.map((char, index) => (
                        <LetterWrapper key={index} custom={index} variants={letterVariants}>
                            {char === ' ' ? '\u00A0' : char}
                        </LetterWrapper>
                    ))}
                </motion.div>
            </GiantTitle>
        </TitleContainer>
    );
};

export default AnimatedProjectTitle;