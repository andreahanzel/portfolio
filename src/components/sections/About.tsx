// src/components/sections/About.tsx 

import { useEffect, useRef } from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import { motion, useAnimation, useScroll, useTransform, MotionValue } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AnimatedCelestialBody from '../effects/AnimatedCelestialBody';
import type { MotionStyle } from 'framer-motion';

interface Theme {
    background: string;
    text: string;
    surface: string;
    accent: string;
    isDarkMode: boolean;
}

// Updated animations to match the celestial theme
const pulseGlow = keyframes`
    0% { opacity: 0.5; box-shadow: 0 0 30px 2px rgba(255, 217, 102, 0.4), 0 0 70px 10px rgba(255, 255, 255, 0.15); }
    50% { opacity: 0.7; box-shadow: 0 0 40px 5px rgba(255, 255, 255, 0.3), 0 0 100px 15px rgba(255, 217, 102, 0.4); }
    100% { opacity: 0.5; box-shadow: 0 0 30px 2px rgba(255, 255, 255, 0.2), 0 0 70px 10px rgba(255, 217, 102, 0.4); }
`;

const pulseSun = keyframes`
    0% { opacity: 0.75; box-shadow: 0 0 40px 15px rgba(255, 152, 0, 0.2), 0 0 80px 30px rgba(255, 236, 179, 0.1); }
    50% { opacity: 0.85; box-shadow: 0 0 50px 20px rgba(255, 152, 0, 0.3), 0 0 90px 40px rgba(255, 236, 179, 0.2); }
    100% { opacity: 0.75; box-shadow: 0 0 40px 15px rgba(255, 236, 179, 0.2), 0 0 80px 30px rgba(255, 236, 179, 0.1); }
`;

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
    padding: 12rem 2rem 2rem;
    position: relative;
    overflow: visible;
    perspective: 1000px;
    transform-style: preserve-3d;
    z-index: 2;
    margin-top: -1px; /* Eliminate any gaps between sections */
    margin-bottom: -1px;
`;

// Enhanced glow orbs to match the style in Home and Projects
const GlowOrb = styled.div<{ $isDarkMode?: boolean }>`
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    z-index: 0;
    
    &.orb1 {
        top: 20%;
        left: 10%;
        width: 400px;
        height: 400px;
        background-color: ${props => props.$isDarkMode ? 
            'rgba(255, 217, 102, 0.1)' : 
            'rgba(255, 217, 102, 0.05)'};
        animation: ${props => props.$isDarkMode ? pulseGlow : pulseSun} 12s ease-in-out infinite;
        opacity: ${props => props.$isDarkMode ? 0.6 : 0.4};
    }
    
    &.orb2 {
        bottom: 15%;
        right: 10%;
        width: 500px;
        height: 500px;
        background-color: ${props => props.$isDarkMode ? 
            'rgba(226, 232, 240, 0.2)' : /* Brighter in dark mode */
            'rgba(255, 252, 245, 0.2)'}; /* Whiter in light mode */
        animation: ${props => props.$isDarkMode ? pulseGlow : pulseSun} 15s ease-in-out infinite alternate;
        opacity: ${props => props.$isDarkMode ? 0.6 : 0.4}; /* Increased opacity in both modes */
    }
`;

const AboutContent = styled.div`
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    gap: 8rem;
    position: relative;
    z-index: 2;
    
    /* Added min-height for better scroll behavior */
    @media (min-width: 993px) {
        min-height: 150vh; /* Make content area taller to allow scrolling */
    }
    
    @media (max-width: 992px) {
        flex-direction: column;
        gap: 4rem;
    }
`;

const AboutImageContainer = styled(motion.div)`
    flex: 1;
    position: relative;
    
    /* Add these properties for sticky behavior */
    @media (min-width: 993px) {
        position: sticky;
        top: 150px; /* Adjust this value to control where it sticks */
        align-self: flex-start;
        height: fit-content;
    }
    
    @media (max-width: 992px) {
        order: 1;
        margin: 0 auto;
        max-width: 400px;
    }
