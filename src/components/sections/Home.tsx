// src/components/sections/Home.tsx 

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import FuturisticGradientText from '../ui/FuturisticGradientText';
{/*import AnimatedCelestialBody from '../effects/AnimatedCelestialBody'; */}
import { SECTION_IDS } from '../../constants/sectionIds';

// Define the props for the Home component
interface HomeProps {
  isDarkMode: boolean;
}

// Keyframes for the glow effects
// These keyframes create a pulsating effect for the glow orbs
const pulseGlow = keyframes`
  0% { opacity: 0.5; box-shadow: 0 0 30px 2px rgba(255, 217, 102, 0.6), 0 0 70px 10px rgba(255, 255, 255, 0.15); }
  50% { opacity: 0.7; box-shadow: 0 0 40px 5px rgba(255, 255, 255, 0.5), 0 0 100px 15px rgba(255, 217, 102, 0.6); }
  100% { opacity: 0.5; box-shadow: 0 0 30px 2px rgba(255, 255, 255, 0.3), 0 0 70px 10px rgba(255, 217, 102, 0.6); }
`;

// Pulsating effect for the sun
// This keyframes creates a glowing effect for the sun
// The sun's glow will pulse in and out, creating a dynamic effect
const pulseSun = keyframes`
  0% { opacity: 0.6; box-shadow: 0 0 300px 150px rgba(255, 217, 102, 0.12), 0 0 500px 200px rgba(255, 236, 179, 0.06); }
  50% { opacity: 0.8; box-shadow: 0 0 350px 175px rgba(255, 217, 102, 0.18), 0 0 600px 250px rgba(255, 236, 179, 0.1); }
  100% { opacity: 0.6; box-shadow: 0 0 300px 150px rgba(255, 217, 102, 0.12), 0 0 500px 200px rgba(255, 236, 179, 0.06); }
`;

// Main container for the Home section
// This container holds all the elements of the Home section
// It is styled to be centered and responsive
const HomeContainer = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 5;
  perspective: 1000px;
  transform-style: preserve-3d;
  padding: 0 clamp(1rem, 4vw, 2rem);
  
  /* Prevent overflow issues */
  overflow: visible;
`;

// Glow orbs for the background
// These orbs create a glowing effect in the background
// They are positioned absolutely and animated to pulse
// The orbs have a blur effect to create a soft glow
  const GlowOrb = styled.div`
    position: absolute;
    border-radius: 50%;
    filter: blur(clamp(40px, 8vw, 80px));
    z-index: 0;
    
    &.orb1 {
      top: 25%;
      left: 15%;
      width: clamp(200px, 40vw, 350px);
      height: clamp(200px, 40vw, 350px);
      background-color: ${props => props.theme.isDarkMode ? 
        'rgba(203, 213, 225, 0.15)' : 
        'rgba(255, 217, 102, 0.15)'};
      animation: ${props => props.theme.isDarkMode ? eclipsePulse : pulseGlow} 10s ease-in-out infinite;
      opacity: 0.6;
      
      @media (max-width: 768px) {
        top: 20%;
        left: 10%;
      }
      
    }
    
    &.orb2 {
      bottom: 15%;
      right: 10%;
      width: clamp(250px, 50vw, 450px);
      height: clamp(250px, 50vw, 450px);
      background-color: ${props => props.theme.isDarkMode ? 
        'rgba(226, 232, 240, 0.1)' : 
        'rgba(250, 248, 242, 0.1)'};
      animation: ${props => props.theme.isDarkMode ? eclipsePulse : pulseSun} 12s ease-in-out infinite alternate;
      opacity: 0.5;
      
      @media (max-width: 768px) {
        bottom: 10%;
        right: 5%;
      }
      
    }
  `;

  // Eclipse pulse animation
  // This keyframes creates a pulsating effect for the eclipse
  // The eclipse will pulse in and out, creating a dynamic effect
const eclipsePulse = keyframes`
  0% { opacity: 0.5; box-shadow: 0 0 30px 2px rgba(226, 232, 240, 0.4), 0 0 70px 10px rgba(226, 232, 240, 0.2); }
  50% { opacity: 0.7; box-shadow: 0 0 40px 5px rgba(226, 232, 240, 0.6), 0 0 100px 15px rgba(226, 232, 240, 0.3); }
  100% { opacity: 0.5; box-shadow: 0 0 30px 2px rgba(226, 232, 240, 0.4), 0 0 70px 10px rgba(226, 232, 240, 0.2); }
`;

// Content container for the main text and buttons
// This container holds the main content of the Home section
const ContentContainer = styled(motion.div)`
  max-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: clamp(1rem, 2vw, 2rem);
  z-index: 10;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Celestial body container
