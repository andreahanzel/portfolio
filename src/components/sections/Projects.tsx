// src/components/sections/Projects.tsx - Updated to match Home page styling

import { useState, useEffect, useRef, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AnimatedProjectTitle from '../ui/AnimatedProjectTitle';
import CelestialTransition from '../effects/CelestialTransition';
import mindfulImage from '../../assets/images/mindful.png';
import handcraftedImage from '../../assets/images/handcrafted.png';
import portfolioImage from '../../assets/images/portfolio.png';
import comingSoon from '../../assets/images/comingsoon.png';



interface ProjectsProps {
    isDarkMode: boolean;
}

interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string[];
    technologies: string[];
    link: string;
    github?: string;
}

const projectsData: Project[] = [
    {
        id: '1',
        title: 'Portfolio Website',
        description: 'An immersive, celestial-themed developer portfolio with smooth scroll-linked animations, dark/light mode, and a futuristic UI built from scratch.',
        image: portfolioImage,
        category: ['Web', 'Frontend'],
        technologies: ['React', 'TypeScript', 'Styled Components', 'Framer Motion'],
        link: '', // No live link yet
        github: 'https://github.com/andreahanzel/portfolio',
    },
    {
        id: '2',
        title: 'Handcrafted Haven',
        description: 'Full-stack marketplace for artisan goods with role-based dashboards, custom seller onboarding, product search, and a glowing dark-themed UI.',
        image: handcraftedImage,
        category: ['Web', 'Fullstack'],
        technologies: ['TypeScript', 'React', 'Next.js', 'Prisma', 'MongoDB'],
        link: 'https://handcraftedhaven-orcin.vercel.app/',
        github: 'https://github.com/andreahanzel/wdd430-teamproject/tree/main/handcraftedhaven',
    },
    {
        id: '3',
        title: 'AI Image Generator',
        description: 'Generate unique images using AI and machine learning.',
        image: comingSoon,
        category: ['Web', 'AI'],
        technologies: ['Python', 'TensorFlow', 'React', 'Flask'],
        link: '#',
    },


    {
        id: '4',
        title: 'E-commerce Dashboard',
        description: 'Admin dashboard for managing products, orders, and customers.',
        image: comingSoon,
        category: ['Web', 'Fullstack'],
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        link: '#',
        github: 'https://github.com/andreahanzel/',
    },

    {
        id: '5',
        title: 'Travel Planner',
        description: 'Plan and organize trips with interactive maps and itineraries.',
        image: comingSoon,
        category: ['Web', 'Fullstack'],
        technologies: ['React', 'Node.js', 'MongoDB', 'Google Maps API'],
        link: '#',
        github: 'https://github.com/andreahanzel/',
    },

    {
        id: '6',
        title: 'Mindful Meal Planner',
        description: 'A personalized meal planning app that generates recipes based on dietary preferences and real-time weather, enhancing healthy eating with mindful choices.',
        image: mindfulImage,
        category: ['Web', 'Frontend'],
        technologies: ['JavaScript', 'HTML/CSS', 'Recipe API'],
        link: 'https://mindful-meal-planner.netlify.app/',
        github: 'https://github.com/andreahanzel/Mindful-Meal-Planner',
    },
    
];

// Glow animations to match Home page
const pulseGlow = keyframes`
  0% { opacity: 0.5; box-shadow: 0 0 30px 2px rgba(255, 217, 102, 0.4), 0 0 70px 10px rgba(255, 255, 255, 0.15); }
  50% { opacity: 0.7; box-shadow: 0 0 40px 5px rgba(255, 255, 255, 0.3), 0 0 100px 15px rgba(255, 217, 102, 0.4); }
  100% { opacity: 0.5; box-shadow: 0 0 30px 2px rgba(255, 255, 255, 0.2), 0 0 70px 10px rgba(255, 217, 102, 0.4); }
`;

const pulseLightGlow = keyframes`
  0% { opacity: 0.75; box-shadow: 0 0 40px 15px rgba(255, 152, 0, 0.2), 0 0 80px 30px rgba(255, 236, 179, 0.1); }
  50% { opacity: 0.85; box-shadow: 0 0 50px 20px rgba(255, 152, 0, 0.3), 0 0 90px 40px rgba(255, 236, 179, 0.2); }
  100% { opacity: 0.75; box-shadow: 0 0 40px 15px rgba(255, 236, 179, 0.2), 0 0 80px 30px rgba(255, 236, 179, 0.1); }
`;

