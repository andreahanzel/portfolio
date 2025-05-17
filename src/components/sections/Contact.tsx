// src/components/sections/Contact.tsx
import { useState, useEffect, useRef } from 'react';
import { type FormEvent } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, useAnimation, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AnimatedCelestialBody from '../effects/AnimatedCelestialBody';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';



// Animation keyframes
const pulseGlow = keyframes`
    0% { opacity: 0.6; box-shadow: 0 0 30px 2px rgba(255, 217, 102, 0.4), 0 0 100px 10px rgba(255, 255, 255, 0.1); }
    50% { opacity: 0.85; box-shadow: 0 0 50px 5px rgba(255, 217, 102, 0.6), 0 0 150px 15px rgba(255, 255, 255, 0.15); }
    100% { opacity: 0.6; box-shadow: 0 0 30px 2px rgba(255, 217, 102, 0.4), 0 0 100px 10px rgba(255, 255, 255, 0.1); }
    `;

    const eclipsePulse = keyframes`
    0% { opacity: 0.5; box-shadow: 0 0 30px 2px rgba(226, 232, 240, 0.4), 0 0 70px 10px rgba(226, 232, 240, 0.2); }
    50% { opacity: 0.7; box-shadow: 0 0 40px 5px rgba(226, 232, 240, 0.6), 0 0 100px 15px rgba(226, 232, 240, 0.3); }
    100% { opacity: 0.5; box-shadow: 0 0 30px 2px rgba(226, 232, 240, 0.4),
    `;

    const pulseSun = keyframes`
    0% { opacity: 0.75; box-shadow: 0 0 40px 15px rgba(250, 226, 156, 0.4), 0 0 80px 30px rgba(255, 236, 179, 0.2); }
    50% { opacity: 0.85; box-shadow: 0 0 50px 20px rgba(243, 222, 161, 0.5), 0 0 90px 40px rgba(255, 236, 179, 0.3); }
    100% { opacity: 0.75; box-shadow: 0 0 40px 15px rgba(255, 236, 179, 0.4), 0 0 80px 30px rgba(255, 236, 179, 0.2); }
    `;

    const floatAnimation = keyframes`
    0% { 
    transform: translateY(0px) translateX(0px) scale(1);
    opacity: 0.6;
    }
    50% { 
        transform: translateY(-8px) translateX(4px) scale(1.05);
        opacity: 0.9;
    }
    100% { 
        transform: translateY(0px) translateX(0px) scale(1);
        opacity: 0.6;
    }
    `;

    const shimmer = keyframes`
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
    `;


    // Styled components with enhanced effects
    const ContactContainer = styled(motion.section)`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* Adjust padding to accommodate the footer at the bottom */
    padding: 12rem 2rem 8rem;
    position: relative;
    overflow: visible; /* Changed from hidden to allow footer to display properly */
    perspective: 1500px;
    transform-style: preserve-3d;
    margin-top: -1px;
    margin-bottom: -1px; /* Important for removing any gap */
    z-index: 2;
    `;

    const CelestialWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.4; // Reduce from 0.3 to 0.2 for better blending
    z-index: 1;
    pointer-events: none;
    `;

    

    const GlowOrb = styled.div<{ $isDarkMode?: boolean }>`
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    z-index: 0;
    pointer-events: none;
    
    &.orb1 {
        top: 20%;
        left: 10%;
        width: 400px;
        height: 400px;
        background-color: ${props => props.$isDarkMode 
        ? 'rgba(203, 213, 225, 0.15)'  // same as Home dark
        : 'rgba(255, 217, 102, 0.15)'  // same as Home light
        };

        animation: ${props => props.$isDarkMode ? eclipsePulse : pulseSun} 12s ease-in-out infinite;
        opacity: ${props => props.$isDarkMode ? 1 : 0.6};
    }
    
    &.orb2 {
        bottom: 10%;
        right: 5%;
        width: 500px;
        height: 500px;
        background-color: ${props => props.$isDarkMode ? 
            'rgba(250, 248, 242, 0.01)' : 
            'rgba(250, 248, 242, 0.02)'};
        animation: ${pulseGlow} 15s ease-in-out infinite alternate;
        opacity: ${props => props.$isDarkMode ? 1 : 0.6};
    }
    
    &.orb3 {
        top: 60%;
        right: 20%;
        width: 300px;
        height: 300px;
        background-color: ${props => props.$isDarkMode ? 
            'rgba(100, 200, 255, 0.01)' : 
            'rgba(100, 200, 255, 0.01)'};
        animation: ${pulseGlow} 10s ease-in-out infinite 2s alternate;
        opacity: ${props => props.$isDarkMode ? 1 : 0.6};
    }
