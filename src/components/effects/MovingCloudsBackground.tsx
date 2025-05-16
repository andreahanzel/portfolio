// not in usage for now: src\components\effects\MovingCloudsBackground.tsx

import React from 'react';
import styled, { keyframes } from 'styled-components';

interface CloudLayerProps {
    speed?: number;
    opacity?: number;
    scale?: number;
    zIndex?: number;
    }

    // Keyframes for cloud movement
    const cloudMovement = keyframes`
    0% {
        transform: translateX(-5%);
    }
    100% {
        transform: translateX(105%);
    }
    `;

    const CloudContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
    `;

    const CloudLayer = styled.div<{
    $speed: number;
    $opacity: number;
    $scale: number;
    $zIndex: number;
    }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: ${props => props.$opacity};
    z-index: ${props => props.$zIndex};
    pointer-events: none;
    `;

    const Cloud = styled.div<{
    $top: number;
    $left: number;
    $speed: number;
    $delay: number;
    $scale: number;
    }>`
    position: absolute;
    top: ${props => props.$top}%;
    left: ${props => props.$left}%;
    width: 300px;
    height: 100px;
    background: rgba(255, 255, 255, 0.2); // changed from 0.05 to 0.2
    border-radius: 50px;
    transform: scale(${props => props.$scale});
    animation: ${cloudMovement} ${props => props.$speed}s linear infinite;
    animation-delay: ${props => props.$delay}s;
    filter: blur(8px); // reduced from 20px to 8px so it doesn't vanish

    &:before,
    &:after {
        content: '';
        position: absolute;
        background: inherit;
        border-radius: inherit;
    }

    &:before {
        width: 170px;
        height: 150px;
        top: -75px;
        left: 40px;
    }

    &:after {
        width: 200px;
        height: 180px;
        top: -80px;
        left: 160px;
    }
    `;


    // Function to generate random cloud parameters
    const generateClouds = (count: number, speed: number, scale: number) => {
    const clouds = [];
    for (let i = 0; i < count; i++) {
        clouds.push({
        top: Math.random() * 100,
        left: Math.random() * 100 - 100, // Start from outside the viewport
        speed: speed + Math.random() * 20,
        delay: Math.random() * 30,
        scale: (scale * 0.5) + (Math.random() * scale),
        });
    }
    return clouds;
    };

    const MovingCloudsBackground: React.FC<{layers?: CloudLayerProps[]}> = ({ 
    layers = [
        { speed: 120, opacity: 0.03, scale: 1.5, zIndex: 0 },
        { speed: 80, opacity: 0.04, scale: 1, zIndex: 1 },
        { speed: 60, opacity: 0.05, scale: 0.8, zIndex: 2 }
    ] 
    }) => {
    // Generate clouds for each layer
    const cloudLayers = layers.map((layer, layerIndex) => {
        const { speed = 80, opacity = 0.05, scale = 1, zIndex = 0 } = layer;
        const cloudCount = Math.floor(5 + Math.random() * 3); // 5-7 clouds per layer
        const clouds = generateClouds(cloudCount, speed, scale);

        return (
        <CloudLayer 
            key={`layer-${layerIndex}`}
            $speed={speed}
            $opacity={opacity}
            $scale={scale}
            $zIndex={zIndex}
        >
            {clouds.map((cloud, cloudIndex) => (
            <Cloud
                key={`cloud-${layerIndex}-${cloudIndex}`}
                $top={cloud.top}
                $left={cloud.left}
                $speed={cloud.speed}
                $delay={cloud.delay}
                $scale={cloud.scale}
            />
            ))}
        </CloudLayer>
        );
    });

    return <CloudContainer>{cloudLayers}</CloudContainer>;
    };

export default MovingCloudsBackground;