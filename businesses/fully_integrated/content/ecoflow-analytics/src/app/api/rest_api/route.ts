import { Request, Response, NextFunction } from 'express';

// Define a constant for the environment variable containing valid API keys.
const API_KEY = process.env.API_KEY;
const validApiKeys: string[] = API_KEY ? API_KEY.split(',') : [];

/**
 * Function to validate the provided API key.
 * Returns true if the API key is valid, false otherwise.
 */
function isValidApiKey(apiKey: string): boolean {
  return validApiKeys.includes(apiKey.trim());
}

/**
 * Function to validate the provided data for the calculateSustainabilityScore function.
 * Returns an error if any of the properties are not numbers.
 */
function validateBusinessData(businessData: {
  energyUsage: number;
  wasteProduction: number;
  waterUsage: number;
}): businessData | Error {
  if (isNaN(businessData.energyUsage) || isNaN(businessData.wasteProduction) || isNaN(businessData.waterUsage)) {
    return new Error('Invalid data provided. EnergyUsage, WasteProduction, and WaterUsage must be numbers.');
  }

  return businessData;
}

/**
 * Function to calculate the sustainability score for a small business.
 * This function takes a validated object as an argument, containing the necessary data.
 * The object should have the following properties:
 * - energyUsage: Energy consumption of the business in kWh.
 * - wasteProduction: Waste produced by the business in kg.
 * - waterUsage: Water consumption of the business in m³.
 *
 * Returns the calculated sustainability score as a number between 0 and 100.
 */
export function calculateSustainabilityScore(businessData: {
  energyUsage: number;
  wasteProduction: number;
  waterUsage: number;
}): number {
  // Implement the logic to calculate the sustainability score based on the provided data.
  // For simplicity, let's assume a linear calculation for this example.

  const energyWeight = 50;
  const wasteWeight = 30;
  const waterWeight = 20;

  const energyScore = (100 - (businessData.energyUsage / 10000)) * energyWeight;
  const wasteScore = (100 - (businessData.wasteProduction / 1000)) * wasteWeight;
  const waterScore = (100 - (businessData.waterUsage / 1000)) * waterWeight;

  return energyScore + wasteScore + waterScore;
}

/**
 * Function to generate marketing content around the green initiatives of a small business.
 * This function takes an object as an argument, containing the necessary data.
 * The object should have the following properties:
 * - businessName: The name of the small business.
 * - sustainabilityScore: The calculated sustainability score of the business.
 *
 * Returns a string containing the generated marketing content.
 */
export function generateMarketingContent(businessData: {
  businessName: string;
  sustainabilityScore: number;
}): string {
  // Implement the logic to generate marketing content based on the provided data.
  // For simplicity, let's assume a basic template for this example.

  const contentTemplate = `
Congratulations, ${businessData.businessName}!

Your sustainability score is ${businessData.sustainabilityScore}. Keep up the great work in reducing your environmental impact!

Share your green initiatives with your customers and attract eco-conscious consumers.
  `;

  return contentTemplate;
}

/**
 * Function to secure the API endpoints.
 * This function checks if the provided API key is valid.
 * If the API key is invalid, it returns a 401 Unauthorized response.
 *
 * This function should be used as a middleware for all API endpoints.
 */
export function apiKeyAuthentication(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || !isValidApiKey(apiKey)) {
    res.status(401).send('Unauthorized');
    return;
  }

  next();
}