`;

    const Star = styled.div<{ size?: string; opacity?: number }>`
    position: absolute;
    width: ${props => props.size || '2px'};
    height: ${props => props.size || '2px'};
    border-radius: 50%;
    background-color: white;
    z-index: 1;
    opacity: ${props => props.opacity || 0.6};
    animation: ${keyframes`
        0% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0); }
    `} ${3 + Math.random() * 7}s ease-in-out infinite;
    `;

    const OrbitingSphere = styled.div`
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 217, 102, 0.8);
    box-shadow: 0 0 20px 5px rgba(255, 217, 102, 0.4);
    top: calc(50% - 5px);
    left: calc(50% - 5px);
    z-index: 2;
    
    &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: rgba(255, 217, 102, 0.5);
    }
    `;

    const GlowingBorder = css`
    position: relative;
    
    &::before {
        content: '';
        position: absolute;
        inset: -2px;
        background: linear-gradient(90deg, rgba(255, 217, 102, 0.3), rgba(255, 255, 255, 0.1), rgba(255, 217, 102, 0.3));
        border-radius: inherit;
        z-index: -1;
        animation: ${shimmer} 4s linear infinite;
        background-size: 1000px 100%;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    &:hover::before {
        opacity: 1;
    }
    `;

    const ContactContent = styled.div`
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
        position: relative;
        z-index: 2;
        display: grid;
        grid-template-columns: 0.8fr 1.2fr;
        gap: clamp(3rem, 6vw, 4rem);
        transform-style: preserve-3d;

        @media (max-width: 992px) {
            grid-template-columns: 1fr;
            gap: clamp(2rem, 4vw, 3rem);
        }
    `;

    const ContactHeader = styled.div`
    grid-column: 1 / -1;
    text-align: center;
    margin-bottom: clamp(3rem, 6vw, 4rem);
    position: relative;
    
    @media (max-width: 768px) {
        margin-bottom: clamp(2rem, 4vw, 3rem);
    }
`;

    const Title = styled(motion.h2)`
        font-family: var(--heading-font);
        font-size: clamp(4rem, 10vw, 6.5rem);
        margin-bottom: clamp(1rem, 2.5vw, 1.2rem);
        margin-top: clamp(3rem, 6vw, 4rem);
        background: ${props => props.theme.isDarkMode ? 
            'linear-gradient(90deg, rgba(226, 232, 240, 0.8), rgba(226, 232, 240, 0.2))' : 
            'linear-gradient(90deg, rgba(255, 152, 0, 0.8), rgba(255, 152, 0, 0.2))'};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        position: relative;
        display: inline-block;
        font-weight: 400;
        letter-spacing: -0.02em;
        line-height: 1.1;

        &::after {
            content: '';
            position: absolute;
            bottom: clamp(-8px, -1.5vw, -10px);
            left: 50%;
            transform: translateX(-50%);
            width: clamp(80px, 15vw, 100px);
            height: 3px;
            background: linear-gradient(90deg, rgba(255, 217, 102, 0.2), rgba(250, 248, 242, 0.8), rgba(255, 217, 102, 0.2));
        }
        
        @media (max-width: 768px) {
            margin-top: clamp(2rem, 4vw, 3rem);
        }
    `;

    const Subtitle = styled(motion.p)`
    font-size: clamp(1rem, 2.5vw, 1.3rem);
    color: ${props => props.theme.text}cc;
    max-width: clamp(300px, 80vw, 700px);
    margin: clamp(1rem, 2.5vw, 1.5rem) auto 0;
    line-height: 1.6;
    font-family: var(--body-font);
    font-weight: 400;
    letter-spacing: 0.5px;
    opacity: 0.85;
    
    @media (max-width: 768px) {
        text-align: center;
        max-width: 90%;
    }
`;

    const ContactInfo = styled(motion.div)`
        display: flex;
        flex-direction: column;
        gap: clamp(1.5rem, 3vw, 1.8rem);
        padding: clamp(2rem, 4vw, 2.5rem);
        background: ${props => props.theme.isDarkMode ? 
            'linear-gradient(135deg, rgba(10, 15, 26, 0.7), rgba(30, 41, 59, 0.6))' : 
            'linear-gradient(145deg, #fff4d6, #ffe4b8, #ffd89f)'};
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: clamp(16px, 3vw, 24px);
        position: relative;
        overflow: hidden;
        box-shadow: ${props => props.theme.isDarkMode ? 
            '0 15px 35px rgba(0, 0, 0, 0.4)' : 
            '0 25px 60px rgba(255, 170, 60, 0.4)'};
        animation: ${floatAnimation} 8s ease-in-out infinite;
        transform-style: preserve-3d;
        transform: perspective(1000px) rotateX(2deg);
        
        &::after {
            content: '';
            position: absolute;
            inset: 0;
            background: ${props => props.theme.isDarkMode ? 
                'linear-gradient(135deg, rgba(255, 217, 102, 0.03), transparent 50%)' : 
                'linear-gradient(135deg, rgba(255, 217, 102, 0.05), transparent 50%)'};
            z-index: -1;
            border-radius: inherit;
        }
        
        @media (max-width: 992px) {
            order: 2;
            transform: none;
            animation: none;
        }
        
        @media (max-width: 768px) {
            padding: clamp(1.5rem, 3vw, 2rem);
        }
    `;


    const InfoGlass = styled.div`
    position: absolute;
    inset: 0;
    border-radius: inherit;
    overflow: hidden;
    z-index: -1;
    
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: ${props => props.theme.isDarkMode ? 
        'linear-gradient(115deg, rgba(25, 25, 35, 0.7), rgba(15, 15, 25, 0.5))' : 
        'linear-gradient(115deg, rgba(255, 239, 210, 0.7), rgba(255, 208, 137, 0.5))'};
        border-radius: inherit;
    }
    
    &::after {
        content: '';
        position: absolute;
        inset: -10px;
        background: ${props => props.theme.isDarkMode ? 
        'radial-gradient(circle at 50% 0%, rgba(255, 217, 102, 0.05), transparent 70%)' : 
        'radial-gradient(circle at 50% 0%, rgba(255, 200, 100, 0.15), transparent 70%)'};
        border-radius: inherit;
    }
    `;

    const ContactInfoItem = styled(motion.div)`
    display: flex;
    align-items: center;
    gap: clamp(1.5rem, 3vw, 1.8rem);
    padding: clamp(1.5rem, 3vw, 1.8rem);
    background: ${props => props.theme.isDarkMode ? 
        'rgba(30, 30, 40, 0.3)' : 
        'rgba(255, 191, 80, 0.12)'};
    border-radius: clamp(12px, 2.5vw, 16px);
    transition: all 0.4s ease;
    border: 1px solid ${props => props.theme.isDarkMode ? 
        'rgba(255, 217, 102, 0.1)' : 
        'rgba(255, 217, 102, 0.05)'};
    position: relative;
    overflow: hidden;
    z-index: 1;
    
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: ${props => props.theme.isDarkMode ? 
            'linear-gradient(115deg, rgba(40, 40, 50, 0.3), transparent)' : 
            'linear-gradient(115deg, rgba(255, 255, 255, 0.03), transparent)'};
        z-index: -1;
    }
    
    &:hover {
        background: ${props => props.theme.isDarkMode ? 
            'rgba(255, 217, 102, 0.15)' : 
            'rgba(255, 217, 102, 0.08)'};
        transform: translateY(-5px) scale(1.02);
        box-shadow: ${props => props.theme.isDarkMode ? 
            '0 15px 30px rgba(0, 0, 0, 0.2)' : 
            '0 15px 30px rgba(0, 0, 0, 0.1)'};
        color: ${props => props.theme.accent};
        border-color: ${props => props.theme.accentAlt};
        
        svg {
            transform: scale(1.1);
            filter: drop-shadow(0 0 8px rgba(255, 217, 102, 0.6));
        }
    }

    svg {
        width: clamp(28px, 5vw, 32px);
        height: clamp(28px, 5vw, 32px);
        color: ${props => props.theme.accent};
        transition: all 0.4s ease;
        flex-shrink: 0;
    }
    
    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
        padding: 1.5rem;
    }
    
    @media (max-width: 480px) {
        padding: 1.2rem;
    }
