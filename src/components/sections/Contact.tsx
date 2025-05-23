// src/components/sections/Contact.tsx
// This component is responsible for rendering the contact section of the portfolio
// It uses styled-components for styling and framer-motion for animations

import { useState, useEffect, useRef } from 'react';
import { type FormEvent } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, useAnimation, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
// import AnimatedCelestialBody from '../effects/AnimatedCelestialBody';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

// Animation keyframes for the floating effect
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

    // Styled components with enhanced effects
        const ContactContainer = styled(motion.section)`
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 8rem 1.5rem 6rem;
        position: relative;
        overflow-x: hidden;
        overflow-y: visible;
        perspective: 1500px;
        transform-style: preserve-3d;
        z-index: 10;
        pointer-events: auto; 
        isolation: isolate;
        
        /* Remove negative margins */
        margin-top: 0;
        margin-bottom: 0;
        
        @media (min-width: 1800px) {
            padding: 10rem 2rem 8rem;
        }

        @media (max-width: 768px) {
            padding: 6rem 1rem 4rem;
            justify-content: flex-start;
            z-index: 100; /* Higher z-index on mobile */
            transform-style: initial; /* Remove 3D on mobile */
            perspective: none; /* Remove perspective on mobile */
        }
        
        @media (max-width: 480px) {
            padding: 5rem 0.75rem 3rem;
        }
        `;

    // Celestial background wrapper
    const CelestialWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.4; // Reduce from 0.3 to 0.2 for better blending
    z-index: -20;
    pointer-events: none;

    @media (max-width: 768px) {
        display: none; /* Hide completely on mobile */
    }
    `;

    
    

    // Contact form container
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
    letter-spacing: 0.10em;
    
    @media (min-width: 1800px) {
        max-width: 1400px;
        gap: clamp(4rem, 5vw, 6rem);
    }

    @media (max-width: 992px) {
        grid-template-columns: 1fr;
        gap: clamp(3rem, 6vw, 4rem);
    }
    
    @media (max-width: 480px) {
        gap: 2rem;
    }
    `;
    // Contact header with title and subtitle
    const ContactHeader = styled.div`
    grid-column: 1 / -1;
    text-align: center;
    margin-bottom: clamp(2rem, 4vw, 3rem);
    position: relative;
    
    @media (max-width: 768px) {
        margin-bottom: clamp(1.5rem, 3vw, 2rem);
    }
`;
// Title and subtitle styles properties
interface TitleProps {
    isDarkMode: boolean;
}
// Title component with animation and gradient text
    const Title = styled(motion.h2)<TitleProps>`
        font-family: var(--heading-font);
        font-size: clamp(4rem, 10vw, 6.5rem);
        margin-bottom: clamp(1rem, 2.5vw, 1.2rem);
        margin-top: clamp(3rem, 6vw, 4rem);
        color: ${props => props.theme.isDarkMode 
  ? '#F1F5F9'        // Light gray for dark mode
  : '#FB923C'};       // Orange (Tailwind orange-400) for light mode
    text-shadow: ${props => props.theme.isDarkMode
    ? '0 0 30px rgba(226, 232, 240, 0.3), 0 0 10px rgba(226, 232, 240, 0.2)'
    : '0 0 12px rgba(251, 146, 60, 0.25), 0 0 20px rgba(253, 186, 116, 0.2)'};

        position: relative;
        display: inline-block;
        font-weight: 300;
        letter-spacing: 0.25em;
        line-height: 1.1;

        &::after {
            content: '';
            position: absolute;
            bottom: clamp(-8px, -1.5vw, -10px);
            left: 50%;
            transform: translateX(-50%);
            width: clamp(80px, 15vw, 100px);
            height: 3px;
            background: ${props => props.theme.isDarkMode ?
            'linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0.2))' :
            'linear-gradient(90deg, rgba(255, 217, 102, 0.2), rgba(212, 108, 22, 0.3), rgba(255, 217, 102, 0.2))'};
    }
        
        @media (max-width: 768px) {
            margin-top: clamp(2rem, 4vw, 3rem);
        }
    `;

    // Subtitle component with animation and text properties
    const Subtitle = styled(motion.p)`
    font-size: clamp(1rem, 2.5vw, 1.3rem);
    color: ${props => props.theme.isDarkMode ? `${props.theme.text}cc` : '#1A1A1A'};
    max-width: clamp(300px, 80vw, 700px);
    margin: clamp(1rem, 2.5vw, 1.5rem) auto 0;
    line-height: 1.6;
    font-family: var(--body-font);
    font-weight: 400;
    letter-spacing: 0.10em;
    opacity: 0.85;
    
    @media (max-width: 768px) {
        text-align: center;
        max-width: 90%;
    }
`;

