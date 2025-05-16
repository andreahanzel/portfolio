// src/components/layout/Footer.tsx - Updated to support scroll-to functionality

import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { SECTION_IDS } from '../../constants/sectionIds';

// Glow animations for use throughout the footer 
const celestialGlow = {
  dark: {
    regular: keyframes`
      0% {
        box-shadow: 0 0 30px 2px rgba(255, 255, 255, 0.3),
                    0 0 70px 10px rgba(255, 255, 255, 0.15);
      }
      50% {
        box-shadow: 0 0 40px 5px rgba(255, 255, 255, 0.5),
                    0 0 100px 15px rgba(255, 255, 255, 0.25);
      }
      100% {
        box-shadow: 0 0 30px 2px rgba(255, 255, 255, 0.3),
                    0 0 70px 10px rgba(255, 255, 255, 0.15);
      }
    `,
    icon: keyframes`
      0% {
        box-shadow: 0 0 5px rgba(255, 255, 255, 0.3),
                    0 0 10px rgba(255, 255, 255, 0.15);
      }
      50% {
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.5),
                    0 0 30px rgba(255, 255, 255, 0.25);
      }
      100% {
        box-shadow: 0 0 5px rgba(255, 255, 255, 0.3),
                    0 0 10px rgba(255, 255, 255, 0.15);
      }
    `
  },
  light: {
    regular: keyframes`
      0% {
        box-shadow: 0 0 40px 15px rgba(250, 226, 156, 0.4),
                    0 0 80px 30px rgba(255, 236, 179, 0.2);
      }
      50% {
        box-shadow: 0 0 50px 20px rgba(243, 222, 161, 0.5),
                    0 0 90px 40px rgba(255, 236, 179, 0.3);
      }
      100% {
        box-shadow: 0 0 40px 15px rgba(255, 236, 179, 0.4),
                    0 0 80px 30px rgba(255, 236, 179, 0.2);
      }
    `,
    icon: keyframes`
      0% {
        box-shadow: 0 0 10px rgba(250, 226, 156, 0.4),
                    0 0 20px rgba(255, 236, 179, 0.2);
      }
      50% {
        box-shadow: 0 0 20px rgba(243, 222, 161, 0.5),
                    0 0 40px rgba(255, 236, 179, 0.3);
      }
      100% {
        box-shadow: 0 0 10px rgba(255, 236, 179, 0.4),
                    0 0 20px rgba(255, 236, 179, 0.2);
      }
    `
  }
};

// Footer container with glass effect
const FooterContainer = styled.footer<{ $isDarkMode: boolean, $scrolled: boolean }>`
  position: relative;
  padding: 0.5rem 0.5rem 0.25rem;
  background: ${props => props.$isDarkMode 
    ? props.$scrolled ? 'rgba(5, 5, 9, 0.7)' : 'transparent'
    : props.$scrolled ? 'rgba(255, 253, 249, 0.7)' : 'transparent'};
  backdrop-filter: ${props => props.$scrolled ? 'blur(14px)' : 'blur(0)'};
  -webkit-backdrop-filter: ${props => props.$scrolled ? 'blur(14px)' : 'blur(0)'};
  color: ${props => props.$isDarkMode ? '#e0e0e0' : '#111f28'};
  overflow: hidden;
  border-top: 1px solid ${props => props.$scrolled 
    ? (props.$isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)') 
    : 'transparent'};
  transition: all 0.4s ease;

  &::before {
    content: '';
    position: absolute;
    top: -50px;
    left: 0;
    width: 100%;
    height: 500px;
    background: radial-gradient(circle at top center, rgba(255, 236, 179, 0.12), transparent 80%);
    filter: blur(25px);
    pointer-events: none;
    z-index: 0;
  }
`;

// Modern grid layout
const FooterContent = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
`;

// Email section with centered content
const EmailSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-bottom: 1rem;
  position: relative;

  &::after {
      content: '';
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      height: 80px;
      background: radial-gradient(circle, rgba(255, 236, 179, 0.12), transparent 70%);
      filter: blur(20px);
      pointer-events: none;
      z-index: 0;
    }
`;

// Futuristic section headers
const SectionTitle = styled.h2<{ $isDarkMode: boolean }>`
  font-size: 0.8rem;
  margin-bottom: 1.5rem;
  color: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.6)'};
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 400;
  position: relative;
  display: flex;
  align-items: center;
  
  &::before {
    content: '—';
    position: relative;
    margin-right: 6px;
    color: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(243, 222, 161, 0.8)'};
  }
`;