`;

// Updated image styling with celestial theme effects
const AboutImage = styled(motion.div)`
    position: relative;
    border-radius: 50%; /* Keep the circular shape */
    overflow: hidden;
    width: 100%;
    height: 500px;
    transform-style: preserve-3d;
    transition: transform 0.5s ease;
    background: ${props => props.theme.isDarkMode ? 
        'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))' : 
        'linear-gradient(135deg, rgba(255, 249, 240, 0.7), rgba(255, 241, 224, 0.8))'};
    backdrop-filter: blur(10px);
    border: 1px solid ${props => props.theme.isDarkMode ? 
        'rgba(226, 232, 240, 0.1)' : 
        'rgba(255, 152, 0, 0.1)'};
    /* Enhanced box shadow for glow effect */
    box-shadow: ${props => props.theme.isDarkMode ? 
        '0 15px 35px rgba(0, 0, 0, 0.4), 0 0 40px rgba(226, 232, 240, 0.3)' : 
        '0 15px 35px rgba(0, 0, 0, 0.15), 0 0 40px rgba(255, 152, 0, 0.3)'};
    
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border: 1px solid ${props => props.theme.isDarkMode ? 
            'rgba(226, 232, 240, 0.1)' : 
            'rgba(255, 152, 0, 0.1)'};
        border-radius: 50%; /* Match parent border-radius */
        z-index: 3;
        pointer-events: none;
    }
    
    /* Added a border effect */
    &::after {
        content: '';
        position: absolute;
        inset: -20px; /* Extends beyond the image border */
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
        mix-blend-mode: normal; /* Removed filter effect */
        opacity: 1; /* Full opacity */
    }
`;

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

const CelestialWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.4;
    z-index: 1;
    pointer-events: none;
`;

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

const AboutInfo = styled(motion.div)`
    flex: 1;
    
    @media (max-width: 992px) {
        order: 2;
    }
`;

// Updated title accent to match Home page styling
const TitleAccent = styled(motion.div)`
    width: 40px;
    height: 3px;
    background: ${props => props.theme.isDarkMode ? 
        'linear-gradient(90deg, rgba(226, 232, 240, 0.8), rgba(226, 232, 240, 0.2))' : 
        'linear-gradient(90deg, rgba(255, 152, 0, 0.8), rgba(255, 152, 0, 0.2))'};
    margin-bottom: 1.5rem;
`;

// Updated title styling to match Home page
const Title = styled(motion.h2)`
    font-size: 5.5rem;
    margin-bottom: 0.5rem;
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
`;

// Updated subtitle with gradient matching Home page
const Subtitle = styled(motion.h3)`
    font-size: 1.2rem;
    background: ${props => props.theme.isDarkMode ? 
        'linear-gradient(90deg, #F1F5F9, #F8FAFC)' : 
        'linear-gradient(90deg, #FF9800, #FFAB40)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    margin-bottom: 2rem;
    font-weight: 500; /* Increased from 400 */
    letter-spacing: 0.5px;
    font-family: var(--heading-font);
`;

// Updated paragraph styling
const AboutText = styled(motion.p)`
    font-size: 1rem;
    line-height: 1.8;
    color: ${props => props.theme.text};
    margin-bottom: 1.5rem;
    font-family: var(--body-font);
`;


