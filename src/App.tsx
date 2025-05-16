// src/App.tsx - Updated container styles

import { useState, useEffect, useRef } from 'react';
import styled, { ThemeProvider } from 'styled-components';

// Import components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/sections/Home';
import Projects from './components/sections/Projects';
import About from './components/sections/About';
import Contact from './components/sections/Contact';
import StarryNightBackground from './components/effects/StarryNightBackground';
import ScrollProgress from './components/ui/ScrollProgress';

// Import constants
import { SECTION_IDS } from './constants/sectionIds';

// Import theme
import { darkTheme, lightTheme } from './theme/theme';
import GlobalStyles from './styles/GlobalStyles';

// Seamless container with minimalist styling
const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

// Main content container with smooth scrolling
const MainContent = styled.main`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  scroll-behavior: smooth;
  overflow-x: hidden;

  /* Remove any potential gaps between sections */
  & > section {
    margin: 0;
    padding: 0;
  }
`;

// Background wrapper that spans the entire app
const BackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; // Make sure this is the lowest z-index
  pointer-events: none;
`;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState(SECTION_IDS.HOME);
  
  // References to each section for intersection observer
  const homeRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Set up intersection observer to detect which section is currently in view
  useEffect(() => {
    const options = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.3, // 30% of the section must be visible
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    
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

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <AppContainer>
        {/* Moved background elements to a fixed wrapper */}
        <BackgroundWrapper>
          {isDarkMode && <StarryNightBackground />}
        </BackgroundWrapper>
        
        <Navbar 
          toggleTheme={toggleTheme} 
          isDarkMode={isDarkMode} 
          activeSection={activeSection}
          scrollToSection={scrollToSection}
        />

        <MainContent>
          {/* All sections rendered in sequence for scrolling */}
          <section id={SECTION_IDS.HOME} ref={homeRef}>
            <Home isDarkMode={isDarkMode} />
          </section>
          
          <section id={SECTION_IDS.PROJECTS} ref={projectsRef}>
            <Projects />
          </section>
          
          <section id={SECTION_IDS.ABOUT} ref={aboutRef}>
            <About />
          </section>
          
          <section id={SECTION_IDS.CONTACT} ref={contactRef}>
            <Contact />
          </section>
        </MainContent>

        <Footer isDarkMode={isDarkMode} />
        
        {/* Add ScrollProgress component */}
        <ScrollProgress sections={Object.values(SECTION_IDS)} />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;