// Contact information container
    const ContactInfo = styled(motion.div)`
    display: flex;
    flex-direction: column;
    gap: clamp(1.2rem, 2.5vw, 1.4rem);
    padding: clamp(1.2rem, 2.5vw, 1.6rem);
    background: ${props => props.theme.isDarkMode
        ? 'linear-gradient(135deg, rgba(10, 15, 26, 0.7), rgba(30, 41, 59, 0.6))'
        : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.7))'};
        
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: clamp(16px, 3vw, 24px);
    position: relative;
    overflow: hidden;
    box-shadow: ${props => props.theme.isDarkMode
        ? '0 8px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(147, 197, 253, 0.3)'
        : '0 8px 25px rgba(251, 146, 60, 0.3), 0 0 20px rgba(253, 186, 116, 0.2)'};
    animation: ${floatAnimation} 8s ease-in-out infinite;
    transform-style: preserve-3d;
    transform: perspective(1000px) rotateX(2deg);
    
    @media (min-width: 1800px) {
        padding: clamp(2rem, 2.5vw, 3rem);
        gap: 2rem;
    }
    
    @media (max-width: 992px) {
        order: 2;
        transform: none;
        animation: none;
    }
    
    @media (max-width: 768px) {
        padding: 1.25rem;
        gap: 1.25rem;
        border-radius: 16px;
    }
    
    @media (max-width: 480px) {
        padding: 1rem;
        gap: 1rem;
    }
    `;

