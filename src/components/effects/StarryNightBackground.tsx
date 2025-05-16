// src/components/effects/StarryNightBackground.tsx - Enhanced version

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

// Container for the stars - now covers the entire page
const StarsContainer = styled.div<{ $hideInFooter?: boolean }>`
    position: fixed; // Changed from absolute to fixed for full page coverage
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
    pointer-events: none;
    
    // Added subtle depth with radial gradient
    background: radial-gradient(ellipse at center, rgba(5, 5, 9, 0.7) 0%, rgba(1, 1, 3, 1) 100%);
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
    height: 150px; 
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
            canvas.height = window.innerHeight * 3; // Extend beyond viewport height
        };

        setCanvasDimensions();
        window.addEventListener('resize', setCanvasDimensions);

        // Define the star properties
        interface Star {
            x: number;
            y: number;
            size: number;
            opacity: number;
            speed: number;
            blinking: boolean;
            blinkRate: number;
            blinkDirection: number;
            color: string; // Added for color variation
        }
        
        // Generate color variations for stars
        const generateStarColor = () => {
            // Occasionally add colored stars
            const colors = [
                'rgba(255, 255, 255, {opacity})',  // White (most common)
                'rgba(255, 255, 235, {opacity})',  // Slightly yellow
                'rgba(235, 235, 255, {opacity})',  // Slightly blue
                'rgba(255, 235, 235, {opacity})',  // Slightly red
                'rgba(255, 223, 155, {opacity})'   // Gold/amber color
            ];
            
            // Choose color with weighted probability - white most common
            const rand = Math.random();
            const colorIndex = rand < 0.7 ? 0 : 
                            rand < 0.8 ? 1 : 
                            rand < 0.9 ? 2 : 
                            rand < 0.95 ? 3 : 4;
                            
            return colors[colorIndex];
        };
        
        // Create stars with random properties
        const stars: Star[] = [];
        const starCount = Math.min(Math.floor(window.innerWidth * window.innerHeight * 1.5 / 1000), 400); // More stars

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.3, // Slightly larger stars
                opacity: Math.random() * 0.5 + 0.2,
                speed: Math.random() * 0.01,
                blinking: Math.random() > 0.6, // More stars blink
                blinkRate: Math.random() * 0.01 + 0.005,
                blinkDirection: Math.random() > 0.5 ? 1 : -1,
                color: generateStarColor()
            });
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Add subtle nebula effect in some areas
            const createNebula = () => {
                const nebulaCount = 3;
                for (let i = 0; i < nebulaCount; i++) {
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    const radius = Math.random() * 300 + 100;
                    
                    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                    gradient.addColorStop(0, 'rgba(75, 50, 100, 0.03)');
                    gradient.addColorStop(0.5, 'rgba(55, 40, 80, 0.02)');
                    gradient.addColorStop(1, 'rgba(30, 30, 60, 0)');
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            };
            
            createNebula();

            stars.forEach(star => {
                if (star.blinking) {
                    star.opacity += star.blinkRate * star.blinkDirection;
                    if (star.opacity > 0.8) star.blinkDirection = -1;
                    else if (star.opacity < 0.2) star.blinkDirection = 1;
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                
                // Replace opacity in the color string
                const color = star.color.replace('{opacity}', star.opacity.toString());
                ctx.fillStyle = color;
                
                // Add subtle glow to some stars
                if (star.size > 1.2) {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = color;
                } else {
                    ctx.shadowBlur = 0;
                }
                
                ctx.fill();

                // Slower star movement for parallax effect
                star.y -= star.speed;
                if (star.y < -10) {
                    star.y = canvas.height + 10;
                    star.x = Math.random() * canvas.width;
                }
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', setCanvasDimensions);
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