// Updated container with a more visual style
const ProjectsContainer = styled(motion.section)`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: clamp(8rem, 15vw, 12rem) clamp(1rem, 4vw, 2rem) clamp(6rem, 10vw, 8rem);
    position: relative;
    z-index: 2;
    
    @media (max-width: 768px) {
        padding: clamp(6rem, 12vw, 10rem) clamp(1rem, 3vw, 1.5rem) clamp(4rem, 8vw, 6rem);
    }
`;

// Glow orbs similar to Home page
const GlowOrb = styled.div`
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    z-index: 0;
    
    &.orb1 {
        top: 15%;
        right: 15%;
        width: 350px;
        height: 350px;
        background-color: ${props => props.theme.isDarkMode ? 
        'rgba(203, 213, 225, 0.1)' : 
        'rgba(255, 217, 102, 0.1)'};
        animation: ${props => props.theme.isDarkMode ? pulseGlow : pulseLightGlow} 10s ease-in-out infinite;
        opacity: 0.6;
    }
    
    &.orb2 {
        bottom: 15%;
        left: 10%;
        width: 450px;
        height: 450px;
        background-color: ${props => props.theme.isDarkMode ? 
        'rgba(226, 232, 240, 0.1)' : 
        'rgba(250, 248, 242, 0.1)'};
        animation: ${props => props.theme.isDarkMode ? pulseGlow : pulseLightGlow} 12s ease-in-out infinite alternate;
        opacity: 0.5;
    }
`;

// Enhanced header with gradients to match Home page
const ProjectsHeader = styled.div`
    text-align: center;
    margin-bottom: clamp(3rem, 6vw, 6rem);
    margin-top: clamp(-4rem, -8vw, -6rem);
    z-index: 2;
    position: relative;
    
    @media (max-width: 768px) {
        margin-bottom: clamp(2rem, 4vw, 3rem);
        margin-top: clamp(-2rem, -4vw, -3rem);
    }
`;

// Title with gradient styling to match Home

const Subtitle = styled(motion.p)`
    font-size: clamp(1rem, 2.5vw, 1.2rem);
    color: ${props => props.theme.text}cc;
    max-width: clamp(300px, 80vw, 600px);
    margin: 0 auto;
    margin-top: clamp(1rem, 3vw, 2rem);
    line-height: 1.6;
    font-family: var(--body-font);
    letter-spacing: 0.5px;
    
    @media (max-width: 768px) {
        max-width: 90%;
        margin-top: -3rem;
    }
`;

const FilterContainer = styled(motion.div)`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 3rem;
    z-index: 2;
`;

// Updated filter button to match CTA button in Home
const FilterButton = styled(motion.button)<{ $isActive: boolean }>`
    padding: 0.5rem 1.5rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    cursor: pointer;
    color: ${props => props.theme.text};
    background-color: ${props => props.$isActive 
        ? (props.theme.isDarkMode ? 'rgba(226, 232, 240, 0.15)' : 'rgba(255, 152, 0, 0.15)')
        : (props.theme.isDarkMode ? 'rgba(226, 232, 240, 0.08)' : 'rgba(255, 152, 0, 0.05)')};
    backdrop-filter: blur(4px);
    border: 1px solid ${props => props.$isActive
        ? (props.theme.isDarkMode ? props.theme.accent : props.theme.accent)
        : (props.theme.isDarkMode ? `${props.theme.accent}40` : `${props.theme.accent}50`)};
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-3px);
        border-color: ${props => props.theme.accent};
        background-color: ${props => props.theme.isDarkMode 
            ? 'rgba(226, 232, 240, 0.15)' 
            : 'rgba(255, 152, 0, 0.15)'};
        box-shadow: ${props => props.theme.isDarkMode 
            ? '0 10px 20px rgba(0, 0, 0, 0.25), 0 0 15px rgba(226, 232, 240, 0.3)' 
            : '0 10px 20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(255, 152, 0, 0.2)'};
    }
`;

const CarouselContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 100vw;
    height: clamp(500px, 80vh, 620px);
    perspective: 2000px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    overflow-x: hidden;
    
    @media (max-width: 992px) {
        height: clamp(450px, 70vh, 550px);
    }
    
    @media (max-width: 768px) {
        height: clamp(400px, 60vh, 500px);
    }
    
    @media (max-width: 480px) {
        height: clamp(350px, 55vh, 450px);
    }
