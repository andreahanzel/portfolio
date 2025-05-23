// src/components/sections/Projects.tsx
// This component is responsible for rendering the projects section of the portfolio
// It uses styled-components for styling and framer-motion for animations

// Import items 
import { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AnimatedProjectTitle from '../ui/AnimatedProjectTitle';
import mindfulImage from '../../assets/images/mindful.png';
import handcraftedImage from '../../assets/images/handcrafted.webp';
import portfolioImage from '../../assets/images/portfolio.svg';
import comingSoon from '../../assets/images/comingsoon.jpg';
import wasabiwalletImage from '../../assets/images/wasabiwallet.png';

// Projects component
interface ProjectsProps {
    isDarkMode: boolean;
}
// The projects data structure
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
// The projects data
const projectsData: Project[] = [
    {
        id: '1',
        title: 'Portfolio Website',
        description: 'An immersive, celestial-themed developer portfolio with smooth scroll-linked animations, dark/light mode, and a futuristic UI built from scratch.',
        image: portfolioImage,
        category: ['Web', 'Frontend'],
        technologies: ['React', 'TypeScript', 'Styled Components', 'Framer Motion'],
        link: 'https://portfolio-orpin-tau-11.vercel.app/', 
        github: 'https://github.com/andreaToreki/portfolio',
    },
    {
        id: '2',
        title: 'Handcrafted Haven',
        description: 'Full-stack marketplace for artisan goods with role-based dashboards, custom seller onboarding, product search, and a glowing dark-themed UI.',
        image: handcraftedImage,
        category: ['Web', 'Fullstack'],
        technologies: ['TypeScript', 'React', 'Next.js', 'Prisma', 'MongoDB'],
        link: 'https://handcraftedhaven-orcin.vercel.app/',
        github: 'https://github.com/andreaToreki/wdd430-teamproject/tree/main/handcraftedhaven',
    },
    {
        id: '3',
        title: 'Wasabi Wallet',
        description: 'Complete Rebranding of the open-source, privacy focused Bitcoin wallet.',
        image: wasabiwalletImage,
        category: ['Web', 'Frontend'],
        technologies: ['C#', 'TeX', 'HTML'],
        link: 'https://wasabiwallet.io/',
        github: 'https://github.com/WalletWasabi/',
    },

    {
        id: '4',
        title: 'E-commerce Dashboard',
        description: 'Admin dashboard for managing products, orders, and customers.',
        image: comingSoon,
        category: ['Web', 'Fullstack'],
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        link: '#',
        github: 'https://github.com/andreaToreki/',
    },

    {
        id: '5',
        title: 'Travel Planner',
        description: 'Plan and organize trips with interactive maps and itineraries.',
        image: comingSoon,
        category: ['Web', 'Fullstack'],
        technologies: ['React', 'Node.js', 'MongoDB', 'Google Maps API'],
        link: '#',
        github: 'https://github.com/andreaToreki/',
    },

    {
        id: '6',
        title: 'Mindful Meal Planner',
        description: 'A personalized meal planning app that generates recipes based on dietary preferences and real-time weather, enhancing healthy eating with mindful choices.',
        image: mindfulImage,
        category: ['Web', 'Frontend'],
        technologies: ['JavaScript', 'HTML/CSS', 'Recipe API'],
        link: 'https://mindful-meal-planner.netlify.app/',
        github: 'https://github.com/andreaToreki/Mindful-Meal-Planner',
    },
    
];
    
    // Updated container with a more visual style
    const ProjectsContainer = styled(motion.section)`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: clamp(6rem, 12vw, 10rem) clamp(1rem, 4vw, 2rem) clamp(4rem, 8vw, 6rem);
    position: relative;
    z-index: 5;
    overflow-x: hidden;
    overflow-y: visible;
    
    /* Add subtle background pattern for light mode */
    ${props => !props.theme.isDarkMode && `
        &::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: 
                radial-gradient(circle at 20% 30%, rgba(255, 152, 0, 0.03) 0%, transparent 40%),
                radial-gradient(circle at 80% 70%, rgba(255, 193, 7, 0.02) 0%, transparent 40%),
                radial-gradient(circle at 60% 20%, rgba(252, 235, 189, 0.04) 0%, transparent 30%);
            z-index: -1;
        }
        
        &::after {
            content: '';
            position: absolute;
            top: 10%;
            left: 5%;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(255, 152, 0, 0.08) 0%, transparent 70%);
            border-radius: 50%;
            filter: blur(60px);
            z-index: -1;
        }
    `}
    
    @media (max-width: 768px) {
        padding: clamp(4rem, 8vw, 8rem) clamp(1rem, 3vw, 1.5rem) clamp(2rem, 6vw, 4rem);
        
        ${props => !props.theme.isDarkMode && `
            &::after {
                width: 150px;
                height: 150px;
                filter: blur(40px);
            }
        `}
    }
`;

    
    // Enhanced header with gradients to match Home page
    const ProjectsHeader = styled.div`
        text-align: center;
        margin-bottom: clamp(3rem, 6vw, 6rem);
        margin-top: clamp(-3rem, -6vw, -4rem);
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
    // Header with gradient text
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
    width: 70px;
    height: 70px;
    border-radius: 50%;
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    cursor: pointer;
    color: ${props => props.theme.text};
    background-color: ${props => props.$isActive 
        ? (props.theme.isDarkMode ? 'rgba(226, 232, 240, 0.15)' : 'rgba(255, 152, 0, 0.15)')
        : (props.theme.isDarkMode ? 'rgba(226, 232, 240, 0.08)' : 'rgba(255, 152, 0, 0.05)')};
    backdrop-filter: blur(4px);
    border: 1px solid ${props => props.$isActive
        ? props.theme.accent
        : (props.theme.isDarkMode ? `${props.theme.accent}40` : `${props.theme.accent}50`)};
        box-shadow: ${props => props.theme.isDarkMode
                ? '0 8px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(147, 197, 253, 0.3)'
                : '0 8px 25px rgba(251, 146, 60, 0.3), 0 0 20px rgba(253, 186, 116, 0.2)'};
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    &:hover {
        transform: translateY(-3px);
        border-color: ${props => props.theme.accent};
        background-color: ${props => props.theme.isDarkMode 
            ? 'rgba(226, 232, 240, 0.15)' 
            : 'rgba(255, 152, 0, 0.15)'};
        box-shadow: ${props => props.theme.isDarkMode
            ? '0 10px 20px rgba(206, 196, 196, 0.25), 0 0 15px rgba(226, 232, 240, 0.3)'
            : '0 10px 20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(255, 152, 0, 0.2)'};
    }

    @media (max-width: 480px) {
        width: 45px;
        height: 45px;
        font-size: 0.75rem;
    }
`;


     // Carousel container with better mobile handling
const CarouselContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 100vw;
    height: clamp(400px, 70vh, 600px);
    perspective: 1000px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    transform-style: preserve-3d;
    padding: 20px;
    
    @media (min-width: 1200px) {
        height: clamp(500px, 60vh, 650px);
        padding: 40px;
    }
    
    @media (max-width: 768px) {
        height: clamp(450px, 80vh, 550px);
        padding: 15px;
    }
    
    @media (max-width: 480px) {
        height: clamp(400px, 75vh, 500px);
        padding: 10px;
    }
`;

// Carousel for 3D effect
const Carousel = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    display: flex;
    justify-content: center;
    align-items: center;
`;

// Enhanced card styling with better visibility and responsiveness
const ProjectCard3D = styled(motion.div)<{ $isActive: boolean }>`
    position: absolute;
    transition: transform 0.5s ease-out, opacity 0.5s ease-out;
    width: clamp(320px, 35vw, 400px);
    height: clamp(320px, 35vw, 400px);
    
    /* Improved background with better contrast */
    background: ${props => props.theme.isDarkMode 
        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)' 
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)'};
    
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    
    /* Better border visibility */
    border: ${props => props.theme.isDarkMode
        ? '2px solid rgba(148, 163, 184, 0.3)'
        : '2px solid rgba(203, 213, 225, 0.5)'};
    
    /* Improved shadow for better visibility */
    box-shadow: ${props => props.$isActive
        ? (props.theme.isDarkMode
            ? '0 0 50px 10px rgba(59, 130, 246, 0.4), 0 0 100px 20px rgba(147, 197, 253, 0.2), inset 0 0 30px rgba(59, 130, 246, 0.1)'
            : '0 0 50px 10px rgba(251, 146, 60, 0.3), 0 0 100px 20px rgba(253, 186, 116, 0.15), inset 0 0 30px rgba(251, 146, 60, 0.05)')
        : (props.theme.isDarkMode
            ? '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)'
            : '0 10px 30px rgba(0, 0, 0, 0.1), 0 0 40px rgba(251, 146, 60, 0.08)')};
    
    /* Backdrop blur for glass effect */
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    
    ${props => props.$isActive && `
        transform: scale(1.08);
        z-index: 10;
    `}
    
    /* Desktop sizing */
    @media (min-width: 1200px) {
        width: clamp(380px, 32vw, 450px);
        height: clamp(380px, 32vw, 450px);
        padding: 2.5rem;
    }
    
    /* Tablet sizing */
    @media (max-width: 1024px) {
        width: clamp(300px, 45vw, 380px);
        height: clamp(300px, 45vw, 380px);
        padding: 1.8rem;
    }
    
    /* Mobile sizing */
    @media (max-width: 768px) {
        width: clamp(280px, 80vw, 350px);
        height: clamp(280px, 80vw, 350px);
        padding: 1.5rem;
    }
    
    @media (max-width: 480px) {
        width: clamp(260px, 85vw, 320px);
        height: clamp(260px, 85vw, 320px);
        padding: 1.2rem;
    }
    
    /* Small mobile devices */
    @media (max-width: 360px) {
        width: clamp(240px, 90vw, 280px);
        height: clamp(240px, 90vw, 280px);
        padding: 1rem;
    }
`;

