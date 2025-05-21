// src/components/ui/ScrollProgress.tsx 

import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';

// Top progress bar to visualize scroll progress
const ProgressBar = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.theme.accent};
    transform-origin: 0%;
    z-index: 1000;
`;

// Side indicator showing the current section 
const SideIndicator = styled.div`
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 15px;
    z-index: 999;
    
    @media (max-width: 768px) {
        display: none; // Hide on mobile
    }
`;

// Animation for the pulse effect
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

// Styled component for the section dots
const SectionDot = styled(motion.div)<{ $active: boolean }>`
    width: ${props => props.$active ? '12px' : '8px'};
    height: ${props => props.$active ? '12px' : '8px'};
    border-radius: 50%;
    background-color: ${props => props.$active ? props.theme.accent : `${props.theme.text}40`};
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    
    &:hover {
        transform: scale(1.2);
        background-color: ${props => props.theme.accent};
    }
    
    /* Show label on hover or when active */
    &:hover .section-label, &.active .section-label {
        opacity: 1;
        transform: translateX(0);
    }
`;

// Styled component for the section label
const SectionLabel = styled.span`
    position: absolute;
    right: 25px;
    background-color: ${props => props.theme.background}CC;
    color: ${props => props.theme.text};
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.3s ease;
    white-space: nowrap;
    backdrop-filter: blur(4px);
    border: 1px solid ${props => props.theme.accent}40;
`;

// Arrow for "go to top" functionality
const GoToTopArrow = styled(motion.div)`
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 40px;
    height: 40px;
    background-color: ${props => props.theme.background}CC;
    backdrop-filter: blur(5px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid ${props => props.theme.accent}30;
    
    svg {
        width: 20px;
        height: 20px;
        color: ${props => props.theme.accent};
    }
    
    @media (max-width: 768px) {
        bottom: 20px;
        right: 20px;
        width: 35px;
        height: 35px;
    }
`;

// Change this line in ScrollIndicatorContainer
const ScrollIndicatorContainer = styled(motion.div)`
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
    pointer-events: none; // Prevents accidental clicks
`;

// Scroll circle for the scroll indicator
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
// Scroll progress component
interface ScrollProgressProps {
    sections: string[];
    sectionLabels?: Record<string, string>;
}
// This component is responsible for rendering the scroll progress bar and side indicator
const ScrollProgress: React.FC<ScrollProgressProps> = ({ sections, sectionLabels = {} }) => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { 
        stiffness: 100, 
        damping: 30, 
        restDelta: 0.001 
    });
    
    const [activeSection, setActiveSection] = useState<string>(sections[0]);
    const [showTopButton, setShowTopButton] = useState(false);
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    
    // Optimized scroll handling with performance improvements
        useEffect(() => {
        let requestId: number;
        let timeoutId: number;
        const handleScroll = () => {
            // Use requestAnimationFrame for smoother performance
            requestId = requestAnimationFrame(() => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.body.scrollHeight;

            // Debounce state updates to prevent excessive re-renders
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                // Show/hide "go to top" button
                setShowTopButton(scrollPosition > windowHeight * 0.5);

                // Show/hide scroll indicator
                setShowScrollIndicator(
                scrollPosition > windowHeight * 0.2 && 
                scrollPosition < documentHeight - windowHeight * 1.2
                );

                // Find the most visible section
                let mostVisibleSection = activeSection;
                let maxVisibility = 0;

                sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
                    const visibleRatio = visibleHeight / Math.min(rect.height, windowHeight);
                    
                    if (visibleRatio > maxVisibility && visibleRatio > 0.3) {
                    maxVisibility = visibleRatio;
                    mostVisibleSection = sectionId;
                    }
                }
                });

                if (mostVisibleSection !== activeSection) {
                setActiveSection(mostVisibleSection);
                }
            }, 100); // 100ms debounce delay
            });
        };

        // Use passive scroll listener for better performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check with immediate execution
        handleScroll();

        return () => {
            cancelAnimationFrame(requestId);
            clearTimeout(timeoutId);
            window.removeEventListener('scroll', handleScroll);
        };
        }, [sections, activeSection]); // Added activeSection to dependencies

        const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            // Smooth scroll with offset to account for fixed headers
            window.scrollTo({
            top: section.offsetTop - 80, // Adjust 80px for header height
            behavior: 'smooth'
            });
        }
        };

        const scrollToTop = () => {
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        });
        };

        // Calculate opacity for scroll indicator
        const scrollIndicatorOpacity = useTransform(
        scrollYProgress,
        [0, 0.05, 0.95, 1], // Adjusted thresholds for smoother transitions
        [0, 1, 1, 0]
        );
    
    return (
        <>
            {/* Top progress bar */}
            <ProgressBar style={{ scaleX }} />
            
            {/* Side indicator */}
            <SideIndicator>
                {sections.map((sectionId) => (
                    <SectionDot 
                        key={sectionId}
                        $active={activeSection === sectionId}
                        className={activeSection === sectionId ? 'active' : ''}
                        onClick={() => scrollToSection(sectionId)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <SectionLabel className="section-label">
                            {sectionLabels[sectionId] || sectionId}
                        </SectionLabel>
                    </SectionDot>
                ))}
            </SideIndicator>
            
            {/* Go to top button */}
            <AnimatePresence>
                {showTopButton && (
                    <GoToTopArrow
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={scrollToTop}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    </GoToTopArrow>
                )}
            </AnimatePresence>
            
            {/* Scroll indicator */}
            <AnimatePresence>
                {showScrollIndicator && (
                    <ScrollIndicatorContainer 
                        style={{ opacity: scrollIndicatorOpacity }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
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
                )}
            </AnimatePresence>
        </>
    );
};

export default ScrollProgress;