import { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useAnimation, useScroll, useTransform, MotionValue } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AnimatedCelestialBody from '../effects/AnimatedCelestialBody';
import type { MotionStyle } from 'framer-motion';


interface Theme {
    background: string;
    text: string;
    surface: string;
    accent: string;
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

const float = keyframes`
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

const AboutContainer = styled(motion.section)<{ theme: Theme }>`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 22rem 2rem 8rem; /* Increased top padding */
    position: relative;
    overflow: hidden;
    background-color: ${(props: { theme: Theme }) => props.theme.background};
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
            radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.03) 2%, transparent 0%), 
            radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.03) 2%, transparent 0%);
        background-size: 100px 100px;
        opacity: 0.5;
        z-index: 0;
    }
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

const AboutContent = styled.div`
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    gap: 8rem;
    position: relative;
    z-index: 2;
    
    @media (max-width: 992px) {
        flex-direction: column;
        gap: 4rem;
    }
`;

const AboutImageContainer = styled(motion.div)`
    flex: 1;
    position: relative;
    
    @media (max-width: 992px) {
        order: 1;
        margin: 0 auto;
        max-width: 400px;
    }
`;

const AboutImage = styled(motion.div)`
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    width: 100%;
    height: 500px;
    transform-style: preserve-3d;
    transition: transform 0.5s ease;
    background: linear-gradient(
        135deg,
        rgba(255, 217, 102, 0.1),
        transparent 50%,
        rgba(250, 248, 242, 0.1)
    );
    
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border: 1px solid rgba(255, 217, 102, 0.2);
        border-radius: 16px;
        z-index: 3;
        pointer-events: none;
    }
    
    &::after {
        content: '';
        position: absolute;
        inset: -1px;
        background: linear-gradient(
            90deg, 
            rgba(255, 217, 102, 0.1),
            rgba(250, 248, 242, 0.1)
        );
        border-radius: 16px;
        z-index: 1;
        pointer-events: none;
        mix-blend-mode: overlay;
    }
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: relative;
        z-index: 2;
        transition: transform 0.5s ease;
        mix-blend-mode: luminosity;
        opacity: 0.9;
    }
`;

const ImageBorderEffect = styled.div`
    position: absolute;
    z-index: 0;
    
    &.border1 {
        top: -10px;
        right: -10px;
        width: 100px;
        height: 100px;
        border-top: 1px solid rgba(255, 217, 102, 0.4);
        border-right: 1px solid rgba(255, 217, 102, 0.4);
        border-top-right-radius: 8px;
    }
    
    &.border2 {
        bottom: -10px;
        left: -10px;
        width: 100px;
        height: 100px;
        border-bottom: 1px solid rgba(250, 248, 242, 0.4);
        border-left: 1px solid rgba(250, 248, 242, 0.4);
        border-bottom-left-radius: 8px;
    }
`;

const GlowEffect = styled(motion.div)`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(
        135deg,
        rgba(255, 217, 102, 0.2),
        transparent 50%,
        rgba(250, 248, 242, 0.2)
    );
    opacity: 0.5;
    z-index: 2;
    pointer-events: none;
`;

const FloatingParticle = styled(motion.div)<{ theme: Theme }>`
    position: absolute;
    border-radius: 50%;
    background-color: ${(props: { theme: Theme }) => props.theme.accent};
    opacity: 0.4;
    filter: blur(1px);
    z-index: 1;
    animation: ${float} 4s ease-in-out infinite;
`;

const CelestialWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.4;
    z-index: 1;
`;

const floatingSkillVariants: Variants = {
    hidden: { 
        opacity: 0,
        y: 20,
        scale: 0.95
    },
    visible: (i: number) => ({
        opacity: 1,
        y: [0, -5, 0],
        scale: 1,
        transition: { 
            duration: 2 + Math.random() * 3,
            delay: i * 0.1,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: "easeInOut"
        }
    })
};

const AboutInfo = styled(motion.div)`
    flex: 1;
    
    @media (max-width: 992px) {
        order: 2;
    }
