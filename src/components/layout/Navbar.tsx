// src/components/layout/Navbar.tsx 

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { SECTION_IDS } from '../../constants/sectionIds';

// SVG icons for theme toggle
const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
    );

    // SVG icon for theme toggle
    const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
    );

    // Define styled components
    const Nav = styled(motion.nav)<{$scrolled: boolean}>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: clamp(0.8rem, 2vw, 1.2rem) clamp(1.5rem, 4vw, 3rem);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    backdrop-filter: ${props => props.$scrolled ? 'blur(10px)' : 'blur(5px)'};
    background: ${props => props.$scrolled ? 
        `${props.theme.background}E6` : 
        'transparent'};
    transition: all 0.4s ease;
    border-bottom: ${props => props.$scrolled ? 
        `1px solid ${props.theme.accent}20` : 
        'none'};
    min-height: 60px; /* Ensure consistent height */
    
    /* Center nav on ultra-wide screens */
    @media (min-width: 2400px) {
        max-width: 2400px;
        margin: 0 auto;
        left: 50%;
        transform: translateX(-50%);
    }
    
    @media (max-width: 768px) {
        padding: clamp(0.8rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem);
        min-height: 50px;
    }
    
    @media (max-width: 480px) {
        padding: 0.8rem 1rem;
    }
    `;

// Logo component with animated background
    const Logo = styled(motion.div)`
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    z-index: 2;

    img {
        width: clamp(45px, 10vw, 60px);
        height: clamp(45px, 10vw, 60px);
        transition: all 0.3s ease;
        filter: ${props => props.theme.isDarkMode 
            ? 'drop-shadow(0 0 8px rgba(226, 232, 240, 0.3))' 
            : 'drop-shadow(0 0 8px rgba(255, 152, 0, 0.4))'};
        position: relative;
        z-index: 2;
    }

    /* Celestial glow background */
    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: clamp(60px, 12vw, 80px);
        height: clamp(60px, 12vw, 80px);
        border-radius: 50%;
        background: ${props => props.theme.isDarkMode 
            ? 'radial-gradient(circle, rgba(226, 232, 240, 0.15) 0%, rgba(226, 232, 240, 0.08) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 152, 0, 0.2) 0%, rgba(255, 193, 7, 0.12) 40%, transparent 70%)'};
        filter: blur(8px);
        z-index: -1;
        opacity: 0.8;
        animation: celestialPulse 4s ease-in-out infinite;
    }

    /* Secondary glow layer for more depth */
    &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: clamp(80px, 14vw, 100px);
        height: clamp(80px, 14vw, 100px);
        border-radius: 50%;
        background: ${props => props.theme.isDarkMode 
            ? 'radial-gradient(circle, rgba(226, 232, 240, 0.08) 0%, rgba(155, 165, 179, 0.05) 50%, transparent 80%)'
            : 'radial-gradient(circle, rgba(255, 152, 0, 0.12) 0%, rgba(255, 236, 179, 0.08) 50%, transparent 80%)'};
        filter: blur(15px);
        z-index: -2;
        opacity: 0.6;
        animation: celestialPulse 6s ease-in-out infinite reverse;
    }

    &:hover {
        img {
            transform: scale(1.05);
            filter: ${props => props.theme.isDarkMode 
                ? 'drop-shadow(0 0 12px rgba(226, 232, 240, 0.5))' 
                : 'drop-shadow(0 0 12px rgba(255, 152, 0, 0.6))'};
        }

        &::before {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
        }

        &::after {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.05);
        }
    }

    @keyframes celestialPulse {
        0%, 100% { 
            opacity: ${props => props.theme.isDarkMode ? '0.6' : '0.8'};
            transform: translate(-50%, -50%) scale(1);
        }
        50% { 
            opacity: ${props => props.theme.isDarkMode ? '0.9' : '1'};
            transform: translate(-50%, -50%) scale(1.02);
        }
    }

    @media (max-width: 768px) {
        img {
            width: 40px;
            height: 40px;
        }

        &::before {
            width: 50px;
            height: 50px;
            filter: blur(6px);
        }

        &::after {
            width: 65px;
            height: 65px;
            filter: blur(12px);
        }
    }
`;

    // Navigation links container
    const NavLinks = styled.div`
    display: flex;
    gap: clamp(1.5rem, 3vw, 2.5rem);
    
    @media (max-width: 768px) {
        display: none;
    }
