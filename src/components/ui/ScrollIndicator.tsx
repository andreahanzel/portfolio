import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';

// Scroll progress indicator at the top of the page
const ProgressBar = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.theme.accent};
    transform-origin: 0%;
    z-index: 1000;
`;

// Styled scroll indicator - HIDDEN as requested
const ScrollIndicatorContainer = styled(motion.div)`
    display: none; /* Changed from fixed positioning to hide completely */
`;

const pulseAnimation = keyframes`
    0% {
        transform: scale(1);
        opacity: 0.8;
    }
    50% {
        transform: scale(1.1);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 0.8;
    }
`;

const ScrollCircle = styled(motion.div)`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    animation: ${pulseAnimation} 2s infinite ease-in-out;
    
    svg {
        width: 18px;
        height: 18px;
        color: ${props => props.theme.accent};
    }
    
    @media (max-width: 768px) {
        width: 35px;
        height: 35px;
        
        svg {
        width: 16px;
        height: 16px;
        }
    }
`;

// Dot indicators for sections - KEPT as requested
const SectionIndicatorsContainer = styled.div`
    position: fixed;
    right: 40px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 999;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    
    @media (max-width: 768px) {
        right: 20px;
    }
`;

const SectionDot = styled.div<{ $active: boolean }>`
    width: ${props => props.$active ? '10px' : '8px'};
    height: ${props => props.$active ? '10px' : '8px'};
    border-radius: 50%;
    background-color: ${props => props.$active ? props.theme.accent : `${props.theme.text}40`};
    transition: all 0.3s ease;
    cursor: pointer;
    pointer-events: all;
    
    &:hover {
        transform: scale(1.2);
        background-color: ${props => props.theme.accent};
    }
`;

interface ScrollIndicatorProps {
    sections: string[];
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ sections }) => {
    const { scrollYProgress } = useScroll();
    const [activeSection, setActiveSection] = useState(0);
    
    // Toggle visibility of the scroll indicator based on scroll position
    const opacity = useTransform(
        scrollYProgress,
        [0, 0.1, 0.9, 1],
        [1, 0, 0, 1]
    );
    
    // Update active section based on scroll position
    useEffect(() => {
        const handleScroll = () => {
        const scrollPos = window.scrollY;
        const docHeight = document.body.scrollHeight;
        
        // Calculate which section we're in based on scroll position
        const sectionHeight = docHeight / sections.length;
        const currentSection = Math.min(
            Math.floor(scrollPos / sectionHeight),
            sections.length - 1
        );
        
        setActiveSection(currentSection);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);
    
    // Handle click on section dot
    const scrollToSection = (index: number) => {
        const element = document.getElementById(sections[index]);
        if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    return (
        <>
        <ProgressBar style={{ scaleX: scrollYProgress }} />
        
        {/* HIDDEN as requested */}
        <ScrollIndicatorContainer style={{ opacity }}>
            <ScrollCircle>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
            </ScrollCircle>
        </ScrollIndicatorContainer>
        
        <SectionIndicatorsContainer>
            {sections.map((section, index) => (
            <SectionDot 
                key={section}
                $active={index === activeSection}
                onClick={() => scrollToSection(index)}
            />
            ))}
        </SectionIndicatorsContainer>
        </>
    );
};

export default ScrollIndicator;