// src/components/ui/Resume.tsx - Complete rewrite
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Smooth glow animation
const subtleGlow = keyframes`
    0%, 100% { 
        box-shadow: 0 0 30px rgba(226, 232, 240, 0.1);
    }
    50% { 
        box-shadow: 0 0 40px rgba(226, 232, 240, 0.2);
    }
`;

// Main container - clean and modern
const AboutContainer = styled(motion.div)`
    max-width: 900px;
    margin: 2rem auto;
    background: ${props => props.theme.isDarkMode 
        ? 'rgba(15, 23, 42, 0.95)'
        : 'rgba(255, 255, 255, 0.95)'};
    border-radius: 24px;
    overflow: hidden;
   
    border: 1px solid ${props => props.theme.isDarkMode
        ? 'rgba(226, 232, 240, 0.1)'
        : 'rgba(255, 152, 0, 0.1)'};
    box-shadow: ${props => props.theme.isDarkMode
        ? '0 25px 80px rgba(0, 0, 0, 0.4)'
        : '0 25px 80px rgba(0, 0, 0, 0.12)'};
    position: relative;
    animation: ${subtleGlow} 4s ease-in-out infinite;
    

    @media (max-width: 768px) {
        margin: 1rem;
        border-radius: 20px;
    }
`;

    const CloseButton = styled.button`
        position: absolute;
        top: 16px;
        right: 16px;
        font-size: 1.8rem;
        background: transparent;
        color: ${props => props.theme.isDarkMode ? '#E2E8F0' : '#333'};
        border: none;
        cursor: pointer;
        z-index: 10;
        transition: opacity 0.2s;

        &:hover {
            opacity: 0.7;
        }
    `;


// Hero section with gradient
const HeroSection = styled.div`
    background: ${props => props.theme.isDarkMode 
        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))'
        : 'linear-gradient(135deg, rgba(255, 248, 235, 0.9), rgba(255, 241, 224, 0.8))'};
    padding: 3rem 3rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: ${props => props.theme.isDarkMode 
            ? 'linear-gradient(90deg, rgba(226, 232, 240, 0.6), rgba(248, 250, 252, 0.8), rgba(226, 232, 240, 0.6))'
            : 'linear-gradient(90deg, rgba(255, 152, 0, 0.6), rgba(255, 193, 7, 0.8), rgba(255, 152, 0, 0.6))'};
    }

    @media (max-width: 768px) {
        padding: 2rem 1.5rem 1.5rem;
    }
`;

// Name styling
const Name = styled.h1`
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 300;
    margin-bottom: 0.5rem;
    background: ${props => props.theme.isDarkMode
        ? 'linear-gradient(135deg, #F8FAFC, #E2E8F0)'
        : 'linear-gradient(135deg, #FF9800, #FF6F00)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Syne', sans-serif;
    letter-spacing: -0.02em;
`;

// Tagline
const Tagline = styled.p`
    font-size: clamp(1rem, 2.5vw, 1.3rem);
    color: ${props => props.theme.isDarkMode ? '#94A3B8' : '#666'};
    font-weight: 400;
    margin-bottom: 2rem;
    font-family: 'DM Sans', sans-serif;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
`;

// Quick stats
const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
`;

const StatItem = styled.div`
    text-align: center;

    .number {
        font-size: clamp(1.8rem, 3vw, 2.2rem);
        font-weight: 600;
        color: ${props => props.theme.isDarkMode ? '#F8FAFC' : '#333'};
        display: block;
        margin-bottom: 0.3rem;
    }

    .labels {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }

    .label {
        font-size: 0.9rem;
        color: ${props => props.theme.isDarkMode ? '#94A3B8' : '#666'};
        font-weight: 400;
    }
`;


// Main content area
const ContentArea = styled.div`
    padding: 0;
`;

// Section styling
const Section = styled(motion.div)`
    padding: 3rem;
    border-bottom: 1px solid ${props => props.theme.isDarkMode
        ? 'rgba(226, 232, 240, 0.06)'
        : 'rgba(255, 152, 0, 0.06)'};

    &:last-child {
        border-bottom: none;
    }

    @media (max-width: 768px) {
        padding: 2rem 1.5rem;
    }
`;

// Section headers
const SectionHeader = styled.div`
    margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
    font-size: clamp(1.5rem, 3vw, 1.8rem);
    font-weight: 500;
    color: ${props => props.theme.isDarkMode ? '#F8FAFC' : '#333'};
    font-family: 'Syne', sans-serif;
    margin-bottom: 0.5rem;
    position: relative;
    display: inline-block;

    &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 40px;
        height: 2px;
        background: ${props => props.theme.isDarkMode 
            ? 'rgba(226, 232, 240, 0.4)' 
            : 'rgba(255, 152, 0, 0.6)'};
        border-radius: 1px;
    }