`;

    const ContactInfoContent = styled.div`
    h3 {
        font-size: clamp(1.1rem, 2.2vw, 1.2rem);
        margin-bottom: clamp(0.6rem, 1.5vw, 0.8rem);
        color: ${props => props.theme.text};
        font-weight: 500;
        letter-spacing: 0.5px;
        font-family: var(--body-font);
    }
    
    p, a {
        font-size: clamp(0.95rem, 2vw, 1.05rem);
        color: ${props => props.theme.text}aa;
        line-height: 1.6;
        transition: color 0.3s ease;
        position: relative;
        display: inline-block;
        font-family: var(--body-font);
    }
    
    a {
        &::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 1px;
            background: ${props => props.theme.accent};
            transition: width 0.3s ease;
        }
        
        &:hover {
            color: ${props => props.theme.accent};
            
            &::after {
                width: 100%;
            }
        }
    }
    
    @media (max-width: 768px) {
        text-align: center;
    }
`;

    const SocialLinks = styled(motion.div)`
        display: flex;
        gap: clamp(1rem, 2.5vw, 1.2rem);
        margin-top: clamp(0.6rem, 1.5vw, 0.8rem);
        justify-content: center;
        flex-wrap: wrap;
    `;

    const SocialLink = styled(motion.a)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: clamp(45px, 8vw, 50px);
    height: clamp(45px, 8vw, 50px);
    border-radius: 50%;
    background: ${props => props.theme.isDarkMode ? 
        'rgba(40, 40, 50, 0.5)' : 
        'rgba(255, 255, 255, 0.03)'};
    color: ${props => props.theme.text};
    transition: all 0.4s ease;
    border: 1px solid ${props => props.theme.isDarkMode ? 
        'rgba(255, 217, 102, 0.2)' : 
        'rgba(255, 217, 102, 0.1)'};
    position: relative;
    overflow: hidden;
    z-index: 1;
    
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: ${props => props.theme.isDarkMode ? 
            'linear-gradient(135deg, rgba(255, 217, 102, 0.15), transparent)' : 
            'linear-gradient(135deg, rgba(255, 217, 102, 0.1), transparent)'};
        z-index: -1;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    &:hover {
        background: ${props => props.theme.isDarkMode ? 
            'rgba(255, 217, 102, 0.2)' : 
            'rgba(255, 217, 102, 0.15)'};
        color: ${props => props.theme.accent};
        transform: translateY(-5px);
        box-shadow: ${props => props.theme.isDarkMode ? 
            '0 10px 20px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 217, 102, 0.2)' : 
            '0 10px 20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(255, 217, 102, 0.3)'};
        
        &::before {
            opacity: 1;
        }
        
        svg {
            transform: scale(1.2);
            filter: drop-shadow(0 0 5px rgba(255, 217, 102, 0.6));
        }
    }

    svg {
        width: clamp(20px, 4vw, 22px);
        height: clamp(20px, 4vw, 22px);
        transition: all 0.4s ease;
    }
`;

    const ContactFormWrapper = styled(motion.div)`
    position: relative;
    transform-style: preserve-3d;
    perspective: 1000px;
    pointer-events: auto;

    @media (max-width: 992px) {
        order: 1;
    `;

    const ContactForm = styled(motion.form)`
        display: flex;
        flex-direction: column;
        gap: clamp(1.5rem, 3vw, 1.8rem);
        padding: clamp(2.5rem, 4vw, 3rem);
        background: ${props => props.theme.isDarkMode ? 
            'linear-gradient(135deg, rgba(10, 15, 26, 0.7), rgba(30, 41, 59, 0.6))' : 
            'linear-gradient(145deg, #fff7e6, #ffecd2, #ffd699, #fff0c2)'
        };

        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: clamp(16px, 3vw, 24px);
        position: relative;
        overflow: hidden;
        box-shadow: ${props => props.theme.isDarkMode ? 
            '0 15px 35px rgba(0, 0, 0, 0.4)' : 
            '0 15px 35px rgba(0, 0, 0, 0.2)'};
        transform-style: preserve-3d;
        
        /* CSS variables for light position */
        --light-pos-x: 50%;
        --light-pos-y: 50%;
        
        &::before {
        content: '';
        position: absolute;
        width: clamp(150px, 30vw, 200px);
        height: clamp(150px, 30vw, 200px);
        background: radial-gradient(
            circle, 
            ${props => props.theme.isDarkMode ? 
                'rgba(255, 217, 102, 0.15) 0%, rgba(255, 217, 102, 0.05) 40%, transparent 70%' : 
                'rgba(255, 217, 102, 0.25) 0%, rgba(255, 217, 102, 0.1) 40%, transparent 70%'});
        border-radius: 50%;
        top: var(--light-pos-y);
        left: var(--light-pos-x);
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 1;
        mix-blend-mode: ${props => props.theme.isDarkMode ? 'screen' : 'overlay'};
        filter: blur(8px);
        opacity: 0.8;
        transition: opacity 0.1s ease;
    }
        
        ${GlowingBorder}

                &:hover::before {
                    opacity: 1;
                    background: linear-gradient(
                        90deg, 
                        rgba(255, 177, 66, 0.4), 
                        rgba(255, 229, 180, 0.3), 
                        rgba(255, 177, 66, 0.4)
                    );
                    }

        
        &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: ${props => props.theme.isDarkMode ? 
            'linear-gradient(135deg, rgba(30, 30, 40, 0.05), transparent 50%)' : 
            'linear-gradient(135deg, rgba(250, 248, 242, 0.05), transparent 50%)'};
        z-index: -1;
        border-radius: inherit;
    }
    
    @media (max-width: 768px) {
        padding: clamp(2rem, 3vw, 2.5rem);
    }
    
    @media (max-width: 480px) {
        padding: 1.5rem;
    }
`;


    const FormGlass = styled.div`
    position: absolute;
    inset: 0;
    border-radius: inherit;
    overflow: hidden;
    z-index: -1;
    
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: ${props => props.theme.isDarkMode ? 
            'linear-gradient(115deg, rgba(25, 25, 35, 0.7), rgba(15, 15, 25, 0.5))' : 
            'linear-gradient(115deg, rgba(255, 255, 255, 0.03), transparent)'};
        border-radius: inherit;
    }
    
    &::after {
        content: '';
        position: absolute;
        inset: -10px;
        background: ${props => props.theme.isDarkMode ? 
            'radial-gradient(circle at 50% 100%, rgba(255, 217, 102, 0.05), transparent 70%)' : 
            'radial-gradient(circle at 50% 100%, rgba(255, 217, 102, 0.1), transparent 70%)'};
        border-radius: inherit;
    }
`;

    const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: clamp(0.6rem, 1.5vw, 0.8rem);
    position: relative;