// Email with celestial-inspired styling
const EmailDisplay = styled.a<{ $isDarkMode: boolean }>`
  display: inline-block;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 300;
  letter-spacing: -0.5px;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#111f28'};
  transition: all 0.4s ease;
  position: relative;
  margin-bottom: 1rem;

  &:hover {
    transform: translateY(-2px);
    color: ${props => props.$isDarkMode ? '#FFD966' : '#FFB300'};
    text-shadow: 0 0 12px rgba(255, 217, 102, 0.4);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 1px;
    background: ${props => props.$isDarkMode 
      ? 'linear-gradient(to right, transparent, #FFD966, transparent)' 
      : 'linear-gradient(to right, transparent, #FFB300, transparent)'};
    transition: width 0.4s ease;
    pointer-events: none;
  }

  &:hover::after {
    width: 100%;
  }
`;

// Connect button with celestial glow effect
const ConnectButton = styled.button<{ $isDarkMode: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.6rem;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${props => props.$isDarkMode ? '#000' : '#111'};
  background: ${props => props.$isDarkMode
    ? 'radial-gradient(circle at center, #FFE8B0 0%, #FFDB75 100%)'
    : 'radial-gradient(circle at center, #FFF8E1 0%, #FFECB3 100%)'};
  border: none;
  border-radius: 16px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  box-shadow: ${props => props.$isDarkMode
    ? '0 0 30px rgba(255, 217, 102, 0.4), 0 0 60px rgba(255, 236, 179, 0.3)'
    : '0 0 25px rgba(255, 236, 179, 0.5), 0 0 45px rgba(255, 236, 179, 0.3)'};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.$isDarkMode
      ? '0 0 40px rgba(255, 217, 102, 0.6), 0 0 80px rgba(255, 236, 179, 0.5)'
      : '0 0 35px rgba(255, 236, 179, 0.6), 0 0 60px rgba(255, 236, 179, 0.4)'};
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 0 20px rgba(255, 217, 102, 0.4);
  }

  &::before {
    content: '';
    position: absolute;
    top: -20%;
    left: -20%;
    width: 140%;
    height: 140%;
    background: radial-gradient(circle, rgba(255, 217, 102, 0.15), transparent 70%);
    filter: blur(12px);
    z-index: -1;
    border-radius: 9999px;
    opacity: 0.9;
    pointer-events: none;
  }
`;

// Center section with social icons
const CenterSection = styled.div<{ $isDarkMode: boolean }>`
  position: relative;
  padding: 3rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Social links container
const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;

// SocialLink with celestial theme styling
const SocialLink = styled(motion.a)<{ $isDarkMode: boolean }>`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  transition: all 0.3s ease;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#111f28'};
  background-color: ${props => props.$isDarkMode ? 
    'rgba(20, 20, 20, 0.6)' : 
    'rgba(240, 240, 240, 0.6)'};
  animation: ${props => props.$isDarkMode ? 
    celestialGlow.dark.icon : 
    celestialGlow.light.icon} 5s infinite;
  position: relative;
  backdrop-filter: blur(5px);

    &::after {
    content: '';
    position: absolute;
    top: -25%;
    left: -25%;
    width: 150%;
    height: 150%;
    background: radial-gradient(circle, rgba(252, 227, 155, 0.2), transparent 30%);
    filter: blur(12px);
    z-index: 0;
    border-radius: 50%;
    opacity: 0.9;
    pointer-events: none;
  }

  
  /* Inner glow effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    border: 1px solid ${props => props.$isDarkMode ? 
      'rgba(255, 255, 255, 0.1)' : 
      'rgba(250, 226, 156, 0.1)'};
    background: ${props => props.$isDarkMode ? 
      'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)' : 
      'radial-gradient(circle at center, rgba(250,226,156,0.15) 0%, transparent 70%)'};
    z-index: 0;
  }
  
  svg {
    width: 20px;
    height: 20px;
    position: relative;
    z-index: 1;
  }
  
  &:hover {
    transform: scale(1.1);
    animation: none;
  }
  
  /* Fix for hover effect in both modes */
  &:hover {
    box-shadow: ${props => props.$isDarkMode ? 
      '0 0 15px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.25)' : 
      '0 0 15px rgba(243, 222, 161, 0.5), 0 0 30px rgba(255, 236, 179, 0.3)'};
  }
`;

// Bottom section
const BottomSection = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

// Copyright text
const Copyright = styled.div<{ $isDarkMode: boolean }>`
  font-size: 0.8rem;
  color: ${props => props.$isDarkMode ? 
    'rgba(255, 255, 255, 0.4)' : 
    'rgba(0, 0, 0, 0.4)'};
`;