const SkillsContainer = styled(motion.div)`
    margin-top: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

// Updated skills title to match section headings
const SkillsTitle = styled(motion.h3)`
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
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
    gap: 1rem;
    justify-content: center;
    align-items: center;
    padding: 2rem 0;
    max-width: 1200px;
    margin: 0 auto;
    perspective: 1000px;

    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    }

    @media (max-width: 480px) {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
    `;


// Updated skill cards to match the project cards styling
const SkillItem = styled(motion.div)`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    overflow: hidden;
    padding: 1rem;
    backdrop-filter: blur(6px);
    background-color: ${props => props.theme.isDarkMode ? 
        'rgba(20, 30, 50, 0.8)' : 
        'rgba(255, 249, 240, 0.8)'};
    border: 1px solid ${props => props.theme.isDarkMode ? 
        'rgba(226, 232, 240, 0.2)' : 
        'rgba(255, 152, 0, 0.2)'};
    box-shadow: ${props => props.theme.isDarkMode ? 
        '0 0 40px rgba(255, 255, 255, 0.1), 0 0 60px rgba(226, 232, 240, 0.1)' : 
        '0 0 40px rgba(255, 200, 100, 0.15), 0 0 60px rgba(255, 152, 0, 0.2)'};
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
`;


const SkillTop = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 0.8rem;
`;

const SkillIcon = styled.div`
    width: 24px;
    height: 24px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const SkillName = styled.span`
    font-size: 0.95rem;
    font-weight: 500;
    color: ${props => props.theme.text};
    font-family: var(--body-font);
`;

const SkillBar = styled(motion.div)`
    width: 100%;
    height: 4px;
    background-color: ${props => props.theme.isDarkMode ? 
        'rgba(15, 23, 42, 0.5)' : 
        'rgba(255, 236, 179, 0.2)'};
    border-radius: 2px;
    overflow: hidden;
    box-shadow: ${props => props.theme.isDarkMode
  ? '0 8px 20px rgba(255, 255, 255, 0.05)'
  : '0 8px 20px rgba(255, 152, 0, 0.1)'};

`;

const SkillProgress = styled(motion.div)<{ $level: number }>`
    height: 100%;
    width: ${props => props.$level * 10}%;
    background: ${props => props.theme.isDarkMode ? 
        'linear-gradient(90deg, rgba(248, 250, 252, 0.8), rgba(226, 232, 240, 0.4))' : 
        'linear-gradient(90deg, rgba(255, 152, 0, 0.7), rgba(255, 152, 0, 0.3))'};
    border-radius: 2px;
`;

// Updated button to match Home page CTA button
const DownloadResumeButton = styled(motion.a)`
    display: inline-flex;
    align-items: center;
    padding: 0.9rem 2rem;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    color: ${props => props.theme.text};
    background-color: ${props => props.theme.isDarkMode ? 
        'rgba(226, 232, 240, 0.08)' : 
        'rgba(255, 152, 0, 0.05)'};
    border: 1px solid ${props => props.theme.isDarkMode ? 
        `${props.theme.accent}40` : 
        `${props.theme.accent}50`};
    border-radius: 50px;
    margin-top: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);
    
    svg {
        margin-right: 0.8rem;
    }
    
    &:hover {
        transform: translateY(-5px);
        border-color: ${props => props.theme.accent};
        background-color: ${props => props.theme.isDarkMode ? 
            'rgba(226, 232, 240, 0.15)' : 
            `${props.theme.accent}15`};
        box-shadow: ${props => props.theme.isDarkMode ? 
            '0 10px 20px rgba(0, 0, 0, 0.25), 0 0 20px rgba(226, 232, 240, 0.4)' : 
            '0 10px 20px rgba(0, 0, 0, 0.1), 0 0 20px rgba(255, 152, 0, 0.4)'};
    }
`;

const TechBracket = styled.div`
    position: absolute;
    font-family: monospace;
    opacity: 0.3;
    font-size: 1.2rem;
    color: ${props => props.theme.isDarkMode ? 
        'rgba(226, 232, 240, 0.8)' : 
        'rgba(255, 152, 0, 0.8)'};
    
    &.left {
        left: -1.5rem;
        top: 8rem;
    }
    
    &.right {
        right: -1.5rem;
        bottom: 8rem;
    }
