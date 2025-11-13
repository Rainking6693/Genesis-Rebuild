import { BusinessOperationsData, SupplyChainData, CustomerBehaviorData } from './dataTypes';

interface Weights {
  operations: number;
  supplyChain: number;
  customerBehavior: number;
}

function validateWeights(weights: Weights): void {
  const totalWeight = weights.operations + weights.supplyChain + weights.customerBehavior;
  if (totalWeight !== 1) {
    throw new Error('The sum of weights should be equal to 1.');
  }

  if (weights.operations < 0 || weights.supplyChain < 0 || weights.customerBehavior < 0) {
    throw new Error('Weights should be non-negative.');
  }
}

function validateInputData(
  businessOperationsData: BusinessOperationsData | null,
  supplyChainData: SupplyChainData | null,
  customerBehaviorData: CustomerBehaviorData | null
): void {
  if (!businessOperationsData || !supplyChainData || !customerBehaviorData) {
    throw new Error('All data sets are required for EcoScore calculation.');
  }
}

function isNumeric(value: any): value is number {
  return typeof value === 'number' && isFinite(value);
}

function calculateNormalizedScore(data: any, weight: number): number {
  let total = 0;
  let count = 0;

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      if (isNumeric(value)) {
        total += value * weight;
        count++;
      }
    }
  }

  return total / count;
}

function calculateWeightedAverage(data: any, weights: Weights): number {
  let total = 0;
  let count = 0;

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      if (isNumeric(value)) {
        total += value * weights[key];
        count++;
      }
    }
  }

  return total / count;
}

const DEFAULT_WEIGHTS: Weights = {
  operations: 0.3,
  supplyChain: 0.4,
  customerBehavior: 0.3
};

function calculateEcoScore(
  businessOperationsData: BusinessOperationsData,
  supplyChainData: SupplyChainData,
  customerBehaviorData: CustomerBehaviorData,
  weights: Weights = DEFAULT_WEIGHTS
): number {
  validateWeights(weights);
  validateInputData(businessOperationsData, supplyChainData, customerBehaviorData);

  const normalizedOperationsScore = calculateNormalizedScore(businessOperationsData, weights.operations);
  const normalizedSupplyChainScore = calculateNormalizedScore(supplyChainData, weights.supplyChain);
  const normalizedCustomerBehaviorScore = calculateNormalizedScore(customerBehaviorData, weights.customerBehavior);

  return calculateWeightedAverage({
    operations: normalizedOperationsScore,
    supplyChain: normalizedSupplyChainScore,
    customerBehavior: normalizedCustomerBehaviorScore
  }, weights);
}

import { BusinessOperationsData, SupplyChainData, CustomerBehaviorData } from './dataTypes';

interface Weights {
  operations: number;
  supplyChain: number;
  customerBehavior: number;
}

function validateWeights(weights: Weights): void {
  const totalWeight = weights.operations + weights.supplyChain + weights.customerBehavior;
  if (totalWeight !== 1) {
    throw new Error('The sum of weights should be equal to 1.');
  }

  if (weights.operations < 0 || weights.supplyChain < 0 || weights.customerBehavior < 0) {
    throw new Error('Weights should be non-negative.');
  }
}

function validateInputData(
  businessOperationsData: BusinessOperationsData | null,
  supplyChainData: SupplyChainData | null,
  customerBehaviorData: CustomerBehaviorData | null
): void {
  if (!businessOperationsData || !supplyChainData || !customerBehaviorData) {
    throw new Error('All data sets are required for EcoScore calculation.');
  }
}

function isNumeric(value: any): value is number {
  return typeof value === 'number' && isFinite(value);
}

function calculateNormalizedScore(data: any, weight: number): number {
  let total = 0;
  let count = 0;

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      if (isNumeric(value)) {
        total += value * weight;
        count++;
      }
    }
  }

  return total / count;
}

function calculateWeightedAverage(data: any, weights: Weights): number {
  let total = 0;
  let count = 0;

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      if (isNumeric(value)) {
        total += value * weights[key];
        count++;
      }
    }
  }

  return total / count;
}

const DEFAULT_WEIGHTS: Weights = {
  operations: 0.3,
  supplyChain: 0.4,
  customerBehavior: 0.3
};

function calculateEcoScore(
  businessOperationsData: BusinessOperationsData,
  supplyChainData: SupplyChainData,
  customerBehaviorData: CustomerBehaviorData,
  weights: Weights = DEFAULT_WEIGHTS
): number {
  validateWeights(weights);
  validateInputData(businessOperationsData, supplyChainData, customerBehaviorData);

  const normalizedOperationsScore = calculateNormalizedScore(businessOperationsData, weights.operations);
  const normalizedSupplyChainScore = calculateNormalizedScore(supplyChainData, weights.supplyChain);
  const normalizedCustomerBehaviorScore = calculateNormalizedScore(customerBehaviorData, weights.customerBehavior);

  return calculateWeightedAverage({
    operations: normalizedOperationsScore,
    supplyChain: normalizedSupplyChainScore,
    customerBehavior: normalizedCustomerBehaviorScore
  }, weights);
}