// Info glass effect
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

    // Contact information item with animation
    const ContactInfoItem = styled(motion.div)`
    display: flex;
    align-items: center;
    gap: clamp(1.5rem, 3vw, 1.8rem);
    padding: clamp(1rem, 2vw, 1.5rem);
    background: ${props => props.theme.isDarkMode 
    ? 'rgba(59, 130, 246, 0.1)'  // Blue in dark mode
    : 'rgba(253, 186, 116, 0.2)' // Orange in light mode
    };
    border-radius: clamp(12px, 2.5vw, 16px);
    transition: all 0.4s ease;
    border: 1px solid ${props => props.theme.isDarkMode ? 
        'rgba(59, 130, 246, 0.2)' : 
        'rgba(251, 146, 60, 0.2)'};
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
            'rgba(147, 197, 253, 0.5)' : 
            'rgba(251, 146, 60, 0.4)'};
        border-color: ${props => props.theme.isDarkMode 
        ? 'rgba(147, 197, 253, 0.5)' 
        : 'rgba(251, 146, 60, 0.4)'};
        box-shadow: ${props => props.theme.isDarkMode
            ? '0 8px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(147, 197, 253, 0.3)'
            : '0 8px 25px rgba(251, 146, 60, 0.3), 0 0 20px rgba(253, 186, 116, 0.2)'};
        color: ${props => props.theme.accent};

        
        svg {
            transform: scale(1.1);
        }
    }

    svg {
        width: clamp(28px, 5vw, 32px);
        height: clamp(28px, 5vw, 32px);
        transition: all 0.4s ease;
        flex-shrink: 0;
    }
    
    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
        padding: 1.25rem;
    }
    
    @media (max-width: 480px) {
        padding: 1rem;
    }
`;
    // Contact information content with text properties
    const ContactInfoContent = styled.div`
    h3 {
        font-size: clamp(1.1rem, 2.2vw, 1.2rem);
        margin-bottom: clamp(0.6rem, 1.5vw, 0.8rem);
        color: ${props => props.theme.text};
        font-weight: 500;
        letter-spacing: 0.25em;
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
            position: relative;
            z-index: 2;
            pointer-events: auto;
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
// Social links container
    const SocialLinks = styled(motion.div)`
        display: flex;
        gap: clamp(1rem, 2.5vw, 1.2rem);
        margin-top: clamp(0.6rem, 1.5vw, 0.8rem);
        justify-content: center;
        flex-wrap: wrap;
    `;
    // Social link item with animation
    const SocialLink = styled(motion.a)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: clamp(45px, 8vw, 50px);
    height: clamp(45px, 8vw, 50px);
    border-radius: 50%;
    color: ${props => props.theme.text};
    transition: all 0.4s ease;
    background: ${props => props.theme.isDarkMode 
        ? 'rgba(40, 40, 50, 0.5)' 
        : 'rgba(253, 186, 116, 0.2)'};
    box-shadow: ${props => props.theme.isDarkMode
        ? '0 4px 15px rgba(59, 130, 246, 0.3), 0 0 10px rgba(147, 197, 253, 0.2)'
        : '0 4px 15px rgba(251, 146, 60, 0.3), 0 0 10px rgba(253, 186, 116, 0.2)'};
    position: relative;
    overflow: hidden;
    z-index: 1;
    
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: ${props => props.theme.isDarkMode 
    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), transparent)' 
    : 'linear-gradient(135deg, rgba(253, 186, 116, 0.15), transparent)'};
        z-index: -1;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    &:hover {
        background: ${props => props.theme.isDarkMode 
            ? 'rgba(59, 130, 246, 0.2)' 
            : 'rgba(253, 186, 116, 0.2)'};
        color: ${props => props.theme.isDarkMode 
            ? '#3b82f6' 
            : '#fb923c'};
        transform: translateY(-5px);
        box-shadow: ${props => props.theme.isDarkMode
            ? '0 8px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(147, 197, 253, 0.3)'
            : '0 8px 25px rgba(251, 146, 60, 0.3), 0 0 20px rgba(253, 186, 116, 0.2)'};
        
        
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
    // Contact form wrapper with animation
    const ContactFormWrapper = styled(motion.div)`
    position: relative;
    transform-style: preserve-3d;
    perspective: 1000px;
    width: 100%;

    @media (max-width: 992px) {
        order: 1;
    }
    `;

// Contact form with animation and glass effect
    const ContactForm = styled(motion.form)`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: clamp(1.2rem, 2.5vw, 1.4rem);
    padding: clamp(1.4rem, 2.5vw, 2rem);
    background: ${props => props.theme.isDarkMode ? 
        'linear-gradient(135deg, rgba(10, 15, 26, 0.7), rgba(30, 41, 59, 0.6))' : 
        'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))'};
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: clamp(16px, 3vw, 24px);
    overflow: hidden;
    z-index: 20;
    box-shadow: ${props => props.theme.isDarkMode
        ? '0 8px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(147, 197, 253, 0.3)'
        : '0 8px 25px rgba(251, 146, 60, 0.3), 0 0 20px rgba(253, 186, 116, 0.2)'};
        
    transform-style: preserve-3d;
    isolation: isolate; 
    
    @media (min-width: 1800px) {
        padding: clamp(2rem, 2.5vw, 3rem);
        gap: 2rem;
    }
    
    @media (max-width: 768px) {
        padding: 1.5rem;
        gap: 1.25rem;
        z-index: 200;
        isolation: isolate;
        position: relative;
        transform: none !important;
    }
    
    @media (max-width: 480px) {
        padding: 1.25rem;
        gap: 1rem;
        border-radius: 16px;
    }
    `;

// Form glass effect
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
// Form group container
    const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: clamp(0.6rem, 1.5vw, 0.8rem);
    position: relative;
`;
// Form label with icon
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

    // Form input and textarea styles
    const inputStyles = css`
    padding: clamp(0.8rem, 2vw, 1rem);
    border-radius: clamp(10px, 2vw, 12px);
    font-family: var(--body-font);  
    background: ${props => props.theme.isDarkMode ? 
        'rgba(30, 30, 40, 0.3)' : 
        'rgba(255, 255, 255, 0.9)'};
    border: 1px solid ${props => props.theme.isDarkMode ? 
        'rgba(59, 130, 246, 0.2)' : 
        'rgba(251, 146, 60, 0.2)'};
    // Better text contrast in light mode
    color: ${props => props.theme.isDarkMode ? 
        props.theme.text : 
        '#1e293b'};
    font-size: clamp(0.9rem, 2vw, 1rem);
    transition: all 0.3s ease;
    box-shadow: ${props => props.theme.isDarkMode
        ? '0 4px 15px rgba(59, 130, 246, 0.2), 0 0 10px rgba(147, 197, 253, 0.1)'
        : '0 4px 15px rgba(251, 146, 60, 0.2), 0 0 10px rgba(253, 186, 116, 0.1)'};
    width: 100%;
    letter-spacing: 0.15em;
    
    &:focus {
        outline: none;
        border-color: ${props => props.theme.accent};
        border-color: ${props => props.theme.isDarkMode ? 
            props.theme.accent : 
            '#3b82f6'};
        background: ${props => props.theme.isDarkMode ? 
            'rgba(35, 35, 45, 0.4)' : 
            'rgba(255, 255, 255, 1)'};
    }
    
    &::placeholder {
        color: ${props => props.theme.isDarkMode ? 
            `${props.theme.text}99` : 
            '#64748b'};
    }
    
    @media (max-width: 480px) {
        padding: 0.8rem;
    }
`;
// Form input and textarea components
    const FormInput = styled.input`
    ${inputStyles}
    &:-webkit-autofill {
    box-shadow: 0 0 0px 1000px ${props => props.theme.isDarkMode ? 'rgba(30, 30, 40, 0.3)' : 'rgba(255, 255, 255, 0.02)'} inset !important;
    -webkit-text-fill-color: ${props => props.theme.text} !important;
    font-family: var(--body-font);
    transition: background-color 5000s ease-in-out 0s;
    position: relative;
    z-index: 5;
    }

    @media (max-width: 768px) {
        font-size: 16px; // Prevent zoom on iOS
        z-index: 50;
        isolation: isolate;
        touch-action: manipulation;
        
        // Fix for iOS safari
        -webkit-appearance: none;
        border-radius: 12px;
    }
    
    &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px ${props => props.theme.isDarkMode ? 'rgba(30, 30, 40, 0.3)' : 'rgba(255, 255, 255, 0.02)'} inset !important;
        -webkit-text-fill-color: ${props => props.theme.text} !important;
        font-family: var(--body-font);
        transition: background-color 5000s ease-in-out 0s;
    }
    `;

