// src/App.tsx 
// This file is the main entry point of the application
// It sets up the main layout, theme, and sections of the portfolio

import { useState, useEffect, useRef } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import CelestialTransition from './components/effects/CelestialTransition';

// Import components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/sections/Home';
import Projects from './components/sections/Projects';
import About from './components/sections/About';
import Contact from './components/sections/Contact';
import StarryNightBackground from './components/effects/StarryNightBackground';
import ScrollProgress from './components/ui/ScrollProgress';
import ConnectingParticles from './components/effects/ConnectingParticles';
import { SECTION_IDS } from './constants/sectionIds';
import { darkTheme, lightTheme } from './theme/theme';
import GlobalStyles from './styles/GlobalStyles';
import { updateFavicon } from './utils/faviconUtils';

// Styled components
// Main app container with a minimum height of 100vh
// and a background color that changes based on the theme
const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  
  /* Allow scrolling but hide scrollbar */
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
    width: 0;
  }
  
  /* Add max-width and centering for ultra-wide screens */
  @media (min-width: 2400px) {
      max-width: 2400px;
      margin: 0 auto;
  }
`;

// Main content container with smooth scrolling
  const MainContent = styled.main`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  
  /* Remove problematic scroll behaviors */
  overflow-x: hidden;
  
  /* Ensure sections flow correctly */
  & > section {
    position: relative;
    margin: 0; 
    padding: 0;
    overflow: visible;
    width: 100%;
  }
  
  /* Add stacking context for proper z-index handling */
  isolation: isolate;
`;

// Background wrapper to hold background elements
const BackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: visible; /* Allow content to overflow */
`;

// Main App component
// This component manages the state of the app, including theme and active section
function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState(SECTION_IDS.HOME);
  
  // References to each section for intersection observer
  const homeRef = useRef<HTMLElement>(null); // Ref for Home section
  const projectsRef = useRef<HTMLElement>(null); // Ref for Projects section
  const aboutRef = useRef<HTMLElement>(null); // Ref for About section
  const contactRef = useRef<HTMLElement>(null); // Ref for Contact section

  // Function to toggle the theme between dark and light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };  

  // Update favicon whenever theme changes
  useEffect(() => {
    updateFavicon(isDarkMode);
  }, [isDarkMode]);

  // Set up intersection observer to detect which section is currently in view
  useEffect(() => {
    const options = {
      root: null, // viewport
      rootMargin: '0px',
  threshold: 0.3, // 30% of the section must be visible
};

window.scrollTo(0, 0);

    // Callback function to handle intersection events
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options); // Create observer instance
    
    // Get all section refs
    const refs = [homeRef, projectsRef, aboutRef, contactRef];
    
    // Observe all section refs
    refs.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      // Cleanup
      refs.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []); // No dependencies needed as refs are stable

  // Scroll to section function that can be passed to Navbar
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Render the app with the selected theme
  //This is the main layout of the app
  return (
  <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
    <GlobalStyles />
    <AppContainer>
        {/* Keep only this one background wrapper */}
        <BackgroundWrapper>
          {isDarkMode && <StarryNightBackground />}
          <ConnectingParticles isDarkMode={isDarkMode} />
          <CelestialTransition isDarkMode={isDarkMode} />
        </BackgroundWrapper>
        
        <Navbar 
          toggleTheme={toggleTheme} 
          isDarkMode={isDarkMode} 
          activeSection={activeSection}
          scrollToSection={scrollToSection}
        />
        <MainContent>
        
        {/* Then render all the page content sections AFTER the background components */}
        <section id={SECTION_IDS.HOME} ref={homeRef}>
          <Home isDarkMode={isDarkMode} />
        </section>
        
        <section id={SECTION_IDS.PROJECTS} ref={projectsRef}>
          <Projects isDarkMode={isDarkMode} />
        </section>
        
        <section id={SECTION_IDS.ABOUT} ref={aboutRef}>
          <About />
        </section>
        
        <section id={SECTION_IDS.CONTACT} ref={contactRef}>
          <Contact isDarkMode={isDarkMode} />
          <Footer isDarkMode={isDarkMode} />
        </section>
      </MainContent>
      
    
      {/* <Footer isDarkMode={isDarkMode} /> */}
      
      {/* Add ScrollProgress component */}
      <ScrollProgress 
        sections={Object.values(SECTION_IDS)}
        sectionLabels={{
          [SECTION_IDS.HOME]: "Home",
          [SECTION_IDS.PROJECTS]: "Work",
          [SECTION_IDS.ABOUT]: "Skills",
          [SECTION_IDS.CONTACT]: "Contact"
        }}
      />
    </AppContainer>
  </ThemeProvider>
);
}

export default App;