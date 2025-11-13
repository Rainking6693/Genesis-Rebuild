import { CarbonEmissionData, RequiredCarbonEmissionData } from './carbon-emission-data';
import { NewsletterTemplate, NewsletterContent } from './newsletter-template';

export type WeeklySustainabilityNewsletter = {
  personalization: string;
  content: string;
  signOff: string;
};

export function generateWeeklySustainabilityNewsletter(carbonData: CarbonEmissionData): WeeklySustainabilityNewsletter | null {
  if (!carbonData) {
    console.error('Invalid or null carbon emission data');
    return null;
  }

  if (!isCompleteCarbonData(carbonData)) {
    console.error('Incomplete carbon emission data');
    return null;
  }

  try {
    const newsletterTemplate = new NewsletterTemplate();
    const newsletterContent = newsletterTemplate.generateContent(carbonData);

    if (!newsletterContent) {
      console.error('Failed to generate newsletter content');
      return null;
    }

    const personalization = `Dear [Business Name],`;
    const signOff = `Best regards,
    The Carbon Copilot Team`;

    const finalNewsletterContent: WeeklySustainabilityNewsletter = {
      personalization,
      content: newsletterContent.toString(),
      signOff,
    };

    return finalNewsletterContent;
  } catch (error) {
    console.error('An error occurred while generating the newsletter:', error);
    return null;
  }
}

function isCompleteCarbonData(carbonData: CarbonEmissionData): carbonData is RequiredCarbonEmissionData {
  return (
    carbonData.emissions !== undefined &&
    carbonData.costSavings !== undefined
  );
}

// In NewsletterTemplate.ts
export interface NewsletterContent {
  // ... existing properties
  personalization?: string;
  content: string;
  signOff?: string;
}

// In CarbonEmissionData.ts
export interface CarbonEmissionData {
  emissions: number;
  costSavings: number;
}

export interface RequiredCarbonEmissionData extends CarbonEmissionData { }

import { CarbonEmissionData, RequiredCarbonEmissionData } from './carbon-emission-data';
import { NewsletterTemplate, NewsletterContent } from './newsletter-template';

export type WeeklySustainabilityNewsletter = {
  personalization: string;
  content: string;
  signOff: string;
};

export function generateWeeklySustainabilityNewsletter(carbonData: CarbonEmissionData): WeeklySustainabilityNewsletter | null {
  if (!carbonData) {
    console.error('Invalid or null carbon emission data');
    return null;
  }

  if (!isCompleteCarbonData(carbonData)) {
    console.error('Incomplete carbon emission data');
    return null;
  }

  try {
    const newsletterTemplate = new NewsletterTemplate();
    const newsletterContent = newsletterTemplate.generateContent(carbonData);

    if (!newsletterContent) {
      console.error('Failed to generate newsletter content');
      return null;
    }

    const personalization = `Dear [Business Name],`;
    const signOff = `Best regards,
    The Carbon Copilot Team`;

    const finalNewsletterContent: WeeklySustainabilityNewsletter = {
      personalization,
      content: newsletterContent.toString(),
      signOff,
    };

    return finalNewsletterContent;
  } catch (error) {
    console.error('An error occurred while generating the newsletter:', error);
    return null;
  }
}

function isCompleteCarbonData(carbonData: CarbonEmissionData): carbonData is RequiredCarbonEmissionData {
  return (
    carbonData.emissions !== undefined &&
    carbonData.costSavings !== undefined
  );
}

// In NewsletterTemplate.ts
export interface NewsletterContent {
  // ... existing properties
  personalization?: string;
  content: string;
  signOff?: string;
}

// In CarbonEmissionData.ts
export interface CarbonEmissionData {
  emissions: number;
  costSavings: number;
}

export interface RequiredCarbonEmissionData extends CarbonEmissionData { }