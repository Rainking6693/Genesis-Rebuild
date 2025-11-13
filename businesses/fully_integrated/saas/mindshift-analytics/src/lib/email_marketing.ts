import { validateEmail } from './email-validator';

interface Name {
    name: string;
}

interface EmailService {
    sendEmail(recipientEmail: string, subject: string, body: string): Promise<void>;
}

function validateEmailParameters(recipientEmail: string, name: Name, wellnessRecommendations: string[], burnoutRiskLevel: number): void {
    if (!recipientEmail || !name || !wellnessRecommendations || !Array.isArray(wellnessRecommendations) || !burnoutRiskLevel || typeof burnoutRiskLevel !== 'number' || burnoutRiskLevel < 0 || burnoutRiskLevel > 100) {
        throw new Error('Invalid parameters provided');
    }

    if (!name.name || !name.name.trim()) {
        throw new Error('Name cannot be empty');
    }

    if (!wellnessRecommendations.length) {
        throw new Error('Wellness recommendations cannot be empty');
    }

    if (burnoutRiskLevel > 100) {
        throw new Error('Burnout risk level should be between 0 and 100');
    }
}

function sendPersonalizedWellnessEmail(recipientEmail: string, name: Name, wellnessRecommendations: string[], burnoutRiskLevel: number, emailService: EmailService): void {
    if (!emailService.sendEmail || !validateEmail) {
        throw new Error('EmailService or EmailValidator not found');
    }

    validateEmailParameters(recipientEmail, name, wellnessRecommendations, burnoutRiskLevel);

    const recipientEmailValid = validateEmail(recipientEmail);
    if (!recipientEmailValid) {
        throw new Error('Invalid email address format');
    }

    const subject = `MindShift Analytics: Personalized Wellness Recommendations for ${name.name}`;
    const body = `Hello ${name.name},\n\nBased on our analysis, we've identified a burnout risk level of ${burnoutRiskLevel}%. To help you maintain your mental health and boost productivity, we recommend the following actions:\n\n${wellnessRecommendations.join('\n')}\n\nStay healthy and productive!\n\nBest regards,\nThe MindShift Analytics Team`;

    emailService.sendEmail(recipientEmail, subject, body)
        .then(() => console.log('Email sent successfully'))
        .catch((error) => {
            console.error('Error sending email:', error);
            throw error;
        });
}

import { validateEmail } from './email-validator';

interface Name {
    name: string;
}

interface EmailService {
    sendEmail(recipientEmail: string, subject: string, body: string): Promise<void>;
}

function validateEmailParameters(recipientEmail: string, name: Name, wellnessRecommendations: string[], burnoutRiskLevel: number): void {
    if (!recipientEmail || !name || !wellnessRecommendations || !Array.isArray(wellnessRecommendations) || !burnoutRiskLevel || typeof burnoutRiskLevel !== 'number' || burnoutRiskLevel < 0 || burnoutRiskLevel > 100) {
        throw new Error('Invalid parameters provided');
    }

    if (!name.name || !name.name.trim()) {
        throw new Error('Name cannot be empty');
    }

    if (!wellnessRecommendations.length) {
        throw new Error('Wellness recommendations cannot be empty');
    }

    if (burnoutRiskLevel > 100) {
        throw new Error('Burnout risk level should be between 0 and 100');
    }
}

function sendPersonalizedWellnessEmail(recipientEmail: string, name: Name, wellnessRecommendations: string[], burnoutRiskLevel: number, emailService: EmailService): void {
    if (!emailService.sendEmail || !validateEmail) {
        throw new Error('EmailService or EmailValidator not found');
    }

    validateEmailParameters(recipientEmail, name, wellnessRecommendations, burnoutRiskLevel);

    const recipientEmailValid = validateEmail(recipientEmail);
    if (!recipientEmailValid) {
        throw new Error('Invalid email address format');
    }

    const subject = `MindShift Analytics: Personalized Wellness Recommendations for ${name.name}`;
    const body = `Hello ${name.name},\n\nBased on our analysis, we've identified a burnout risk level of ${burnoutRiskLevel}%. To help you maintain your mental health and boost productivity, we recommend the following actions:\n\n${wellnessRecommendations.join('\n')}\n\nStay healthy and productive!\n\nBest regards,\nThe MindShift Analytics Team`;

    emailService.sendEmail(recipientEmail, subject, body)
        .then(() => console.log('Email sent successfully'))
        .catch((error) => {
            console.error('Error sending email:', error);
            throw error;
        });
}