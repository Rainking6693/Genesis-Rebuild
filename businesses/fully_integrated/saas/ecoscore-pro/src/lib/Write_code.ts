import { v4 as uuidv4 } from 'uuid';

type EcoScoreData = {
  operations?: number;
  supplyChain?: number;
  customerEngagement?: number;
};

function isValidEcoScoreData(data: EcoScoreData): data is NonNullable<EcoScoreData> {
  return (
    data.operations !== undefined &&
    data.supplyChain !== undefined &&
    data.customerEngagement !== undefined
  );
}

function calculateEcoScore(data: EcoScoreData): data is NonNullable<EcoScoreData> & { ecoScore?: string } {
  if (!isValidEcoScoreData(data)) {
    return undefined;
  }

  const weightOperations = 0.4;
  const weightSupplyChain = 0.3;
  const weightCustomerEngagement = 0.3;

  const score =
    weightOperations * (data.operations || 0) +
    weightSupplyChain * (data.supplyChain || 0) +
    weightCustomerEngagement * (data.customerEngagement || 0);

  // Return the EcoScore as a string with 2 decimal places or undefined if input data is invalid
  if (score >= 0 && score <= 1) {
    return { ...data, ecoScore: score.toFixed(2) };
  }

  console.error('Invalid EcoScore calculation');
  return undefined;
}

// Example usage
const ecoScoreData: EcoScoreData = {
  operations: 80,
  supplyChain: 70,
  customerEngagement: 90,
};

const ecoScoreResult = calculateEcoScore(ecoScoreData);
if (ecoScoreResult) {
  console.log(`EcoScore: ${ecoScoreResult.ecoScore}`);
} else {
  console.error('Invalid input data');
}

import { v4 as uuidv4 } from 'uuid';

type EcoScoreData = {
  operations?: number;
  supplyChain?: number;
  customerEngagement?: number;
};

function isValidEcoScoreData(data: EcoScoreData): data is NonNullable<EcoScoreData> {
  return (
    data.operations !== undefined &&
    data.supplyChain !== undefined &&
    data.customerEngagement !== undefined
  );
}

function calculateEcoScore(data: EcoScoreData): data is NonNullable<EcoScoreData> & { ecoScore?: string } {
  if (!isValidEcoScoreData(data)) {
    return undefined;
  }

  const weightOperations = 0.4;
  const weightSupplyChain = 0.3;
  const weightCustomerEngagement = 0.3;

  const score =
    weightOperations * (data.operations || 0) +
    weightSupplyChain * (data.supplyChain || 0) +
    weightCustomerEngagement * (data.customerEngagement || 0);

  // Return the EcoScore as a string with 2 decimal places or undefined if input data is invalid
  if (score >= 0 && score <= 1) {
    return { ...data, ecoScore: score.toFixed(2) };
  }

  console.error('Invalid EcoScore calculation');
  return undefined;
}

// Example usage
const ecoScoreData: EcoScoreData = {
  operations: 80,
  supplyChain: 70,
  customerEngagement: 90,
};

const ecoScoreResult = calculateEcoScore(ecoScoreData);
if (ecoScoreResult) {
  console.log(`EcoScore: ${ecoScoreResult.ecoScore}`);
} else {
  console.error('Invalid input data');
}