// src/components/ui/Resume.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// This component is responsible for rendering a resume with a glowing border effect
const pulseGlow = keyframes`
    0%, 100% { 
        box-shadow: 0 0 20px rgba(255, 217, 102, 0.3);
    }
    50% { 
        box-shadow: 0 0 30px rgba(255, 217, 102, 0.5);
    }
`;

// Main container for the resume
const ResumeContainer = styled(motion.div)`
    max-width: 800px;
    margin: 0 auto;
    background: ${props => props.theme.isDarkMode 
        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))'
        : 'linear-gradient(135deg, #ffffff, #fff8f0)'};
    border-radius: 20px;
    padding: 3rem;
    box-shadow: ${props => props.theme.isDarkMode
        ? '0 20px 60px rgba(0, 0, 0, 0.4)'
        : '0 20px 60px rgba(0, 0, 0, 0.1)'};
    backdrop-filter: blur(10px);
    border: 1px solid ${props => props.theme.isDarkMode
        ? 'rgba(255, 217, 102, 0.2)'
        : 'rgba(255, 152, 0, 0.2)'};
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, 
        ${props => props.theme.isDarkMode ? '#FFD966' : '#FF9800'}, 
        ${props => props.theme.isDarkMode ? '#FFF8E1' : '#FFC107'}, 
        ${props => props.theme.isDarkMode ? '#FFD966' : '#FF9800'});
        animation: ${pulseGlow} 3s ease-in-out infinite;
    }
`;

// Header section of the resume
const Header = styled.div`
    text-align: center;
    margin-bottom: 3rem;
    position: relative;
`;

// Name and title styles
const Name = styled.h1`
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: ${props => props.theme.isDarkMode
        ? 'linear-gradient(90deg, #F8FAFC, #E2E8F0)'
        : 'linear-gradient(90deg, #FF9800, #FF6F00)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family: 'Syne', sans-serif;
    letter-spacing: -0.02em;
`;

// Title styles
const Title = styled.h2`
    font-size: 1.5rem;
    color: ${props => props.theme.isDarkMode ? '#94A3B8' : '#666'};
    font-weight: 400;
    margin-bottom: 1rem;
    font-family: 'DM Sans', sans-serif;
`;

// Contact information styles
const ContactInfo = styled.div`
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
`;

// Individual contact item styles
const ContactItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${props => props.theme.isDarkMode ? '#CBD5E1' : '#555'};
    font-size: 0.9rem;

    svg {
        width: 16px;
        height: 16px;
        color: ${props => props.theme.isDarkMode ? '#FFD966' : '#FF9800'};
    }
`;

// Section styles
const Section = styled.div`
    margin-bottom: 2.5rem;
`;

// Section title styles
const SectionTitle = styled.h3`
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: ${props => props.theme.isDarkMode ? '#F8FAFC' : '#333'};
    font-family: 'Syne', sans-serif;
    position: relative;
    padding-bottom: 0.5rem;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 50px;
        height: 2px;
        background: ${props => props.theme.isDarkMode ? '#FFD966' : '#FF9800'};
    }
`;

// Description styles
const ExperienceItem = styled.div`
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: ${props => props.theme.isDarkMode
        ? 'rgba(30, 41, 59, 0.5)'
        : 'rgba(255, 249, 240, 0.8)'};
    border-radius: 12px;
    border: 1px solid ${props => props.theme.isDarkMode
        ? 'rgba(255, 217, 102, 0.1)'
        : 'rgba(255, 152, 0, 0.1)'};
`;

// Job title and company styles
const JobTitle = styled.h4`
    font-size: 1.1rem;
    font-weight: 600;
    color: ${props => props.theme.isDarkMode ? '#F8FAFC' : '#333'};
    margin-bottom: 0.3rem;
`;

// Company name styles
const Company = styled.div`
    font-size: 1rem;
    color: ${props => props.theme.isDarkMode ? '#FFD966' : '#FF9800'};
    font-weight: 500;
    margin-bottom: 0.3rem;
`;

// Description list styles
const Description = styled.ul`
    margin: 0;
    padding-left: 1.2rem;
    list-style: none;

    li {
        position: relative;
        margin-bottom: 0.5rem;
        color: ${props => props.theme.isDarkMode ? '#CBD5E1' : '#555'};
        line-height: 1.6;

        &::before {
            content: '▸';
            position: absolute;
            left: -1.2rem;
            color: ${props => props.theme.isDarkMode ? '#FFD966' : '#FF9800'};
        }
    }