// Form textarea with animation
    const FormTextarea = styled.textarea`
    ${inputStyles}
    min-height: 180px;
    resize: vertical;
    font-family: var(--body-font);
    &:-webkit-autofill {
    box-shadow: ${props => props.theme.isDarkMode
                ? '0 8px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(147, 197, 253, 0.3)'
                : '0 8px 25px rgba(251, 146, 60, 0.3), 0 0 20px rgba(253, 186, 116, 0.2)'};
    -webkit-text-fill-color: ${props => props.theme.text} !important;
    transition: background-color 5000s ease-in-out 0s;
    z-index: 5;
    }

    @media (max-width: 768px) {
        min-height: 150px;
        font-size: 16px; // Prevent zoom on iOS
        z-index: 50;
        isolation: isolate;
        touch-action: manipulation;
        
        // Fix for iOS safari
        -webkit-appearance: none;
        border-radius: 12px;
    }

    &:-webkit-autofill {
        box-shadow: ${props => props.theme.isDarkMode
            ? '0 8px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(147, 197, 253, 0.3)'
            : '0 8px 25px rgba(251, 146, 60, 0.3), 0 0 20px rgba(253, 186, 116, 0.2)'};
        -webkit-text-fill-color: ${props => props.theme.text} !important;
        transition: background-color 5000s ease-in-out 0s;
    }
    `;

    // Submit button with animation
    const SubmitButton = styled(motion.button)`
    position: relative;
    z-index: 300; /* Very high z-index */
    padding: clamp(0.7rem, 1.5vw, 0.9rem) clamp(1.8rem, 3vw, 2.8rem);
    background-color: ${props => props.theme.isDarkMode 
        ? 'rgba(59, 130, 246, 0.2)' 
        : 'rgba(251, 146, 60, 0.2)'};
    border: 1px solid ${props => props.theme.isDarkMode 
        ? 'rgba(59, 130, 246, 0.4)' 
        : 'rgba(251, 146, 60, 0.4)'};
    color: ${props => props.theme.isDarkMode 
        ? '#3B82F6' 
        : '#FB923C'};
    border-radius: 50px;
    font-size: clamp(0.9rem, 1.8vw, 1.1rem);
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: ${props => props.theme.isDarkMode
        ? '0 8px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(147, 197, 253, 0.3)'
        : '0 8px 25px rgba(251, 146, 60, 0.3), 0 0 20px rgba(253, 186, 116, 0.2)'};
    overflow: hidden;
    margin-top: clamp(0.8rem, 2vw, 1rem);
    letter-spacing: 0.25em;
    backdrop-filter: blur(4px);
    white-space: nowrap;
    pointer-events: auto !important;
    isolation: isolate;
    
    /* Mobile-specific fixes */
    @media (max-width: 768px) {
        padding: 1rem 2rem;
        font-size: 1rem;
        min-height: 50px;
        z-index: 500; /* Extremely high z-index on mobile */
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        
        /* Ensure button is always clickable */
        &:before {
            content: '';
            position: absolute;
            inset: -10px;
            z-index: -1;
            pointer-events: auto;
        }
        
        /* Remove any potential blockers */
        transform: translateZ(100px) !important;
    }
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transform: translateX(-100%);
        transition: transform 0.5s ease;
    }

    &:hover {
        color: white;
        transform: translateY(-5px);
        background-color: ${props => props.theme.isDarkMode 
            ? 'rgba(59, 130, 246, 0.3)' 
            : 'rgba(251, 146, 60, 0.3)'};
        box-shadow: ${props => props.theme.isDarkMode
            ? '0 8px 25px rgba(59, 130, 246, 0.6), 0 0 20px rgba(147, 197, 253, 0.5)'
            : '0 8px 25px rgba(251, 146, 60, 0.5), 0 0 20px rgba(253, 186, 116, 0.4)'};
        
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
        background-color: ${props => props.theme.isDarkMode 
            ? 'rgba(59, 130, 246, 0.05)' 
            : 'rgba(59, 130, 246, 0.05)'};
    }
    
    @media (max-width: 480px) {
        padding: 0.7rem 1.5rem;
        font-size: 0.9rem;
    }
`;