`;

    const FormLabel = styled.label`
        font-size: clamp(0.9rem, 2vw, 1rem);
        color: ${props => props.theme.text}cc;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: clamp(0.4rem, 1vw, 0.5rem);
        font-family: var(--body-font);
        
        svg {
            width: clamp(14px, 3vw, 16px);
            height: clamp(14px, 3vw, 16px);
            color: ${props => props.theme.accent}aa;
        }
    `;

    const inputStyles = css`
    padding: clamp(1rem, 2.5vw, 1.2rem);
    border-radius: clamp(10px, 2vw, 12px);
    border: 1px solid ${props => props.theme.isDarkMode ? 
        'rgba(255, 217, 102, 0.2)' : 
        'rgba(255, 217, 102, 0.1)'};
    background: ${props => props.theme.isDarkMode ? 
        'rgba(30, 30, 40, 0.3)' : 
        'rgba(255, 249, 229, 0.4)'};
    font-family: var(--body-font);  
    color: ${props => props.theme.text};
    font-size: clamp(0.9rem, 2vw, 1rem);
    transition: all 0.3s ease;
    box-shadow: ${props => props.theme.isDarkMode ? 
        '0 5px 15px rgba(0, 0, 0, 0.1)' : 
        '0 5px 15px rgba(0, 0, 0, 0.05)'};
    backdrop-filter: blur(5px);
    width: 100%;
    
    &:focus {
        outline: none;
        border-color: ${props => props.theme.accent};
        box-shadow: ${props => props.theme.isDarkMode ? 
            '0 5px 15px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(255, 217, 102, 0.3)' : 
            '0 0 0 3px rgba(255, 179, 71, 0.6), 0 0 20px rgba(255, 219, 128, 0.3)'};
        background: ${props => props.theme.isDarkMode ? 
            'rgba(35, 35, 45, 0.4)' : 
            'rgba(255, 255, 255, 0.04)'};
    }
    
    &::placeholder {
        color: ${props => props.theme.isDarkMode ? 
            `${props.theme.text}99` : 
            `${props.theme.text}66`};
        font-size: clamp(0.85rem, 1.8vw, 0.95rem);
    }
    
    @media (max-width: 480px) {
        padding: 1rem;
    }