`;

const TitleAccent = styled(motion.div)`
    width: 40px;
    height: 3px;
    background: linear-gradient(
        90deg,
        rgba(255, 217, 102, 0.8),
        rgba(250, 248, 242, 0.8)
    );
    margin-bottom: 1.5rem;
`;

const Title = styled(motion.h2)`
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.text};
    font-weight: 600;
    letter-spacing: -0.5px;
`;

const Subtitle = styled(motion.h3)`
    font-size: 1.2rem;
    background: linear-gradient(
        90deg,
        rgb(255, 217, 102),
        rgb(250, 248, 242)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    margin-bottom: 2rem;
    font-weight: 500;
    letter-spacing: 0.5px;
`;

const AboutText = styled(motion.p)`
    font-size: 1rem;
    line-height: 1.8;
    color: ${props => props.theme.text}cc;
    margin-bottom: 1.5rem;
`;

const SkillsContainer = styled(motion.div)`
    margin-top: 3rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const SkillsTitle = styled(motion.h3)`
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    color: ${props => props.theme.text};
    font-weight: 500;
    letter-spacing: 0.5px;
`;

const SkillsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1.5rem;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    perspective: 1000px;
    
    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
    
    @media (max-width: 480px) {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
`;

const SkillItem = styled(motion.div)`
    display: flex;
    flex-direction: column;
    padding: 1.2rem;
    background-color: ${props => props.theme.surface}80;
    backdrop-filter: blur(4px);
    border-radius: 16px;
    border: 1px solid rgba(255, 217, 102, 0.1);
    transition: all 0.3s ease;
    min-width: 0;
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,217,102,0.1) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 217, 102, 0.3);
        background-color: ${props => props.theme.surface}90;
        
        &::before {
            opacity: 0.6;
            animation: ${float} 6s infinite linear;
        }
    }
`;

const SkillTop = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 0.8rem;
`;

const SkillIcon = styled.div`
    width: 24px;
    height: 24px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const SkillName = styled.span`
    font-size: 0.95rem;
    font-weight: 500;
    color: ${props => props.theme.text};
`;

const SkillBar = styled(motion.div)`
    width: 100%;
    height: 4px;
    background-color: ${props => props.theme.background}80;
    border-radius: 2px;
    overflow: hidden;
`;

const SkillProgress = styled(motion.div)<{ $level: number }>`
    height: 100%;
    width: ${props => props.$level * 10}%;
    background: linear-gradient(90deg, rgba(255, 217, 102, 0.7), rgba(250, 248, 242, 0.7));
    border-radius: 2px;
`;

const DownloadResumeButton = styled(motion.a)`
    display: inline-flex;
    align-items: center;
    padding: 0.9rem 2rem;
    background: linear-gradient(
        90deg,
        rgba(255, 217, 102, 0.2),
        rgba(250, 248, 242, 0.2)
    );
    color: white;
    border-radius: 16px;
    font-weight: 500;
    margin-top: 3rem;
    box-shadow: 0 8px 20px rgba(255, 217, 102, 0.2);
    transition: all 0.3s ease;
    letter-spacing: 0.5px;
    border: 1px solid rgba(255, 217, 102, 0.4);
    
    svg {
        margin-right: 0.8rem;
    }
    
    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 30px rgba(255, 217, 102, 0.3);
        background: linear-gradient(
            90deg,
            rgba(255, 217, 102, 0.3),
            rgba(250, 248, 242, 0.3)
        );
    }
`;

const TechBracket = styled.div`
    position: absolute;
    font-family: monospace;
    opacity: 0.3;
    font-size: 1.2rem;
    color: rgba(255, 217, 102, 0.8);
    
    &.left {
        left: -1.5rem;
        top: 8rem;
    }
    
    &.right {
        right: -1.5rem;
        bottom: 8rem;
    }
