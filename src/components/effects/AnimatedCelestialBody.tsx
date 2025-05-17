// src/components/effects/AnimatedCelestialBody.tsx

import React from 'react';
import styled, { keyframes } from 'styled-components';

// Pulsating animation for the eclipse glow
const pulseGlow = keyframes`
    0% {
        opacity: 0.7;
        box-shadow: 
            0 0 90px 20px rgba(248, 250, 252, 0.6),
            0 0 160px 50px rgba(226, 232, 240, 0.3),
            0 0 220px 80px rgba(248, 250, 252, 0.2);
    }
    50% {
        opacity: 1;
        box-shadow: 
            0 0 140px 40px rgba(248, 250, 252, 0.8),
            0 0 240px 80px rgba(226, 232, 240, 0.5),
            0 0 300px 120px rgba(248, 250, 252, 0.3);
    }
    100% {
        opacity: 0.7;
        box-shadow: 
            0 0 90px 20px rgba(248, 250, 252, 0.6),
            0 0 160px 50px rgba(226, 232, 240, 0.3),
            0 0 220px 80px rgba(248, 250, 252, 0.2);
    }
`;

// Soft pulsating for the sun
const pulseSun = keyframes`
    0%, 100% {  // Resting state - smaller glow
        opacity: 0.85;
        box-shadow:
            0 0 80px 30px rgba(255, 145, 0, 0.6),      // Reduced size
            0 0 120px 60px rgba(255, 165, 0, 0.4),     // Reduced size
            0 0 180px 90px rgba(255, 185, 0, 0.2);     // Reduced size
    }
    50% {      // Peak state - expanded glow
        opacity: 1;
        box-shadow:
            0 0 160px 80px rgba(255, 145, 0, 0.9),
            0 0 240px 140px rgba(255, 165, 0, 0.7),
            0 0 320px 200px rgba(255, 185, 0, 0.4);
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
    z-index: 0;
    pointer-events: none;
    opacity: ${props => props.theme.isDarkMode ? 0.3 : 0.35};
    
    ${props => props.theme.isDarkMode && `
        justify-content: flex-start;
        padding-left: 30%;
    `}
    
    @media (max-width: 768px) {
        opacity: ${props => props.theme.isDarkMode ? 0.2 : 0.15};
        ${props => props.theme.isDarkMode && `
            padding-left: 20%;
        `}
    }
`;

// Base celestial body component with responsive sizing
const CelestialBase = styled.div`
    position: absolute;
    width: clamp(300px, 60vw, 500px); // Better responsive sizing
    height: clamp(300px, 60vw, 500px);
    border-radius: 50%;
    
    @media (max-width: 768px) {
        width: clamp(200px, 80vw, 400px);
        height: clamp(200px, 80vw, 400px);
    }
`;

// Eclipse outer ring - the glowing part
    const eclipseSlide = keyframes`
    0% {
        transform: translateX(40%) scale(1.05);
    }
    50% {
        transform: translateX(0%) scale(1);
    }
    100% {
        transform: translateX(-40%) scale(1.05);
    }
    `;


// EclipseRing and EclipseDisk components
    const EclipseRing = styled(CelestialBase)`
    background-color: #ffffff;
    z-index: 1;
    box-shadow:
        0 0 120px 60px rgba(255, 255, 255, 1),
        0 0 240px 120px rgba(255, 255, 255, 0.85),
        0 0 360px 180px rgba(255, 255, 255, 0.6),
        0 0 500px 240px rgba(255, 255, 255, 0.35);
    animation: ${pulseGlow} 10s ease-in-out infinite alternate;

    &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: radial-gradient(
        circle at center,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 0.95) 50%,
        rgba(255, 255, 255, 0.75) 70%,
        rgba(255, 255, 255, 0.4) 85%,
        transparent 100%
        );
        filter: blur(60px);
        z-index: -1;
        animation: ${pulseGlow} 10s ease-in-out infinite alternate;
    }
    `;

    // Update EclipseDisk with dynamic effects
    const EclipseDisk = styled(CelestialBase)`
    background: radial-gradient(circle at center,rgb(0, 0, 0) 0%,rgb(26, 26, 27) 100%);
    z-index: 2;
    animation: ${eclipseSlide} 60s ease-in-out infinite alternate;
    will-change: transform;
    `;


    const EclipseCorona = styled(CelestialBase)`
    background: radial-gradient(
        circle at center,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 0.7) 30%,
        rgb(255, 255, 255) 60%,
        transparent 100%
    );
    filter: blur(20px);
    z-index: 0;
    `;


// Sun for light mode
const Sun = styled(CelestialBase)`
    background: radial-gradient(
        circle at center, 
        #FFECB3 20%, 
        #FFB74D 70%, 
        transparent 100%
    );
    box-shadow:
        inset 0 0 60px 20px rgba(255, 152, 0, 0.8),
        0 0 120px 40px rgba(255, 152, 0, 0.4);
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
            <EclipseCorona />
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