`;

    const FormInput = styled.input`
    ${inputStyles}
    &:-webkit-autofill {
    box-shadow: 0 0 0px 1000px ${props => props.theme.isDarkMode ? 'rgba(30, 30, 40, 0.3)' : 'rgba(255, 255, 255, 0.02)'} inset !important;
    -webkit-text-fill-color: ${props => props.theme.text} !important;
    font-family: var(--body-font);
    transition: background-color 5000s ease-in-out 0s;
    }
    `;


    const FormTextarea = styled.textarea`
    ${inputStyles}
    min-height: 180px;
    resize: vertical;
    font-family: var(--body-font);
    &:-webkit-autofill {
    box-shadow: 0 0 0px 1000px ${props => props.theme.isDarkMode ? 'rgba(30, 30, 40, 0.3)' : 'rgba(255, 255, 255, 0.02)'} inset !important;
    -webkit-text-fill-color: ${props => props.theme.text} !important;
    transition: background-color 5000s ease-in-out 0s;
    }
    `;

    const SubmitButton = styled(motion.button)`
    position: relative;
    z-index: 10; 
    padding: clamp(0.7rem, 1.5vw, 0.9rem) clamp(1.8rem, 3vw, 2.8rem);
    background-color: ${props => props.theme.isDarkMode 
        ? 'rgba(226, 232, 240, 0.08)' 
        : 'rgba(255, 152, 0, 0.05)'};
    border: 1px solid ${props => props.theme.isDarkMode 
        ? `${props.theme.accent}40` 
        : `${props.theme.accent}50`};
    color: ${props => props.theme.text};
    border-radius: 50px;
    font-size: clamp(0.9rem, 1.8vw, 1.1rem);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: ${props => props.theme.isDarkMode ? 
        '0 10px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 217, 102, 0.2)' : 
        '0 10px 30px rgba(255, 179, 71, 0.2), 0 0 40px rgba(255, 199, 99, 0.4)'};
    position: relative;
    overflow: hidden;
    margin-top: clamp(0.8rem, 2vw, 1rem);
    letter-spacing: 0.5px;
    backdrop-filter: blur(4px);
    white-space: nowrap;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transform: translateX(-100%);
        transition: transform 0.5s ease;
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: ${props => props.theme.isDarkMode ? 
            '0 15px 35px rgba(0, 0, 0, 0.25), 0 0 30px rgba(255, 217, 102, 0.3)' : 
            '0 20px 45px rgba(255, 179, 71, 0.3), 0 0 50px rgba(255, 199, 99, 0.5)'};
        
        &::before {
            transform: translateX(100%);
        }
    }

    &:active {
        transform: translateY(-2px);
        transition: transform 0.1s;
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
    
    @media (max-width: 768px) {
        padding: 0.8rem 2rem;
        font-size: 1rem;
    }
    
    @media (max-width: 480px) {
        padding: 0.7rem 1.5rem;
        font-size: 0.9rem;
    }
`;

    const FormFeedback = styled(motion.div)`
    padding: 1.2rem;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    `;

    const FormSuccess = styled(FormFeedback)`
    background: rgba(74, 222, 128, 0.15);
    color: ${props => props.theme.text};
    border: 1px solid rgba(74, 222, 128, 0.3);
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(115deg, rgba(74, 222, 128, 0.1), transparent);
        z-index: -1;
        border-radius: inherit;
    }
    `;

    const FormError = styled(FormFeedback)`
    background: rgba(248, 113, 113, 0.15);
    color: ${props => props.theme.text};
    border: 1px solid rgba(248, 113, 113, 0.3);
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(115deg, rgba(248, 113, 113, 0.1), transparent);
        z-index: -1;
        border-radius: inherit;
    }
    `;

    const FloatingShapeWrapper = styled(motion.div)`
    position: absolute;
    z-index: 1;
    width: clamp(200px, 40vw, 300px);
    height: clamp(200px, 40vw, 300px);
    opacity: 0.6;
    
    &.shape1 {
        top: 10%;
        right: 10%;
    }
    
    &.shape2 {
        bottom: 15%;
        left: 5%;
    }
    
    @media (max-width: 992px) {
        display: none;
    }