// Policy links
const PolicyLinks = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  gap: 1.5rem;
  
  a {
    font-size: 0.8rem;
    color: ${props => props.$isDarkMode ? 
      'rgba(255, 255, 255, 0.4)' : 
      'rgba(0, 0, 0, 0.4)'};
    transition: all 0.3s ease;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: -10px;
      top: 50%;
      width: 0;
      height: 1px;
      background-color: ${props => props.$isDarkMode ? 
        'rgba(255, 255, 255, 0.8)' : 
        'rgba(250, 226, 156, 0.8)'};
      transition: width 0.3s ease;
      transform: translateY(-50%);
    }
    
    &:hover {
      color: ${props => props.$isDarkMode ? 
        'rgba(255, 255, 255, 0.8)' : 
        'rgba(250, 226, 156, 0.8)'};
      
      &::before {
        width: 6px;
      }
    }
  }
`;

// SVG icons
const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733-16z"></path>
    <path d="M4 20l6.768-6.768"></path>
    <path d="M20 4l-7.768 7.768"></path>
  </svg>
);

const BehanceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9h5.5"></path>
    <path d="M2 14.5h5.5"></path>
    <path d="M15.5 9H20"></path>
    <path d="M15.5 14.5H20"></path>
    <path d="M9.5 16C8 16 6.5 15.2 6.5 12.5 6.5 9.8 8 9 9.5 9c1.5 0 2.5 0.8 2.5 2.5"></path>
    <path d="M16.5 11C16.5 9.8 17.5 9 18.5 9 19.5 9 20.5 9.8 20.5 11 20.5 12.2 19.5 13 18.5 13 17.5 13 16.5 12.2 16.5 11Z"></path>
    <path d="M20.5 13C20.5 14.2 19.5 15 18.5 15 17.5 15 16.5 14.2 16.5 13"></path>
  </svg>
);

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

// Main Footer component with enhanced features
const Footer: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const currentYear = new Date().getFullYear();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Improved way to detect when user is approaching the footer
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const bodyHeight = document.body.offsetHeight;
    
      // Calculate distance from bottom of viewport to bottom of page
      const distanceToBottom = bodyHeight - (scrollPosition + windowHeight);
      
      // Set scrolled to true when approaching the footer (within 200px)
      // This gives a smoother transition
      if (distanceToBottom < 200) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    // Initial check on mount
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Scroll to a section when clicked
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <FooterContainer $isDarkMode={isDarkMode} $scrolled={scrolled}>
      <FooterContent>
        {/* Email section - now centered */}
        <EmailSection>
          <SectionTitle $isDarkMode={isDarkMode}>CONTACT</SectionTitle>
          <EmailDisplay 
            href="mailto:hello@andreatoreki.com" 
            $isDarkMode={isDarkMode}
          >
            hello@andreatoreki.com
          </EmailDisplay>
          
          <ConnectButton 
            $isDarkMode={isDarkMode}
            onClick={() => scrollToSection(SECTION_IDS.CONTACT)}
          >
            Let's talk!
          </ConnectButton>
        </EmailSection>
        
        {/* Center section with social icons */}
        <CenterSection $isDarkMode={isDarkMode}>
          <SocialLinks>
            <SocialLink 
              href="https://linkedin.com/" 
              target="_blank"
              rel="noopener noreferrer"
              $isDarkMode={isDarkMode}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <LinkedInIcon />
            </SocialLink>
            <SocialLink 
              href="https://instagram.com/" 
              target="_blank"
              rel="noopener noreferrer"
              $isDarkMode={isDarkMode}
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <InstagramIcon />
            </SocialLink>
            <SocialLink 
              href="https://twitter.com/" 
              target="_blank"
              rel="noopener noreferrer"
              $isDarkMode={isDarkMode}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <XIcon />
            </SocialLink>
            <SocialLink 
              href="https://github.com/" 
              target="_blank"
              rel="noopener noreferrer"
              $isDarkMode={isDarkMode}
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <GitHubIcon />
            </SocialLink>
            <SocialLink 
              href="https://behance.net/" 
              target="_blank"
              rel="noopener noreferrer"
              $isDarkMode={isDarkMode}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <BehanceIcon />
            </SocialLink>
          </SocialLinks>
        </CenterSection>
        
        {/* Bottom section with copyright and policy links */}
        <BottomSection>
          <Copyright $isDarkMode={isDarkMode}>
            © {currentYear} Andrea Toreki. All rights reserved.
          </Copyright>
          
          <PolicyLinks $isDarkMode={isDarkMode}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </PolicyLinks>
        </BottomSection>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;