`;

const Carousel = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    display: flex;
    justify-content: center;
    align-items: center;
`;

// Enhanced card styling to match Home page aesthetics
const ProjectCard3D = styled(motion.div)<{ $isActive: boolean }>`
    position: absolute;
    width: 400px;
    height: 500px;
    background-color: ${props => props.theme.isDarkMode 
        ? 'rgba(15, 23, 42, 0.8)'
        : 'rgba(255, 249, 240, 0.8)'};
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.5s ease;
    margin-top: 1rem;
    cursor: pointer;
    transform-origin: center center;
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(5px);
    border: 1px solid ${props => props.theme.isDarkMode
        ? 'rgba(226, 232, 240, 0.1)'
        : 'rgba(255, 152, 0, 0.1)'};
    
    /* Enhanced glow effect to match the theme */
    box-shadow: ${props => props.$isActive
        ? (props.theme.isDarkMode
            ? '0 15px 35px rgba(255, 255, 255, 0.1), 0 5px 15px rgba(226, 232, 240, 0.05)'
            : '0 15px 35px rgba(255, 152, 0, 0.15), 0 5px 15px rgba(255, 236, 179, 0.1)')
        : (props.theme.isDarkMode
            ? '0 10px 25px rgba(0, 0, 0, 0.3), 0 5px 10px rgba(0, 0, 0, 0.2)'
            : '0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05)')};
            
    ${props => props.$isActive && `
        transform: scale(1.05);
    `}
    
    /* Glass effect */
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: ${props => props.theme.isDarkMode
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))'
            : 'linear-gradient(135deg, rgba(255, 249, 240, 0.7), rgba(255, 241, 224, 0.8))'};
        border-radius: inherit;
        z-index: -1;
    }
`;

const ProjectImage = styled.div`
    position: relative;
    height: 200px;
    overflow: hidden;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }
    
    /* Add a subtle gradient overlay */
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${props => props.theme.isDarkMode
            ? 'linear-gradient(to bottom, rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.6))'
            : 'linear-gradient(to bottom, rgba(255, 236, 179, 0.2), rgba(255, 152, 0, 0.3))'};
    }
`;

const ProjectContent = styled.div`
    padding: 1.8rem;
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const ProjectTitle = styled.h3`
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
    color: ${props => props.theme.text};
    font-family: var(--heading-font);
    letter-spacing: -0.02em;
    font-weight: 600;
`;

const ProjectDescription = styled.p`
    font-size: 0.95rem;
    color: ${props => props.theme.text}cc;
    line-height: 1.6;
    margin-bottom: 1.2rem;
    flex: 1;
    font-family: var(--body-font);
`;

const TechStack = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: clamp(0.3rem, 1vw, 0.5rem);
    margin-bottom: clamp(1rem, 2.5vw, 1.5rem);
`;

// Updated tech tags to match Home aesthetics
const TechTag = styled(motion.span)`
    padding: clamp(0.25rem, 0.8vw, 0.35rem) clamp(0.6rem, 1.5vw, 0.8rem);
    background-color: ${props => props.theme.isDarkMode
        ? 'rgba(30, 41, 59, 0.5)'
        : 'rgba(255, 248, 225, 0.5)'};
    color: ${props => props.theme.text};
    border-radius: 4px;
    font-size: clamp(0.7rem, 1.5vw, 0.75rem);
    font-weight: 500;
    letter-spacing: 0.5px;
    backdrop-filter: blur(2px);
    border: 1px solid ${props => props.theme.isDarkMode
        ? 'rgba(226, 232, 240, 0.1)'
        : 'rgba(255, 152, 0, 0.1)'};
    white-space: nowrap;
`;

const ProjectLinks = styled.div`
    display: flex;
    gap: clamp(0.5rem, 2vw, 1rem);
    margin-top: auto;
    
    @media (max-width: 480px) {
        flex-direction: column;
    }
`;

