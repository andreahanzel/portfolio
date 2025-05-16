// src/components/effects/FloatingGlowParticles.tsx

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
    speed?: number;
    opacity?: number;
    isDarkMode?: boolean;
    }

    // Default values for the component
    const FloatingGlowParticles: React.FC<FloatingGlowParticlesProps> = ({
    count = 40,
    color,
    size = { min: 1, max: 4 },
    speed = 0.5,
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

        // Particle properties
        interface Particle {
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        opacity: number;
        hue: number;
        }

        // Create particles
        const particles: Particle[] = [];
        const actualColor = color || (isDarkMode ? '#FFB74D' : '#FFE8B0');
        
        // Create initial set of particles
        for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * (size.max - size.min) + size.min,
            speedX: (Math.random() - 0.5) * speed,
            speedY: (Math.random() - 0.5) * speed,
            opacity: Math.random() * 0.3 + 0.2,
            hue: Math.random() * 20 - 10 // Slight color variation
        });
        }

        const animate = () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw and update particles
        particles.forEach(particle => {
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            
            // Set color with opacity
            ctx.fillStyle = actualColor;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
            
            // Move particle
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Reset position if particle goes out of bounds
            if (particle.x < 0 || particle.x > canvas.width) {
            particle.x = Math.random() * canvas.width;
            }
            
            if (particle.y < 0 || particle.y > canvas.height) {
            particle.y = Math.random() * canvas.height;
            }
            
            // Randomly change opacity for twinkling effect
            particle.opacity += (Math.random() - 0.5) * 0.01;
            if (particle.opacity < 0.1) particle.opacity = 0.1;
            if (particle.opacity > 0.5) particle.opacity = 0.5;
        });
        
        // Reset global alpha
        ctx.globalAlpha = 1;
        
        // Continue animation loop
        requestAnimationFrame(animate);
        };
        
        // Start animation
        animate();
        
        return () => {
        window.removeEventListener('resize', resizeCanvas);
        };
    }, [count, color, size, speed, isDarkMode]);

    return (
        <ParticlesContainer $opacity={opacity}>
        <Canvas ref={canvasRef} />
        </ParticlesContainer>
    );
    };

export default FloatingGlowParticles;