// This container holds the animated celestial body effect
const CelestialBodyContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

// Subtitle for the main text
// This text provides a brief description of the user's skills
const Subtitle = styled(motion.h2)`
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  font-weight: 400;
  max-width: min(700px, 90%);
  margin: 0 auto clamp(1.5rem, 3vw, 2rem);
  color: ${props => props.theme.isDarkMode ? `${props.theme.text}cc` : '#1A1A1A'};
  line-height: 1.6;
  letter-spacing: 0.5px;
  opacity: 0.85;

  @media (max-width: 768px) {
    margin: 0 auto 1.5rem;
    line-height: 1.4;
    max-width: 95%;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin: 0 auto 1rem;
  }
`;

// Call to Action button
// This button encourages users to explore the portfolio
const CTAButton = styled(motion.button)`
  padding: clamp(0.7rem, 1.5vw, 0.9rem) clamp(1.8rem, 3vw, 2.8rem);
  font-size: clamp(0.9rem, 1.2vw, 1.1rem);
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
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.theme.accent};
    background-color: ${props => props.theme.isDarkMode ? 
      `rgba(226, 232, 240, 0.15)` : 
      `${props.theme.accent}15`};
    box-shadow: ${props => props.theme.isDarkMode ? 
      '0 10px 20px rgba(0, 0, 0, 0.25), 0 0 15px rgba(226, 232, 240, 0.3)' : 
      '0 10px 20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(255, 152, 0, 0.2)'};
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 2rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
  }
`;

// Scroll Down Indicator
// This indicator encourages users to scroll down to the next section
// It consists of a chevron icon and a text label
const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: clamp(20px, 5vh, 40px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 20;
  
  @media (max-width: 480px) {
    bottom: 15px;
  }
`;

// Chevron down icon
// This icon indicates to users that they can scroll down
// It is animated to create a dynamic effect
const ChevronDown = styled(motion.div)`
  width: clamp(24px, 5vw, 30px);
  height: clamp(24px, 5vw, 30px);
  
  svg {
    width: 100%;
    height: 100%;
    color: ${props => props.theme.accent};
  }
`;

// Scroll text label
// This text label indicates to users that they can scroll down
const ScrollText = styled(motion.span)`
  font-size: clamp(0.7rem, 1.5vw, 0.8rem);
  color: ${props => props.theme.isDarkMode ? props.theme.accent : '#BF360C'};
  margin-top: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 500;
  
  @media (max-width: 768px) {
    letter-spacing: 1px;
  }
  
  @media (max-width: 480px) {
    display: none; // Hide text on very small screens
  }
`;

// Home component
// This component represents the Home section of the portfolio
// It includes the main text, buttons, and background effects
const Home: React.FC<HomeProps> = ({ isDarkMode }) => {
  // Function to scroll to the next section
  // This function uses the scrollIntoView method to scroll to the projects section
  const scrollToNextSection = () => {
    const projectsSection = document.getElementById(SECTION_IDS.PROJECTS);
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  

  return (
    <HomeContainer>
      {/* Background effect */}
      
      {/* Glow orbs */}
      <GlowOrb className="orb1" />
      <GlowOrb className="orb2" />
    
      <CelestialBodyContainer>
         {/* <AnimatedCelestialBody isDarkMode={isDarkMode} /> */}
      </CelestialBodyContainer>

      <ContentContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <FuturisticGradientText
          text="Andrea Hanzel"
          delay={0.2}
          fontSize="clamp(2.5rem, 8vw, 7.5rem)" // Better mobile scaling
          fontWeight="400" 
          letterSpacing="-0.04em" 
          textAlign="center"
          gradient="custom"
          customGradient={
            isDarkMode
            ? "linear-gradient(90deg, #F1F5F9, #F8FAFC, #FFFFFF)"
            : "linear-gradient(90deg, #FF9800, #FFC107, #FF7A00)"
          }
        />

        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          I craft seamless user journeys with full-stack precision and design that feels alive.
        </Subtitle>

        <CTAButton
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={scrollToNextSection}
        >
          Explore My Work
        </CTAButton>
      </ContentContainer>

      {/* Scroll Down Indicator */}
      <ScrollIndicator
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        onClick={scrollToNextSection}
        aria-label="Scroll to next section"
      >
        <ChevronDown
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            ease: "easeInOut"
          }}
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
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </ChevronDown>
        <ScrollText>Scroll Down</ScrollText>
      </ScrollIndicator>
    </HomeContainer>
  );
};

export default Home;