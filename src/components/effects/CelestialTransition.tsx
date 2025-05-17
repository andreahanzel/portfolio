// src/components/effects/CelestialTransition.tsx 

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Styled component for the transition container
// This container will hold the celestial body and manage its position
// It is positioned absolutely to cover the entire viewport
const TransitionContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
`;

// Eclipse Body styled component
// This component represents the eclipse effect
// It has a circular shape with a black background and glowing shadows
// The shadows create a glowing effect around the eclipse
const EclipseBody = styled(motion.div)`
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: #000000;
    box-shadow: 0 0 40px 2px rgba(226, 232, 240, 0.6), 
                0 0 90px 10px rgba(226, 232, 240, 0.3), 
                0 0 150px 30px rgba(226, 232, 240, 0.15);
    transform-origin: center center;
`;

// Sun Body styled component
// This component represents the sun effect
// It has a circular shape with a radial gradient background
const SunBody = styled(motion.div)`
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: radial-gradient(circle, rgb(255, 248, 242) 0%, rgb(255, 217, 102) 100%);
    box-shadow: 
        0 0 60px 30px rgba(255, 152, 0, 0.5), 
        0 0 120px 60px rgba(255, 236, 179, 0.3), 
        0 0 200px 100px rgba(255, 152, 0, 0.2);
    transform-origin: center center;
`;

// CelestialTransition component
// This component manages the transition effect of the celestial body
interface CelestialTransitionProps {
    isDarkMode: boolean;
}

// The component takes a prop isDarkMode to determine which celestial body to render
// It uses framer-motion to animate the position, scale, and opacity of the celestial body
const CelestialTransition: React.FC<CelestialTransitionProps> = ({ isDarkMode }) => {
    const { scrollY } = useScroll();
    const [isVisible, setIsVisible] = useState(false);
    
    // Create motion values for position
    const y = useTransform(scrollY, value => `${value}px`); // y position based on scroll
    const scale = useTransform(scrollY, () => 1); // no scale change
    const opacity = useTransform(scrollY, () => 1); // always fully visible
    const rotate = useTransform(scrollY, value => `${value % 360}deg`); // rotation based on scroll
    const ySpring = useSpring(y, { stiffness: 60, damping: 20 }); // spring for smooth y position
    const rotateSpring = useSpring(rotate, { stiffness: 40, damping: 15 }); // spring for smooth rotation


// Effect to handle scroll events
    // This effect listens for scroll events and updates the visibility of the celestial body
    // It sets the visibility to true when the scroll position is between 10 and 1000 pixels
    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY;
            if (scrollPos > 10 && scrollPos < 1000) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    if (!isVisible) return null;
    
    // Render different components based on isDarkMode
    const CelestialComponent = isDarkMode ? EclipseBody : SunBody;
    
    return (
        <TransitionContainer>
            <CelestialComponent 
                style={{ 
                    y: ySpring, 
                    scale,
                    opacity,
                    rotate: rotateSpring,
                    x: '-50%',
                    left: '50%'
                }}
            />
        </TransitionContainer>
    );
};

export default CelestialTransition;