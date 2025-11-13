import { validate as isValid } from 'class-validator';

interface SustainabilityScoreInput {
  carbonFootprint?: number;
  energyEfficiencyScore?: number;
}

type SustainabilityScore = number;

async function validateInput(input: SustainabilityScoreInput): Promise<void> {
  const validationOptions = { forbidNonWhitelisted: true };
  const validationErrors = await isValid(input, validationOptions);

  if (validationErrors.length > 0) {
    const errorMessages = validationErrors.map((error) => error.property + ': ' + error.message);
    throw new Error(`Invalid input: ${errorMessages.join(', ')}`);
  }
}

async function calculateSustainabilityScore(input: SustainabilityScoreInput): Promise<SustainabilityScore> {
  await validateInput(input);

  const { carbonFootprint = 0, energyEfficiencyScore = 0 } = input;

  // Calculate the total sustainability score
  const totalScore = carbonFootprint + energyEfficiencyScore;

  // Optimize performance by returning the result directly
  return totalScore;
}

// Add a function to check if the calculated score is within a reasonable range
function isValidSustainabilityScore(score: SustainabilityScore): boolean {
  return score >= 0 && score <= 100;
}

// Use the new functions
(async () => {
  try {
    const input: SustainabilityScoreInput = { carbonFootprint: -1, energyEfficiencyScore: 100 };
    const score = await calculateSustainabilityScore(input);

    if (!isValidSustainabilityScore(score)) {
      throw new Error('The calculated sustainability score is not valid.');
    }

    console.log(`Calculated sustainability score: ${score}`);
  } catch (error) {
    console.error(error.message);
  }
})();

import { validate as isValid } from 'class-validator';

interface SustainabilityScoreInput {
  carbonFootprint?: number;
  energyEfficiencyScore?: number;
}

type SustainabilityScore = number;

async function validateInput(input: SustainabilityScoreInput): Promise<void> {
  const validationOptions = { forbidNonWhitelisted: true };
  const validationErrors = await isValid(input, validationOptions);

  if (validationErrors.length > 0) {
    const errorMessages = validationErrors.map((error) => error.property + ': ' + error.message);
    throw new Error(`Invalid input: ${errorMessages.join(', ')}`);
  }
}

async function calculateSustainabilityScore(input: SustainabilityScoreInput): Promise<SustainabilityScore> {
  await validateInput(input);

  const { carbonFootprint = 0, energyEfficiencyScore = 0 } = input;

  // Calculate the total sustainability score
  const totalScore = carbonFootprint + energyEfficiencyScore;

  // Optimize performance by returning the result directly
  return totalScore;
}

// Add a function to check if the calculated score is within a reasonable range
function isValidSustainabilityScore(score: SustainabilityScore): boolean {
  return score >= 0 && score <= 100;
}

// Use the new functions
(async () => {
  try {
    const input: SustainabilityScoreInput = { carbonFootprint: -1, energyEfficiencyScore: 100 };
    const score = await calculateSustainabilityScore(input);

    if (!isValidSustainabilityScore(score)) {
      throw new Error('The calculated sustainability score is not valid.');
    }

    console.log(`Calculated sustainability score: ${score}`);
  } catch (error) {
    console.error(error.message);
  }
})();