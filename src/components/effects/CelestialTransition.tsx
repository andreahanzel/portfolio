  // src/components/effects/CelestialTransition.tsx 
  import React, { useEffect, useState, useRef } from 'react';
  import styled from 'styled-components';
  import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
  import { useVelocity, useMotionValue } from 'framer-motion';

  interface CelestialContainerProps {
    $scrollY: number;
  }

  // Container spans the full viewport with proper 3D perspective
  const CelestialContainer = styled.div<CelestialContainerProps>`
  position: relative;
  display: flex;
  top: 40px;
  left: 0;
  width: 100%;
  min-height: 90vh;
  pointer-events: none;
  overflow: visible; 
  perspective: 3000px;
  transform-style: preserve-3d;
  z-index: -5;
  transform: translateZ(${props => props.$scrollY}px) rotateX(${props => props.$scrollY * 0.04}deg) rotateY(${props => props.$scrollY * 0.01}deg);
  
  /* Center on ultra-wide screens */
  @media (min-width: 2400px) {
    max-width: 2400px;
    margin: 0 auto;
}

  @media (max-width: 768px) {
    perspective: 800px; // Reduce perspective on mobile
    transform: translateZ(${props => props.$scrollY * 0.5}px) rotateX(${props => props.$scrollY * 0.02}deg) rotateY(${props => props.$scrollY * 0.005}deg);
`;

  // Base styles for all celestial bodies
  const CelestialBodyBase = styled(motion.div)`
    position: absolute;
    border-radius: 50%;
    transform-origin: center center;
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
    aspect-ratio: 1;
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
  const SmallCelestialBody = styled(CelestialBodyBase)<{ 
    $isDarkMode: boolean; 
    $speedFactor?: number 
  }>`
    background-color: ${props => props.$isDarkMode ? '#FFFFFF' : '#FFD54F'};
    opacity: ${props => props.$isDarkMode ? '0.4' : '0.3'};
    filter: blur(${props => props.$speedFactor ? Math.min(props.$speedFactor * 0.5, 3) : 1}px);
    box-shadow: ${props => props.$isDarkMode 
      ? `0 0 8px 2px rgba(255, 255, 255, ${props.$speedFactor ? 0.4 + props.$speedFactor * 0.1 : 0.4})` 
      : `0 0 8px 2px rgba(255, 152, 0, ${props.$speedFactor ? 0.4 + props.$speedFactor * 0.1 : 0.4})`};
    transition: filter 0.2s ease;
  `;

  interface CelestialTransitionProps {
    isDarkMode: boolean;
  }

  // Main component
  const CelestialTransition: React.FC<CelestialTransitionProps> = ({ isDarkMode }) => {
    const { scrollY } = useScroll();
    const containerRef = useRef<HTMLDivElement>(null);
    const [documentHeight, setDocumentHeight] = useState(0);
    const scrollVelocity = useVelocity(scrollY);
    const [cameraShake, setCameraShake] = useState({ x: 0, y: 0 });
    
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

    // Camera shake effect
    useEffect(() => {
      const unsubscribe = scrollVelocity.onChange(latest => {
        if (Math.abs(latest) > 100) {
          setCameraShake({
            x: (Math.random() - 0.5) * Math.min(Math.abs(latest) * 0.05, 5),
            y: (Math.random() - 0.5) * Math.min(Math.abs(latest) * 0.05, 5)
          });
        } else {
          setCameraShake({ x: 0, y: 0 });
        }
      });
      
      return () => unsubscribe();
    }, [scrollVelocity]);

    // Initial calculation to make the celestial body align with the home eclipse/sun
    // Calculate initial position (center of the viewport)
    const [homePosition, setHomePosition] = useState({
    x: "260%", 
    y: "35%"  
  });

  useEffect(() => {
  const updateHomePosition = () => {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    
    if (isMobile) {
      setHomePosition({ x: "80%", y: "10%" }); // Center for mobile
    } else if (isTablet) {
      setHomePosition({ x: "80%", y: "37%" }); // Adjusted for tablet
    } else {
      setHomePosition({ x: "260%", y: "35%" }); // Original desktop
    }
  };
  
  updateHomePosition();
  window.addEventListener('resize', updateHomePosition);
  return () => window.removeEventListener('resize', updateHomePosition);
}, []);

    // Main celestial body path - Start at center of Home eclipse, then follow a path
    //Horizontal path X positions - Start at center of Home eclipse, then follow a path
    const mainPathX = useTransform(
      scrollY,
      [0, documentHeight * 0.05, documentHeight * 0.1, documentHeight * 0.3, documentHeight * 0.5, documentHeight * 0.7, documentHeight * 0.9],
      [homePosition.x, '260%', '90%', '25%', '180%', '70%', '2%']
    );

    // Main path Y positions - Start at center of Home eclipse, then follow a path
    // Vertical path Y positions - Start at center of Home eclipse, then follow a path
    const mainPathY = useTransform(
      scrollY,
      [0, documentHeight * 0.05, documentHeight * 0.1, documentHeight * 0.3, documentHeight * 0.5, documentHeight * 0.7, documentHeight * 0.9],
      [homePosition.y, '35%', '45%', '70%', '80%', '45%', '75%']
    );
      
    // Z-positions for depth effect
    const mainPathZ = useTransform(
      scrollY,
      [0, documentHeight * 0.2, documentHeight * 0.4, documentHeight * 0.6, documentHeight * 0.8],
      ['10px', '40px', '10px', '-0px', '10px']  // More dramatic Z movement
    );
      

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 768);
      handleResize(); // Initialize
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);


    // Scale transformations for the main body
    // Size changes for the main body
    const mainPathScale = useTransform(
      scrollY,
      [0, 5, documentHeight * 0.1, documentHeight * 0.3, documentHeight * 0.5, documentHeight * 0.7, documentHeight * 0.9],
      isMobile
        ? [1.1, 0.85, 1.3, 0.95, 1.2, 1.0, 0.6] // mobile-friendly values
        : [1.2, 0.9, 1.5, 1, 1.4, 1.05, 0.5]     // desktop values
    );


    // Opacity values for fade in/out effects
    const mainOpacity = useTransform(
      scrollY,
      [0, 100, 300], 
      [1, 1, 1]  // Always visible
    );

    // Z-index values for layering effect
    const mainZIndex = useTransform(scrollY, [0, 100, 400], [2, 1, -1]);

    // Rotation transforms
    const mainRotateX = useTransform(
      scrollY,
      [0, documentHeight * 0.7, documentHeight],
      [0, 15, 0]  // Rotates back to 0 at bottom
    );
    const mainRotateY = useTransform(
      scrollY,
      [0, documentHeight * 0.7, documentHeight],
      [0, -25, 0]  // Rotates back to 0 at bottom
    );

    // Spring physics
    const springConfig = { stiffness: 40, damping: 25, mass: 1.2 };
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
      createPathPoints(documentHeight*0.2, documentHeight*0.4, "60%", "30%")
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
    
    // X positions for small bodies
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
    
    // Y positions for small bodies
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
    
    // Z-positions for depth effect for small bodies
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
    
    // Opacity values for fade in/out effects for small bodies
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
    
    // Scale transformations for size changes for small bodies
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
    
    // Apply spring physics to Z transformations
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
    
    // Apply spring physics to scale transformations
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
    
    // Apply spring physics to opacity transformations
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
  
  // Create z-transforms for each small body with velocity
  const smallBodyZWithVelocity1 = useMotionValue(smallBodyZSpring1.get());
  const smallBodyZWithVelocity2 = useMotionValue(smallBodyZSpring2.get());
  const smallBodyZWithVelocity3 = useMotionValue(smallBodyZSpring3.get());
  const smallBodyZWithVelocity4 = useMotionValue(smallBodyZSpring4.get());
  const smallBodyZWithVelocity5 = useMotionValue(smallBodyZSpring5.get());
  const smallBodyZWithVelocity6 = useMotionValue(smallBodyZSpring6.get());
  const smallBodyZWithVelocity7 = useMotionValue(smallBodyZSpring7.get());
  const smallBodyZWithVelocity8 = useMotionValue(smallBodyZSpring8.get());
  const smallBodyZWithVelocity9 = useMotionValue(smallBodyZSpring9.get());
  const smallBodyZWithVelocity10 = useMotionValue(smallBodyZSpring10.get());
  const smallBodyZWithVelocity11 = useMotionValue(smallBodyZSpring11.get());
  const smallBodyZWithVelocity12 = useMotionValue(smallBodyZSpring12.get());

  // Update Z positions based on velocity
  // Update Z positions based on velocity
  useEffect(() => {
    const unsubscribe = scrollVelocity.onChange(vel => {
      const velFactor = vel / 200;
      smallBodyZWithVelocity1.set(smallBodyZSpring1.get() + velFactor * 20);
      smallBodyZWithVelocity2.set(smallBodyZSpring2.get() + velFactor * 20);
      smallBodyZWithVelocity3.set(smallBodyZSpring3.get() + velFactor * 20);
      smallBodyZWithVelocity4.set(smallBodyZSpring4.get() + velFactor * 20);
      smallBodyZWithVelocity5.set(smallBodyZSpring5.get() + velFactor * 20);
      smallBodyZWithVelocity6.set(smallBodyZSpring6.get() + velFactor * 20);
      smallBodyZWithVelocity7.set(smallBodyZSpring7.get() + velFactor * 20);
      smallBodyZWithVelocity8.set(smallBodyZSpring8.get() + velFactor * 20);
      smallBodyZWithVelocity9.set(smallBodyZSpring9.get() + velFactor * 20);
      smallBodyZWithVelocity10.set(smallBodyZSpring10.get() + velFactor * 20);
      smallBodyZWithVelocity11.set(smallBodyZSpring11.get() + velFactor * 20);
      smallBodyZWithVelocity12.set(smallBodyZSpring12.get() + velFactor * 20);
    });
    
    return () => unsubscribe();
  }, [
    scrollVelocity, 
    smallBodyZSpring1, smallBodyZSpring2, smallBodyZSpring3, smallBodyZSpring4,
    smallBodyZSpring5, smallBodyZSpring6, smallBodyZSpring7, smallBodyZSpring8,
    smallBodyZSpring9, smallBodyZSpring10, smallBodyZSpring11, smallBodyZSpring12,
    // Add these new dependencies:
    smallBodyZWithVelocity1, smallBodyZWithVelocity2, smallBodyZWithVelocity3, smallBodyZWithVelocity4,
    smallBodyZWithVelocity5, smallBodyZWithVelocity6, smallBodyZWithVelocity7, smallBodyZWithVelocity8,
    smallBodyZWithVelocity9, smallBodyZWithVelocity10, smallBodyZWithVelocity11, smallBodyZWithVelocity12
  ]);

  // Create blur filters for each small body
  const smallBodyBlurFilter1 = useTransform(scrollVelocity, [0, 100], ['blur(0px)', 'blur(2px)']);
  const smallBodyBlurFilter2 = useTransform(scrollVelocity, [0, 100], ['blur(0px)', 'blur(2px)']);
  const smallBodyBlurFilter3 = useTransform(scrollVelocity, [0, 100], ['blur(0px)', 'blur(2px)']);
  const smallBodyBlurFilter4 = useTransform(scrollVelocity, [0, 100], ['blur(0px)', 'blur(2px)']);
  const smallBodyBlurFilter5 = useTransform(scrollVelocity, [0, 100], ['blur(0px)', 'blur(2px)']);
  const smallBodyBlurFilter6 = useTransform(scrollVelocity, [0, 100], ['blur(0px)', 'blur(2px)']);
  const smallBodyBlurFilter7 = useTransform(scrollVelocity, [0, 100], ['blur(0px)', 'blur(2px)']);
  const smallBodyBlurFilter8 = useTransform(scrollVelocity, [0, 100], ['blur(0px)', 'blur(2px)']);
  const smallBodyBlurFilter9 = useTransform(scrollVelocity, [0, 100], ['blur(0px)', 'blur(2px)']);
  const smallBodyBlurFilter10 = useTransform(scrollVelocity, [0, 100], ['blur(0px)', 'blur(2px)']);
  const smallBodyBlurFilter11 = useTransform(scrollVelocity, [0, 100], ['blur(0px)', 'blur(2px)']);
  const smallBodyBlurFilter12 = useTransform(scrollVelocity, [0, 100], ['blur(0px)', 'blur(2px)']);
  
  // Combine all spring values for small bodies
  const smallBodiesSpringValues = [
    { 
      x: smallBodyXSpring1, 
      y: smallBodyYSpring1, 
      z: smallBodyZSpring1, 
      zWithVelocity: smallBodyZWithVelocity1,
      scale: smallBodyScaleSpring1, 
      opacity: smallBodyOpacitySpring1,
      blurFilter: smallBodyBlurFilter1
    },
    { 
      x: smallBodyXSpring2, 
      y: smallBodyYSpring2, 
      z: smallBodyZSpring2, 
      zWithVelocity: smallBodyZWithVelocity2,
      scale: smallBodyScaleSpring2, 
      opacity: smallBodyOpacitySpring2,
      blurFilter: smallBodyBlurFilter2
    },
    { 
      x: smallBodyXSpring3, 
      y: smallBodyYSpring3, 
      z: smallBodyZSpring3, 
      zWithVelocity: smallBodyZWithVelocity3,
      scale: smallBodyScaleSpring3, 
      opacity: smallBodyOpacitySpring3,
      blurFilter: smallBodyBlurFilter3
    },
    { 
      x: smallBodyXSpring4, 
      y: smallBodyYSpring4, 
      z: smallBodyZSpring4, 
      zWithVelocity: smallBodyZWithVelocity4,
      scale: smallBodyScaleSpring4, 
      opacity: smallBodyOpacitySpring4,
      blurFilter: smallBodyBlurFilter4
    },
    { 
      x: smallBodyXSpring5, 
      y: smallBodyYSpring5, 
      z: smallBodyZSpring5, 
      zWithVelocity: smallBodyZWithVelocity5,
      scale: smallBodyScaleSpring5, 
      opacity: smallBodyOpacitySpring5,
      blurFilter: smallBodyBlurFilter5
    },
    { 
      x: smallBodyXSpring6, 
      y: smallBodyYSpring6, 
      z: smallBodyZSpring6, 
      zWithVelocity: smallBodyZWithVelocity6,
      scale: smallBodyScaleSpring6, 
      opacity: smallBodyOpacitySpring6,
      blurFilter: smallBodyBlurFilter6
    },
    { 
      x: smallBodyXSpring7, 
      y: smallBodyYSpring7, 
      z: smallBodyZSpring7, 
      zWithVelocity: smallBodyZWithVelocity7,
      scale: smallBodyScaleSpring7, 
      opacity: smallBodyOpacitySpring7,
      blurFilter: smallBodyBlurFilter7
    },
    { 
      x: smallBodyXSpring8, 
      y: smallBodyYSpring8, 
      z: smallBodyZSpring8, 
      zWithVelocity: smallBodyZWithVelocity8,
      scale: smallBodyScaleSpring8, 
      opacity: smallBodyOpacitySpring8,
      blurFilter: smallBodyBlurFilter8
    },
    { 
      x: smallBodyXSpring9, 
      y: smallBodyYSpring9, 
      z: smallBodyZSpring9, 
      zWithVelocity: smallBodyZWithVelocity9,
      scale: smallBodyScaleSpring9, 
      opacity: smallBodyOpacitySpring9,
      blurFilter: smallBodyBlurFilter9
    },
    { 
      x: smallBodyXSpring10, 
      y: smallBodyYSpring10, 
      z: smallBodyZSpring10, 
      zWithVelocity: smallBodyZWithVelocity10,
      scale: smallBodyScaleSpring10, 
      opacity: smallBodyOpacitySpring10,
      blurFilter: smallBodyBlurFilter10
    },
    { 
      x: smallBodyXSpring11, 
      y: smallBodyYSpring11, 
      z: smallBodyZSpring11, 
      zWithVelocity: smallBodyZWithVelocity11,
      scale: smallBodyScaleSpring11, 
      opacity: smallBodyOpacitySpring11,
      blurFilter: smallBodyBlurFilter11
    },
    { 
      x: smallBodyXSpring12, 
      y: smallBodyYSpring12, 
      z: smallBodyZSpring12, 
      zWithVelocity: smallBodyZWithVelocity12,
      scale: smallBodyScaleSpring12, 
      opacity: smallBodyOpacitySpring12,
      blurFilter: smallBodyBlurFilter12
    }
  ];
  
  
  // Adjust celestial body size to match home page eclipse at initial load
  const mainBodySize = typeof window !== 'undefined'
  ? Math.min(window.innerWidth, window.innerHeight) * (window.innerWidth < 768 ? 0.5 :
    window.innerWidth > 1800 ? 0.5 : 0.7)
  : 400;

  const prevScrollY = useRef(0);

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Find home page eclipse and match its size
  useEffect(() => {
    const homeSection = document.getElementById('home');
    if (homeSection) {
      const celestialElements = homeSection.querySelectorAll('.celestial-body');
      if (celestialElements.length > 0) {
        const celestial = celestialElements[0];
        const rect = celestial.getBoundingClientRect();
        console.log('Found home celestial body at:', rect);
      }
    }
  }, []);
  
  return (
    <CelestialContainer 
      ref={containerRef} 
      $scrollY={scrollY.get()} 
      style={{
        transform: `translate(${cameraShake.x}px, ${cameraShake.y}px)`
      }}
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
            zIndex: mainZIndex,
            rotateX: mainRotateX,
            rotateY: mainRotateY,
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
            zIndex: mainZIndex,
            rotateX: mainRotateX,
            rotateY: mainRotateY,
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
          $speedFactor={Math.abs(scrollVelocity.get() * 0.01)}
          style={{
            x: body.x,
            y: body.y,
            z: body.zWithVelocity,
            scale: body.scale,
            opacity: body.opacity,
            width: 6 + (index % 4) * 3,
            height: 6 + (index % 4) * 3,
            zIndex: -20,
            filter: body.blurFilter
          }}
        />
      ))}
    </CelestialContainer>
  );
  }

  export default CelestialTransition;