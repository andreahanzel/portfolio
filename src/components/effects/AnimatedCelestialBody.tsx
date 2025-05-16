// src/components/effects/AnimatedCelestialBody.tsx

import React from 'react';
import styled, { keyframes } from 'styled-components';

// Pulsating animation for the eclipse glow
const pulseGlow = keyframes`
    0% {
        opacity: 0.6;
        box-shadow: 0 0 40px 2px rgba(226, 232, 240, 0.6),
                    0 0 90px 10px rgba(226, 232, 240, 0.3),
                    0 0 150px 30px rgba(226, 232, 240, 0.15);
    }
    50% {
        opacity: 0.8;
        box-shadow: 0 0 60px 4px rgba(226, 232, 240, 0.7),
                    0 0 120px 20px rgba(226, 232, 240, 0.4),
                    0 0 200px 40px rgba(226, 232, 240, 0.2);
    }
    100% {
        opacity: 0.6;
        box-shadow: 0 0 40px 2px rgba(226, 232, 240, 0.6),
                    0 0 90px 10px rgba(226, 232, 240, 0.3),
                    0 0 150px 30px rgba(226, 232, 240, 0.15);
    }
`;

// Soft pulsating for the sun
const pulseSun = keyframes`
    0% {
        opacity: 0.75;
        box-shadow: 0 0 50px 15px rgba(250, 226, 156, 0.5),
                    0 0 100px 30px rgba(255, 236, 179, 0.3);
    }
    50% {
        opacity: 0.85;
        box-shadow: 0 0 60px 20px rgba(255, 152, 0, 0.6),
                    0 0 120px 40px rgba(255, 236, 179, 0.4);
    }
    100% {
        opacity: 0.75;
        box-shadow: 0 0 50px 15px rgba(255, 236, 179, 0.5),
                    0 0 100px 30px rgba(255, 236, 179, 0.3);
    }
`;

const CelestialContainer = styled.div`
    position: absolute;
    top: -50px; // Extend beyond the container
    left: 0;
    width: 100%;
    height: calc(100% + 100px); // Add extra height
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: visible; // Change to visible
    z-index: 1;
    pointer-events: none;
    mix-blend-mode: ${props => props.theme.isDarkMode ? 'screen' : 'overlay'};
    opacity: ${props => props.theme.isDarkMode ? 0.9 : 0.7};
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
    box-shadow: inset 0 0 30px 5px rgba(0, 0, 0, 0.95); 
    animation: ${pulseGlow} 12s ease-in-out infinite;
`;

// Eclipse inner dark circle
const EclipseDisk = styled(CelestialBase)`
    background-color:rgb(14, 15, 17);
    box-shadow: inset 0 0 40px 10px rgba(0, 0, 0, 0.95),
                inset 0 0 4px 2px rgba(203, 213, 225, 0.1); 
    z-index: 3;
`;

// Sun for light mode
const Sun = styled(CelestialBase)`
    background-color: rgb(255, 248, 242);
    box-shadow: inset 0 0 40px 5px rgba(255, 152, 0, 0.8);
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