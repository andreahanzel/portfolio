// src/components/effects/CelestialTransition.tsx 

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

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
const SunBody = styled(motion.div)`
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: radial-gradient(circle, rgb(255, 248, 242) 0%, rgb(255, 217, 102) 100%);
    box-shadow: 0 0 60px 30px rgba(255, 152, 0, 0.5), 
                0 0 120px 60px rgba(255, 236, 179, 0.3), 
                0 0 200px 100px rgba(255, 152, 0, 0.2);
    transform-origin: center center;
`;

interface CelestialTransitionProps {
    isDarkMode: boolean;
}

const CelestialTransition: React.FC<CelestialTransitionProps> = ({ isDarkMode }) => {
    const { scrollY } = useScroll();
    const [isVisible, setIsVisible] = useState(false);
    
    // Create motion values for position
    const y = useTransform(scrollY, value => `${value}px`);
    const scale = useTransform(scrollY, () => 1); // no scale change
    const opacity = useTransform(scrollY, () => 1); // always fully visible
    const rotate = useTransform(scrollY, value => `${value % 360}deg`);
    const ySpring = useSpring(y, { stiffness: 60, damping: 20 });
    const rotateSpring = useSpring(rotate, { stiffness: 40, damping: 15 });


    
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