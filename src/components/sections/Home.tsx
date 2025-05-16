// src/components/sections/Home.tsx
import React, { useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FuturisticGradientText from '../ui/FuturisticGradientText';
import AnimatedCelestialBody from '../effects/AnimatedCelestialBody';

interface HomeProps {
  isDarkMode: boolean;
}

const pulseGlow = keyframes`
  0% { opacity: 0.5; box-shadow: 0 0 30px 2px rgba(255, 217, 102, 0.6), 0 0 70px 10px rgba(255, 255, 255, 0.15); }
  50% { opacity: 0.7; box-shadow: 0 0 40px 5px rgba(255, 255, 255, 0.5), 0 0 100px 15px rgba(255, 217, 102, 0.6); }
  100% { opacity: 0.5; box-shadow: 0 0 30px 2px rgba(255, 255, 255, 0.3), 0 0 70px 10px rgba(255, 217, 102, 0.6); }
`;

const pulseSun = keyframes`
  0% { opacity: 0.75; box-shadow: 0 0 40px 15px rgba(250, 226, 156, 0.4), 0 0 80px 30px rgba(255, 236, 179, 0.2); }
  50% { opacity: 0.85; box-shadow: 0 0 50px 20px rgba(243, 222, 161, 0.5), 0 0 90px 40px rgba(255, 236, 179, 0.3); }
  100% { opacity: 0.75; box-shadow: 0 0 40px 15px rgba(255, 236, 179, 0.4), 0 0 80px 30px rgba(255, 236, 179, 0.2); }
`;

const StarryCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.6;
`;

const HomeContainer = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  overflow: hidden;
  z-index: 5;
  perspective: 1000px;
  transform-style: preserve-3d;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(10, 10, 30, 0.5));
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 25px 25px, rgba(224, 212, 212, 0.03) 2%, transparent 0%), 
      radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.03) 2%, transparent 0%);
    background-size: 100px 100px;
    opacity: 0.5;
    z-index: 0;
  }
`;

const FuturisticLine = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  z-index: 1;
  
  &.top {
    top: 15%;
    background: linear-gradient(to right, transparent, rgba(255, 217, 102, 0.3), transparent);
  }
  
  &.bottom {
    bottom: 15%;
    background: linear-gradient(to right, transparent, rgba(250, 248, 242, 0.3), transparent);
  }
`;

const GlowOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  
  &.orb1 {
    top: 25%;
    left: 15%;
    width: 350px;
    height: 350px;
    background-color: rgba(255, 217, 102, 0.15);
    animation: ${pulseGlow} 10s ease-in-out infinite;
    opacity: 0.6;
  }
  
  &.orb2 {
    bottom: 15%;
    right: 10%;
    width: 450px;
    height: 450px;
    background-color: rgba(250, 248, 242, 0.1);
    animation: ${pulseSun} 12s ease-in-out infinite alternate;
    opacity: 0.5;
  }
`;

const ContentContainer = styled(motion.div)`
  max-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  z-index: 10;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const CelestialBodyContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const Subtitle = styled(motion.h2)`
  font-size: clamp(0.9rem, 2.5vw, 1.5rem);
  font-weight: 400;
  max-width: min(700px, 90%);
  margin: 0 auto 2rem;
  color: ${props => `${props.theme.text}CC`};
  line-height: 1.6;

  @media (max-width: 768px) {
    margin: 0 auto 1.5rem;
    line-height: 1.4;
  }
`;

const CTAButton = styled(motion.button)`
  padding: clamp(0.6rem, 1.5vw, 0.8rem) clamp(1.5rem, 3vw, 2.5rem);
  font-size: clamp(0.8rem, 1.2vw, 1rem);
  font-weight: 500;
  letter-spacing: 0.5px;
  color: ${props => props.theme.text};
  background-color: transparent;
  border: 1px solid ${props => `${props.theme.accent}60`};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.theme.accent};
    background-color: ${props => `${props.theme.accent}20`};
  }
`;

// Starry background effect component
const HomeStarryEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const stars: { x: number; y: number; radius: number; opacity: number; speed: number }[] = [];
    
    const createStars = () => {
      const starCount = Math.floor(canvas.width * canvas.height / 2000);
      
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.05 + 0.02
        });
      }
    };
    
    createStars();
    
    let animationFrameId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        
        star.y += star.speed;
        
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <StarryCanvas ref={canvasRef} />;
};

const Home: React.FC<HomeProps> = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/projects');
  };

  return (
    <HomeContainer>
      {/* Add starry effect */}
      <HomeStarryEffect />
      
      {/* Add glowing orbs and lines */}
      <FuturisticLine className="top" />
      <FuturisticLine className="bottom" />
      <GlowOrb className="orb1" />
      <GlowOrb className="orb2" />
    
      <CelestialBodyContainer>
        <AnimatedCelestialBody isDarkMode={isDarkMode} />
      </CelestialBodyContainer>

      {!isDarkMode && (
        <AnimatedCelestialBody isDarkMode={isDarkMode} />
      )}

      <ContentContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <FuturisticGradientText
          text="Andrea Toreki"
          delay={0.2}
          fontSize="clamp(3rem, 8vw, 7rem)"
          fontWeight="700"
          textAlign="center"
          gradient="custom"
          customGradient={
            isDarkMode
              ? "linear-gradient(90deg, rgb(190, 176, 110), rgb(190, 183, 111), rgb(34, 33, 31))"
              : "linear-gradient(90deg, rgb(252, 235, 189), rgb(232, 216, 186), rgb(30, 30, 30))"}
        />

        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          UX/UI-focused Full-Stack Developer creating exceptional digital experiences
        </Subtitle>

        <CTAButton
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExploreClick}
        >
          Explore My Work
        </CTAButton>
      </ContentContainer>
    </HomeContainer>
  );
};

export default Home;