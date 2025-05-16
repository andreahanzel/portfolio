import { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';



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
        description: 'A modern, responsive portfolio website built with React and TypeScript.',
        image: 'https://via.placeholder.com/600x400?text=Portfolio+Website',
        category: ['Web', 'Frontend'],
        technologies: ['React', 'TypeScript', 'Styled Components', 'Framer Motion'],
        link: '#',
        github: 'https://github.com/andreahanzel/portfolio',
    },
    {
        id: '2',
        title: 'E-commerce Dashboard',
        description: 'Admin dashboard for managing products, orders, and customers.',
        image: 'https://via.placeholder.com/600x400?text=E-commerce+Dashboard',
        category: ['Web', 'Fullstack'],
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        link: '#',
        github: 'https://github.com/andreahanzel/',
    },
    {
        id: '3',
        title: 'Task Manager App',
        description: 'Mobile app for managing tasks and projects with reminders.',
        image: 'https://via.placeholder.com/600x400?text=Task+Manager+App',
        category: ['Mobile', 'Fullstack'],
        technologies: ['React Native', 'Firebase', 'Redux'],
        link: '#',
    },
    {
        id: '4',
        title: 'Weather Application',
        description: 'Real-time weather forecast app with location detection.',
        image: 'https://via.placeholder.com/600x400?text=Weather+App',
        category: ['Web', 'Frontend'],
        technologies: ['JavaScript', 'HTML/CSS', 'Weather API'],
        link: '#',
        github: 'https://github.com/andreahanzel/',
    },
    {
        id: '5',
        title: 'Travel Planner',
        description: 'Plan and organize trips with interactive maps and itineraries.',
        image: 'https://via.placeholder.com/600x400?text=Travel+Planner',
        category: ['Web', 'Fullstack'],
        technologies: ['React', 'Node.js', 'MongoDB', 'Google Maps API'],
        link: '#',
        github: 'https://github.com/andreahanzel/',
    },
    {
        id: '6',
        title: 'AI Image Generator',
        description: 'Generate unique images using AI and machine learning.',
        image: 'https://via.placeholder.com/600x400?text=AI+Image+Generator',
        category: ['Web', 'AI'],
        technologies: ['Python', 'TensorFlow', 'React', 'Flask'],
        link: '#',
    },
];

// Starry background effect
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

const ProjectsContainer = styled(motion.section)`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 12rem 2rem 8rem;
    position: relative;
    overflow: hidden;
    background-color: ${props => props.theme.background};
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

const ProjectsHeader = styled.div`
    text-align: center;
    margin-bottom: 4rem;
    z-index: 2;
`;

const Title = styled(motion.h2)`
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.text};
    position: relative;
    display: inline-block;
    
    &:after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 4px;
        background: linear-gradient(
        to right,
        ${props => props.theme.primary},
        ${props => props.theme.secondary}
        );
        border-radius: 2px;
    }
`;

const Subtitle = styled(motion.p)`
    font-size: 1.2rem;
    color: ${props => props.theme.text}cc;
    max-width: 600px;
    margin: 0 auto;
    margin-top: 2rem;
`;

const FilterContainer = styled(motion.div)`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 3rem;
    z-index: 2;
`;

const FilterButton = styled(motion.button)<{ $isActive: boolean }>`
    padding: 0.5rem 1.5rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    background-color: ${props => props.$isActive ? props.theme.primary : 'transparent'};
    color: ${props => props.$isActive ? 'white' : props.theme.text};
    border: 2px solid ${props => props.$isActive ? props.theme.primary : props.theme.text + '33'};
    transition: all 0.3s ease;
    
    &:hover {
        background-color: ${props => props.$isActive ? props.theme.primary : props.theme.text + '10'};
        transform: translateY(-3px);
    }
`;

const CarouselContainer = styled.div`
    position: relative;
    width: 100%;
    height: 600px;
    perspective: 2000px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
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

const ProjectCard3D = styled(motion.div)<{ $isActive: boolean }>`
    position: absolute;
    width: 300px;
    height: 450px;
    background-color: ${props => props.theme.surface};
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 50px rgba(250, 226, 156, 0.8);
    transition: all 0.5s ease;
    cursor: pointer;
    transform-origin: center center;
    display: flex;
    flex-direction: column;
    
    ${props => props.$isActive && `
        box-shadow: 0 20px 50px ${props.theme.primary}33;
        transform: scale(1.05);
    `}
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
`;

const ProjectContent = styled.div`
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const ProjectTitle = styled.h3`
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
    color: ${props => props.theme.text};
`;

const ProjectDescription = styled.p`
    font-size: 0.9rem;
    color: ${props => props.theme.text}cc;
    line-height: 1.6;
    margin-bottom: 1rem;
    flex: 1;
`;

const TechStack = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
`;

const TechTag = styled(motion.span)`
    padding: 0.35rem 0.8rem;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
`;

const ProjectLinks = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: auto;
`;

const ProjectLink = styled(motion.a)`
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
    font-weight: 500;
    text-align: center;
    border-radius: 50px;
    transition: all 0.3s ease;
    flex: 1;
    
    &.primary {
        background-color: ${props => props.theme.primary};
        color: white;
        
        &:hover {
        background-color: ${props => props.theme.primary}dd;
        }
    }
    
    &.secondary {
        background-color: transparent;
        color: ${props => props.theme.text};
        border: 1px solid ${props => props.theme.text}33;
        
        &:hover {
        background-color: ${props => props.theme.text}10;
        }
    }
`;

const NavButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: ${props => props.theme.primary};
    color: white;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-50%) scale(1.1);
    }
    
    &:first-child {
        left: 20px;
    }
    
    &:last-child {
        right: 20px;
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

const Projects: React.FC = () => {
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
    
    const calculatePosition = (index: number) => {
        const total = filteredProjects.length;
        const angle = (360 / total) * (index - currentIndex);
        const radius = 500; // Adjust this value to change the carousel size
        
        return {
            x: Math.sin(angle * Math.PI / 180) * radius,
            z: Math.cos(angle * Math.PI / 180) * radius - radius,
            rotateY: angle,
            opacity: Math.cos(angle * Math.PI / 180) * 0.5 + 0.5,
            scale: Math.cos(angle * Math.PI / 180) * 0.2 + 0.8,
        };
    };
    
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
        <AboutStarryEffect />
        <FuturisticLine className="top" />
        <FuturisticLine className="bottom" />
        <GlowOrb className="orb1" />
        <GlowOrb className="orb2" />

        <ProjectsHeader>
            <Title variants={itemVariants}>
                My Projects
            </Title>
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
        
        <CarouselContainer>
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
                                        <TechTag key={i}>
                                            {tech}
                                        </TechTag>
                                    ))}
                                    {project.technologies.length > 3 && (
                                        <TechTag>+{project.technologies.length - 3}</TechTag>
                                    )}
                                </TechStack>
                                
                                <ProjectLinks>
                                    <ProjectLink 
                                        href={project.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="primary"
                                        whileHover={{ scale: 1.05 }}
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
                                            whileHover={{ scale: 1.05 }}
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