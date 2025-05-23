// src/components/sections/About.tsx 

import { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Resume from '../ui/Resume';
import { downloadResumeAsPDF } from '../../utils/resumeDownload';

// Define the celestial theme color


// Floating animation for celestial bodies
const float = keyframes`
    0% { 
        transform: translateY(0px) translateX(0px) scale(1);
        opacity: 0.6;
    }
    50% { 
        transform: translateY(-8px) translateX(4px) scale(1.05);
        opacity: 0.9;
    }
    100% { 
        transform: translateY(0px) translateX(0px) scale(1);
        opacity: 0.6;
    }
`;

// Updated container with better spacing
const AboutContainer = styled(motion.section)`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: clamp(8rem, 15vw, 10rem) clamp(1rem, 4vw, 2rem) clamp(1rem, 3vw, 2rem);
    position: relative;
    z-index: 2;
    
    /* Remove margin causing overlap */
    margin-top: 0;
    margin-bottom: 0;
    
    @media (min-width: 1800px) {
        padding: clamp(8rem, 12vw, 12rem) clamp(2rem, 6vw, 4rem);
        justify-content: flex-start;
    }
    
    @media (max-width: 768px) {
        padding: clamp(6rem, 12vw, 8rem) clamp(1rem, 3vw, 1.5rem) clamp(1rem, 2vw, 1.5rem);
        min-height: auto; // Let content determine height on mobile
    }
    `;

// Updated content wrapper with better spacing
const AboutContent = styled.div`
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    gap: clamp(4rem, 8vw, 8rem);
    position: relative;
    z-index: 2;
    
    @media (min-width: 1800px) {
        max-width: 1400px;
    }
    
    @media (max-width: 992px) {
        flex-direction: column;
        gap: clamp(3rem, 6vw, 4rem);
        max-width: 100%;
    }
    `;


//This container holds the image and the text
    const AboutImageContainer = styled(motion.div)`
    flex: 1;
    position: relative;
    
    
    @media (min-width: 993px) {
        position: sticky;
        top: 150px;
        align-self: flex-start;
        height: fit-content;
        max-width: 40%;
    }
    
    @media (min-width: 1800px) {
        max-width: 35%;
    }
    
    @media (max-width: 992px) {
        order: 1;
        margin: 0 auto;
        max-width: clamp(300px, 80vw, 400px);
        position: static; // Remove sticky on mobile
    }
    
    @media (max-width: 480px) {
        max-width: clamp(250px, 90vw, 300px);
    }
    `;

// Updated image styling with celestial theme effects
const AboutImage = styled(motion.div)`
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    width: 100%;
    aspect-ratio: 1; // Force perfect circle
    transform-style: preserve-3d;
    transition: transform 0.5s ease;
    background: ${props => props.theme.isDarkMode ? 
        'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))' : 
        'linear-gradient(135deg, rgba(255, 249, 240, 0.7), rgba(255, 241, 224, 0.8))'};
    backdrop-filter: blur(10px);
    border: 1px solid ${props => props.theme.isDarkMode ? 
        'rgba(226, 232, 240, 0.1)' : 
        'rgba(255, 152, 0, 0.1)'};
    box-shadow: ${props => props.theme.isDarkMode
        ? '0 8px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(147, 197, 253, 0.3)'
        : '0 8px 25px rgba(251, 146, 60, 0.3), 0 0 20px rgba(253, 186, 116, 0.2)'};

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border: 1px solid ${props => props.theme.isDarkMode ? 
            'rgba(226, 232, 240, 0.1)' : 
            'rgba(255, 152, 0, 0.1)'};
        border-radius: 50%;
        z-index: 3;
        pointer-events: none;
    }
    
    &::after {
        content: '';
        position: absolute;
        inset: -20px;
        border-radius: 50%;
        background: ${props => props.theme.isDarkMode ? 
            'radial-gradient(circle, rgba(226, 232, 240, 0.15) 0%, transparent 70%)' : 
            'radial-gradient(circle, rgba(255, 152, 0, 0.15) 0%, transparent 70%)'};
        z-index: -1;
        pointer-events: none;
    }
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: relative;
        z-index: 2;
        transition: transform 0.5s ease;
        opacity: 1;
    }
    
    @media (max-width: 768px) {
        // No height override on mobile - let aspect-ratio handle it
    }
`;

// Updated image border effects to match the celestial theme
const ImageBorderEffect = styled.div`
    position: absolute;
    z-index: 0;
    
    &.border1 {
        top: -10px;
        right: -10px;
        width: 100px;
        height: 100px;
        border-top: 1px solid ${props => props.theme.isDarkMode ? 
            'rgba(226, 232, 240, 0.2)' : 
            'rgba(255, 152, 0, 0.2)'};
        border-right: 1px solid ${props => props.theme.isDarkMode ? 
            'rgba(226, 232, 240, 0.2)' : 
            'rgba(255, 152, 0, 0.2)'};
        border-top-right-radius: 8px;
    }
    
    &.border2 {
        bottom: -10px;
        left: -10px;
        width: 100px;
        height: 100px;
        border-bottom: 1px solid ${props => props.theme.isDarkMode ? 
            'rgba(226, 232, 240, 0.2)' : 
            'rgba(255, 152, 0, 0.2)'};
        border-left: 1px solid ${props => props.theme.isDarkMode ? 
            'rgba(226, 232, 240, 0.2)' : 
            'rgba(255, 152, 0, 0.2)'};
        border-bottom-left-radius: 8px;
    }
`;

//This effect is a glowing overlay that adds depth to the image
const GlowEffect = styled(motion.div)`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: ${props => props.theme.isDarkMode ? 
        'linear-gradient(135deg, rgba(226, 232, 240, 0.05), transparent 50%)' : 
        'linear-gradient(135deg, rgba(255, 152, 0, 0.1), transparent 50%)'};
    opacity: 0.5;
    z-index: 2;
    pointer-events: none;
`;

// Floating particles effect
const FloatingParticle = styled(motion.div)`
    position: absolute;
    border-radius: 50%;
    background-color: ${props => props.theme.isDarkMode ? 
        'rgba(226, 232, 240, 0.6)' : 
        'rgba(255, 152, 0, 0.4)'};
    opacity: 0.4;
    filter: blur(1px);
    z-index: 1;
    animation: ${float} 4s ease-in-out infinite;
`;

// Updated celestial wrapper to match the celestial theme
const CelestialWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0; // Lower z-index
    pointer-events: none;
`;

// Floating skill variants for celestial theme
const floatingSkillVariants: Variants = {
    hidden: { 
        opacity: 0,
        y: 20,
        scale: 0.95
    },
    visible: (i: number) => ({
        opacity: 1,
        y: [0, -5, 0],
        scale: 1,
        transition: { 
            duration: 2 + Math.random() * 3,
            delay: i * 0.1,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: "easeInOut"
        }
    })
};

// Updated about info section to match the celestial theme
const AboutInfo = styled(motion.div)`
    flex: 1;
    
    @media (max-width: 992px) {
        order: 2;
    }
`;

    // Updated title accent to match Home page styling
    const TitleAccent = styled(motion.div)`
        width: clamp(30px, 6vw, 40px);
        height: 3px;
        background: ${props => props.theme.isDarkMode ? 
            'linear-gradient(90deg, rgba(226, 232, 240, 0.8), rgba(226, 232, 240, 0.2))' : 
            'linear-gradient(90deg, rgba(255, 152, 0, 0.8), rgba(255, 152, 0, 0.2))'};
        margin-bottom: clamp(1rem, 3vw, 1.5rem);
    `;

    const Title = styled(motion.h2)`
        font-size: clamp(3.5rem, 8vw, 5.5rem);
        margin-bottom: clamp(0.3rem, 1vw, 0.5rem);
        background: ${props => props.theme.isDarkMode ? 
            'linear-gradient(90deg, #F1F5F9, #F8FAFC, #FFFFFF)' : 
            'linear-gradient(90deg, #FF9800, #FFC107, #FF7A00)'};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        font-weight: 400;
        letter-spacing: -0.02em;
        font-family: var(--heading-font);
        line-height: 1.1;
        color: ${props => props.theme.isDarkMode ? 
            'rgb(255, 255, 255)' : 
            'rgb(0, 0, 0)'};
        
        @media (max-width: 768px) {
            text-align: center;
        }
    `;

    // Updated subtitle with gradient matching Home page
    const Subtitle = styled(motion.h3)`
        font-size: clamp(1rem, 2.5vw, 1.2rem);
        background: ${props => props.theme.isDarkMode ? 
            'linear-gradient(90deg, #F1F5F9, #F8FAFC)' : 
            'linear-gradient(90deg, #FF9800, #FFAB40)'};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        margin-bottom: clamp(1.5rem, 3vw, 2rem);
        font-weight: 500;
        letter-spacing: 0.5px;
        font-family: var(--heading-font);
        
        @media (max-width: 768px) {
            text-align: center;
        }
    `;

    // Updated about text with better readability
 const AboutText = styled(motion.p)`
    font-size: clamp(0.9rem, 2vw, 1rem);
    line-height: 1.8;
    color: ${props => props.theme.isDarkMode ? 
        props.theme.text + 'ee' : 
        props.theme.text}; // Use theme text color directly (#1A1A1A)
    margin-bottom: clamp(1.2rem, 2.5vw, 1.5rem);
    font-family: var(--body-font);
    font-weight: 400;
    
    strong {
        color: ${props => props.theme.text};
        font-weight: 600;
    }
    
    @media (max-width: 768px) {
        line-height: 1.6;
        text-align: justify;
    }
`;

// Updated skills container to match the celestial theme
    const SkillsContainer = styled(motion.div)`
    margin: clamp(4rem, 8vw, 6rem) 0; // More spacing for mobile
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 clamp(1rem, 3vw, 2rem);
    
    @media (min-width: 993px) {
        margin-top: clamp(4rem, 8vw, 6rem); // Positive margin on desktop too
    }

    @media (min-width: 1800px) {
        margin-top: clamp(5rem, 6vw, 8rem);
    }

    @media (max-width: 768px) {
        margin-top: clamp(3rem, 8vw, 6rem);
        padding: 0 0.5rem;
    }
    `;

// Updated skills title to match the celestial theme
const SkillsTitle = styled(motion.h3)`
    font-size: clamp(2.5rem, 6vw, 3.5rem);
    margin-bottom: clamp(1rem, 3vw, 1.5rem);
    background: ${props => props.theme.isDarkMode ? 
        'linear-gradient(90deg, #F1F5F9, #F8FAFC)' : 
        'linear-gradient(90deg, #FF9800, #FFAB40)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    font-weight: 400;
    letter-spacing: 0.5px;
    font-family: var(--heading-font);
    text-align: center;
`;


// Updated grid layout for skills
    const SkillsGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: clamp(0.8rem, 2vw, 1rem);
    justify-content: center;
    align-items: center;
    padding: clamp(1.5rem, 3vw, 2rem) 0;
    max-width: 1200px;
    margin: 0 auto;
    perspective: 1000px;
    
    @media (min-width: 1800px) {
        max-width: 1400px;
        gap: clamp(1rem, 1.5vw, 1.5rem);
    }
    
    @media (max-width: 768px) {
        gap: clamp(0.6rem, 1.5vw, 0.8rem);
        padding: 1.5rem 0;
    }
    
    @media (max-width: 480px) {
        gap: 0.5rem;
        padding: 1rem 0;
    }
    `;


// Updated skill cards to match the project cards styling
const SkillItem = styled(motion.div)`
    width: clamp(100px, 15vw, 120px);
    height: clamp(100px, 15vw, 120px);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
    position: relative;
    overflow: hidden;
    padding: clamp(0.8rem, 2vw, 1rem);
    backdrop-filter: blur(6px);
    background-color: ${props => props.theme.isDarkMode ? 
        'rgba(20, 30, 50, 0.8)' : 
        'rgba(255, 249, 240, 0.8)'};
    border: 1px solid ${props => props.theme.isDarkMode ? 
        'rgba(226, 232, 240, 0.2)' : 
        'rgba(255, 152, 0, 0.2)'};
    box-shadow: ${props => props.theme.isDarkMode
                ? '0 8px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(147, 197, 253, 0.3)'
                : '0 8px 25px rgba(251, 146, 60, 0.3), 0 0 20px rgba(253, 186, 116, 0.2)'};
    cursor: pointer;
    transition: all 0.3s ease;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        z-index: -1;
        background: ${props => props.theme.isDarkMode ? 
            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05), transparent)' : 
            'radial-gradient(circle at 30% 30%, rgba(255, 200, 100, 0.1), transparent)'};
    }

    &:hover {
        transform: scale(1.05);
        box-shadow: ${props => props.theme.isDarkMode ? 
            '0 0 60px rgba(255, 255, 255, 0.2), 0 0 100px rgba(226, 232, 240, 0.2)' : 
            '0 0 60px rgba(255, 200, 100, 0.3), 0 0 100px rgba(255, 152, 0, 0.25)'};
    }
    
    @media (max-width: 768px) {
        width: clamp(90px, 18vw, 110px);
        height: clamp(90px, 18vw, 110px);
        padding: 0.8rem;
    }
    
    @media (max-width: 480px) {
        width: clamp(80px, 20vw, 100px);
        height: clamp(80px, 20vw, 100px);
        padding: 0.6rem;
    }
`;

// This component holds the icon and name of the skill
const SkillTop = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 0.8rem;
    width: 100%;
`;

// This component holds the icon of the skill
const SkillIcon = styled.div`
    font-size: clamp(1.2rem, 2.5vw, 1.5rem);
    margin-bottom: 0.5rem;
    
    @media (max-width: 480px) {
        font-size: 1rem;
    }
`;

// This component holds the name of the skill
const SkillName = styled.span`
    font-size: clamp(0.8rem, 1.8vw, 0.95rem);
    font-weight: 500;
    color: ${props => props.theme.text};
    font-family: var(--body-font);
    text-align: center;
    line-height: 1.2;
    margin-bottom: clamp(0.5rem, 1vw, 0.8rem);
    
    @media (max-width: 480px) {
        font-size: 0.75rem;
        line-height: 1.1;
    }
`;




// This component holds the download resume button
const DownloadResumeButton = styled(motion.a)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    padding: 0; // Remove default padding
    width: clamp(60px, 10vw, 80px);
    height: clamp(60px, 10vw, 80px);
    aspect-ratio: 1 / 1;
    font-size: clamp(0.6rem, 1.5vw, 0.75rem);
    font-weight: 400;
    letter-spacing: 0.5px;
    color: ${props => props.theme.text};
    background-color: ${props => props.theme.isDarkMode
        ? 'rgba(226, 232, 240, 0.08)'
        : 'rgba(255, 152, 0, 0.05)'};
    border: 1px solid ${props => props.theme.isDarkMode
        ? `${props.theme.accent}40`
        : `${props.theme.accent}50`};
    border-radius: 50%;
    margin-top: clamp(2.5rem, 4vw, 3rem);
    margin-left: auto; // Push slightly right
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);
    white-space: normal;
    text-decoration: none;
    box-shadow: ${props => props.theme.isDarkMode
        ? '0 8px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(147, 197, 253, 0.3)'
        : '0 8px 25px rgba(251, 146, 60, 0.3), 0 0 20px rgba(253, 186, 116, 0.2)'};
    
        
    &:hover {
        transform: translateY(-5px);
        border-color: ${props => props.theme.accent};
        background-color: ${props => props.theme.isDarkMode
        ? 'rgba(226, 232, 240, 0.15)'
        : `${props.theme.accent}15`};
        box-shadow: ${props => props.theme.isDarkMode
        ? '0 10px 20px rgba(0, 0, 0, 0.25), 0 0 20px rgba(226, 232, 240, 0.4)'
        : '0 10px 20px rgba(0, 0, 0, 0.1), 0 0 20px rgba(255, 152, 0, 0.4)'};
    }

    @media (max-width: 768px) {
        margin: clamp(2.5rem, 4vw, 3rem) auto 0;
    }
    `;

    // This component holds the resume buttons
    const ResumeButtons = styled.div`
        display: flex;
        gap: 1rem;
        margin-top: clamp(2.5rem, 4vw, 3rem);
        
        @media (max-width: 768px) {
            flex-direction: column;
            align-items: center;
            gap: 0.8rem;
        }
    `;

    // This component holds the resume modal
    const ResumeModal = styled(motion.div)`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 2rem;
        overflow-y: auto;
    `;

    // This component is the close button for the modal
    const CloseButton = styled.button`
        position: absolute;
        top: 50px;
        margin-bottom: 40px;
        right: 16x;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: ${props => props.theme.isDarkMode ? 'rgba(226, 232, 240, 0.1)' : 'rgba(255, 152, 0, 0.1)'};
        border: 1px solid ${props => props.theme.isDarkMode ? 'rgba(226, 232, 240, 0.2)' : 'rgba(255, 152, 0, 0.2)'};
        color: ${props => props.theme.text};
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1.5rem;
        font-weight: bold;
        
        &:hover {
            transform: scale(1.1);
            background: ${props => props.theme.isDarkMode ? 'rgba(226, 232, 240, 0.2)' : 'rgba(255, 152, 0, 0.2)'};
        }

        
    `;

// This component holds the container for the various sections
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03,
            delayChildren: 0,
        },
    },
};