// Project image with better responsiveness
const ProjectImage = styled.div`
    position: relative;
    width: clamp(60px, 15vw, 90px);
    height: clamp(60px, 15vw, 90px);
    margin: 0 auto 1rem;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: ${props => props.theme.isDarkMode
        ? '0 8px 20px rgba(0, 0, 0, 0.4), 0 0 15px rgba(59, 130, 246, 0.2)'
        : '0 8px 20px rgba(0, 0, 0, 0.15), 0 0 15px rgba(251, 146, 60, 0.1)'};
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    @media (max-width: 480px) {
        width: clamp(50px, 12vw, 70px);
        height: clamp(50px, 12vw, 70px);
        margin-bottom: 0.8rem;
    }
`;

// Project content with better spacing
const ProjectContent = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.5rem;
`;

// Project title with responsive sizing
const ProjectTitle = styled.h3`
    font-size: clamp(1.1rem, 3vw, 1.4rem);
    margin: 0 0 0.5rem 0;
    color: ${props => props.theme.isDarkMode 
        ? 'rgba(241, 245, 249, 0.95)' 
        : 'rgba(15, 23, 42, 0.95)'};
    font-family: var(--heading-font);
    letter-spacing: -0.02em;
    font-weight: 600;
    line-height: 1.2;
    
    @media (max-width: 480px) {
        font-size: clamp(1rem, 4vw, 1.2rem);
        margin-bottom: 0.4rem;
    }
