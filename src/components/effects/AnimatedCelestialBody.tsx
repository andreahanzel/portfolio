// src/components/effects/AnimatedCelestialBody.tsx

import React from 'react';
import styled, { keyframes } from 'styled-components';

// Pulsating animation for the eclipse glow
const pulseGlow = keyframes`
    0% {
        opacity: 0.5;
        box-shadow: 0 0 30px 2px rgba(255, 217, 102, 0.6),
                    0 0 70px 10px rgba(255, 255, 255, 0.15);
    }
    50% {
        opacity: 0.7;
        box-shadow: 0 0 40px 5px rgba(255, 255, 255, 0.5),
                    0 0 100px 15px rgba(255, 217, 102, 0.6);
    }
    100% {
        opacity: 0.5;
        box-shadow: 0 0 30px 2px rgba(255, 255, 255, 0.3),
                    0 0 70px 10px rgba(255, 217, 102, 0.6);
    }
`;

// Soft pulsating for the sun
const pulseSun = keyframes`
    0% {
        opacity: 0.75;
        box-shadow: 0 0 40px 15px rgba(250, 226, 156, 0.4),
                    0 0 80px 30px rgba(255, 236, 179, 0.2);
    }
    50% {
        opacity: 0.85;
        box-shadow: 0 0 50px 20px rgba(243, 222, 161, 0.5),
                    0 0 90px 40px rgba(255, 236, 179, 0.3);
    }
    100% {
        opacity: 0.75;
        box-shadow: 0 0 40px 15px rgba(255, 236, 179, 0.4),
                    0 0 80px 30px rgba(255, 236, 179, 0.2);
    }
`;

const CelestialContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    z-index: 1;
    pointer-events: none;
    mix-blend-mode: screen; // Add this for better blending
    opacity: 0.7; // Reduce overall opacity
`;

// Base celestial body component with responsive sizing
const CelestialBase = styled.div`
    position: absolute;
    width: min(500px, 90vw, 90vh); /* Responsive size */
    height: min(500px, 90vw, 90vh); /* Responsive size */
    border-radius: 50%;
`;

// Eclipse outer ring - the glowing part
const EclipseRing = styled(CelestialBase)`
    background-color: #000000;
    box-shadow: inset 0 0 20px 5px rgba(0, 0, 0, 0.8); 
    animation: ${pulseGlow} 8s ease-in-out infinite;
`;

// Eclipse inner dark circle
const EclipseDisk = styled(CelestialBase)`
    background-color: rgb(12, 12, 12);
    box-shadow: inset 0 0 20px 5px rgba(0, 0, 0, 0.8); 
    z-index: 3;
`;

// Sun for light mode
const Sun = styled(CelestialBase)`
    background-color: rgb(250, 248, 242);
    box-shadow: inset 0 0 30px 5px rgba(255, 217, 102, 0.6);
    z-index: 2;
    animation: ${pulseSun} 8s ease-in-out infinite;
`;

interface AnimatedCelestialBodyProps {
    isDarkMode: boolean;
}
    const AnimatedCelestialBody: React.FC<AnimatedCelestialBodyProps> = ({ isDarkMode }) => {
    return (
        <CelestialContainer>
        {isDarkMode ? (
            // Eclipse effect for dark mode
            <>
            <EclipseRing />
            <EclipseDisk />
            </>
        ) : (
            // Sun effect for light mode
            <Sun />
        )}
        </CelestialContainer>
    );
    };

export default AnimatedCelestialBody;