`;

const SectionSubtitle = styled.p`
    color: ${props => props.theme.isDarkMode ? '#94A3B8' : '#666'};
    font-size: 1rem;
    line-height: 1.6;
    margin-top: 1rem;
`;

// Story text styling
const StoryText = styled.p`
    font-size: 1.1rem;
    line-height: 1.8;
    color: ${props => props.theme.isDarkMode ? '#CBD5E1' : '#444'};
    margin-bottom: 1.5rem;
    font-family: 'DM Sans', sans-serif;

    &:last-child {
        margin-bottom: 0;
    }

    strong {
        color: ${props => props.theme.isDarkMode 
            ? 'rgba(226, 232, 240, 0.9)' 
            : 'rgba(255, 152, 0, 0.9)'};
        font-weight: 600;
    }
`;

// Journey timeline
const TimelineContainer = styled.div`
    position: relative;
    padding-left: 2rem;

    &::before {
        content: '';
        position: absolute;
        left: 0.5rem;
        top: 0;
        bottom: 0;
        width: 2px;
        background: ${props => props.theme.isDarkMode 
            ? 'linear-gradient(180deg, rgba(226, 232, 240, 0.3), rgba(226, 232, 240, 0.1))'
            : 'linear-gradient(180deg, rgba(255, 152, 0, 0.3), rgba(255, 152, 0, 0.1))'};
        border-radius: 1px;
    }
`;

const TimelineItem = styled(motion.div)`
    position: relative;
    margin-bottom: 2.5rem;
    padding-left: 1.5rem;

    &::before {
        content: '';
        position: absolute;
        left: -0.6rem;
        top: 0.5rem;
        width: 12px;
        height: 12px;
        background: ${props => props.theme.isDarkMode 
            ? 'rgba(226, 232, 240, 0.6)' 
            : 'rgba(255, 152, 0, 0.6)'};
        border-radius: 50%;
        border: 3px solid ${props => props.theme.isDarkMode 
            ? 'rgba(15, 23, 42, 1)' 
            : 'rgba(255, 255, 255, 1)'};
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

const TimelineTitle = styled.h3`
    font-size: 1.2rem;
    font-weight: 600;
    color: ${props => props.theme.isDarkMode ? '#F8FAFC' : '#333'};
    margin-bottom: 0.3rem;
`;

const TimelineCompany = styled.div`
    font-size: 1rem;
    color: ${props => props.theme.isDarkMode 
        ? 'rgba(226, 232, 240, 0.7)' 
        : 'rgba(255, 152, 0, 0.8)'};
    font-weight: 500;
    margin-bottom: 0.8rem;
`;

const TimelineDescription = styled.p`
    font-size: 0.95rem;
    line-height: 1.7;
    color: ${props => props.theme.isDarkMode ? '#94A3B8' : '#666'};
`;

// Skills grid
const SkillsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
`;

const SkillCategory = styled.div`
    background: ${props => props.theme.isDarkMode
        ? 'rgba(30, 41, 59, 0.4)'
        : 'rgba(255, 249, 240, 0.6)'};
    padding: 1.5rem;
    border-radius: 16px;
    border: 1px solid ${props => props.theme.isDarkMode
        ? 'rgba(226, 232, 240, 0.08)'
        : 'rgba(255, 152, 0, 0.08)'};
    backdrop-filter: blur(10px);
`;

const SkillCategoryTitle = styled.h4`
    font-size: 1rem;
    font-weight: 600;
    color: ${props => props.theme.isDarkMode 
        ? 'rgba(226, 232, 240, 0.9)' 
        : 'rgba(255, 152, 0, 0.9)'};
    margin-bottom: 1rem;
    font-family: 'Syne', sans-serif;
`;

const SkillsList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`;

const SkillTag = styled.span`
    background: ${props => props.theme.isDarkMode
        ? 'rgba(226, 232, 240, 0.08)'
        : 'rgba(255, 152, 0, 0.08)'};
    color: ${props => props.theme.isDarkMode ? '#CBD5E1' : '#555'};
    padding: 0.4rem 0.8rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    border: 1px solid ${props => props.theme.isDarkMode
        ? 'rgba(226, 232, 240, 0.1)'
        : 'rgba(255, 152, 0, 0.1)'};
`;

// Values section
const ValuesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
`;

const ValueCard = styled(motion.div)`
    text-align: center;
    padding: 2rem 1.5rem;
    background: ${props => props.theme.isDarkMode
        ? 'rgba(30, 41, 59, 0.3)'
        : 'rgba(255, 249, 240, 0.5)'};
    border-radius: 16px;
    border: 1px solid ${props => props.theme.isDarkMode
        ? 'rgba(226, 232, 240, 0.08)'
        : 'rgba(255, 152, 0, 0.08)'};

    .icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        display: block;
    }

    .title {
        font-size: 1.1rem;
        font-weight: 600;
        color: ${props => props.theme.isDarkMode ? '#F8FAFC' : '#333'};
        margin-bottom: 0.8rem;
    }

    .description {
        font-size: 0.9rem;
        line-height: 1.6;
        color: ${props => props.theme.isDarkMode ? '#94A3B8' : '#666'};
    }