`;

// Skills grid styles
const SkillsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
`;

// Skill category styles
const SkillCategory = styled.div`
    background: ${props => props.theme.isDarkMode
        ? 'rgba(30, 41, 59, 0.5)'
        : 'rgba(255, 249, 240, 0.8)'};
    padding: 1.2rem;
    border-radius: 12px;
    border: 1px solid ${props => props.theme.isDarkMode
        ? 'rgba(255, 217, 102, 0.1)'
        : 'rgba(255, 152, 0, 0.1)'};
`;

// Skill category title styles
const SkillCategoryTitle = styled.h5`
    font-size: 1rem;
    font-weight: 600;
    color: ${props => props.theme.isDarkMode ? '#FFD966' : '#FF9800'};
    margin-bottom: 0.8rem;
`;

// Skills list styles
const SkillsList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`;

// Individual skill tag styles
const SkillTag = styled.span`
    background: ${props => props.theme.isDarkMode
        ? 'rgba(255, 217, 102, 0.1)'
        : 'rgba(255, 152, 0, 0.1)'};
    color: ${props => props.theme.isDarkMode ? '#F8FAFC' : '#333'};
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
`;

// Education section styles
const Education = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
`;

//  Individual education item styles
const EducationItem = styled.div`
    background: ${props => props.theme.isDarkMode
        ? 'rgba(30, 41, 59, 0.5)'
        : 'rgba(255, 249, 240, 0.8)'};
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid ${props => props.theme.isDarkMode
        ? 'rgba(255, 217, 102, 0.1)'
        : 'rgba(255, 152, 0, 0.1)'};
`;

const Degree = styled.h4`
    font-size: 1.1rem;
    font-weight: 600;
    color: ${props => props.theme.isDarkMode ? '#F8FAFC' : '#333'};
    margin-bottom: 0.3rem;
`;

const School = styled.div`
    font-size: 1rem;
    color: ${props => props.theme.isDarkMode ? '#FFD966' : '#FF9800'};
    font-weight: 500;
    margin-bottom: 0.3rem;
`;

const ResumeFooter = styled.div`
    text-align: center;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid ${props => props.theme.isDarkMode
        ? 'rgba(255, 217, 102, 0.2)'
        : 'rgba(255, 152, 0, 0.2)'};
`;
// Footer text styles
const FooterText = styled.p`
    font-size: 0.9rem;
    color: ${props => props.theme.isDarkMode ? '#94A3B8' : '#666'};
    font-style: italic;
`;