// This slide-in animation is used for the main content
const slideInVariants: Variants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { 
            duration: 0.5, 
            ease: [0.25, 0.1, 0.25, 1] 
        }
    },
};

// This variant is used for the right side of the screen
const slideInFromRightVariants: Variants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { 
            duration: 0.3, 
            ease: "easeOut"
        }
    },
};

//Floating animation for the particles
interface FloatPosition {
    x: number;
    y: number;
}

// Float variants for the particles
const floatVariants: Variants = {
    initial: ({ x, y }: FloatPosition) => ({
        x,
        y,
        opacity: 0.3 + Math.random() * 0.3,
    }),
    animate: ({ x, y }: FloatPosition) => ({
        x: x + Math.random() * 15 - 7.5,
        y: y + Math.random() * 15 - 7.5,
        opacity: [0.2, 0.4, 0.2],
        transition: {
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            repeatType: "mirror",
        }
    })
};



// Glow effect animation for the resume button
const glowVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: [0.3, 0.6, 0.3], 
        transition: { 
            duration: 0.5,
            repeat: Infinity,
            repeatType: "mirror" as const
        } 
    }
};

// This is the SVG for the close icon
const skills = [
    { name: 'HTML', icon: '⚡', level: 9 },
    { name: 'CSS', icon: '💫', level: 9 },
    { name: 'JavaScript', icon: '✨', level: 8 },
    { name: 'TypeScript', icon: '🔷', level: 8 },
    { name: 'React', icon: '⚛️', level: 9 },
    { name: 'Node.js', icon: '📡', level: 7 },
    { name: 'React Native', icon: '📱', level: 7 },
    { name: 'MongoDB', icon: '🔮', level: 6 },
    { name: 'UI/UX Design', icon: '🎨', level: 9 },
    { name: 'Figma', icon: '🔺', level: 8 },
    { name: 'Git', icon: '📊', level: 8 },
    { name: 'REST APIs', icon: '🔗', level: 8 },
];

