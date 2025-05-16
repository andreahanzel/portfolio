//. src\App.tsx

import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

// Import components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/sections/Home';
import Projects from './components/sections/Projects';
import About from './components/sections/About';
import Contact from './components/sections/Contact';
import StarryNightBackground from './components/effects/StarryNightBackground';

// Import theme
import { darkTheme, lightTheme } from './theme/theme';
import GlobalStyles from './styles/GlobalStyles';

// Container with minimalist styling
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

// Main content container
const MainContent = styled.main`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
`;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <BrowserRouter>
        <AppContainer>
          {isDarkMode && <StarryNightBackground />}
          <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

          <MainContent>
            <Routes>
              <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
              <Route path="/home" element={<Home isDarkMode={isDarkMode} />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </MainContent>

          <Footer isDarkMode={isDarkMode} />
        </AppContainer>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;