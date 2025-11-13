import assert from 'assert';

interface ImpactCategory {
  length: 16;
  value: string;
}

interface ImpactValue {
  value: number;
  min: number;
}

function validateInput(
  category: ImpactCategory,
  value: ImpactValue,
  baseValue: ImpactValue,
  improvementFactor: ImpactValue
): void {
  assert.ok(typeof category === 'string', 'Invalid ImpactCategory');
  assert.ok(category.length === 16, 'ImpactCategory must have a length of 16');

  assert.ok(typeof value.value === 'number', 'Invalid ImpactValue');
  assert.ok(value.value >= 0, 'ImpactValue must be greater than or equal to 0');

  assert.ok(typeof baseValue.value === 'number', 'Invalid BaseValue');
  assert.ok(baseValue.value >= 0, 'BaseValue must be greater than or equal to 0');

  assert.ok(typeof improvementFactor.value === 'number', 'Invalid ImprovementFactor');
  assert.ok(improvementFactor.value > 0, 'ImprovementFactor must be greater than 0');
}

function calculateSustainabilityImpactScore(
  category: ImpactCategory,
  value: ImpactValue,
  baseValue: ImpactValue,
  improvementFactor: ImpactValue
): ImpactValue {
  validateInput(category, value, baseValue, improvementFactor);

  const impactScore = (value.value - baseValue.value) * improvementFactor.value;
  return { value: impactScore > 0 ? impactScore : 0 };
}

// Usage example:
const energyConsumption = 1000;
const carbonEmissions = 500;
const baseValue = 500;
const improvementFactor = 0.1;

try {
  const energyImpactScore = calculateSustainabilityImpactScore(
    { value: 'energyConsumption', length: 16 },
    { value: energyConsumption, min: 0 },
    { value: baseValue, min: 0 },
    { value: improvementFactor, min: 0 }
  );
  console.log(`Energy Consumption Impact Score: ${energyImpactScore.value}`);

  const carbonImpactScore = calculateSustainabilityImpactScore(
    { value: 'carbonEmissions', length: 16 },
    { value: carbonEmissions, min: 0 },
    { value: baseValue, min: 0 },
    { value: improvementFactor, min: 0 }
  );
  console.log(`Carbon Emissions Impact Score: ${carbonImpactScore.value}`);
} catch (error) {
  console.error(error.message);
}

import assert from 'assert';

interface ImpactCategory {
  length: 16;
  value: string;
}

interface ImpactValue {
  value: number;
  min: number;
}

function validateInput(
  category: ImpactCategory,
  value: ImpactValue,
  baseValue: ImpactValue,
  improvementFactor: ImpactValue
): void {
  assert.ok(typeof category === 'string', 'Invalid ImpactCategory');
  assert.ok(category.length === 16, 'ImpactCategory must have a length of 16');

  assert.ok(typeof value.value === 'number', 'Invalid ImpactValue');
  assert.ok(value.value >= 0, 'ImpactValue must be greater than or equal to 0');

  assert.ok(typeof baseValue.value === 'number', 'Invalid BaseValue');
  assert.ok(baseValue.value >= 0, 'BaseValue must be greater than or equal to 0');

  assert.ok(typeof improvementFactor.value === 'number', 'Invalid ImprovementFactor');
  assert.ok(improvementFactor.value > 0, 'ImprovementFactor must be greater than 0');
}

function calculateSustainabilityImpactScore(
  category: ImpactCategory,
  value: ImpactValue,
  baseValue: ImpactValue,
  improvementFactor: ImpactValue
): ImpactValue {
  validateInput(category, value, baseValue, improvementFactor);

  const impactScore = (value.value - baseValue.value) * improvementFactor.value;
  return { value: impactScore > 0 ? impactScore : 0 };
}

// Usage example:
const energyConsumption = 1000;
const carbonEmissions = 500;
const baseValue = 500;
const improvementFactor = 0.1;

try {
  const energyImpactScore = calculateSustainabilityImpactScore(
    { value: 'energyConsumption', length: 16 },
    { value: energyConsumption, min: 0 },
    { value: baseValue, min: 0 },
    { value: improvementFactor, min: 0 }
  );
  console.log(`Energy Consumption Impact Score: ${energyImpactScore.value}`);

  const carbonImpactScore = calculateSustainabilityImpactScore(
    { value: 'carbonEmissions', length: 16 },
    { value: carbonEmissions, min: 0 },
    { value: baseValue, min: 0 },
    { value: improvementFactor, min: 0 }
  );
  console.log(`Carbon Emissions Impact Score: ${carbonImpactScore.value}`);
} catch (error) {
  console.error(error.message);
}