// This is the list of creative skills
const creativeSkills = [
    { name: 'Brand Strategy', icon: '🧠', level: 9 },
    { name: 'Marketing Analytics', icon: '📈', level: 8 },
    { name: 'Adobe Illustrator', icon: '🎯', level: 9 },
    { name: 'Adobe Photoshop', icon: '🖌️', level: 9 },
    { name: 'Logo Design', icon: '🏷️', level: 9 },
    { name: 'Packaging Design', icon: '📦', level: 8 },
    { name: 'Content Creation', icon: '📝', level: 8 },
    { name: 'Social Campaigns', icon: '📣', level: 7 },
    { name: 'Email Design', icon: '✉️', level: 8 },
    { name: 'Market Research', icon: '🔍', level: 9 },
    { name: 'Motion Graphics', icon: '🎞️', level: 7 },
    { name: 'Creative Direction', icon: '🎬', level: 9 },
];

// Particles for the floating effect
const particles = Array.from({ length: 20 }, () => ({
    x: Math.random() * 500 - 250,
    y: Math.random() * 500 - 250,
    size: Math.random() * 6 + 3
}));

//About component
const About: React.FC = () => {
    const aboutSectionRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showResume, setShowResume] = useState(false);

    // Remove all scroll-based transforms - they're causing the issues
    const [ref, inView] = useInView({
        triggerOnce: false,
        threshold: 0.3,
    });

    const controls = useAnimation();
    
    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    // UseEffect to handle mouse movement for 3D effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!imageRef.current) return;
            
            const { clientX, clientY } = e;
            const { left, top, width, height } = imageRef.current.getBoundingClientRect();
            
            const x = (clientX - left) / width - 0.5;
            const y = (clientY - top) / height - 0.5;
            
            // Only apply 3D effect on desktop
            if (window.innerWidth > 768) {
                imageRef.current.style.transform = `
                    perspective(1000px)
                    rotateY(${x * 8}deg)
                    rotateX(${y * -8}deg)
                    translateZ(10px)
                `;
            }
        };
        
        // Reset transform on mouse leave
        const handleMouseLeave = () => {
            if (!imageRef.current) return;
            imageRef.current.style.transform = `
                perspective(1000px)
                rotateY(0deg)
                rotateX(0deg)
                translateZ(0px)
            `;
        };
        
        const element = imageRef.current;
        if (element) {
            element.addEventListener('mousemove', handleMouseMove);
            element.addEventListener('mouseleave', handleMouseLeave);
        }
        
        return () => {
            if (element) {
                element.removeEventListener('mousemove', handleMouseMove);
                element.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);
    

    
    const [skillsRef, skillsInView] = useInView({
    triggerOnce: false, // Allow multiple triggers
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: '-50px 0px', 
    });
    
    return (
        <AboutContainer
            id="about"
            ref={aboutSectionRef}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
        >
            <CelestialWrapper>
            
            </CelestialWrapper>
        
            <AboutContent ref={containerRef}>
                <AboutImageContainer
                    variants={slideInVariants}
                    // Remove all the problematic style transforms
                >
                <motion.div
                        ref={imageRef}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        >
                        <AboutImage>
                            <img src="/portrait.webp" alt="Andrea Toreki" />
                            
                            <GlowEffect 
                            variants={glowVariants}
                            initial="hidden"
                            animate="visible"
                            />

                            {particles.map((_, i) => (
                            <FloatingParticle
                                key={`particle-${i}`}
                                custom={{
                                x: Math.random() * 50 - 25,
                                y: Math.random() * 50 - 25,
                                }}
                                variants={floatVariants}
                                initial="initial"
                                animate="animate"
                                style={{ 
                                width: '2px',
                                height: '2px',
                                backgroundColor: 'inherit',
                                }}
                            />
                            ))}
                        </AboutImage>
                </motion.div>

                    
                    <ImageBorderEffect className="border1" />
                    <ImageBorderEffect className="border2" />
                </AboutImageContainer>
                
                <AboutInfo 
                    ref={ref} 
                    // Remove the problematic style transforms
                >
                    <TitleAccent variants={slideInFromRightVariants} />
                    <Title variants={slideInFromRightVariants}>
                        About Me
                    </Title>
                    <Subtitle 
                        initial={{ opacity: 0, y: 15 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.7 }}
                    >
                        UX/UI Visionary & Full-Stack Craftsman
                    </Subtitle>
                    
                    <AboutText 
                        variants={slideInFromRightVariants}
                        initial={{ opacity: 0, y: 15 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                    >
                        I’m Andrea Toreki — where code meets canvas. I blend technical precision with brand artistry, transforming digital experiences into memorable journeys. My dual expertise in engineering and marketing strategy doesn't just build products — it architects emotional connections.
                    </AboutText>

                    <AboutText 
                        variants={slideInFromRightVariants}
                        initial={{ opacity: 0, y: 15 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        At <strong>Il Makiage</strong>, I forged brand identities that captivated. For <strong>Wasabi Wallet</strong>, I reimagined digital security with elegance. My <strong>Google</strong> tenure sharpened my understanding of algorithms, behavior, and storytelling — a rare blend I leverage in every project.
                    </AboutText>

                    <AboutText 
                        variants={slideInFromRightVariants}
                        initial={{ opacity: 0, y: 15 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        My engineering carries the soul of a designer: I code with empathy, accessibility, and visual harmony as my north stars. Whether it’s a sleek storefront, a glowing dashboard, or an immersive portfolio, I build systems that resonate on every level.
                    </AboutText>

                    <AboutText 
                        variants={slideInFromRightVariants}
                        initial={{ opacity: 0, y: 15 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        Fluent across tech stacks and visual languages, I unite performance with beauty. My process is rooted in strategic thinking, creative intuition, and deep empathy — shaped by years of hands-on experience in brand design, UX, and development.
                    </AboutText>

                    <AboutText 
                        variants={slideInFromRightVariants}
                        initial={{ opacity: 0, y: 15 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                    >
                        When I’m not crafting code, I’m deconstructing design systems, exploring new tech horizons, or drawing inspiration from the wild patterns of nature. Let’s build something extraordinary — something that speaks both to logic and soul.
                    </AboutText>
                    
                    <ResumeButtons>
                        <motion.div
                            variants={slideInFromRightVariants}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            >
                            <DownloadResumeButton as="button" onClick={() => setShowResume(true)}>
                                My Source Code
                            </DownloadResumeButton>
                            </motion.div>

                    
                    <motion.div
                        variants={slideInFromRightVariants}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        >
                        <DownloadResumeButton
                            as="button"
                            onClick={async () => {
                            setShowResume(true);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            downloadResumeAsPDF('resume-container');
                            }}
                        >
                            DevFile.pdf
                        </DownloadResumeButton>
                    </motion.div>

                    </ResumeButtons>

                    {/* Resume Modal */}
                    <AnimatePresence>
                        {showResume && (
                            <ResumeModal
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={(e) => {
                                    if (e.target === e.currentTarget) {
                                        setShowResume(false);
                                    }
                                }}
                            >
                                <CloseButton onClick={() => setShowResume(false)}>
                                    ×
                                </CloseButton>
                                <div id="resume-container">
                                    <Resume onClose={() => setShowResume(false)} />
                                </div>
                            </ResumeModal>
                        )}
                    </AnimatePresence>
                </AboutInfo>
            </AboutContent>
            
            <SkillsContainer
                ref={skillsRef}
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={skillsInView ? { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.3, ease: "easeOut" }
                } : { 
                    opacity: 0, 
                    y: 20,
                    transition: { duration: 0.2 }
                }}
                >
                <SkillsTitle>Skills</SkillsTitle>
                <SkillsGrid>
                    {[...skills, ...creativeSkills].map((skill, index) => (
                        <motion.div
                                key={`skill-${index}`}
                                custom={index}
                                variants={floatingSkillVariants}
                                initial="hidden"
                                animate={skillsInView ? { 
                                    opacity: 1, 
                                    y: [0, -5, 0],
                                    scale: 1,
                                    transition: { 
                                    duration: 1.5,
                                    delay: index * 0.05,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    ease: "easeInOut"
                                    }
                                } : { opacity: 0, y: 10, scale: 0.95 }}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                >
                                <SkillItem>
                                    <SkillTop>
                                    <SkillIcon>{skill.icon}</SkillIcon>
                                    <SkillName>{skill.name}</SkillName>
                                    </SkillTop>
                                </SkillItem>
                                </motion.div>

                    ))}
                </SkillsGrid>
            </SkillsContainer>

        </AboutContainer>
    );
};

export default About;