`;

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

const slideInVariants: Variants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { 
            duration: 0.8, 
            ease: [0.25, 0.1, 0.25, 1] 
        }
    },
};

const slideInFromRightVariants: Variants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { 
            duration: 0.8, 
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.2 
        }
    },
};

interface FloatPosition {
    x: number;
    y: number;
}

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

const progressVariants: Variants = {
    hidden: { width: 0 },
    visible: (level: number) => ({
        width: `${level * 10}%`,
        transition: { duration: 1.2, ease: "easeOut", delay: 0.3 }
    })
};

const glowVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: [0.2, 0.5, 0.2], 
        transition: { 
            duration: 5,
            repeat: Infinity,
            repeatType: "mirror" as const
        } 
    }
};

const downloadIconSvg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);


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


const particles = Array.from({ length: 20 }, () => ({
    x: Math.random() * 500 - 250,
    y: Math.random() * 500 - 250,
    size: Math.random() * 6 + 3
}));

const About: React.FC = () => {
    const aboutSectionRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: aboutSectionRef,
        offset: ["start start", "end end"]
    });

    const [ref, inView] = useInView({
        triggerOnce: false,
        threshold: 0.1,
    });

    const controls = useAnimation();

    const imageX = useTransform(scrollYProgress, [0, 1], [-100, 0]);
    const imageY = useTransform(scrollYProgress, [0, 1], [0, 300]);
    const contentX = useTransform(scrollYProgress, [0, 1], [100, 0]);
    const opacity: MotionValue<number> = useTransform(
        scrollYProgress,
        [0, 0.2, 0.8, 1],
        [0, 1, 1, 1]
    );


    
    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!imageRef.current) return;
            
            const { clientX, clientY } = e;
            const { left, top, width, height } = imageRef.current.getBoundingClientRect();
            
            const x = (clientX - left) / width - 0.5;
            const y = (clientY - top) / height - 0.5;
            
            imageRef.current.style.transform = `
                perspective(1000px)
                rotateY(${x * 8}deg)
                rotateX(${y * -8}deg)
                translateZ(10px)
            `;
        };
        
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
    
    // Get theme for conditional styling
    const theme = useTheme() as Theme;
    const isDarkMode = theme.isDarkMode;
    
    return (
        <AboutContainer
            id="about"
            ref={aboutSectionRef}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
        >

            <CelestialWrapper>
                <AnimatedCelestialBody isDarkMode={theme.isDarkMode} />
            </CelestialWrapper>
            
            {/* Glow orbs with appropriate theme colors */}
            <GlowOrb className="orb1" $isDarkMode={isDarkMode} />
            <GlowOrb className="orb2" $isDarkMode={isDarkMode} />
            
            <AboutContent ref={containerRef}>
                <AboutImageContainer
                    variants={slideInVariants}
                    style={{ 
                        x: imageX,
                        y: imageY,
                        opacity: opacity
                    } as MotionStyle}
                >
                    <AboutImage 
                        ref={imageRef}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        <img 
                            src="/src/assets/images/portrait.webp" 
                            alt="Andrea Toreki" 
                        />
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
                    
                    <TechBracket className="left">{`<`}</TechBracket>
                    <TechBracket className="right">{`/>`}</TechBracket>
                    <ImageBorderEffect className="border1" />
                    <ImageBorderEffect className="border2" />
                </AboutImageContainer>
                
                <AboutInfo ref={ref} style={{ x: contentX, opacity } as MotionStyle}>
                    <TitleAccent variants={slideInFromRightVariants} />
                    <Title variants={slideInFromRightVariants}>
                        About Me
                    </Title>
                    <Subtitle 
                        initial={{ opacity: 0, y: 15 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        UX/UI Visionary & Full-Stack Craftsman
                    </Subtitle>
                    
                    <AboutText 
                        variants={slideInFromRightVariants}
                        initial={{ opacity: 0, y: 15 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
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
                        transition={{ duration: 0.7, delay: 0.5 }}
                    >
                        My engineering carries the soul of a designer: I code with empathy, accessibility, and visual harmony as my north stars. Whether it’s a sleek storefront, a glowing dashboard, or an immersive portfolio, I build systems that resonate on every level.
                    </AboutText>

                    <AboutText 
                        variants={slideInFromRightVariants}
                        initial={{ opacity: 0, y: 15 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                    >
                        Fluent across tech stacks and visual languages, I unite performance with beauty. My process is rooted in strategic thinking, creative intuition, and deep empathy — shaped by years of hands-on experience in brand design, UX, and development.
                    </AboutText>

                    <AboutText 
                        variants={slideInFromRightVariants}
                        initial={{ opacity: 0, y: 15 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.7, delay: 0.7 }}
                    >
                        When I’m not crafting code, I’m deconstructing design systems, exploring new tech horizons, or drawing inspiration from the wild patterns of nature. Let’s build something extraordinary — something that speaks both to logic and soul.
                    </AboutText>
                    
                    <DownloadResumeButton 
                        href="/andrea-toreki-resume.pdf" 
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={slideInFromRightVariants}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {downloadIconSvg} Download Resume
                    </DownloadResumeButton>
                </AboutInfo>
                
            </AboutContent>
                    <SkillsContainer
                            as={motion.div}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            style={{
                                width: '100%',
                                marginTop: '-200px',
                            }}
                            >
                            <SkillsTitle>Skills</SkillsTitle>
                            <SkillsGrid>
                                {[...skills, ...creativeSkills].map((skill, index) => (
                                <SkillItem 
                                    key={`skill-${index}`}
                                    custom={index}
                                    variants={floatingSkillVariants}
                                    initial="hidden"
                                    animate={inView ? "visible" : "hidden"}
                                    whileHover={{
                                    y: -8,
                                    transition: { duration: 0.3 }
                                    }}
                                >
                                    <SkillTop>
                                    <SkillIcon>{skill.icon}</SkillIcon>
                                    <SkillName>{skill.name}</SkillName>
                                    </SkillTop>
                                    <SkillBar>
                                    <SkillProgress 
                                        $level={skill.level}
                                        initial="hidden"
                                        animate={inView ? "visible" : "hidden"}
                                        variants={progressVariants}
                                        custom={skill.level}
                                    />
                                    </SkillBar>
                                </SkillItem>
                                ))}
                            </SkillsGrid>
                </SkillsContainer>
        </AboutContainer>
        
    );
};

export default About;