`;

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

const slideInVariants: Variants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { 
            duration: 0.8, 
            ease: [0.25, 0.1, 0.25, 1] 
        }
    },
};

const slideInFromRightVariants: Variants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { 
            duration: 0.8, 
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.2 
        }
    },
};

interface FloatPosition {
    x: number;
    y: number;
}


const floatVariants: Variants = {
    initial: ({ x, y }: FloatPosition) => ({
        x,
        y,
        opacity: 0.3 + Math.random() * 0.3,
    }),
    animate: ({ x, y }: FloatPosition) => ({
        x: x + Math.random() * 15 - 7.5,
        y: y + Math.random() * 15 - 7.5,
        opacity: [0.2, 0.4, 0.2],
        transition: {
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            repeatType: "mirror",
        }
    })
};

const progressVariants: Variants = {
    hidden: { width: 0 },
    visible: (level: number) => ({
        width: `${level * 10}%`,
        transition: { duration: 1.2, ease: "easeOut", delay: 0.3 }
    })
};

const glowVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: [0.2, 0.5, 0.2], 
        transition: { 
            duration: 5,
            repeat: Infinity,
            repeatType: "mirror" as const
        } 
    }
};

const downloadIconSvg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

const skills = [
    { name: 'HTML', icon: '⚡', level: 9 },
    { name: 'CSS', icon: '💫', level: 9 },
    { name: 'JavaScript', icon: '✨', level: 8 },
    { name: 'TypeScript', icon: '🔷', level: 8 },
    { name: 'React', icon: '⚛️', level: 9 },
    { name: 'Node.js', icon: '📡', level: 7 },
    { name: 'React Native', icon: '📱', level: 7 },
    { name: 'MongoDB', icon: '🔮', level: 6 },
    { name: 'UI/UX Design', icon: '🎨', level: 9 },
    { name: 'Figma', icon: '🔺', level: 8 },
    { name: 'Git', icon: '📊', level: 8 },
    { name: 'REST APIs', icon: '🔗', level: 8 },
];

const particles = Array.from({ length: 20 }, () => ({
    x: Math.random() * 500 - 250,
    y: Math.random() * 500 - 250,
    size: Math.random() * 6 + 3
}));

const AboutStarryEffect: React.FC = () => {
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

const About: React.FC = () => {
    const { scrollYProgress } = useScroll();
    const [ref, inView] = useInView({
        triggerOnce: false,
        threshold: 0.1,
    });
    
    const containerRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();
    const imageRef = useRef<HTMLDivElement>(null);
    
    const imageX = useTransform(scrollYProgress, [0, 1], [-100, 0]);
    const contentX = useTransform(scrollYProgress, [0, 1], [100, 0]);
    const opacity: MotionValue<number> = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 1]);
    
    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!imageRef.current) return;
            
            const { clientX, clientY } = e;
            const { left, top, width, height } = imageRef.current.getBoundingClientRect();
            
            const x = (clientX - left) / width - 0.5;
            const y = (clientY - top) / height - 0.5;
            
            imageRef.current.style.transform = `
                perspective(1000px)
                rotateY(${x * 8}deg)
                rotateX(${y * -8}deg)
                translateZ(10px)
            `;
        };
        
        const handleMouseLeave = () => {
            if (!imageRef.current) return;
            imageRef.current.style.transform = `
                perspective(1000px)
                rotateY(0deg)
                rotateX(0deg)
                translateZ(0px)
            `;
        };
        
        const element = imageRef.current;
        if (element) {
            element.addEventListener('mousemove', handleMouseMove);
            element.addEventListener('mouseleave', handleMouseLeave);
        }
        
        return () => {
            if (element) {
                element.removeEventListener('mousemove', handleMouseMove);
                element.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);
    
    return (
        <AboutContainer
            id="about"
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
        >
            <AboutStarryEffect />
            
            <CelestialWrapper>
                <AnimatedCelestialBody isDarkMode={true} />
            </CelestialWrapper>
            
            <FuturisticLine className="top" />
            <FuturisticLine className="bottom" />
            <GlowOrb className="orb1" />
            <GlowOrb className="orb2" />
            
            <AboutContent ref={containerRef}>
                <AboutImageContainer
                    variants={slideInVariants}
                    style={{ 
                        x: imageX,
                        opacity: opacity
                    } as MotionStyle}
                >
                    <AboutImage 
                        ref={imageRef}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        <img 
                            src="/src/assets/images/portrait.webp" 
                            alt="Andrea Toreki" 
                        />
                        <GlowEffect 
                            variants={glowVariants}
                            initial="hidden"
                            animate="visible"
                        />

                        {particles.map((_, i) => (
                            <FloatingParticle
                                key={`particle-${i}`}
                                custom={{
                                    x: Math.random() * 50 - 25,
                                    y: Math.random() * 50 - 25,
                                }}
                                variants={floatVariants}
                                initial="initial"
                                animate="animate"
                                style={{ 
                                    width: '2px',
                                    height: '2px',
                                    backgroundColor: 'inherit', 
                                }}
                            />
                        ))}
                    </AboutImage>
                    
                    <TechBracket className="left">{`<`}</TechBracket>
                    <TechBracket className="right">{`/>`}</TechBracket>
                    <ImageBorderEffect className="border1" />
                    <ImageBorderEffect className="border2" />
                </AboutImageContainer>
                
                <AboutInfo style={{ x: contentX, opacity } as MotionStyle}>
                    <TitleAccent variants={slideInFromRightVariants} />
                    <Title variants={slideInFromRightVariants}>
                        About Me
                    </Title>
                    <Subtitle 
                        initial={{ opacity: 0, y: 15 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        UX/UI-focused Full-Stack Developer
                    </Subtitle>
                    
                    <AboutText 
                        variants={slideInFromRightVariants}
                        initial={{ opacity: 0, y: 15 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        Hello! I'm Andrea, a passionate full-stack developer with a focus on creating beautiful and functional user experiences. I combine my technical expertise with a strong design sensibility to build applications that not only work flawlessly but also delight users.
                    </AboutText>
                    
                    <AboutText 
                        variants={slideInFromRightVariants}
                        initial={{ opacity: 0, y: 15 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        With several years of experience in web and mobile development, I've had the opportunity to work on a diverse range of projects from e-commerce platforms to mobile apps. I'm always eager to learn new technologies and push the boundaries of what's possible in digital experiences.
                    </AboutText>
                    
                    <AboutText 
                        variants={slideInFromRightVariants}
                        initial={{ opacity: 0, y: 15 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                    >
                        When I'm not coding, you can find me exploring design trends, attending tech meetups, or hiking in the great outdoors. I believe in continuous learning and sharing knowledge with the developer community.
                    </AboutText>
                    
                    <SkillsContainer 
                        initial={{ opacity: 0, x: 50 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                    >
                        <SkillsTitle
                            initial={{ opacity: 0, y: 15 }}
                            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                            transition={{ duration: 0.7, delay: 0.7 }}
                        >
                            My Skills
                        </SkillsTitle>
                        <SkillsGrid>
                            {skills.map((skill, index) => (
                                <SkillItem 
                                    key={index}
                                    custom={index}
                                    variants={floatingSkillVariants}
                                    initial="hidden"
                                    animate={inView ? "visible" : "hidden"}
                                    whileHover={{
                                        y: -8,
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    {/* Floating particles */}
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <FloatingParticle
                                            key={`particle-${index}-${i}`}
                                            custom={{
                                                x: Math.random() * 50 - 25,
                                                y: Math.random() * 50 - 25,
                                            }}
                                            variants={floatVariants}
                                            initial="initial"
                                            animate="animate"
                                            style={{ 
                                                width: '2px',
                                                height: '2px',
                                                backgroundColor: 'inherit',
                                            }}
                                        />
                                    ))}
                                    
                                    <SkillTop>
                                        <SkillIcon>{skill.icon}</SkillIcon>
                                        <SkillName>{skill.name}</SkillName>
                                    </SkillTop>
                                    <SkillBar>
                                        <SkillProgress 
                                            $level={skill.level}
                                            initial="hidden"
                                            animate={inView ? "visible" : "hidden"}
                                            variants={progressVariants}
                                            custom={skill.level}
                                        />
                                    </SkillBar>
                                </SkillItem>
                            ))}
                    </SkillsGrid>
                    </SkillsContainer>
                    
                    <DownloadResumeButton 
                        href="/andrea-toreki-resume.pdf" 
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={slideInFromRightVariants}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {downloadIconSvg} Download Resume
                    </DownloadResumeButton>
                </AboutInfo>
            </AboutContent>
        </AboutContainer>
    );
};

export default About;