// Updated buttons to match CTA in Home page
const ProjectLink = styled(motion.a)`
    padding: clamp(0.6rem, 1.5vw, 0.7rem) clamp(1rem, 2.5vw, 1.2rem);
    font-size: clamp(0.8rem, 1.8vw, 0.85rem);
    font-weight: 500;
    text-align: center;
    border-radius: 50px;
    transition: all 0.3s ease;
    flex: 1;
    letter-spacing: 0.5px;
    backdrop-filter: blur(4px);
    white-space: nowrap;
    
    &.primary {
        color: ${props => props.theme.text};
        background-color: ${props => props.theme.isDarkMode
            ? 'rgba(226, 232, 240, 0.15)'
            : 'rgba(255, 152, 0, 0.15)'};
        border: 1px solid ${props => props.theme.accent};
        
        &:hover {
            transform: translateY(-3px);
            box-shadow: ${props => props.theme.isDarkMode
                ? '0 10px 20px rgba(0, 0, 0, 0.25), 0 0 15px rgba(226, 232, 240, 0.3)'
                : '0 10px 20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(255, 152, 0, 0.2)'};
        }
    }
    
    &.secondary {
        background-color: transparent;
        color: ${props => props.theme.text};
        border: 1px solid ${props => props.theme.isDarkMode
            ? 'rgba(226, 232, 240, 0.2)'
            : 'rgba(255, 152, 0, 0.2)'};
        
        &:hover {
            background-color: ${props => props.theme.isDarkMode
                ? 'rgba(226, 232, 240, 0.08)'
                : 'rgba(255, 152, 0, 0.05)'};
            transform: translateY(-3px);
        }
    }
    
    @media (max-width: 480px) {
        padding: 0.6rem 1rem;
        font-size: 0.8rem;
    }
`;

// Updated navigation buttons to match theme
const NavButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: clamp(45px, 8vw, 55px);
    height: clamp(45px, 8vw, 55px);
    border-radius: 50%;
    background-color: ${props => props.theme.isDarkMode
        ? 'rgba(226, 232, 240, 0.1)'
        : 'rgba(255, 152, 0, 0.1)'};
    color: ${props => props.theme.text};
    border: 1px solid ${props => props.theme.isDarkMode
        ? 'rgba(226, 232, 240, 0.2)'
        : 'rgba(255, 152, 0, 0.2)'};
    backdrop-filter: blur(4px);
    font-size: clamp(1.1rem, 2.2vw, 1.4rem);
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-50%) scale(1.1);
        background-color: ${props => props.theme.isDarkMode
            ? 'rgba(226, 232, 240, 0.15)'
            : 'rgba(255, 152, 0, 0.15)'};
        box-shadow: ${props => props.theme.isDarkMode
            ? '0 5px 15px rgba(0, 0, 0, 0.25), 0 0 10px rgba(226, 232, 240, 0.2)'
            : '0 5px 15px rgba(0, 0, 0, 0.1), 0 0 10px rgba(255, 152, 0, 0.15)'};
    }
    
    &:first-child {
        left: clamp(80px, 15vw, 200px); // Increased to move closer to center
    }
    
    &:last-child {
        right: clamp(80px, 15vw, 200px); // Increased to move closer to center
    }
    
    @media (max-width: 768px) {
        display: flex; // Show on mobile but make them more visible
        width: 40px;
        height: 40px;
        font-size: 1rem;
        
        &:first-child {
            left: 10px;
        }
        
        &:last-child {
            right: 10px;
        }
    }
    
    @media (max-width: 480px) {
        width: 35px;
        height: 35px;
        font-size: 0.9rem;
        
        &:first-child {
            left: 5px;
        }
        
        &:last-child {
            right: 5px;
        }
    }
