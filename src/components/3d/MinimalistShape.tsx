// src\components\3d\MinimalistShape.tsx

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import { Vector3, Mesh } from 'three';

interface MinimalistShapeProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
    size?: number;
    color?: string;
    speed?: number;
    distortion?: number;
    type?: 'sphere' | 'torus' | 'icosahedron';
    opacity?: number; 
    }

    const MinimalistShape: React.FC<MinimalistShapeProps> = ({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
    size,
    color = '#FFFFFF',
    speed = 0.5,
    distortion = 0.3,
    type = 'sphere',
    opacity = 1
    }) => {
    const mesh = useRef<Mesh>(null);
    const pos = useRef<Vector3>(new Vector3(...position));
    const finalScale = size !== undefined ? size / 2 : scale;
    
    useFrame((state, delta) => {
        if (mesh.current) {
        // Subtle rotation
        mesh.current.rotation.x += delta * speed * 0.2;
        mesh.current.rotation.y += delta * speed * 0.3;
        
        // Subtle floating motion
        const t = state.clock.getElapsedTime();
        mesh.current.position.y = pos.current.y + Math.sin(t * 0.5) * 0.1;
        }
    });

    // Choose geometry based on type
    const renderGeometry = () => {
        switch (type) {
        case 'torus':
            return <torusGeometry args={[1, 0.3, 16, 32]} />;
        case 'icosahedron':
            return <icosahedronGeometry args={[1, 1]} />;
        case 'sphere':
        default:
            return <sphereGeometry args={[1, 32, 32]} />;
        }
    };
    
    return (
        <mesh 
        ref={mesh}
        position={position}
        rotation={rotation}
        scale={finalScale} 
        >
        {renderGeometry()}
        <MeshDistortMaterial 
            color={color}
            speed={0.6}
            distort={distortion}
            roughness={0.5}
            metalness={0.2}
            opacity={opacity ?? 1}
        />
        </mesh>
    );
};

export default MinimalistShape;