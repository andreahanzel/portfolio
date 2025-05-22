// src/utils/resumeDownload.ts
// This utility function is responsible for downloading the resume as a PDF
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Function to download the resume as a PDF
export const downloadResumeAsPDF = async (elementId: string = 'resume-container') => {
    try {
        // Add loading state
        console.log('Starting PDF generation...');
        
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`Element with id "${elementId}" not found`);
            alert('Resume element not found. Please try again.');
            return;
        }
        
        // Wait for any animations to complete
        await new Promise(resolve => setTimeout(resolve, 500));

        // Configure html2canvas with optimized settings
        const canvas = await html2canvas(element, {
            scale: 1.5, // Reduced from 2 for better performance
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            logging: false,
            width: element.scrollWidth,
            height: element.scrollHeight,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
            // Fix for styled-components
            ignoreElements: (node) => {
                // Skip any problematic elements
                return node.tagName === 'SCRIPT' || node.tagName === 'STYLE';
            }
        });

        console.log('Canvas created successfully');

        const imgData = canvas.toDataURL('image/png', 0.95);
        
        // A4 size in mm
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Calculate image dimensions to fit PDF with margins
        const margin = 10; // 10mm margin
        const availableWidth = pdfWidth - (margin * 2);
        const imgWidth = availableWidth;
        const imgHeight = (canvas.height * availableWidth) / canvas.width;
        
        // Add the image to PDF
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
        
        // If content is longer than one page, handle pagination
        let heightLeft = imgHeight;
        let position = margin;
        
        while (heightLeft >= (pdfHeight - margin * 2)) {
            position = heightLeft - imgHeight + margin;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= (pdfHeight - margin * 2);
        }
        
        // Generate filename with current date
        const currentDate = new Date().toISOString().split('T')[0];
        const filename = `Andrea_Toreki_Resume_${currentDate}.pdf`;
        
        // Download the PDF
        pdf.save(filename);
        
        console.log('PDF downloaded successfully');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('There was an error generating the PDF. Please try again or contact support.');
    }
};

// Alternative direct download method
export const downloadResumeAsFormattedPDF = () => {
    try {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Set up page margins
        const margin = 20;
        let yPosition = margin;
        
        // Header
        pdf.setFontSize(28);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Andrea Toreki', pdf.internal.pageSize.getWidth() / 2, yPosition, { align: 'center' });
        
        yPosition += 10;
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Full-Stack Developer & UX/UI Designer', pdf.internal.pageSize.getWidth() / 2, yPosition, { align: 'center' });
        
        yPosition += 8;
        pdf.setFontSize(10);
        pdf.text('hello@andreatoreki.com | +1 (510) 604-0802', pdf.internal.pageSize.getWidth() / 2, yPosition, { align: 'center' });
        
        // Add separator line
        yPosition += 8;
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pdf.internal.pageSize.getWidth() - margin, yPosition);
        
        // Professional Summary
        yPosition += 12;
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Professional Summary', margin, yPosition);
        
        yPosition += 8;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        // Add summary text
        const summaryText = [
            '• Visionary Full-Stack Developer with 3+ years of cutting-edge engineering excellence',
            '• AI-powered technical architect specializing in React, TypeScript, and intelligent automation',
            '• Elite performance optimizer at Google, achieving 95%+ algorithmic precision',
            '• Brand storytelling virtuoso with a decade of marketing innovation experience'
        ];
        
        // Split text into lines that fit within the PDF width
        summaryText.forEach(text => {
            const lines = pdf.splitTextToSize(text, pdf.internal.pageSize.getWidth() - (margin * 2));
            lines.forEach((line: string) => {
                pdf.text(line, margin, yPosition);
                yPosition += 5;
            });
            yPosition += 2;
        });
        
        // Experience Section
        yPosition += 8;
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Experience', margin, yPosition);
        
        yPosition += 8;
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Senior Quality Assurance Specialist & AI Workflow Architect', margin, yPosition);
        
        yPosition += 5;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.text('Google (via Vaco LLC & Tech Firefly)', margin, yPosition);
        
        yPosition += 6;
        pdf.setFont('helvetica', 'normal');
        const experiencePoints = [
            '• Engineered revolutionary quality assurance frameworks with 95% algorithmic precision',
            '• Architected intelligent automation pipelines using Google Apps Script and ML algorithms',
            '• Spearheaded cutting-edge front-end experiences for Google Help Center',
            '• Orchestrated cross-functional synergies between data science and engineering teams'
        ];
        
        experiencePoints.forEach(point => {
            const lines = pdf.splitTextToSize(point, pdf.internal.pageSize.getWidth() - (margin * 2));
            lines.forEach((line: string) => {
                pdf.text(line, margin, yPosition);
                yPosition += 4;
            });
        });
        
        // Skills Section
        yPosition += 10;
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Technical Skills', margin, yPosition);
        
        yPosition += 8;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        // Add skills categories
        const skills = [
            'Frontend: React, TypeScript, Next.js, JavaScript, HTML5/CSS3, Styled Components',
            'Backend: Node.js, Python, MongoDB, PostgreSQL, RESTful APIs, GraphQL',
            'Design: Figma, Adobe Creative Suite, UI/UX Design, Brand Strategy',
            'Tools: Git, Google Cloud Platform, AI Workflows, Advanced Analytics'
        ];
        
        skills.forEach(skillCategory => {
            const lines = pdf.splitTextToSize(`• ${skillCategory}`, pdf.internal.pageSize.getWidth() - (margin * 2));
            lines.forEach((line: string) => {
                pdf.text(line, margin, yPosition);
                yPosition += 5;
            });
        });
        
        // Education
        yPosition += 10;
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Education', margin, yPosition);
        
        yPosition += 8;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('• Bachelor of Science in Applied Technologies - Brigham Young University, Idaho', margin, yPosition);
        yPosition += 5;
        pdf.text('• Business Administration - Project Management - William Jessup University', margin, yPosition);
        
        // Generate filename
        const currentDate = new Date().toISOString().split('T')[0];
        const filename = `Andrea_Toreki_Resume_Formatted_${currentDate}.pdf`;
        
        pdf.save(filename);
        console.log('Formatted PDF downloaded successfully');
        
    } catch (error) {
        console.error('Error generating formatted PDF:', error);
        alert('There was an error generating the PDF. Please try again.');
    }
};