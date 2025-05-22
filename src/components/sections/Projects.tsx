// src/components/sections/Projects.tsx

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


     // carousel container with 3D effect
    const CarouselContainer = styled.div`
        position: relative;
        width: 100%;
        max-width: 100vw;
        height: clamp(500px, 80vh, 620px);
        perspective: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
        transform-style: preserve-3d;
        
        @media (min-width: 1800px) {
            height: clamp(550px, 60vh, 700px); /* Larger on big screens */
        }
        
        @media (max-width: 992px) {
            height: clamp(450px, 70vh, 550px);
        }
        
        @media (max-width: 768px) {
            height: clamp(400px, 60vh, 500px);
        }
        
        @media (max-width: 480px) {
            height: clamp(350px, 55vh, 450px);
        }
        
        /* Handle extremely tall screens */
        @media (min-height: 1000px) {
            height: clamp(500px, 50vh, 650px);
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

    // Enhanced card styling to match Home page aesthetics
    const ProjectCard3D = styled(motion.div)<{ $isActive: boolean }>`
    position: absolute;
    transition: transform 0.5s ease-out, opacity 0.5s ease-out;
    width: clamp(350px, 40vw, 450px);
    height: clamp(350px, 40vw, 450px);
    
    /* Updated background colors to match your light theme */
    background: ${props => props.theme.isDarkMode 
        ? 'linear-gradient(135deg, rgba(20, 30, 50, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)' 
        : 'linear-gradient(135deg, rgba(255, 249, 240, 0.95) 0%, rgba(255, 241, 224, 0.9) 50%, rgba(252, 235, 189, 0.85) 100%)'};
    
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    
    /* Enhanced border with gradient effect for light mode */
    border: ${props => props.theme.isDarkMode
        ? '1px solid rgba(226, 232, 240, 0.1)'
        : '2px solid transparent'};
    
    /* Add gradient border for light mode */
    ${props => !props.theme.isDarkMode && `
        background-clip: padding-box;
        &::before {
            content: '';
            position: absolute;
            inset: 0;
            padding: 2px;
            background: linear-gradient(135deg, 
                rgba(255, 152, 0, 0.3) 0%, 
                rgba(255, 193, 7, 0.2) 50%, 
                rgba(255, 171, 64, 0.3) 100%);
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: xor;
            -webkit-mask-composite: xor;
            z-index: -2;
        }
    `}
    
    /* Enhanced glow effects */
    box-shadow: ${props => props.$isActive
        ? (props.theme.isDarkMode
            ? '0 0 40px 15px rgba(255, 255, 255, 0.3), 0 0 80px 30px rgba(226, 232, 240, 0.2)'
            : `0 0 60px 20px rgba(255, 152, 0, 0.25), 
               0 0 100px 40px rgba(255, 193, 7, 0.15),
               inset 0 0 30px rgba(255, 248, 225, 0.3)`)
        : (props.theme.isDarkMode
            ? '0 0 20px 5px rgba(255, 255, 255, 0.2), 0 0 40px 15px rgba(226, 232, 240, 0.1)'
            : `0 0 30px 10px rgba(255, 152, 0, 0.15), 
               0 0 60px 25px rgba(255, 193, 7, 0.08),
               inset 0 0 20px rgba(255, 248, 225, 0.2)`)};
    
    ${props => props.$isActive && `
        transform: scale(1.05);
    `}
    
    /* Adjust sizing for different screens */
    @media (min-width: 1800px) {
        width: clamp(400px, 35vw, 500px);
        height: clamp(400px, 35vw, 500px);
    }
    
    @media (max-width: 768px) {
        width: clamp(300px, 80vw, 380px);
        height: clamp(300px, 80vw, 380px);
    }
    
    @media (max-width: 480px) {
        width: clamp(260px, 90vw, 320px);
        height: clamp(260px, 90vw, 320px);
    }
    
    /* Enhanced glass overlay effect */
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: ${props => props.theme.isDarkMode
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)'
            : `linear-gradient(135deg, 
                rgba(255, 248, 225, 0.6) 0%, 
                rgba(255, 249, 240, 0.4) 30%,
                rgba(252, 235, 189, 0.5) 70%,
                rgba(255, 241, 224, 0.3) 100%)`};
        border-radius: inherit;
        z-index: -1;
        backdrop-filter: blur(4px);
    }
    
    /* Add subtle texture for light mode */
    ${props => !props.theme.isDarkMode && `
        &::before {
            background-image: 
                radial-gradient(circle at 25% 25%, rgba(255, 152, 0, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(255, 193, 7, 0.08) 0%, transparent 50%);
        }
    `}
`;

// The project image with a more modern look
    const ProjectImage = styled.div`
    position: relative;
    width: 90px; 
    height: 90px; 
    margin: 0 auto 1.5rem; // Center and add space below
    margin-top: 0.1rem; // Add space above
    border-radius: 50%; // Make image circular
    overflow: hidden;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    
    img {
        width: 100%; 
        height: 100%;
        object-fit: cover;


    }

    }
`;

// The project content area
    const ProjectContent = styled.div`
    width: 80%; // Limit width for better centering
    margin: 0 auto; // Center the content
    display: flex;
    flex-direction: column;
    align-items: center; // Center everything horizontally
    text-align: center; // Center text