// Icons
const EmailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
    </svg>
);
// Phone icon
const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
);
// Resume component
const Resume: React.FC = () => {
    return (
        <ResumeContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <Header>
                <Name>Andrea Hanzel</Name>  
                <Title>Full-Stack Developer & UX/UI Designer with Brand Strategy Expertise</Title>
                <ContactInfo>
                    <ContactItem>
                        <EmailIcon />
                        hello@andreahanzel.com
                    </ContactItem>
                    <ContactItem>
                        <PhoneIcon />
                        +1 (510) 604-0802 | + 36 (30) 113 2511
                    </ContactItem>
                </ContactInfo>
            </Header>

            <Section>
                <SectionTitle>Professional Summary</SectionTitle>
                <Description>
                    <li>Visionary Full-Stack Developer with 3+ years of cutting-edge engineering excellence and 10+ years of strategic marketing mastery, orchestrating digital ecosystems that transcend conventional boundaries</li>
                    <li>AI-powered technical architect specializing in React, TypeScript, and intelligent automation systems, with deep expertise in machine learning workflows and predictive analytics frameworks</li>
                    <li>Elite performance optimizer at Google, achieving 95%+ algorithmic precision while pioneering next-generation quality assurance methodologies and data-driven decision frameworks</li>
                    <li>Brand storytelling virtuoso with a decade of marketing innovation, transforming complex technical concepts into compelling user narratives that bridge cutting-edge technology with human-centered design philosophy</li>
                </Description>
            </Section>

            <Section>
                <SectionTitle>Experience</SectionTitle>
                
                <ExperienceItem>
                    <JobTitle>Senior Quality Assurance Specialist & AI Workflow Architect</JobTitle>
                    <Company>Google</Company>
                    <Description>
                        <li>Engineered revolutionary quality assurance frameworks, achieving 95% algorithmic precision across multi-platform advertising ecosystems while establishing new paradigms for AI-driven compliance monitoring</li>
                        <li>Architected intelligent automation pipelines using Google Apps Script and machine learning algorithms, revolutionizing workflow efficiency and reducing manual intervention by 80%</li>
                        <li>Spearheaded the development of cutting-edge front-end experiences for Google Help Center, implementing responsive design principles and accessibility standards that enhanced user engagement by 40%</li>
                        <li>Orchestrated cross-functional synergies between data science, engineering, and product teams, driving strategic decision-making through advanced analytics and predictive modeling frameworks</li>
                    </Description>
                </ExperienceItem>

                <ExperienceItem>
                    <JobTitle>Chief Marketing Officer & Digital Transformation Lead</JobTitle>
                    <Company>Wasabi Wallet</Company>
                    <Description>
                        <li>Executed comprehensive brand metamorphosis, elevating market presence through strategic positioning and innovative visual identity systems that redefined industry standards for privacy-focused financial technology</li>
                        <li>Led a dynamic 15-member multidisciplinary team encompassing marketing strategists, UX architects, and full-stack developers to deliver cohesive brand experiences across all digital touchpoints</li>
                        <li>Achieved exponential 90% surge in brand visibility through meticulously orchestrated omnichannel advertising campaigns, leveraging advanced targeting algorithms and behavioral analytics</li>
                        <li>Pioneered integration of cutting-edge SEO/SEM optimization techniques with content marketing strategies, resulting in unprecedented organic growth and thought leadership positioning</li>
                    </Description>
                </ExperienceItem>

                <ExperienceItem>
                    <JobTitle>Brand Marketing Manager & Creative Strategy Architect</JobTitle>
                    <Company>Il Makiage</Company>
                    <Description>
                        <li>Orchestrated revolutionary brand narrative ecosystems for premium beauty technology, crafting emotionally resonant omnichannel campaigns that seamlessly integrated AR/VR experiences with hyper-personalized customer journey mapping</li>
                        <li>Pioneered sophisticated multi-dimensional marketing architectures leveraging advanced customer segmentation algorithms, predictive behavioral analytics, and psychographic profiling to achieve 200% ROI amplification</li>
                        <li>Architected immersive brand activations and influencer ecosystem collaborations, establishing Il Makiage as a vanguard in beauty-tech innovation while building authentic community engagement through data-driven storytelling</li>
                        <li>Implemented cutting-edge creative optimization protocols utilizing multivariate A/B testing frameworks, sentiment analysis algorithms, and real-time engagement metrics to ensure every brand touchpoint delivered maximum emotional impact and conversion optimization</li>
                    </Description>
                </ExperienceItem>

                <ExperienceItem>
                    <JobTitle>Senior Data Analyst & Algorithmic Performance Specialist</JobTitle>
                    <Company>Google</Company>
                    <Description>
                        <li>Analyzed and optimized 90,000+ Responsive Search Ads using sophisticated machine learning algorithms and natural language processing, maintaining 99% content quality standards across global markets</li>
                        <li>Developed predictive analytics models and trend identification systems that enhanced campaign effectiveness by 35%, revolutionizing how performance metrics were interpreted and actioned</li>
                        <li>Engineered advanced content optimization frameworks incorporating semantic analysis, keyword performance modeling, and brand consistency algorithms that set new industry benchmarks</li>
                        <li>Pioneered integration of AI-driven insights with human creative intuition, establishing best practices for balancing algorithmic efficiency with authentic brand storytelling</li>
                    </Description>
                </ExperienceItem>
            </Section>

            <Section>
                <SectionTitle>Technical Expertise</SectionTitle>
                <SkillsGrid>

                    {/* Frontend Architecture & Development */}
                    <SkillCategory>
                        <SkillCategoryTitle>Frontend Architecture & Development</SkillCategoryTitle>
                        <SkillsList>
                            <SkillTag>React Ecosystem</SkillTag>
                            <SkillTag>TypeScript</SkillTag>
                            <SkillTag>Next.js Framework</SkillTag>
                            <SkillTag>Advanced JavaScript</SkillTag>
                            <SkillTag>Responsive HTML5/CSS3</SkillTag>
                            <SkillTag>C#</SkillTag>
                            <SkillTag>Tailwind CSS</SkillTag>
                            <SkillTag>GraphQL</SkillTag>
                        </SkillsList>
                    </SkillCategory>

                    {/* Backend Systems & AI Integration */}
                    <SkillCategory>
                        <SkillCategoryTitle>Backend Systems & AI Integration</SkillCategoryTitle>
                        <SkillsList>
                            <SkillTag>Node.js Runtime</SkillTag>
                            <SkillTag>Python & AI Libraries</SkillTag>
                            <SkillTag>MongoDB Atlas</SkillTag>
                            <SkillTag>PostgreSQL</SkillTag>
                            <SkillTag>RESTful & GraphQL APIs</SkillTag>
                            <SkillTag>Prisma ORM</SkillTag>
                            <SkillTag>Machine Learning Workflows</SkillTag>
                        </SkillsList>
                    </SkillCategory>

                    {/* Strategic Marketing & Brand Innovation */}
                    <SkillCategory>
                        <SkillCategoryTitle>Strategic Marketing & Brand Innovation</SkillCategoryTitle>
                        <SkillsList>
                            <SkillTag>Omnichannel Campaign Strategy</SkillTag>
                            <SkillTag>Advanced UX/UI Design</SkillTag>
                            <SkillTag>Figma & Design Systems</SkillTag>
                            <SkillTag>Adobe Creative Mastery</SkillTag>
                            <SkillTag>Brand Architecture</SkillTag>
                            <SkillTag>Performance Marketing</SkillTag>
                            <SkillTag>Analytics & Attribution</SkillTag>
                        </SkillsList>
                    </SkillCategory>

                    {/* DevOps & Emerging Technologies */}
                    <SkillCategory>
                        <SkillCategoryTitle>DevOps & Emerging Technologies</SkillCategoryTitle>
                        <SkillsList>
                            <SkillTag>Git Version Control</SkillTag>
                            <SkillTag>Google Cloud Platform</SkillTag>
                            <SkillTag>AI Workflow Automation</SkillTag>
                            <SkillTag>Advanced A/B Testing</SkillTag>
                            <SkillTag>Agile Leadership</SkillTag>
                            <SkillTag>Data Pipeline Architecture</SkillTag>
                            <SkillTag>Predictive Analytics</SkillTag>
                        </SkillsList>
                    </SkillCategory>

                    {/* Testing & Quality Assurance - NEW */}
                    <SkillCategory>
                        <SkillCategoryTitle>Testing & Quality Assurance</SkillCategoryTitle>
                        <SkillsList>
                            <SkillTag>Jest</SkillTag>
                            <SkillTag>React Testing Library</SkillTag>
                            <SkillTag>Cypress</SkillTag>
                            <SkillTag>Postman</SkillTag>
                            <SkillTag>Manual QA Protocols</SkillTag>
                            <SkillTag>Performance Testing</SkillTag>
                        </SkillsList>
                    </SkillCategory>

                    {/* Cloud Services & Deployment - NEW */}
                    <SkillCategory>
                        <SkillCategoryTitle>Cloud Services & Deployment</SkillCategoryTitle>
                        <SkillsList>
                            <SkillTag>Vercel</SkillTag>
                            <SkillTag>Render</SkillTag>
                            <SkillTag>Firebase</SkillTag>
                            <SkillTag>Netlify</SkillTag>
                            <SkillTag>Docker</SkillTag>
                            <SkillTag>GitHub Actions</SkillTag>
                            <SkillTag>Splash</SkillTag>
                        </SkillsList>
                    </SkillCategory>

                </SkillsGrid>
            </Section>


            <Section>
                <SectionTitle>Education</SectionTitle>
                <Education>
                    <EducationItem>
                        <Degree>Bachelor of Science in Applied Technologies</Degree>
                        <School>Brigham Young University, Idaho</School>
                    </EducationItem>
                    <EducationItem>
                        <Degree> Business Administration - Project Management</Degree>
                        <School>William Jessup University</School>
                    </EducationItem>
                </Education>
                
                <SkillCategory style={{ marginTop: '2rem' }}>
                    <SkillCategoryTitle>Further Education</SkillCategoryTitle>
                    <SkillsList>
                        <SkillTag>Marketing Strategy & Consumer Psychology - University of California Los Angeles</SkillTag>
                        <SkillTag>Web Development - Brigham Young University, Idaho</SkillTag>
                        <SkillTag>Web and Computer Programming - Brigham Young University, Idaho</SkillTag>
                        <SkillTag>AI-Driven UX/UI Design - Stanford University</SkillTag>
                        <SkillTag>Professional Graphic Design Systems - Figma</SkillTag>
                    </SkillsList>
                </SkillCategory>
            </Section>

            <ResumeFooter>
                <FooterText>
                    “I bridge the gap between code and compassion - designing intelligent systems that not only function with flawless logic but also connect with users on a deeply emotional level.”
                </FooterText>
            </ResumeFooter>
        </ResumeContainer>
    );
};

export default Resume;