// Form feedback messages for success and error
    const FormFeedback = styled(motion.div)`
    padding: 1.2rem;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    `;

    // Form success message with animation
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

    // Form error message with animation
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

    // Floating shapes with animation
    const FloatingShapeWrapper = styled(motion.div)`
    position: absolute;
    z-index: -30; /* Much lower z-index */
    width: clamp(100px, 20vw, 150px);
    height: clamp(100px, 20vw, 150px);
    opacity: 0.6;
    border-radius: 50%;
    overflow: hidden;
    pointer-events: none; /* Add this to prevent interference */
    
    background: ${props => props.theme.isDarkMode 
        ? 'radial-gradient(circle, rgba(255,217,102,0.1) 0%, rgba(255,217,102,0.05) 50%, transparent 80%)' 
        : 'radial-gradient(circle, rgba(255,217,102,0.2) 0%, rgba(255,217,102,0.1) 50%, transparent 80%)'};

    box-shadow: ${props => props.theme.isDarkMode
        ? '0 8px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(147, 197, 253, 0.3)'
        : '0 8px 25px rgba(251, 146, 60, 0.3), 0 0 20px rgba(253, 186, 116, 0.2)'};
        
    &.shape1 {
        top: 10%;
        right: 10%;
    }

    &.shape2 {
        bottom: 15%;
        left: 5%;
    }
    
    /* Hide on mobile to prevent any interference */
    @media (max-width: 992px) {
        display: none;
        pointer-events: none;
    }

    @media (max-width: 768px) {
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

    const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l11.733 16h4.267l-11.733-16z"></path>
        <path d="M4 20l6.768-6.768"></path>
        <path d="M20 4l-7.768 7.768"></path>
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

    

    // 3D Geometric Shape Component
    const GeometricShape: React.FC<{ position: [number, number, number]; rotation: [number, number, number]; color: string; size?: number }> = ({ 
        position, 
        rotation, 
        color, 
        size = 1 
        }) => {
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
                <sphereGeometry args={[size, 32, 32]} /> {/* Changed to sphere geometry */}
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

// variants for the individual items
    const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    },
    };

    // Form variants for the 3D effect
    const formVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -10 },
    visible: {
        opacity: 1,
        y: 0,
        rotateX: -2,
        transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }
    }
    };

// variants for the info section
    const infoVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 10 },
    visible: {
        opacity: 1,
        y: 0,
        rotateX: 2,
        transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }
    }
    };

    // Button variants for hover and tap effects
    const buttonVariants = {
    initial: {
        y: 0,
    },
    hover: { 
        y: -5,
        transition: { duration: 0.3 }
    },
    tap: { 
        y: -2,
        scale: 0.98,
        transition: { duration: 0.1 }
    }
};

// Styled components for the contact section
    const CenteredMotionDiv = styled(motion.div)`
    text-align: center;
    margin-top: 2rem;
    `;

// SEction container with background and animation
    const SectionHeading = styled.h3`
    margin-bottom: 1rem;
    color: ${props => props.theme.isDarkMode
                ? '0 8px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(147, 197, 253, 0.3)'
                : '0 8px 25px rgba(251, 146, 60, 0.3), 0 0 20px rgba(253, 186, 116, 0.2)'};
    font-size: 1.4rem;
    font-weight: 600;
    letter-spacing: 0.10em;
    margin-bottom: 2.5rem;

    `;

// Flex container for the contact section
    const FlexCenter = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    
    `;

    // Bottom fade effect
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
    