`;

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    },
};


const Resume: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <AboutContainer
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <CloseButton onClick={handleClose}>×</CloseButton>
            <HeroSection>
                <Name>Andrea Toreki</Name>
                <Tagline>
                    Digital craftsperson blending code with creativity, building experiences that feel like magic but work like science.
                </Tagline>
                
                <StatsGrid>
                <StatItem>
                        <span className="number">10+</span>
                        <div className="labels">
                            <span className="label">Years Experience</span>
                            <span className="label">Tech & Marketing</span>
                        </div>
                    </StatItem>
                    <StatItem>
                        <span className="number">40+</span>
                        <span className="label">Projects Delivered</span>
                    </StatItem>
                    <StatItem>
                        <span className="number">3</span>
                        <span className="label">Major Brands</span>
                    </StatItem>
                    <StatItem>
                        <span className="number">∞</span>
                        <span className="label">Curiosity Level</span>
                    </StatItem>
                </StatsGrid>
            </HeroSection>

            <ContentArea>
                <Section variants={itemVariants}>
                    <SectionHeader>
                        <SectionTitle>My Story</SectionTitle>
                        <SectionSubtitle>The journey from curiosity to craft</SectionSubtitle>
                    </SectionHeader>
                    
                    <StoryText>
                        I didn't follow a traditional path into tech. My journey began in the world of marketing and brand strategy, where I learned that the most powerful technologies are those that connect with people on an emotional level. Every pixel has purpose, every interaction tells a story.
                    </StoryText>
                    
                    <StoryText>
                        At <strong>Google</strong>, I discovered the beauty of algorithmic thinking and data-driven decisions. Working with machine learning systems taught me that intelligence isn't just about processing power—it's about understanding patterns, predicting needs, and creating seamless experiences.
                    </StoryText>
                    
                    <StoryText>
                        My time at <strong>Il Makiage</strong> and <strong>Wasabi Wallet</strong> showed me how design and development must dance together. Whether crafting beauty experiences or reimagining digital privacy, I learned that the best solutions emerge when technical capability meets human empathy.
                    </StoryText>
                    
                    <StoryText>
                        Today, I build bridges—between complex backends and intuitive frontends, between business goals and user needs, between what's possible and what's meaningful. I believe technology should feel effortless, even when the engineering behind it is sophisticated.
                    </StoryText>
                </Section>

                <Section variants={itemVariants}>
                    <SectionHeader>
                        <SectionTitle>Professional Journey</SectionTitle>
                        <SectionSubtitle>Key moments that shaped my perspective</SectionSubtitle>
                    </SectionHeader>
                    
                    <TimelineContainer>
                        <TimelineItem variants={itemVariants}>
                            <TimelineTitle>Senior Quality Assurance Specialist & AI Workflow Architect</TimelineTitle>
                            <TimelineCompany>Google</TimelineCompany>
                            <TimelineDescription>
                                Leading quality assurance frameworks achieving 95% precision while pioneering AI-driven automation. Building intelligent systems that learn and adapt, transforming how teams approach testing and validation.
                            </TimelineDescription>
                        </TimelineItem>

                        <TimelineItem variants={itemVariants}>
                            <TimelineTitle>Chief Marketing Officer & Digital Transformation Lead</TimelineTitle>
                            <TimelineCompany>Wasabi Wallet</TimelineCompany>
                            <TimelineDescription>
                                Orchestrated complete brand transformation for privacy-focused financial technology. Led cross-functional teams to deliver cohesive experiences that redefined how people think about digital privacy and security.
                            </TimelineDescription>
                        </TimelineItem>

                        <TimelineItem variants={itemVariants}>
                            <TimelineTitle>Brand Marketing Manager & Creative Strategy Architect</TimelineTitle>
                            <TimelineCompany>Il Makiage</TimelineCompany>
                            <TimelineDescription>
                                Crafted emotionally resonant omnichannel campaigns integrating AR/VR experiences with personalized customer journeys. Pioneered beauty-tech innovation through data-driven storytelling and authentic community engagement.
                            </TimelineDescription>
                        </TimelineItem>
                    </TimelineContainer>
                </Section>

                <Section variants={itemVariants}>
                    <SectionHeader>
                        <SectionTitle>Technical Expertise</SectionTitle>
                        <SectionSubtitle>The tools I use to bring ideas to life</SectionSubtitle>
                    </SectionHeader>
                    
                    <SkillsGrid>
                        <SkillCategory>
                            <SkillCategoryTitle>Frontend Development</SkillCategoryTitle>
                            <SkillsList>
                                <SkillTag>React & Next.js</SkillTag>
                                <SkillTag>TypeScript</SkillTag>
                                <SkillTag>Modern CSS</SkillTag>
                                <SkillTag>Framer Motion</SkillTag>
                                <SkillTag>Responsive Design</SkillTag>
                                <SkillTag>Accessibility</SkillTag>
                            </SkillsList>
                        </SkillCategory>

                        <SkillCategory>
                            <SkillCategoryTitle>Backend & Data</SkillCategoryTitle>
                            <SkillsList>
                                <SkillTag>Node.js</SkillTag>
                                <SkillTag>Python</SkillTag>
                                <SkillTag>MongoDB</SkillTag>
                                <SkillTag>PostgreSQL</SkillTag>
                                <SkillTag>REST & GraphQL</SkillTag>
                                <SkillTag>Cloud Platforms</SkillTag>
                            </SkillsList>
                        </SkillCategory>

                        <SkillCategory>
                            <SkillCategoryTitle>Design & Strategy</SkillCategoryTitle>
                            <SkillsList>
                                <SkillTag>UI/UX Design</SkillTag>
                                <SkillTag>Figma</SkillTag>
                                <SkillTag>Adobe Creative Suite</SkillTag>
                                <SkillTag>Brand Strategy</SkillTag>
                                <SkillTag>Design Systems</SkillTag>
                                <SkillTag>User Research</SkillTag>
                            </SkillsList>
                        </SkillCategory>

                        <SkillCategory>
                            <SkillCategoryTitle>AI & Innovation</SkillCategoryTitle>
                            <SkillsList>
                                <SkillTag>Machine Learning</SkillTag>
                                <SkillTag>AI Workflows</SkillTag>
                                <SkillTag>Automation</SkillTag>
                                <SkillTag>Analytics</SkillTag>
                                <SkillTag>Performance Optimization</SkillTag>
                                <SkillTag>A/B Testing</SkillTag>
                            </SkillsList>
                        </SkillCategory>

                        <SkillCategory>
                        <SkillCategoryTitle>Testing & QA</SkillCategoryTitle>
                        <SkillsList>
                            <SkillTag>Jest</SkillTag>
                            <SkillTag>Cypress</SkillTag>
                            <SkillTag>React Testing Library</SkillTag>
                            <SkillTag>Manual QA Protocols</SkillTag>
                            <SkillTag>Postman</SkillTag>
                            <SkillTag>Performance Testing</SkillTag>
                        </SkillsList>
                        </SkillCategory>

                        <SkillCategory>
                            <SkillCategoryTitle>DevOps & Deployment</SkillCategoryTitle>
                            <SkillsList>
                                <SkillTag>Docker</SkillTag>
                                <SkillTag>GitHub Actions</SkillTag>
                                <SkillTag>Vercel</SkillTag>
                                <SkillTag>Netlify</SkillTag>
                                <SkillTag>Firebase</SkillTag>
                                <SkillTag>Splash</SkillTag>
                            </SkillsList>
                            </SkillCategory>


                    </SkillsGrid>
                </Section>

                <Section variants={itemVariants}>
                    <SectionHeader>
                        <SectionTitle>What Drives Me</SectionTitle>
                        <SectionSubtitle>The principles that guide my work</SectionSubtitle>
                    </SectionHeader>
                    
                    <ValuesGrid>
                        <ValueCard variants={itemVariants}>
                            <span className="icon">🎯</span>
                            <div className="title">Purpose-Driven Design</div>
                            <div className="description">
                                Every interface element should have a reason for existence. I believe in intentional design that serves both user goals and business objectives.
                            </div>
                        </ValueCard>

                        <ValueCard variants={itemVariants}>
                            <span className="icon">⚡</span>
                            <div className="title">Performance & Accessibility</div>
                            <div className="description">
                                Beautiful experiences mean nothing if they're not fast and inclusive. I build for everyone, ensuring smooth performance across all devices and abilities.
                            </div>
                        </ValueCard>

                        <ValueCard variants={itemVariants}>
                            <span className="icon">🔬</span>
                            <div className="title">Continuous Learning</div>
                            <div className="description">
                                Technology evolves rapidly, and so do I. I'm constantly exploring new tools, techniques, and approaches to stay at the forefront of innovation.
                            </div>
                        </ValueCard>

                        <ValueCard variants={itemVariants}>
                            <span className="icon">🤝</span>
                            <div className="title">Collaborative Spirit</div>
                            <div className="description">
                                The best solutions emerge from diverse perspectives. I thrive in environments where designers, developers, and strategists work together seamlessly.
                            </div>
                        </ValueCard>

                        <ValueCard variants={itemVariants}>
                            <span className="icon">🧠</span>
                            <div className="title">Empathy-First Thinking</div>
                            <div className="description">
                                I approach every product with the end user’s feelings in mind—creating experiences that not only work, but feel good to interact with.
                            </div>
                        </ValueCard>

                        <ValueCard variants={itemVariants}>
                            <span className="icon">🌱</span>
                            <div className="title">Growth Through Feedback</div>
                            <div className="description">
                                I welcome critique as a tool for refinement. Every suggestion, challenge, or review helps me sharpen my craft and see from new angles.
                            </div>
                        </ValueCard>

                    </ValuesGrid>
                </Section>

                <Section variants={itemVariants}>
                    <SectionHeader>
                        <SectionTitle>Beyond the Code</SectionTitle>
                        <SectionSubtitle>What fuels my creativity and keeps me evolving</SectionSubtitle>
                    </SectionHeader>
                            <StoryText>
                                At my core, I’m a lifelong learner. Whether I’m exploring the depths of emerging AI frameworks, experimenting with fresh programming paradigms, or mastering the nuances of new design tools—curiosity is my compass. It’s what fuels my creativity and gives my work deeper meaning.
                            </StoryText>

                            <StoryText>
                                When I’m not writing code, I’m creating in other ways. I lead a <strong>blog channel</strong> where I share the intersections of design, development, and soul-driven innovation. I'm also <strong>writing a book</strong> that weaves together technical mastery with creative intuition—because I believe technology should never lose its human touch. And through <strong>singing</strong>, I’ve learned how rhythm, breath, and emotional timing deeply influence how users experience digital journeys.
                            </StoryText>

                            <StoryText>
                                My mind is a playground of <strong>project ideas</strong>. I’m always building something—sometimes useful, sometimes just for fun. From small experimental apps to tools that solve daily problems, I prototype with purpose. Each creation stretches my skills and sparks unexpected insight.
                            </StoryText>

                            <StoryText>
                                I’m also a passionate <strong>reader</strong>—drawn equally to design philosophy, tech strategy, poetic storytelling, and spiritual reflection. I’ve found that the most elegant solutions often come from connecting dots across disciplines. When I need clarity or inspiration, I escape into <strong>nature</strong>. Hiking grounds me and resets my creative rhythm.
                            </StoryText>

                            <StoryText>
                                In the kitchen, I code with flavor. <strong>Cooking</strong> is where my developer’s logic meets the artist’s spontaneity—measuring, mixing, breaking rules, and creating something greater than the sum of its parts. Like software, the best recipes are written with care, adapted over time, and shared with love.
                            </StoryText>

                </Section>

                {/* FINAL MOTTO SEPARATOR HERE */}
<motion.hr
    initial={{ opacity: 0, scaleX: 0 }}
    animate={{ opacity: 1, scaleX: 1 }}
    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
    style={{
        width: '100px',
        height: '2px',
        margin: '3rem auto 2rem',
        border: 'none',
        borderRadius: '2px',
        background: 'linear-gradient(90deg, rgba(255, 152, 0, 0.6), rgba(255, 152, 0, 0.2))',
    }}
/>

<motion.p
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    style={{
        textAlign: 'center',
        fontStyle: 'italic',
        fontSize: '1rem',
        lineHeight: '1.8',
        maxWidth: '800px',
        margin: '0 auto 3rem',
        color: 'var(--text-color, #ccc)',
    }}
>
    Elegance in logic. Emotion in pixels. Purpose in every line of code.
</motion.p>
            </ContentArea>
        </AboutContainer>
    );
};

export default Resume;