`;
// Navigation link styles
    const NavLink = styled(motion.div)<{ $isActive?: boolean }>`
    position: relative;
    font-weight: 500;
    font-size: clamp(0.85rem, 1.8vw, 0.95rem);
    letter-spacing: 0.5px;
    color: ${props => props.$isActive ? props.theme.text : (props.theme.isDarkMode ? `${props.theme.text}99` : '#2E2E2E')}; 
    cursor: pointer;
    
    &:after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: ${props => props.$isActive ? '100%' : '0'};
        height: 2px;
        background-color: ${props => props.theme.accent};
        transition: width 0.3s ease;
    }
    
    &:hover {
        color: ${props => props.theme.text};
    }
    
    &:hover:after {
        width: 100%;
    }
    
    @media (max-width: 992px) {
        font-size: 0.9rem;
    }

    @media (max-width: 768px) {
    font-size: 1.4rem;  
    padding: 0.6rem 0;  
`;

// Mobile menu button styles
    const MobileMenuButton = styled(motion.button)`
    display: none;
    
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width: 2rem;
        height: 2rem;
        background: transparent;
        border: none;
        cursor: pointer;
        z-index: 10;
    }
    `;

    // Burger lines for the mobile menu button
    const BurgerLine = styled.div<{ $position: 'top' | 'middle' | 'bottom'; $isOpen: boolean }>`
    width: 2rem;
    height: 0.25rem;
    background-color: ${props => props.theme.text};
    border-radius: 10px;
    transition: all 0.3s linear;
    transform-origin: 1px;
    
    ${props => props.$position === 'top' && props.$isOpen && `
        transform: rotate(45deg);
        background-color: ${props.theme.accent};
    `}
    
    ${props => props.$position === 'middle' && props.$isOpen && `
        opacity: 0;
        transform: translateX(-20px);
    `}
    
    ${props => props.$position === 'bottom' && props.$isOpen && `
        transform: rotate(-45deg);
        background-color: ${props.theme.accent};
    `}
    `;

    // Mobile menu styles
    const MobileMenu = styled(motion.div)`
    display: none;
    
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        width: 100%;
        background: ${props => props.theme.background};
        z-index: 9;
        
        /* Improve scollability on mobile */
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
    `;

    // Mobile navigation links container
    const MobileNavLinks = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    
    @media (max-width: 480px) {
        gap: 1.5rem;
        padding: 2rem 0;
    }
    `;

    // Theme toggle button styles
    const ThemeToggle = styled(motion.button)`
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: all 0.3s ease;
    
    &:hover {
        background: ${props => `${props.theme.accent}10`};
    }
    `;

    // Define the Navbar component
    interface NavbarProps {
    toggleTheme: () => void;
    isDarkMode: boolean;
    activeSection: string;
    scrollToSection: (sectionId: string) => void;
    }

    // Navbar component
    const Navbar: React.FC<NavbarProps> = ({ toggleTheme, isDarkMode, activeSection, scrollToSection }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    // Close mobile menu when clicking a link
    const handleLinkClick = (sectionId: string) => {
        scrollToSection(sectionId);
        setIsOpen(false);
    };
    
    // Handle scroll event to change navbar style
    useEffect(() => {
        const handleScroll = () => {
        if (window.scrollY > 50) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => {
        window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    const navItems = [
        { name: 'Home', sectionId: SECTION_IDS.HOME },
        { name: 'Projects', sectionId: SECTION_IDS.PROJECTS },
        { name: 'About', sectionId: SECTION_IDS.ABOUT },
        { name: 'Contact', sectionId: SECTION_IDS.CONTACT },
    ];
    
    return (
        <Nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        $scrolled={scrolled}
        >
        <Logo
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => scrollToSection(SECTION_IDS.HOME)}
        >
            <img src="/ATlogo.svg" alt="AT Logo" />
        </Logo>
        
        <NavLinks>
            {navItems.map((item, index) => (
            <NavLink 
                key={index}
                $isActive={activeSection === item.sectionId}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                onClick={() => handleLinkClick(item.sectionId)}
            >
                {item.name}
            </NavLink>
            ))}
        </NavLinks>
        
        <ThemeToggle 
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </ThemeToggle>
        
        <MobileMenuButton 
            onClick={() => setIsOpen(!isOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            aria-label="Toggle mobile menu"
        >
            {/* Replaced the problematic props with proper ones */}
            <BurgerLine $position="top" $isOpen={isOpen} />
            <BurgerLine $position="middle" $isOpen={isOpen} />
            <BurgerLine $position="bottom" $isOpen={isOpen} />
        </MobileMenuButton>
        
        <AnimatePresence>
            {isOpen && (
            <MobileMenu
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
            >
                <MobileNavLinks>
                {navItems.map((item, index) => (
                    <NavLink 
                    key={index}
                    $isActive={activeSection === item.sectionId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    onClick={() => handleLinkClick(item.sectionId)}
                    >
                    {item.name}
                    </NavLink>
                ))}
                
                <ThemeToggle 
                    onClick={toggleTheme} 
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {isDarkMode ? <SunIcon /> : <MoonIcon />}
                </ThemeToggle>
                </MobileNavLinks>
            </MobileMenu>
            )}
        </AnimatePresence>
        </Nav>
    );
    };

export default Navbar;