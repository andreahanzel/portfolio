// src/components/sections/Home.tsx 
// This component is responsible for rendering the home section of the portfolio
// It uses styled-components for styling and framer-motion for animations

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import FuturisticGradientText from '../ui/FuturisticGradientText';
import { SECTION_IDS } from '../../constants/sectionIds';


// Define the props for the Home component
interface HomeProps {
  isDarkMode: boolean;
}
// Main container for the Home section
// This container holds all the elements of the Home section
// It is styled to be centered and responsive
const HomeContainer = styled.div`
  position: relative;
  min-height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 5;
  padding-top: 6vh;
  overflow: hidden;

  @media (max-width: 480px) {
    padding-top: 15vh; /* More padding on mobile */
  }
`;

// Content container for the main text and buttons
// This container holds the main content of the Home section
const ContentContainer = styled(motion.div)`
  max-width: 1200px;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: clamp(1rem, 2vw, 2rem);
  z-index: 10;

  /* Perfect center */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  /* Spacing between elements */
  gap: clamp(1.2rem, 2.5vh, 2rem);

  @media (max-width: 768px) {
    width: 95%;
  }

  @media (max-width: 480px) {
    gap: clamp(1rem, 2vh, 1.5rem);
  }
`;

// Subtitle for the main text
// This text provides a brief description of the user's skills
const Subtitle = styled(motion.h2)`
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  font-weight: 00;
  max-width: min(700px, 90%);
  margin: 0 auto clamp(1.5rem, 3vw, 2rem);
  color: ${props => props.theme.isDarkMode ? `${props.theme.text}cc` : '#1A1A1A'};
  line-height: 1.6;
  letter-spacing: 0.25px;
  opacity: 0.85;

  @media (max-width: 768px) {
    margin: 0 auto 1.5rem;
    line-height: 1.4;
    max-width: 95%;
    padding: 0 0.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin: 0 auto 1rem;
    line-height: 1.3;
  }
`;

// Call to Action button
// This button encourages users to explore the portfolio
const CTAButton = styled(motion.button)`
  width: clamp(60px, 12vw, 80px);
  height: clamp(60px, 12vw, 80px);
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  font-size: clamp(0.8rem, 1vw, 1rem);
  font-weight: 400;
  letter-spacing: 0.5px;
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.isDarkMode
    ? 'rgba(226, 232, 240, 0.08)'
    : 'rgba(255, 152, 0, 0.05)'};
  border: 1px solid ${props => props.theme.isDarkMode
    ? `${props.theme.accent}40`
    : `${props.theme.accent}50`};
  box-shadow: ${props => props.theme.isDarkMode
                ? '0 8px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(147, 197, 253, 0.3)'
                : '0 8px 25px rgba(251, 146, 60, 0.3), 0 0 20px rgba(253, 186, 116, 0.2)'};
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: normal;
  margin-bottom: 8rem;

  

  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.theme.accent};
    background-color: ${props => props.theme.isDarkMode
      ? `rgba(226, 232, 240, 0.15)`
      : `${props.theme.accent}15`};
    box-shadow: ${props => props.theme.isDarkMode
      ? '0 10px 20px rgba(0, 0, 0, 0.25), 0 0 15px rgba(226, 232, 240, 0.3)'
      : '0 10px 20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(255, 152, 0, 0.2)'};
  }

  @media (max-width: 480px) {
    margin-top: 1rem; 
  }

  @media (max-width: 768px) {
    width: clamp(50px, 10vw, 70px);
    height: clamp(50px, 10vw, 70px);
    font-size: clamp(0.7rem, 1.5vw, 0.9rem);
  }
`;


// Scroll Down Indicator
// This indicator encourages users to scroll down to the next section
// It consists of a chevron icon and a text label
const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: clamp(5px, 2vh, 15px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 20;

  @media (max-width: 768px) {
    bottom: 2vh; // ⬅ Lower for mobile
  }

  @media (max-width: 480px) {
    bottom: 1vh; // ⬅ Even lower on very small screens
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
    color: ${props => props.theme.isDarkMode ? 
            'rgb(255, 255, 255)' : 
            'rgb(0, 0, 0)'};
  }
`;

// Scroll text label
// This text label indicates to users that they can scroll down
const ScrollText = styled(motion.span)`
  font-size: clamp(0.7rem, 1.5vw, 0.8rem);
  color: ${props => props.theme.isDarkMode ? 
            'rgb(255, 255, 255)' : 
            'rgb(0, 0, 0)'};
  margin-top: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.45em;
  font-weight: 500;
  
  @media (max-width: 768px) {
    letter-spacing: 1px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.6rem;
    margin-top: 3rem;
    margin-bottom: 1rem;
  
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

// Styled component for the name wrapper
  const NameWrapper = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  margin-top: 10rem;
`;
  

  return (
    <HomeContainer>
      {/* Background effect */}
    
      <ContentContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <NameWrapper>
        <FuturisticGradientText
          text={`ANDREA\n TOREKI`} // Text to be displayed
          delay={0.2}
          fontSize="clamp(2.5rem, 8vw, 7.5rem)"
          fontWeight="400"
          letterSpacing="0.25em"
          textAlign="center"
          gradient="custom"
          customGradient={
            isDarkMode
              ? "linear-gradient(90deg, #F1F5F9, #F8FAFC, #FFFFFF)"
              : "linear-gradient(90deg, #FF9800, #FFC107, #FF7A00)"
          }
        />

      </NameWrapper>

        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          I craft seamless user journeys with full-stack precision and design that feels alive.
        </Subtitle>

      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <CTAButton onClick={scrollToNextSection}>
            explore
          </CTAButton>
        </motion.div>

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
        <ScrollText>fetchnext()</ScrollText>
      </ScrollIndicator>
    </HomeContainer>
  );
};

export default Home;