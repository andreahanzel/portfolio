// src/components/effects/CelestialTransition.tsx 
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface CelestialContainerProps {
  $scrollY: number;
}

// Container spans the full viewport with proper 3D perspective
const CelestialContainer = styled.div<CelestialContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  overflow: hidden;
  perspective: 1500px;
  transform-style: preserve-3d;
  transition: z-index 0.1s;
`;


// Base styles for all celestial bodies
const CelestialBodyBase = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  transform-origin: center center;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
`;

// Eclipse body styling
const EclipseBody = styled(CelestialBodyBase)`
  background-color: #000000;
  box-shadow: 0 0 60px 10px rgba(155, 165, 179, 0.8), 
            0 0 120px 30px rgba(226, 232, 240, 0.5), 
            0 0 200px 60px rgba(226, 232, 240, 0.3);
  
  /* Corona effect */
  &::after {
    content: '';
    position: absolute;
    top: -15px;
    left: -15px;
    right: -15px;
    bottom: -15px;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      rgba(226, 232, 240, 0.3) 0%,
      rgba(226, 232, 240, 0.1) 50%,
      transparent 75%
    );
    z-index: -1;
  }
  
  @media (max-width: 768px) {
    box-shadow: 0 0 30px 2px rgba(226, 232, 240, 0.6), 
                0 0 60px 8px rgba(226, 232, 240, 0.3);
                
    &::after {
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
    }
  }
`;

// Sun body styling
const SunBody = styled(CelestialBodyBase)`
  background: radial-gradient(
    circle, 
    rgb(255, 248, 242) 0%, 
    rgb(255, 234, 170) 50%,
    rgb(255, 217, 102) 100%
  );
  box-shadow: 0 0 80px 40px rgba(255, 152, 0, 0.6), 
            0 0 160px 80px rgba(255, 236, 179, 0.4), 
            0 0 260px 120px rgba(255, 152, 0, 0.3);
  
  /* Solar flare effect */
  &::after {
    content: '';
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      rgba(255, 236, 179, 0.3) 0%,
      rgba(255, 152, 0, 0.2) 50%,
      transparent 75%
    );
    z-index: -1;
  }
  
  @media (max-width: 768px) {
    box-shadow: 0 0 40px 20px rgba(255, 152, 0, 0.5),
                0 0 80px 40px rgba(255, 236, 179, 0.3);
                
    &::after {
      top: -15px;
      left: -15px;
      right: -15px;
      bottom: -15px;
    }
  }
`;

// Small celestial body styling
const SmallCelestialBody = styled(CelestialBodyBase)<{ $isDarkMode: boolean }>`
  background-color: ${props => props.$isDarkMode ? '#FFFFFF' : '#FFD54F'};
  opacity: ${props => props.$isDarkMode ? '0.4' : '0.3'};
  filter: blur(1px);
  box-shadow: ${props => props.$isDarkMode 
    ? '0 0 8px 2px rgba(255, 255, 255, 0.4)' 
    : '0 0 8px 2px rgba(255, 152, 0, 0.4)'};
`;

interface CelestialTransitionProps {
  isDarkMode: boolean;
}

