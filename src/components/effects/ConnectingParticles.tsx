// ConnectingParticles.tsx
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

// This component creates a canvas with animated particles
const ParticlesCanvas = styled.canvas`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -10;
    pointer-events: none;
    opacity: 0.4;
    
    /* Center on ultra-wide screens */
    @media (min-width: 2400px) {
        max-width: 2400px;
        left: 50%;
        transform: translateX(-50%);
    }
    `;


    // This component is responsible for rendering the connecting particles effect
    interface ConnectingParticlesProps {
    isDarkMode: boolean;
    }

    // The component takes a prop isDarkMode to determine the color of the particles
    const ConnectingParticles: React.FC<ConnectingParticlesProps> = ({ isDarkMode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // useEffect hook to handle canvas rendering and animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions
        const setDimensions = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        };
        
        setDimensions();
        window.addEventListener('resize', setDimensions);

        // Particle properties
        const particleCount = Math.min(
            30, 
            Math.max(15, Math.floor(window.innerWidth / 64))
            ); // Scales with viewport width
        const particles: {
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        opacity: number;
        }[] = [];

        // Create particles concentrated near the top and bottom
        for (let i = 0; i < particleCount; i++) {
        // Determine if particle should be at top or bottom
        const isTop = Math.random() > 0.5;
        
        particles.push({
            x: Math.random() * canvas.width,
            y: isTop ? Math.random() * 200 : canvas.height - Math.random() * 200,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.4 + 0.1
        });
        }

        // Animation
        const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw particles
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            
            const color = isDarkMode 
            ? `rgba(255, 217, 102, ${p.opacity})`
            : `rgba(255, 167, 38, ${p.opacity})`;
            
            ctx.fillStyle = color;
            ctx.fill();
            
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Boundary check
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        });
        
        requestAnimationFrame(animate);
        };
        
        animate();
        
        return () => {
        window.removeEventListener('resize', setDimensions);
        };
    }, [isDarkMode]);

    return <ParticlesCanvas ref={canvasRef} />;
    };

export default ConnectingParticles;