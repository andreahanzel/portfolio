// src/components/ui/ScrollProgress.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { SECTION_IDS } from '../../constants/sectionIds';

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

    interface ScrollProgressProps {
    sections: string[];
    }

    const sectionLabels: Record<string, string> = {
    [SECTION_IDS.HOME]: 'Home',
    [SECTION_IDS.PROJECTS]: 'Projects',
    [SECTION_IDS.ABOUT]: 'About',
    [SECTION_IDS.CONTACT]: 'Contact',
    };

    const ScrollProgress: React.FC<ScrollProgressProps> = ({ sections }) => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { 
        stiffness: 100, 
        damping: 30, 
        restDelta: 0.001 
    });
    
    const [activeSection, setActiveSection] = useState<string>(sections[0]);
    const [showTopButton, setShowTopButton] = useState(false);
    
    // Update active section based on scroll position
    useEffect(() => {
        const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Show "go to top" button after scrolling down a bit
        if (scrollPosition > windowHeight * 0.5) {
            setShowTopButton(true);
        } else {
            setShowTopButton(false);
        }
        
        // Find active section by checking which one is most in view
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
            const rect = section.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
            const visibleRatio = visibleHeight / rect.height;
            
            if (visibleRatio > 0.3) {
                setActiveSection(sectionId);
            }
            }
        });
        };
        
        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);
    
    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
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
        </>
    );
    };

export default ScrollProgress;