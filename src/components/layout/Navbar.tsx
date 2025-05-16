// src\components\layout\Navbar.tsx

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
    padding: 1.2rem 3rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    backdrop-filter: blur(10px);
    background: ${props => props.$scrolled ? 
        `${props.theme.background}E6` : 
        'transparent'};
    transition: all 0.3s ease;
    border-bottom: ${props => props.$scrolled ? 
        `1px solid ${props.theme.accent}20` : 
        'none'};

    @media (max-width: 768px) {
        padding: 1rem 1.5rem;
    }
    `;

    const Logo = styled(motion.div)`
    font-size: 1.6rem;
    font-weight: 700;
    color: ${props => props.theme.text};
    position: relative;
    z-index: 2;
    cursor: pointer;

    span {
        color: ${props => props.theme.accent};
    }

    &::before {
        content: '';
        position: absolute;
        top: -20px;
        left: -20px;
        width: 60px;
        height: 60px;
        background: radial-gradient(circle, rgba(255, 236, 179, 0.15), transparent 70%);
        filter: blur(10px);
        z-index: -1;
        border-radius: 50%;
        pointer-events: none;
    }
    `;


    const NavLinks = styled.div`
    display: flex;
    gap: 2.5rem;
    
    @media (max-width: 768px) {
        display: none;
    }
    `;

    const NavLink = styled(motion.div)<{ $isActive?: boolean }>`
    position: relative;
    font-weight: 500;
    font-size: 0.95rem;
    letter-spacing: 0.5px;
    color: ${props => props.$isActive ? props.theme.text : `${props.theme.text}99`};
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
    `;

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

    const BurgerLine = styled.div<{ isFirst?: boolean; isMiddle?: boolean; isLast?: boolean; $isOpen: boolean }>`
    width: 2rem;
    height: 0.25rem;
    background-color: ${props => props.theme.text};
    border-radius: 10px;
    transition: all 0.3s linear;
    transform-origin: 1px;
    
    ${props => props.isFirst && props.$isOpen && `
        transform: rotate(45deg);
        background-color: ${props.theme.accent};
    `}
    
    ${props => props.isMiddle && props.$isOpen && `
        opacity: 0;
        transform: translateX(-20px);
    `}
    
    ${props => props.isLast && props.$isOpen && `
        transform: rotate(-45deg);
        background-color: ${props.theme.accent};
    `}
    `;

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
    }
    `;

    const MobileNavLinks = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    `;

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

    interface NavbarProps {
    toggleTheme: () => void;
    isDarkMode: boolean;
    activeSection: string;
    scrollToSection: (sectionId: string) => void;
    }

    const Navbar: React.FC<NavbarProps> = ({ toggleTheme, isDarkMode, activeSection, scrollToSection }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    // Close mobile menu when clicking a link
    const handleLinkClick = (sectionId: string) => {
        scrollToSection(sectionId);
        setIsOpen(false);
    };
    
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
            AT<span>.</span>
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
        >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </ThemeToggle>
        
        <MobileMenuButton 
            onClick={() => setIsOpen(!isOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
        >
            <BurgerLine isFirst $isOpen={isOpen} />
            <BurgerLine isMiddle $isOpen={isOpen} />
            <BurgerLine isLast $isOpen={isOpen} />
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