`;

// Project description with better readability
const ProjectDescription = styled.p`
    font-size: clamp(0.75rem, 2vw, 0.85rem);
    color: ${props => props.theme.isDarkMode 
        ? 'rgba(203, 213, 225, 0.9)' 
        : 'rgba(51, 65, 85, 0.9)'};
    line-height: 1.4;
    margin: 0 0 0.8rem 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 2.2rem;
    
    @media (max-width: 480px) {
        font-size: clamp(0.7rem, 3vw, 0.8rem);
        -webkit-line-clamp: 2;
        max-height: 2rem;
        margin-bottom: 0.6rem;
    }
`;

// Tech stack with better mobile layout
const TechStack = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.3rem;
    margin: 0 0 1rem 0;
    max-width: 100%;
    
    @media (max-width: 480px) {
        gap: 0.25rem;
        margin-bottom: 0.8rem;
    }
`;

// Tech tags with better visibility
const TechTag = styled(motion.span)`
    padding: 0.2rem 0.5rem;
    background-color: ${props => props.theme.isDarkMode
        ? 'rgba(59, 130, 246, 0.2)'
        : 'rgba(251, 146, 60, 0.15)'};
    color: ${props => props.theme.isDarkMode 
        ? 'rgba(147, 197, 253, 0.95)' 
        : 'rgba(194, 65, 12, 0.95)'};
    border: 1px solid ${props => props.theme.isDarkMode
        ? 'rgba(59, 130, 246, 0.3)'
        : 'rgba(251, 146, 60, 0.3)'};
    border-radius: 12px;
    font-size: clamp(0.65rem, 1.5vw, 0.75rem);
    font-weight: 500;
    letter-spacing: 0.3px;
    backdrop-filter: blur(4px);
    white-space: nowrap;
    
    @media (max-width: 480px) {
        padding: 0.15rem 0.4rem;
        font-size: clamp(0.6rem, 2vw, 0.7rem);
        border-radius: 10px;
    }
`;

// Project links with better mobile handling
const ProjectLinks = styled.div`
    display: flex;
    gap: 0.5rem;
    width: 100%;
    justify-content: center;
    
    @media (max-width: 480px) {
        flex-direction: column;
        gap: 0.4rem;
        align-items: center;
    }
`;

// Project link buttons with improved visibility
const ProjectLink = styled(motion.a)`
    padding: 0.5rem 1rem;
    font-size: clamp(0.7rem, 1.8vw, 0.8rem);
    font-weight: 500;
    text-align: center;
    border-radius: 20px;
    transition: all 0.3s ease;
    letter-spacing: 0.3px;
    backdrop-filter: blur(6px);
    white-space: nowrap;
    text-decoration: none;
    min-width: 80px;
    
    &.primary {
        color: ${props => props.theme.isDarkMode 
            ? 'rgba(15, 23, 42, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)'};
        background: ${props => props.theme.isDarkMode
            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(251, 146, 60, 0.9) 0%, rgba(249, 115, 22, 0.95) 100%)'};
        border: 1px solid ${props => props.theme.isDarkMode
            ? 'rgba(59, 130, 246, 0.5)'
            : 'rgba(251, 146, 60, 0.5)'};
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: ${props => props.theme.isDarkMode
                ? '0 8px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(147, 197, 253, 0.3)'
                : '0 8px 25px rgba(251, 146, 60, 0.3), 0 0 20px rgba(253, 186, 116, 0.2)'};
        }
    }
    
    &.secondary {
        background: transparent;
        color: ${props => props.theme.isDarkMode 
            ? 'rgba(203, 213, 225, 0.9)' 
            : 'rgba(51, 65, 85, 0.9)'};
        border: 1px solid ${props => props.theme.isDarkMode
            ? 'rgba(148, 163, 184, 0.4)'
            : 'rgba(203, 213, 225, 0.6)'};
        
        &:hover {
            background: ${props => props.theme.isDarkMode
                ? 'rgba(59, 130, 246, 0.1)'
                : 'rgba(251, 146, 60, 0.08)'};
            transform: translateY(-2px);
            box-shadow: ${props => props.theme.isDarkMode
                ? '0 8px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(59, 130, 246, 0.2)'
                : '0 8px 20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(251, 146, 60, 0.1)'};
        }
    }
    
    @media (max-width: 480px) {
        padding: 0.6rem 1.2rem;
        font-size: clamp(0.75rem, 3vw, 0.85rem);
        width: 100%;
        max-width: 120px;
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
    box-shadow: ${props => props.theme.isDarkMode
                ? '0 8px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(147, 197, 253, 0.3)'
                : '0 8px 25px rgba(251, 146, 60, 0.3), 0 0 20px rgba(253, 186, 116, 0.2)'};
    
    &:hover {
        transform: translateY(-50%) scale(1.1);
        background-color: ${props => props.theme.isDarkMode
        ? 'rgba(226, 232, 240, 0.15)'
        : 'rgba(255, 152, 0, 0.15)'};
        box-shadow: ${props => props.theme.isDarkMode
        ? '0 10px 20px rgba(206, 196, 196, 0.25), 0 0 15px rgba(226, 232, 240, 0.3)'
        : '0 10px 20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(255, 152, 0, 0.2)'};
    }
    
    &:first-child {
        left: clamp(20px, 5vw, 100px); /* Adjusted for better positioning */
    }
    
    &:last-child {
        right: clamp(20px, 5vw, 100px); /* Adjusted for better positioning */
    }
    
    @media (max-width: 768px) {
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
        left: 2px; /* Move closer to edge */
    }
    
    &:last-child {
        right: 2px; /* Move closer to edge */
    }
    }
    `;