`;

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
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    },
    exit: { 
        opacity: 0, 
        y: 20, 
        transition: { duration: 0.3 } 
    }
};

const filterVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

const Projects: React.FC<ProjectsProps> = ({ isDarkMode }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [filteredProjects, setFilteredProjects] = useState<Project[]>(projectsData);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });
    
    const carouselRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();
    
    // Extract unique categories from project data
    const categories = ['All', ...Array.from(new Set(projectsData.flatMap(project => project.category)))];
    
    // Filter projects when category changes
    useEffect(() => {
        if (selectedCategory === 'All') {
            setFilteredProjects(projectsData);
        } else {
            setFilteredProjects(projectsData.filter(project => project.category.includes(selectedCategory)));
        }
        setCurrentIndex(0); // Reset to first project when filter changes
    }, [selectedCategory]);
    
    const nextProject = () => {
        setCurrentIndex(prev => (prev + 1) % filteredProjects.length);
    };
    
    const prevProject = () => {
        setCurrentIndex(prev => (prev - 1 + filteredProjects.length) % filteredProjects.length);
    };

    const [touchStart, setTouchStart] = useState<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart) return;
        
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;
        
        // If swipe is more than 50px, consider it a deliberate swipe
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swiped left
                nextProject();
            } else {
                // Swiped right
                prevProject();
            }
        }
        
        setTouchStart(null);
    };
    
    const calculatePosition = useMemo(() => {
        return (index: number) => {
            const total = filteredProjects.length;
            const angle = (360 / total) * (index - currentIndex);
            const radius = 600; // Adjust radius for spacing
            
            return {
                x: Math.sin(angle * Math.PI / 180) * radius,
                z: Math.cos(angle * Math.PI / 180) * radius - radius,
                rotateY: angle,
                opacity: Math.cos(angle * Math.PI / 180) * 0.5 + 0.5,
                scale: Math.cos(angle * Math.PI / 180) * 0.2 + 0.8,
            };
        };
    }, [currentIndex, filteredProjects.length]);
        
    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);
    
    return (
        <ProjectsContainer
            id="projects"
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
        >
             {/* The celestial transition effect */}
            <CelestialTransition isDarkMode={isDarkMode} />
            
            {/* Add glow orbs */}
            <GlowOrb className="orb1" />
            <GlowOrb className="orb2" />

            <AnimatedProjectTitle isDarkMode={isDarkMode} />

            <ProjectsHeader>
                <Subtitle variants={itemVariants}>
                    A collection of my recent work, showcasing my skills and passion for creating
                    exceptional digital experiences.
                </Subtitle>
            </ProjectsHeader>
            
            <FilterContainer variants={filterVariants}>
                {categories.map((category, index) => (
                    <FilterButton
                        key={index}
                        $isActive={selectedCategory === category}
                        onClick={() => setSelectedCategory(category)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {category}
                    </FilterButton>
                ))}
            </FilterContainer>
            
            <CarouselContainer
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <NavButton onClick={prevProject}>&lt;</NavButton>
                
                <Carousel ref={carouselRef}>
                    {filteredProjects.map((project, index) => {
                        const position = calculatePosition(index);
                        const isActive = Math.abs(position.rotateY) < 45;
                        
                        return (
                            <ProjectCard3D
                                key={project.id}
                                style={{
                                    transform: `translateX(${position.x}px) translateZ(${position.z}px) rotateY(${position.rotateY}deg) scale(${position.scale})`,
                                    opacity: position.opacity,
                                    zIndex: isActive ? 2 : 1,
                                }}
                                $isActive={isActive}
                                onClick={() => {
                                    const diff = index - currentIndex;
                                    if (diff > 0) {
                                        for (let i = 0; i < diff; i++) nextProject();
                                    } else if (diff < 0) {
                                        for (let i = 0; i < -diff; i++) prevProject();
                                    }
                                }}
                                whileHover={isActive ? { y: -10 } : {}}
                            >
                                <ProjectImage>
                                    <img src={project.image} alt={project.title} />
                                </ProjectImage>
                                
                                <ProjectContent>
                                    <ProjectTitle>{project.title}</ProjectTitle>
                                    <ProjectDescription>{project.description}</ProjectDescription>
                                    
                                    <TechStack>
                                        {project.technologies.slice(0, 3).map((tech, i) => (
                                            <TechTag key={i} whileHover={{ scale: 1.05 }}>
                                                {tech}
                                            </TechTag>
                                        ))}
                                        {project.technologies.length > 3 && (
                                            <TechTag whileHover={{ scale: 1.05 }}>
                                                +{project.technologies.length - 3}
                                            </TechTag>
                                        )}
                                    </TechStack>
                                    
                                    <ProjectLinks>
                                        <ProjectLink 
                                            href={project.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="primary"
                                            whileHover={{ scale: 1.05, y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Live Demo
                                        </ProjectLink>
                                        
                                        {project.github && (
                                            <ProjectLink 
                                                href={project.github} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="secondary"
                                                whileHover={{ scale: 1.05, y: -3 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                GitHub
                                            </ProjectLink>
                                        )}
                                    </ProjectLinks>
                                </ProjectContent>
                            </ProjectCard3D>
                        );
                    })}
                </Carousel>
                
                <NavButton onClick={nextProject}>&gt;</NavButton>
            </CarouselContainer>
        </ProjectsContainer>
    );
};

export default Projects;