// Styled component for the contact section
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
        
    });
    
    const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
    

    
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
        console.log("Submitted:", formData);
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
        
        </CelestialWrapper>
        
    
        
        {/* Floating 3D shapes */}
    <FloatingShapeWrapper className="shape1" style={{ y: y1 }}>
        <Canvas>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <GeometricShape 
                position={[0, 0, 0]} 
                rotation={[0.5, 0.5, 0]} 
                color={isDarkMode ? "#94A3B8" : "#FFD966"}
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
                    color={isDarkMode ? "#64748B" : "#FF9800"}
                    size={1.2}
                />
                <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} autoRotate autoRotateSpeed={-1} />
            </Canvas>
        </FloatingShapeWrapper>
            
        <ContactContent ref={containerRef}>
            <ContactHeader>
            <Title 
                isDarkMode={isDarkMode}
                variants={itemVariants}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
            say hello()
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
                <p>Remote</p>
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
        <h3>Phone</h3>
        <a href="tel:+36301132511">
            +36 (30) 113 25 11<br />
            +1 (510) 604 0802
        </a>
    </ContactInfoContent>
</ContactInfoItem>
            
    <CenteredMotionDiv variants={itemVariants}>
    <SectionHeading>interface.connect();</SectionHeading>

    

                <SocialLinks>
                <motion.div
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <SocialLink
                    href="https://github.com/andreaToreki"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub profile"
                    >
                    <GitHubIcon />
                    </SocialLink>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <SocialLink
                    href="https://linkedin.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Linkedin profile"
                    >
                    <LinkedInIcon />
                    </SocialLink>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <SocialLink
                    href="https://x.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X profile"
                    >
                    <XIcon />
                    </SocialLink>
                </motion.div>
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
                    >
                    <FlexCenter>
                        {isSubmitting ? 'sendingMessage()...' : 'sendMessage()'}
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