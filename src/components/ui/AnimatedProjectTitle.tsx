import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AnimatedProjectTitleProps {
    isDarkMode: boolean;
}

const TitleContainer = styled.div`
    position: relative;
    width: 100%;
    padding: clamp(1rem, 3vw, 2rem) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: clamp(2rem, 4vw, 4rem);
    min-height: clamp(20vh, 30vh, 40vh); 
    z-index: 5;
    
    @media (max-width: 768px) {
        margin-bottom: clamp(1rem, 3vw, 2rem);
        min-height: clamp(15vh, 25vh, 30vh);
    }
`;

interface GiantTitleProps {
    isDarkMode: boolean;
}

const GiantTitle = styled(motion.h1)<GiantTitleProps>`
    font-family: var(--heading-font);
    font-size: clamp(3rem, 10vw, 12rem); // Reduced minimum size for mobile
    font-weight: 700;
    line-height: 0.9;
    text-transform: uppercase;
    text-align: center;
    letter-spacing: clamp(-0.06em, -0.02vw, -0.04em);
    margin: 0;
    padding: 0 clamp(1rem, 3vw, 2rem); // Add padding to prevent cutoff
    overflow: visible;
    transition: filter 0.6s ease, opacity 0.6s ease;
    word-break: break-word; // Allow breaking on mobile
    hyphens: auto; // Enable hyphenation

    color: ${props => props.isDarkMode ? '#F8FAFC' : '#FF9800'};

    background: ${props => props.isDarkMode
        ? 'linear-gradient(90deg, #F1F5F9, #F8FAFC)'
        : 'linear-gradient(90deg, #FF9800, #FFAB40)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    text-shadow: ${props => props.isDarkMode
        ? '0 0 20px rgba(226, 232, 240, 0.2)'
        : '0 0 20px rgba(255, 152, 0, 0.2)'};
    
    @media (max-width: 768px) {
        line-height: 1;
        font-size: clamp(2.5rem, 12vw, 8rem); // Better mobile scaling
    }
    
    @media (max-width: 480px) {
        font-size: clamp(2rem, 15vw, 6rem);
        letter-spacing: -0.02em;
    }
`;

const LetterWrapper = styled(motion.span)`
    display: inline-block;
    position: relative;
    transform-origin: center bottom;
`;

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
        hidden: { opacity: 0.3 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.3,
                duration: 1,
            },
        },
    };

    const letterVariants = {
        hidden: {
            y: 50,
            opacity: 0,
            skewY: 5,
        },
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            skewY: 0,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
                delay: i * 0.04,
                duration: 1.2,
            },
        }),
    };

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
                        filter: inView ? 'blur(0)' : 'blur(3px)', // Reduced blur
                        opacity: inView ? 1 : 0.7, // Less opacity difference
                        transition: 'filter 0.6s ease, opacity 0.6s ease',
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