`;

// The project title with a more modern look
    const ProjectTitle = styled.h3`
        font-size: 1.5rem; // Slightly larger
        margin-bottom: 0.8rem;
        color: ${props => props.theme.text};
        font-family: var(--heading-font);
        letter-spacing: -0.02em;
        font-weight: 600;
        text-align: center; // Ensure center alignment
    `;

// The project description with a more modern look
    const ProjectDescription = styled.p`
        font-size: 0.85rem; // Smaller font
        color: ${props => props.theme.text}cc;
        line-height: 1.5;
        margin-bottom: 1rem;
        display: -webkit-box;
        -webkit-line-clamp: 2; // Limit to 2 lines
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 2.5rem; // Limit height
        text-align: center; // Center text
    `;

// The tech stack area with a more modern look
    const TechStack = styled.div`
        display: flex;
        flex-wrap: wrap;
        justify-content: center; // Center the tags
        gap: 0.4rem; // Reduce gap
        margin-bottom: 1.2rem;
    `;

    // Updated tech tags to match Home aesthetics
    const TechTag = styled(motion.span)`
        padding: 0.25rem 0.5rem; // Smaller padding
        background-color: ${props => props.theme.isDarkMode
            ? 'rgba(30, 41, 59, 0.5)'
            : 'rgba(255, 248, 225, 0.5)'};
        color: ${props => props.theme.text};
        border-radius: 4px;
        font-size: 0.7rem; // Smaller font
        font-weight: 500;
        letter-spacing: 0.5px;
        backdrop-filter: blur(2px);
        white-space: nowrap;
    `;

// The project links area with a more modern look
    const ProjectLinks = styled.div`
        display: flex;
        gap: 0.5rem; // Reduce gap
        margin-top: 0.5rem;
        
        @media (max-width: 480px) {
            flex-direction: column;
        }
    `;

    // The project link button with a more modern look
    const ProjectLink = styled(motion.a)`
       padding: 0.5rem 0.8rem; // Smaller padding
        font-size: 0.75rem; // Smaller font
        font-weight: 500;
        text-align: center;
        border-radius: 20px; // More rounded
        transition: all 0.3s ease;
        letter-spacing: 0.5px;
        backdrop-filter: blur(4px);
        white-space: nowrap;
        
        &.primary {
            color: ${props => props.theme.text};
            background-color: ${props => props.theme.isDarkMode
                ? 'rgba(226, 232, 240, 0.15)'
                : 'rgba(255, 153, 0, 0.69)'};
            
            
            &:hover {
                transform: translateY(-3px);
                box-shadow: ${props => props.theme.isDarkMode
                    ? '0 10px 20px rgba(206, 196, 196, 0.25), 0 0 15px rgba(226, 232, 240, 0.3)'
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
                box-shadow: ${props => props.theme.isDarkMode
                    ? '0 10px 20px rgba(206, 196, 196, 0.25), 0 0 15px rgba(226, 232, 240, 0.3)'
                    : '0 10px 20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(255, 152, 0, 0.2)'};
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
        ? '0 10px 20px rgba(206, 196, 196, 0.25), 0 0 15px rgba(226, 232, 240, 0.3)'
        : '0 10px 20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(255, 152, 0, 0.2)'};
    }
    
    &:first-child {
        left: clamp(20px, 10vw, 200px); /* Adjusted for better positioning */
    }
    
    &:last-child {
        right: clamp(20px, 10vw, 200px); /* Adjusted for better positioning */
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
        left: 5px;
        }
        
        &:last-child {
        right: 5px;
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
        const [ref, inView] = useInView({
            triggerOnce: true,
            threshold: 0.1,
        });
        
        const carouselRef = useRef<HTMLDivElement>(null);
        const controls = useAnimation();
        
        // Extract unique categories from project data
        const categories = ['All', ...Array.from(new Set(projectsData.flatMap(project => project.category)))];

        useEffect(() => {
        const animation = requestAnimationFrame(() => {
            if (!isHovered) {
            setOrbitProgress(prev => (prev + 0.005) % (Math.PI * 2));
            }
        });
        return () => cancelAnimationFrame(animation);
        }, [orbitProgress, isHovered]);
        
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
        setCurrentIndex(prev => (prev - 1 + filteredProjects.length) % filteredProjects.length);
        };

        const prevProject = () => {
        setCurrentIndex(prev => (prev + 1) % filteredProjects.length);
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
        // Calculate the position of each project card in 3D space
        const calculatePosition = useMemo(() => {
            return (index: number) => {
                const total = filteredProjects.length;
                // Add currentIndex to ensure all cards move relative to center
                const angle = ((index - currentIndex) / total * Math.PI * 2) + orbitProgress; 
                const radius = 600;
                
                return {
                x: Math.sin(angle) * radius,
                z: Math.cos(angle) * radius - radius,
                rotateY: angle * (180 / Math.PI),
                opacity: 0.7 + Math.cos(angle) * 0.3, // Smoother opacity transition
                scale: 1,
                };
            };
            }, [orbitProgress, currentIndex, filteredProjects.length]);

            
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
                            const isActive = Math.abs(position.rotateY) < 45;
                            
                            return (
                                <ProjectCard3D
                                    key={project.id}
                                    style={{
                                    transform: `translateX(${position.x}px) translateZ(${position.z}px) rotateY(${position.rotateY}deg) scale(${position.scale})`,
                                    opacity: position.opacity,
                                    zIndex: isActive ? 2 : 1,
                                    // Add a slight tilt for better 3D effect when not active
                                    transformOrigin: 'center center',
                                    transformStyle: 'preserve-3d',
                                    }}
                                    $isActive={isActive}
                                    onHoverStart={() => setIsHovered(project.id)}
                                    onHoverEnd={() => setIsHovered(null)}
                                    whileHover={{ 
                                        scale: 1.1,
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