// Container variants for the project cards
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
    
// Item variants for the project cards
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

    // Filter variants for the filter buttons
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

    // Main Projects component
    const Projects: React.FC<ProjectsProps> = ({ isDarkMode }) => {
        const [isHovered, setIsHovered] = useState<string | null>(null);
        const [orbitProgress, setOrbitProgress] = useState(0);
        const [selectedCategory, setSelectedCategory] = useState<string>('All');
        const [filteredProjects, setFilteredProjects] = useState<Project[]>(projectsData);
        const [currentIndex, setCurrentIndex] = useState(0);
        const [isPaused, setIsPaused] = useState(false);
        const [ref, inView] = useInView({
            triggerOnce: true,
            threshold: 0.1,
        });
        
        const carouselRef = useRef<HTMLDivElement>(null);
        const controls = useAnimation();
        
        // Extract unique categories from project data
        const categories = ['All', ...Array.from(new Set(projectsData.flatMap(project => project.category)))];

        // Handle mouse hover state
        useEffect(() => {
            const animation = requestAnimationFrame(() => {
                // Disable auto-rotation on mobile for better UX
                const isMobile = window.innerWidth < 768;
                if (!isHovered && !isPaused && !isMobile) {
                    setOrbitProgress(prev => (prev + 0.005) % (Math.PI * 2));
                }
            });
            return () => cancelAnimationFrame(animation);
        }, [orbitProgress, isHovered, isPaused]);
        
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
            setIsPaused(true); // Pause auto-rotation
            setCurrentIndex(prev => (prev - 1 + filteredProjects.length) % filteredProjects.length);
            
            // Resume auto-rotation after 3 seconds
            setTimeout(() => setIsPaused(false), 3000);
        };

        const prevProject = () => {
            setIsPaused(true); // Pause auto-rotation
            setCurrentIndex(prev => (prev + 1) % filteredProjects.length);
            
            // Resume auto-rotation after 3 seconds
            setTimeout(() => setIsPaused(false), 3000);
        };

        const [touchStart, setTouchStart] = useState<number | null>(null);

        const handleTouchStart = (e: React.TouchEvent) => {
            setTouchStart(e.touches[0].clientX);
        };

        // Handle touch end event
        const handleTouchEnd = (e: React.TouchEvent) => {
            if (!touchStart) return;
            
            const touchEnd = e.changedTouches[0].clientX;
            const diff = touchStart - touchEnd;
            
            if (Math.abs(diff) > 50) {
                setIsPaused(true); // Add this line
                if (diff > 0) {
                    nextProject();
                } else {
                    prevProject();
                }
                setTimeout(() => setIsPaused(false), 3000); // Add this line
            }
            
            setTouchStart(null);
        };

        // Calculate the position of each project card in 3D space
    const calculatePosition = useMemo(() => {
    return (index: number) => {
        const total = filteredProjects.length;
        const angle = ((index - currentIndex) / total * Math.PI * 2) + orbitProgress;
        
        // Much smaller radius on mobile to prevent overlap
        const radius = window.innerWidth < 768 ? 250 : 600;
        
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius - radius;
        
        // More restrictive front detection on mobile
        const frontThreshold = window.innerWidth < 768 ? 0.5 : -0.2;
        const isInFront = Math.cos(angle) > frontThreshold;
        
        // Hide side cards more aggressively on mobile
        const isMobile = window.innerWidth < 768;
        const isActive = index === currentIndex;
        
        return {
            x: x,
            z: z,
            rotateY: angle * (180 / Math.PI),
            opacity: isActive ? 1 : (isMobile ? (isInFront ? 0.3 : 0) : (isInFront ? 0.6 : 0.2)),
            scale: isActive ? 1.05 : 0, // Only scale active card, completely hide others
        };
    };
}, [orbitProgress, currentIndex, filteredProjects.length]);

        // Handle inView animation        
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

            
                <AnimatedProjectTitle isDarkMode={isDarkMode} />

                <ProjectsHeader>
                    <Subtitle variants={itemVariants}>
                        A collection of my recent work, showcasing my skills and passion for creating
                        exceptional digital experiences.
                    </Subtitle>
                </ProjectsHeader>
                
                <FilterContainer variants={filterVariants}>
                    {categories.map((category, index) => (
                        <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FilterButton
                                $isActive={selectedCategory === category}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </FilterButton>
                        </motion.div>

                        </motion.div>
                    ))}
                </FilterContainer>

                
                <CarouselContainer
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <NavButton onClick={prevProject} aria-label="Previous project">&lt;</NavButton>
                    
                    <Carousel ref={carouselRef}>
                        {filteredProjects.map((project, index) => {
                        const position = calculatePosition(index);
                        const isActive = index === currentIndex;
    
                            return (
                                <ProjectCard3D
                                    key={project.id}
                                    style={{
                                        transform: `translateX(${position.x}px) translateZ(${position.z}px) rotateY(${position.rotateY}deg) scale(${position.scale})`,
                                        opacity: position.opacity,
                                        zIndex: position.z > -300 ? 10 : 1, // Higher z-index for front cards
                                        transformOrigin: 'center center',
                                        transformStyle: 'preserve-3d',
                                        pointerEvents: position.z > -300 ? 'auto' : 'none', // Only front cards are clickable
                                    }}
                                    $isActive={isActive}
                                    onHoverStart={() => setIsHovered(project.id)}
                                    onHoverEnd={() => setIsHovered(null)}
                                    whileHover={{ 
                                        scale: position.z > -300 ? 1.1 : 1, // Only hover effect on front cards
                                        transition: { duration: 0.3 }
                                    }}
                                
                                    animate={{
                                        x: position.x,
                                        z: position.z,
                                        rotateY: position.rotateY,
                                        transition: {
                                            type: 'spring',
                                            stiffness: isHovered === project.id ? 100 : 40, // Increased stiffness
                                            damping: 15,
                                            mass: 0.5
                                        }
                                        }}
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
                    
                    <NavButton onClick={nextProject} aria-label="Next project">&gt;</NavButton>
                </CarouselContainer>
            </ProjectsContainer>
        );
    };

export default Projects;