// Main component
const CelestialTransition: React.FC<CelestialTransitionProps> = ({ isDarkMode }) => {
  const { scrollY } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const [documentHeight, setDocumentHeight] = useState(0);
  
  // Update document height measurement
  useEffect(() => {
    const updateDimensions = () => {
      const height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      setDocumentHeight(height > 0 ? height : window.innerHeight * 3);
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Initial calculation to make the celestial body align with the home eclipse/sun
  // Calculate initial position (center of the viewport)
const homePosition = {
  x: "118%", 
  y: "35%"  
};

  // Main celestial body path - Start at center of Home eclipse, then follow a path
  // Properly place and animate the celestial body
  const mainPathX = useTransform(
  scrollY,
  [0, documentHeight * 0.1, documentHeight * 0.3, documentHeight * 0.5, documentHeight * 0.7, documentHeight * 0.9],
  [homePosition.x, '30%', '60%', '20%', '70%', '40%']
);

const mainPathY = useTransform(
  scrollY,
  [0, documentHeight * 0.1, documentHeight * 0.3, documentHeight * 0.5, documentHeight * 0.7, documentHeight * 0.9],
  [homePosition.y, '60%', '70%', '80%', '65%', '75%'] // Move progressively downward
);
  
  const mainPathZ = useTransform(
    scrollY,
    [0, documentHeight * 0.2, documentHeight * 0.4, documentHeight * 0.6, documentHeight * 0.8],
    ['-10px', '-50px', '0px', '-30px', '-20px']
  );
  
  // Start the same size as home eclipse, then vary as it moves through the path
  const mainPathScale = useTransform(
  scrollY,
  [0, 5, documentHeight * 0.1, documentHeight * 0.3, documentHeight * 0.5, documentHeight * 0.7, documentHeight * 0.9],
  [1.0, 1.05, 1.4, 0.8, 1.2, 0.7, 1.0] // Added a small scale change at the beginning for pulsation
);

 const mainOpacity = useTransform(
  scrollY,
  [0, 100, 300], 
  [1, 1, 1]  // Always visible (change from [0, 0, 1] to [1, 1, 1])
);
  
  // Spring physics
  const springConfig = { stiffness: 50, damping: 20 };
  const mainXSpring = useSpring(mainPathX, springConfig);
  const mainYSpring = useSpring(mainPathY, springConfig);
  const mainZSpring = useSpring(mainPathZ, springConfig);
  const mainScaleSpring = useSpring(mainPathScale, springConfig);
  

  
  // Define the small body paths with proper typing
  const createPathPoints = (
    startPos: number, 
    endPos: number, 
    startVal: string, 
    endVal: string
  ): [number, number, string, string] => {
    return [startPos, endPos, startVal, endVal];
  };
  
  // Path data for small bodies
  const smallBodiesXPaths: [number, number, string, string][] = [
    createPathPoints(0, documentHeight/3, "20%", "60%"),
    createPathPoints(documentHeight/6, documentHeight/2, "35%", "75%"),
    createPathPoints(documentHeight/4, documentHeight*0.6, "70%", "30%"),
    createPathPoints(documentHeight/3, documentHeight*0.7, "15%", "65%"),
    createPathPoints(documentHeight*0.5, documentHeight*0.8, "55%", "25%"),
    createPathPoints(documentHeight*0.6, documentHeight*0.9, "80%", "40%"),
    createPathPoints(documentHeight*0.1, documentHeight*0.3, "25%", "70%"),
    createPathPoints(documentHeight*0.2, documentHeight*0.5, "60%", "35%"),
    createPathPoints(documentHeight*0.4, documentHeight*0.7, "30%", "75%"),
    createPathPoints(documentHeight*0.3, documentHeight*0.6, "65%", "20%"),
    createPathPoints(documentHeight*0.5, documentHeight*0.8, "40%", "60%"),
    createPathPoints(documentHeight*0.2, documentHeight*0.4, "50%", "30%")
  ];
  

  // Path data for small bodies Y positions
  const smallBodiesYPaths: [number, number, string, string][] = [
    createPathPoints(0, documentHeight/3, "10%", "30%"),
    createPathPoints(documentHeight/6, documentHeight/2, "20%", "70%"),
    createPathPoints(documentHeight/4, documentHeight*0.6, "75%", "40%"),
    createPathPoints(documentHeight/3, documentHeight*0.7, "60%", "85%"),
    createPathPoints(documentHeight*0.5, documentHeight*0.8, "25%", "65%"),
    createPathPoints(documentHeight*0.6, documentHeight*0.9, "80%", "30%"),
    createPathPoints(documentHeight*0.1, documentHeight*0.3, "15%", "55%"),
    createPathPoints(documentHeight*0.2, documentHeight*0.5, "50%", "90%"),
    createPathPoints(documentHeight*0.4, documentHeight*0.7, "70%", "35%"),
    createPathPoints(documentHeight*0.3, documentHeight*0.6, "45%", "80%"),
    createPathPoints(documentHeight*0.5, documentHeight*0.8, "60%", "20%"),
    createPathPoints(documentHeight*0.2, documentHeight*0.4, "30%", "70%")
  ];
  
  // Use individual hooks for each small body to comply with React Hooks rules
  // Transform hooks for small bodies - explicitly define each one
  // X positions
  const smallBodyX1 = useTransform(scrollY, [smallBodiesXPaths[0][0], smallBodiesXPaths[0][1]], [smallBodiesXPaths[0][2], smallBodiesXPaths[0][3]]);
  const smallBodyX2 = useTransform(scrollY, [smallBodiesXPaths[1][0], smallBodiesXPaths[1][1]], [smallBodiesXPaths[1][2], smallBodiesXPaths[1][3]]);
  const smallBodyX3 = useTransform(scrollY, [smallBodiesXPaths[2][0], smallBodiesXPaths[2][1]], [smallBodiesXPaths[2][2], smallBodiesXPaths[2][3]]);
  const smallBodyX4 = useTransform(scrollY, [smallBodiesXPaths[3][0], smallBodiesXPaths[3][1]], [smallBodiesXPaths[3][2], smallBodiesXPaths[3][3]]);
  const smallBodyX5 = useTransform(scrollY, [smallBodiesXPaths[4][0], smallBodiesXPaths[4][1]], [smallBodiesXPaths[4][2], smallBodiesXPaths[4][3]]);
  const smallBodyX6 = useTransform(scrollY, [smallBodiesXPaths[5][0], smallBodiesXPaths[5][1]], [smallBodiesXPaths[5][2], smallBodiesXPaths[5][3]]);
  const smallBodyX7 = useTransform(scrollY, [smallBodiesXPaths[6][0], smallBodiesXPaths[6][1]], [smallBodiesXPaths[6][2], smallBodiesXPaths[6][3]]);
  const smallBodyX8 = useTransform(scrollY, [smallBodiesXPaths[7][0], smallBodiesXPaths[7][1]], [smallBodiesXPaths[7][2], smallBodiesXPaths[7][3]]);
  const smallBodyX9 = useTransform(scrollY, [smallBodiesXPaths[8][0], smallBodiesXPaths[8][1]], [smallBodiesXPaths[8][2], smallBodiesXPaths[8][3]]);
  const smallBodyX10 = useTransform(scrollY, [smallBodiesXPaths[9][0], smallBodiesXPaths[9][1]], [smallBodiesXPaths[9][2], smallBodiesXPaths[9][3]]);
  const smallBodyX11 = useTransform(scrollY, [smallBodiesXPaths[10][0], smallBodiesXPaths[10][1]], [smallBodiesXPaths[10][2], smallBodiesXPaths[10][3]]);
  const smallBodyX12 = useTransform(scrollY, [smallBodiesXPaths[11][0], smallBodiesXPaths[11][1]], [smallBodiesXPaths[11][2], smallBodiesXPaths[11][3]]);
  
  // Y positions
  const smallBodyY1 = useTransform(scrollY, [smallBodiesYPaths[0][0], smallBodiesYPaths[0][1]], [smallBodiesYPaths[0][2], smallBodiesYPaths[0][3]]);
  const smallBodyY2 = useTransform(scrollY, [smallBodiesYPaths[1][0], smallBodiesYPaths[1][1]], [smallBodiesYPaths[1][2], smallBodiesYPaths[1][3]]);
  const smallBodyY3 = useTransform(scrollY, [smallBodiesYPaths[2][0], smallBodiesYPaths[2][1]], [smallBodiesYPaths[2][2], smallBodiesYPaths[2][3]]);
  const smallBodyY4 = useTransform(scrollY, [smallBodiesYPaths[3][0], smallBodiesYPaths[3][1]], [smallBodiesYPaths[3][2], smallBodiesYPaths[3][3]]);
  const smallBodyY5 = useTransform(scrollY, [smallBodiesYPaths[4][0], smallBodiesYPaths[4][1]], [smallBodiesYPaths[4][2], smallBodiesYPaths[4][3]]);
  const smallBodyY6 = useTransform(scrollY, [smallBodiesYPaths[5][0], smallBodiesYPaths[5][1]], [smallBodiesYPaths[5][2], smallBodiesYPaths[5][3]]);
  const smallBodyY7 = useTransform(scrollY, [smallBodiesYPaths[6][0], smallBodiesYPaths[6][1]], [smallBodiesYPaths[6][2], smallBodiesYPaths[6][3]]);
  const smallBodyY8 = useTransform(scrollY, [smallBodiesYPaths[7][0], smallBodiesYPaths[7][1]], [smallBodiesYPaths[7][2], smallBodiesYPaths[7][3]]);
  const smallBodyY9 = useTransform(scrollY, [smallBodiesYPaths[8][0], smallBodiesYPaths[8][1]], [smallBodiesYPaths[8][2], smallBodiesYPaths[8][3]]);
  const smallBodyY10 = useTransform(scrollY, [smallBodiesYPaths[9][0], smallBodiesYPaths[9][1]], [smallBodiesYPaths[9][2], smallBodiesYPaths[9][3]]);
  const smallBodyY11 = useTransform(scrollY, [smallBodiesYPaths[10][0], smallBodiesYPaths[10][1]], [smallBodiesYPaths[10][2], smallBodiesYPaths[10][3]]);
  const smallBodyY12 = useTransform(scrollY, [smallBodiesYPaths[11][0], smallBodiesYPaths[11][1]], [smallBodiesYPaths[11][2], smallBodiesYPaths[11][3]]);
  
  // Z-positions for depth effect
  const smallBodyZ1 = useTransform(scrollY, [0, documentHeight/3], ["-50px", "30px"]);
  const smallBodyZ2 = useTransform(scrollY, [documentHeight/6, documentHeight/2], ["-40px", "20px"]);
  const smallBodyZ3 = useTransform(scrollY, [documentHeight/4, documentHeight*0.6], ["-30px", "40px"]);
  const smallBodyZ4 = useTransform(scrollY, [documentHeight/3, documentHeight*0.7], ["-60px", "10px"]);
  const smallBodyZ5 = useTransform(scrollY, [documentHeight*0.5, documentHeight*0.8], ["-20px", "50px"]);
  const smallBodyZ6 = useTransform(scrollY, [documentHeight*0.6, documentHeight*0.9], ["-70px", "5px"]);
  const smallBodyZ7 = useTransform(scrollY, [documentHeight*0.1, documentHeight*0.3], ["-45px", "25px"]);
  const smallBodyZ8 = useTransform(scrollY, [documentHeight*0.2, documentHeight*0.5], ["-55px", "35px"]);
  const smallBodyZ9 = useTransform(scrollY, [documentHeight*0.4, documentHeight*0.7], ["-35px", "45px"]);
  const smallBodyZ10 = useTransform(scrollY, [documentHeight*0.3, documentHeight*0.6], ["-25px", "15px"]);
  const smallBodyZ11 = useTransform(scrollY, [documentHeight*0.5, documentHeight*0.8], ["-65px", "55px"]);
  const smallBodyZ12 = useTransform(scrollY, [documentHeight*0.2, documentHeight*0.4], ["-15px", "60px"]);
  
  // Opacity values for fade in/out effects
  const smallBodyOpacity1 = useTransform(scrollY, [0, documentHeight/6, documentHeight/3], [0, 0.4, 0]);
  const smallBodyOpacity2 = useTransform(scrollY, [documentHeight/6, documentHeight/3, documentHeight/2], [0, 0.5, 0]);
  const smallBodyOpacity3 = useTransform(scrollY, [documentHeight/4, documentHeight*0.4, documentHeight*0.6], [0, 0.3, 0]);
  const smallBodyOpacity4 = useTransform(scrollY, [documentHeight/3, documentHeight*0.5, documentHeight*0.7], [0, 0.6, 0]);
  const smallBodyOpacity5 = useTransform(scrollY, [documentHeight*0.5, documentHeight*0.65, documentHeight*0.8], [0, 0.4, 0]);
  const smallBodyOpacity6 = useTransform(scrollY, [documentHeight*0.6, documentHeight*0.75, documentHeight*0.9], [0, 0.5, 0]);
  const smallBodyOpacity7 = useTransform(scrollY, [documentHeight*0.1, documentHeight*0.2, documentHeight*0.3], [0, 0.3, 0]);
  const smallBodyOpacity8 = useTransform(scrollY, [documentHeight*0.2, documentHeight*0.35, documentHeight*0.5], [0, 0.7, 0]);
  const smallBodyOpacity9 = useTransform(scrollY, [documentHeight*0.4, documentHeight*0.55, documentHeight*0.7], [0, 0.4, 0]);
  const smallBodyOpacity10 = useTransform(scrollY, [documentHeight*0.3, documentHeight*0.45, documentHeight*0.6], [0, 0.6, 0]);
  const smallBodyOpacity11 = useTransform(scrollY, [documentHeight*0.5, documentHeight*0.65, documentHeight*0.8], [0, 0.3, 0]);
  const smallBodyOpacity12 = useTransform(scrollY, [documentHeight*0.2, documentHeight*0.3, documentHeight*0.4], [0, 0.5, 0]);
  
  // Scale transformations for size changes
  const smallBodyScale1 = useTransform(scrollY, [0, documentHeight/3], [0.2, 0.1]);
  const smallBodyScale2 = useTransform(scrollY, [documentHeight/6, documentHeight/2], [0.3, 0.2]);
  const smallBodyScale3 = useTransform(scrollY, [documentHeight/4, documentHeight*0.6], [0.15, 0.25]);
  const smallBodyScale4 = useTransform(scrollY, [documentHeight/3, documentHeight*0.7], [0.25, 0.15]);
  const smallBodyScale5 = useTransform(scrollY, [documentHeight*0.5, documentHeight*0.8], [0.2, 0.3]);
  const smallBodyScale6 = useTransform(scrollY, [documentHeight*0.6, documentHeight*0.9], [0.3, 0.1]);
  const smallBodyScale7 = useTransform(scrollY, [documentHeight*0.1, documentHeight*0.3], [0.2, 0.25]);
  const smallBodyScale8 = useTransform(scrollY, [documentHeight*0.2, documentHeight*0.5], [0.25, 0.15]);
  const smallBodyScale9 = useTransform(scrollY, [documentHeight*0.4, documentHeight*0.7], [0.15, 0.3]);
  const smallBodyScale10 = useTransform(scrollY, [documentHeight*0.3, documentHeight*0.6], [0.3, 0.2]);
  const smallBodyScale11 = useTransform(scrollY, [documentHeight*0.5, documentHeight*0.8], [0.1, 0.25]);
  const smallBodyScale12 = useTransform(scrollY, [documentHeight*0.2, documentHeight*0.4], [0.25, 0.1]);
  
  // Apply spring physics to all transformations for smoother motion
  const smallBodyXSpring1 = useSpring(smallBodyX1, springConfig);
  const smallBodyXSpring2 = useSpring(smallBodyX2, springConfig);
  const smallBodyXSpring3 = useSpring(smallBodyX3, springConfig);
  const smallBodyXSpring4 = useSpring(smallBodyX4, springConfig);
  const smallBodyXSpring5 = useSpring(smallBodyX5, springConfig);
  const smallBodyXSpring6 = useSpring(smallBodyX6, springConfig);
  const smallBodyXSpring7 = useSpring(smallBodyX7, springConfig);
  const smallBodyXSpring8 = useSpring(smallBodyX8, springConfig);
  const smallBodyXSpring9 = useSpring(smallBodyX9, springConfig);
  const smallBodyXSpring10 = useSpring(smallBodyX10, springConfig);
  const smallBodyXSpring11 = useSpring(smallBodyX11, springConfig);
  const smallBodyXSpring12 = useSpring(smallBodyX12, springConfig);
  
  // Apply spring physics to Y transformations
  const smallBodyYSpring1 = useSpring(smallBodyY1, springConfig);
  const smallBodyYSpring2 = useSpring(smallBodyY2, springConfig);
  const smallBodyYSpring3 = useSpring(smallBodyY3, springConfig);
  const smallBodyYSpring4 = useSpring(smallBodyY4, springConfig);
  const smallBodyYSpring5 = useSpring(smallBodyY5, springConfig);
  const smallBodyYSpring6 = useSpring(smallBodyY6, springConfig);
  const smallBodyYSpring7 = useSpring(smallBodyY7, springConfig);
  const smallBodyYSpring8 = useSpring(smallBodyY8, springConfig);
  const smallBodyYSpring9 = useSpring(smallBodyY9, springConfig);
  const smallBodyYSpring10 = useSpring(smallBodyY10, springConfig);
  const smallBodyYSpring11 = useSpring(smallBodyY11, springConfig);
  const smallBodyYSpring12 = useSpring(smallBodyY12, springConfig);
  
  const smallBodyZSpring1 = useSpring(smallBodyZ1, springConfig);
  const smallBodyZSpring2 = useSpring(smallBodyZ2, springConfig);
  const smallBodyZSpring3 = useSpring(smallBodyZ3, springConfig);
  const smallBodyZSpring4 = useSpring(smallBodyZ4, springConfig);
  const smallBodyZSpring5 = useSpring(smallBodyZ5, springConfig);
  const smallBodyZSpring6 = useSpring(smallBodyZ6, springConfig);
  const smallBodyZSpring7 = useSpring(smallBodyZ7, springConfig);
  const smallBodyZSpring8 = useSpring(smallBodyZ8, springConfig);
  const smallBodyZSpring9 = useSpring(smallBodyZ9, springConfig);
  const smallBodyZSpring10 = useSpring(smallBodyZ10, springConfig);
  const smallBodyZSpring11 = useSpring(smallBodyZ11, springConfig);
  const smallBodyZSpring12 = useSpring(smallBodyZ12, springConfig);
  
  const smallBodyScaleSpring1 = useSpring(smallBodyScale1, springConfig);
  const smallBodyScaleSpring2 = useSpring(smallBodyScale2, springConfig);
  const smallBodyScaleSpring3 = useSpring(smallBodyScale3, springConfig);
  const smallBodyScaleSpring4 = useSpring(smallBodyScale4, springConfig);
  const smallBodyScaleSpring5 = useSpring(smallBodyScale5, springConfig);
  const smallBodyScaleSpring6 = useSpring(smallBodyScale6, springConfig);
  const smallBodyScaleSpring7 = useSpring(smallBodyScale7, springConfig);
  const smallBodyScaleSpring8 = useSpring(smallBodyScale8, springConfig);
  const smallBodyScaleSpring9 = useSpring(smallBodyScale9, springConfig);
  const smallBodyScaleSpring10 = useSpring(smallBodyScale10, springConfig);
  const smallBodyScaleSpring11 = useSpring(smallBodyScale11, springConfig);
  const smallBodyScaleSpring12 = useSpring(smallBodyScale12, springConfig);
  
  const smallBodyOpacitySpring1 = useSpring(smallBodyOpacity1, springConfig);
  const smallBodyOpacitySpring2 = useSpring(smallBodyOpacity2, springConfig);
  const smallBodyOpacitySpring3 = useSpring(smallBodyOpacity3, springConfig);
  const smallBodyOpacitySpring4 = useSpring(smallBodyOpacity4, springConfig);
  const smallBodyOpacitySpring5 = useSpring(smallBodyOpacity5, springConfig);
  const smallBodyOpacitySpring6 = useSpring(smallBodyOpacity6, springConfig);
  const smallBodyOpacitySpring7 = useSpring(smallBodyOpacity7, springConfig);
  const smallBodyOpacitySpring8 = useSpring(smallBodyOpacity8, springConfig);
  const smallBodyOpacitySpring9 = useSpring(smallBodyOpacity9, springConfig);
  const smallBodyOpacitySpring10 = useSpring(smallBodyOpacity10, springConfig);
  const smallBodyOpacitySpring11 = useSpring(smallBodyOpacity11, springConfig);
  const smallBodyOpacitySpring12 = useSpring(smallBodyOpacity12, springConfig);
  
  // Combine all spring values for small bodies
  const smallBodiesSpringValues = [
    { x: smallBodyXSpring1, y: smallBodyYSpring1, z: smallBodyZSpring1, scale: smallBodyScaleSpring1, opacity: smallBodyOpacitySpring1 },
    { x: smallBodyXSpring2, y: smallBodyYSpring2, z: smallBodyZSpring2, scale: smallBodyScaleSpring2, opacity: smallBodyOpacitySpring2 },
    { x: smallBodyXSpring3, y: smallBodyYSpring3, z: smallBodyZSpring3, scale: smallBodyScaleSpring3, opacity: smallBodyOpacitySpring3 },
    { x: smallBodyXSpring4, y: smallBodyYSpring4, z: smallBodyZSpring4, scale: smallBodyScaleSpring4, opacity: smallBodyOpacitySpring4 },
    { x: smallBodyXSpring5, y: smallBodyYSpring5, z: smallBodyZSpring5, scale: smallBodyScaleSpring5, opacity: smallBodyOpacitySpring5 },
    { x: smallBodyXSpring6, y: smallBodyYSpring6, z: smallBodyZSpring6, scale: smallBodyScaleSpring6, opacity: smallBodyOpacitySpring6 },
    { x: smallBodyXSpring7, y: smallBodyYSpring7, z: smallBodyZSpring7, scale: smallBodyScaleSpring7, opacity: smallBodyOpacitySpring7 },
    { x: smallBodyXSpring8, y: smallBodyYSpring8, z: smallBodyZSpring8, scale: smallBodyScaleSpring8, opacity: smallBodyOpacitySpring8 },
    { x: smallBodyXSpring9, y: smallBodyYSpring9, z: smallBodyZSpring9, scale: smallBodyScaleSpring9, opacity: smallBodyOpacitySpring9 },
    { x: smallBodyXSpring10, y: smallBodyYSpring10, z: smallBodyZSpring10, scale: smallBodyScaleSpring10, opacity: smallBodyOpacitySpring10 },
    { x: smallBodyXSpring11, y: smallBodyYSpring11, z: smallBodyZSpring11, scale: smallBodyScaleSpring11, opacity: smallBodyOpacitySpring11 },
    { x: smallBodyXSpring12, y: smallBodyYSpring12, z: smallBodyZSpring12, scale: smallBodyScaleSpring12, opacity: smallBodyOpacitySpring12 }
  ];
  
  // Adjust celestial body size to match home page eclipse at initial load
  // Calculate size to match home page eclipse/sun
  const mainBodySize = typeof window !== 'undefined' ? 
  Math.min(window.innerWidth, window.innerHeight) * (window.innerWidth < 768 ? 0.5 : 0.6) : // Increased from 0.3/0.4 to 0.5/0.6
  400; // Also increased base size

  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const prevScrollY = useRef(0);

  // Add this effect to track scroll direction
  useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setIsScrollingUp(currentScrollY < prevScrollY.current);
    prevScrollY.current = currentScrollY;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
  
  // Effect to find home page eclipse and match its size
  useEffect(() => {
    // Try to find the home eclipse to match its position
    const homeSection = document.getElementById('home');
    if (homeSection) {
      // This attempts to find the celestial body in the home section
      const celestialElements = homeSection.querySelectorAll('.celestial-body');
      if (celestialElements.length > 0) {
        // Found the celestial body, use its position for better alignment
        const celestial = celestialElements[0];
        const rect = celestial.getBoundingClientRect();
        
        // You could update position based on this if needed
        console.log('Found home celestial body at:', rect);
      }
    }
  }, []);
  
return (
      <CelestialContainer 
      ref={containerRef} 
      $scrollY={scrollY.get()} 
      style={{ zIndex: isScrollingUp ? -1 : undefined }}
    >
  {isDarkMode ? (
      <EclipseBody
        style={{
          x: mainXSpring,
          y: mainYSpring,
          z: mainZSpring,
          scale: mainScaleSpring,
          opacity: mainOpacity,
          width: mainBodySize,
          height: mainBodySize,
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
    ) : (
      <SunBody
        style={{
          x: mainXSpring,
          y: mainYSpring,
          z: mainZSpring,
          opacity: mainOpacity,
          scale: mainScaleSpring,
          width: mainBodySize,
          height: mainBodySize,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 1 }}
      />
    )}
    
    {/* Small celestial bodies to enhance the 3D space feeling */}
    {smallBodiesSpringValues.map((body, index) => (
      <SmallCelestialBody
        key={index}
        $isDarkMode={isDarkMode}
        style={{
          x: body.x,
          y: body.y,
          z: body.z,
          scale: body.scale,
          opacity: body.opacity,
          width: 6 + (index % 4) * 3,
          height: 6 + (index % 4) * 3,
        }}
      />
    ))}
  </CelestialContainer>
);

}

export default CelestialTransition;