// src/components/effects/FloatingGlowParticles.tsx - Currently not in use but kept for reference and future use

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

// Container for the particles
const ParticlesContainer = styled.div<{ $opacity?: number }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    opacity: ${props => props.$opacity || 0.6};
`;

// Canvas for rendering particles
const Canvas = styled.canvas`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

// FloatingGlowParticles component
interface FloatingGlowParticlesProps {
    count?: number;
    color?: string;
    size?: { min: number; max: number };
    opacity?: number;
    isDarkMode?: boolean;
}

// Default values for the component
const FloatingGlowParticles: React.FC<FloatingGlowParticlesProps> = ({
    count = 40,
    color,
    size = { min: 1, max: 4 },
    opacity = 0.6,
    isDarkMode = true
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize canvas to match container
        const resizeCanvas = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle properties - SIMPLIFIED
        interface Particle {
            x: number;
            y: number;
            size: number;
            opacity: number;
        }

        // Create particles - STATIC, NO MOVEMENT
        const particles: Particle[] = [];
        const actualColor = color || (isDarkMode ? '#FFB74D' : '#FFE8B0');
        
        // Create initial set of particles
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * (size.max - size.min) + size.min,
                opacity: Math.random() * 0.3 + 0.2
            });
        }

        // Draw particles - ONE TIME, NO ANIMATION
        const renderParticles = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw particles (static, no movement)
            particles.forEach(particle => {
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                
                // Set color with opacity
                ctx.fillStyle = actualColor;
                ctx.globalAlpha = particle.opacity;
                ctx.fill();
            });
            
            // Reset global alpha
            ctx.globalAlpha = 1;
        };
        
        // Render once - no animation
        renderParticles();
        
        // Handle resize
        const handleResize = () => {
            resizeCanvas();
            renderParticles();
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('resize', handleResize);
        };
    }, [count, color, size, isDarkMode]);

    return (
        <ParticlesContainer $opacity={opacity}>
            <Canvas ref={canvasRef} />
        </ParticlesContainer>
    );
};

export default FloatingGlowParticles;