`;


    // SVG icons
    const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
    );

    const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
    );

    const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
    );

    const GitHubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
    );

    const LinkedInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
    );

    const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
    </svg>
    );

    const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
    );

    const SubjectIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
    );

    const MessageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    );

    const SendIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
    );



    // 3D Geometric Shape Component
    const GeometricShape: React.FC<{ position: [number, number, number]; rotation: [number, number, number]; color: string; size?: number }> = ({ position, rotation, color, size = 1 }) => {

    const meshRef = useRef<THREE.Mesh | null>(null);
    
    useEffect(() => {
        if (!meshRef.current) return;
        
        meshRef.current.rotation.x = rotation[0];
        meshRef.current.rotation.y = rotation[1];
        meshRef.current.rotation.z = rotation[2];
    }, [rotation]);
    
    return (
        <Float
        speed={2}
        rotationIntensity={0.5}
        floatIntensity={1.5}
        >
        <mesh ref={meshRef} position={position}>
            <icosahedronGeometry args={[size, 0]} />
            <meshPhongMaterial
            color={color}
            transparent
            opacity={0.6}
            emissive={color}
            emissiveIntensity={0.5}
            flatShading
            />
        </mesh>
        </Float>
    );
    };

    // Background Canvas with stars


    // Create stars for the starry effect
    const generateStars = (count = 100) => { // Increased from 50 to 100
    const stars = [];
    for (let i = 0; i < count; i++) {
        stars.push({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() > 0.9 ? '3px' : Math.random() > 0.6 ? '2px' : '1px', // Match About page sizing
        opacity: 0.3 + Math.random() * 0.7, // Added opacity variation
        animationDuration: `${2 + Math.random() * 3}s`, // Add random animation duration
        animationDelay: `${Math.random() * 2}s` // Add random animation delay
        });
    }
    return stars;
    };

    // Animation variants
    const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        },
    },
    };

    const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    },
    };

    const formVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -10 },
    visible: {
        opacity: 1,
        y: 0,
        rotateX: -2,
        transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }
    }
    };

    const infoVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 10 },
    visible: {
        opacity: 1,
        y: 0,
        rotateX: 2,
        transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }
    }
    };

    const buttonVariants = {
        initial: {
            y: 0,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 217, 102, 0.2)"
        },
        hover: { 
            y: -5,
            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.25), 0 0 30px rgba(255, 217, 102, 0.3)",
            transition: { duration: 0.3 }
        },
        tap: { 
            y: -2,
            scale: 0.98,
            transition: { duration: 0.1 }
        }
        };

    const CenteredMotionDiv = styled(motion.div)`
    text-align: center;
    margin-top: 2rem;
    `;

    const SectionHeading = styled.h3`
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.4rem;
    font-weight: 600;
    `;

    const FlexCenter = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    `;

    const BottomFade = styled.div<{ $isDarkMode: boolean }>`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    /* Make it fully transparent to remove the fade */
    background: transparent;
    pointer-events: none;
    z-index: 3;
    `;

    const StyledFlexContainer = styled.div`
        display: flex;
        align-items: center;
        gap: 0.8rem;
        `;


    // Main Contact component with enhanced 3D effects
    const Contact: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    
    const [ref, inView] = useInView({
        triggerOnce: false,
        threshold: 0.1,
    });
    
    const controls = useAnimation();
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    
    const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
    
    
    const stars = generateStars(100);
    
    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    // Handle 3D effect on form hover
    const handle3DEffect = (e: React.MouseEvent<HTMLFormElement>) => {
        if (!formRef.current) return;
        
        const form = formRef.current;
        const rect = form.getBoundingClientRect();
        
        // Calculate mouse position relative to the form
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate the center of the form
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation angles with reduced intensity (from 3 to 1.5 degrees max)
        // This makes the movement more subtle and less jumpy
        const rotateY = ((x - centerX) / centerX) * 1.5;
        const rotateX = ((centerY - y) / centerY) * 1.5;
        
        // Add damping to make the movement smoother
        form.style.transition = 'transform 0.1s ease-out';
        form.style.transform = `perspective(1000px) rotateX(${-2 + rotateX}deg) rotateY(${rotateY}deg)`;
        };
    
    // Reset form transform on mouse leave
    const resetTransform = () => {
        if (!formRef.current) return;
        formRef.current.style.transition = 'transform 0.5s ease-out';
        formRef.current.style.transform = 'perspective(1000px) rotateX(-2deg) rotateY(0deg)';
        };
    
    // Form submission handler
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitSuccess(false);
        setSubmitError('');
        
        // Simulate form submission
        setTimeout(() => {
        try {
            console.log('Form submitted:', formData);
            setSubmitSuccess(true);
            setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
            });
        } catch {
            setSubmitError('An error occurred while submitting the form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
        }, 500);
    };
    
    useEffect(() => {
        if (inView) {
        controls.start('visible');
        }
    }, [controls, inView]);
    
    return (
        <ContactContainer
        id="contact"
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        >
        {/* Background elements */}
    
        
        <CelestialWrapper>
            <AnimatedCelestialBody isDarkMode={isDarkMode} />
        </CelestialWrapper>
        
    
        <GlowOrb className="orb1" $isDarkMode={isDarkMode} />
        <GlowOrb className="orb2" $isDarkMode={isDarkMode} />
        <GlowOrb className="orb3" $isDarkMode={isDarkMode} />
        
        {/* Decorative stars */}
        {stars.map((star, index) => (
        <Star 
            key={index} 
            size={star.size}
            opacity={star.opacity}
            style={{
            top: star.top,
            left: star.left,
            animationDelay: `${Math.random() * 5}s`
            }}
        />
        ))}
        
        {/* Orbiting element */}
        <OrbitingSphere />
        
        {/* Floating 3D shapes */}
        <FloatingShapeWrapper className="shape1" style={{ y: y1 }}>
            <Canvas>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <GeometricShape 
                position={[0, 0, 0]} 
                rotation={[0.5, 0.5, 0]} 
                color="#FFD966" 
                size={1.5}
            />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} autoRotate autoRotateSpeed={1} />
            </Canvas>
        </FloatingShapeWrapper>
        
        <FloatingShapeWrapper className="shape2" style={{ y: y2 }}>
            <Canvas>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <GeometricShape 
                position={[0, 0, 0]} 
                rotation={[0.2, 0.8, 0.3]} 
                color="#A2DCFF" 
                size={1.2}
            />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} autoRotate autoRotateSpeed={-1} />
            </Canvas>
        </FloatingShapeWrapper>
        
        <ContactContent ref={containerRef}>
            <ContactHeader>
            <Title 
                variants={itemVariants}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                Get In Touch
            </Title>
            <Subtitle 
                variants={itemVariants}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                Let's create something extraordinary together. Reach out and let's start a conversation.
            </Subtitle>
            </ContactHeader>
            
            {/* Contact information card */}
            <ContactInfo 
            variants={infoVariants}
            initial="hidden"
            animate="visible"
            >
            <InfoGlass />
            
            <ContactInfoItem variants={itemVariants}>
                <LocationIcon />
                <ContactInfoContent>
                <h3>Location</h3>
                <p>Budapest, Hungary</p>
                </ContactInfoContent>
            </ContactInfoItem>
            
            <ContactInfoItem variants={itemVariants}>
                <EmailIcon />
                <ContactInfoContent>
                <h3>Email</h3>
                <a href="mailto:hello@andreatoreki.com">hello@andreatoreki.com</a>
                </ContactInfoContent>
            </ContactInfoItem>
            
            <ContactInfoItem variants={itemVariants}>
                <PhoneIcon />
                <ContactInfoContent>
                <h3>Phone - WhatsApp Only</h3>
                <a href="tel:+15106040802">+1 (510) 604-0802</a>
                </ContactInfoContent>
            </ContactInfoItem>
            
    <CenteredMotionDiv variants={itemVariants}>
    <SectionHeading>Connect With Me</SectionHeading>

    

            <SocialLinks>
                <SocialLink 
                href="https://github.com/andreahanzel" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                aria-label="GitHub profile"
                >
                <GitHubIcon />
                </SocialLink>
                <SocialLink 
                href="https://linkedin.com/" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Linkedin profile"
                >
                <LinkedInIcon />
                </SocialLink>
                <SocialLink 
                href="https://x.com/" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                aria-label="X profile"
                >
                <TwitterIcon />
                </SocialLink>
            </SocialLinks>
            </CenteredMotionDiv>


            </ContactInfo>

            
            {/* Contact form with 3D effect */}
            <ContactFormWrapper>
            <ContactForm 
                variants={formVariants}
                initial="hidden"
                animate="visible"
                ref={formRef}
                onSubmit={handleSubmit}
                onMouseMove={handle3DEffect}
                onMouseLeave={resetTransform}
            >
                <FormGlass />
                
                <AnimatePresence>
                {submitSuccess && (
                    <FormSuccess
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        >
                        <StyledFlexContainer>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="#4ADE80"/>
                            </svg>
                            <span>Thank you! Your message has been sent. I'll get back to you soon.</span>
                        </StyledFlexContainer>
                    </FormSuccess>
                )}
                </AnimatePresence>

                <AnimatePresence>
                {submitError && (
                    <FormError>
                        <StyledFlexContainer>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#F87171"/>
                            </svg>
                            <span>{submitError}</span>
                        </StyledFlexContainer>
                    </FormError>
                )}
                </AnimatePresence>
                
                <FormGroup>
                <FormLabel htmlFor="name">
                    <UserIcon /> Your Name
                </FormLabel>
                <FormInput
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required
                />
                </FormGroup>
                
                <FormGroup>
                <FormLabel htmlFor="email">
                    <EmailIcon /> Email Address
                </FormLabel>
                <FormInput
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                />
                </FormGroup>
                
                <FormGroup>
                <FormLabel htmlFor="subject">
                    <SubjectIcon /> Subject
                </FormLabel>
                <FormInput
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What is this regarding?"
                    required
                />
                </FormGroup>
                
                <FormGroup>
                <FormLabel htmlFor="message">
                    <MessageIcon /> Your Message
                </FormLabel>
                <FormTextarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Share your thoughts or questions..."
                    required
                />
                </FormGroup>
                
                <SubmitButton
                    type="submit"
                    disabled={isSubmitting}
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => console.log('Button clicked')}
                    onMouseEnter={() => console.log('Button hover')}
                    >
                    <FlexCenter>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                        {!isSubmitting && <SendIcon />}
                    </FlexCenter>
                </SubmitButton>


            </ContactForm>
            </ContactFormWrapper>
        </ContactContent>
        <BottomFade $isDarkMode={isDarkMode} />
        </ContactContainer>
    );
    };

export default Contact;