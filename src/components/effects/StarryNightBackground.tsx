// src/components/effects/StarryNightBackground.tsx 
// This component is responsible for rendering a starry night background
// It uses styled-components for styling and canvas for rendering the stars
// It allows for customizable star density, size, and color
// It also includes a gradient overlay for the bottom edge blending
// It uses the useEffect hook to handle canvas rendering and resizing
// It uses the useRef hook to reference the canvas element
// It uses the useTheme hook to access the theme colors

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

// Container for the stars - now covers the entire page
const StarsContainer = styled.div<{ $hideInFooter?: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -40;
    pointer-events: none;
    background: radial-gradient(ellipse at center, rgba(10, 15, 26, 0.7) 0%, rgba(5, 7, 13, 1) 100%);
    overflow: hidden;
    
    /* Center on ultra-wide screens */
    @media (min-width: 2400px) {
        max-width: 100vw;
        left: 50%;
        transform: translateX(-50%);
    }
`;

// Canvas for the stars
const Canvas = styled.canvas`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

// Added overlay gradient for bottom edge blending
const BottomFade = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 200px; // Increase height
    background: linear-gradient(to bottom, rgba(5, 5, 9, 0) 0%, rgba(5, 5, 9, 0.8) 100%);
    pointer-events: none;
`;

// Starry night background component
const StarryNightBackground: React.FC<{ hideInFooter?: boolean }> = ({ hideInFooter }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const setCanvasDimensions = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        setCanvasDimensions();
        window.addEventListener('resize', setCanvasDimensions);

        // Define the star properties
        interface Star {
            x: number;
            y: number;
            size: number;
            opacity: number;
            color: string;
        }
        
        // Generate color variations for stars
        const generateStarColor = () => {
    // Pure white stars for eclipse feeling
            const colors = [
                'rgba(255, 255, 255, {opacity})',  // Pure white
                'rgba(248, 250, 252, {opacity})',  // Very slightly blue-white
                'rgba(241, 245, 249, {opacity})',  // Very slightly blue-white
                'rgba(226, 232, 240, {opacity})'   // Slightly blue-white
            ];
            
            // Weight toward pure white
            const rand = Math.random();
            const colorIndex = rand < 0.7 ? 0 : 
                            rand < 0.85 ? 1 : 
                            rand < 0.95 ? 2 : 3;
                            
            return colors[colorIndex];
        };

        // Create stars with random properties 
        const stars: Star[] = [];
        const starCount = Math.min(
            Math.floor(window.innerWidth * window.innerHeight * 0.3 / 1500), 
            window.innerWidth > 1800 ? 200 : 150
            );

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.2 + 0.3, // Slightly smaller stars
                opacity: Math.random() * 0.5 + 0.2,
                color: generateStarColor()
            });
        }

        // Static render - no animation loop
        const renderStars = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Add subtle nebula effect in some areas (static)
            const createNebula = () => {
                const nebulaCount = 2;
                for (let i = 0; i < nebulaCount; i++) {
                    const x = canvas.width * (i === 0 ? 0.7 : 0.3);
                    const y = canvas.height * (i === 0 ? 0.3 : 0.7);
                    const radius = Math.random() * 200 + 100;
                    
                    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                    gradient.addColorStop(0, 'rgba(75, 50, 100, 0.02)');
                    gradient.addColorStop(0.5, 'rgba(55, 40, 80, 0.01)');
                    gradient.addColorStop(1, 'rgba(30, 30, 60, 0)');
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            };
            
            createNebula();

            // Draw static stars - no movement or animation
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                
                // Replace opacity in the color string
                const color = star.color.replace('{opacity}', star.opacity.toString());
                ctx.fillStyle = color;
                
                // Add subtle glow to some stars (but not animated)
                if (star.size > 1) {
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = color;
                } else {
                    ctx.shadowBlur = 0;
                }
                
                ctx.fill();
            });
        };

        // Render once - no animation
        renderStars();

        // Handle window resize
        const handleResize = () => {
            setCanvasDimensions();
            renderStars();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', setCanvasDimensions);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <StarsContainer $hideInFooter={hideInFooter}>
            <Canvas ref={canvasRef} />
            <BottomFade />
        </StarsContainer>
    );
};

export default StarryNightBackground;