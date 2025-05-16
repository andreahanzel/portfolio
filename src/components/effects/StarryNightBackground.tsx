// src\components\effects\StarryNightBackground.tsx

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

// Container for the stars
const StarsContainer = styled.div<{ $hideInFooter?: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: ${props => props.$hideInFooter ? 'calc(100% - 400px)' : '100%'};
    overflow: hidden;
    z-index: 0;
    pointer-events: none;
    mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 0) 0%, rgba(0,0,0,1) 60%);
    -webkit-mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 0) 0%, rgba(0,0,0,1) 60%);
    `;

    // Canvas for the stars
    const Canvas = styled.canvas`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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
        speed: number;
        blinking: boolean;
        blinkRate: number;
        blinkDirection: number;
        }
        // Create stars with random properties
        const stars: Star[] = [];
        const starCount = Math.min(Math.floor(window.innerWidth * window.innerHeight / 2000), 200);

        for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1 + 0.3,
            opacity: Math.random() * 0.3 + 0.2,
            speed: Math.random() * 0.01,
            blinking: Math.random() > 0.7,
            blinkRate: Math.random() * 0.01 + 0.005,
            blinkDirection: Math.random() > 0.5 ? 1 : -1
        });
        }

        // Animation loop
        const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            if (star.blinking) {
            star.opacity += star.blinkRate * star.blinkDirection;
            if (star.opacity > 0.8) star.blinkDirection = -1;
            else if (star.opacity < 0.3) star.blinkDirection = 1;
            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();

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
        </StarsContainer>
    );
    };

export default StarryNightBackground;
