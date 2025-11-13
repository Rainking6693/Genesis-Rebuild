import { validate, ValidationError, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';

// Custom validation decorator for score limits
@ValidatorConstraint({ name: 'customScoreLimit', async: true })
class CustomScoreLimit implements ValidatorConstraintInterface {
  validate(value: number, args: any[]) {
    const [min, max] = args;
    return value >= min && value <= max;
  }
}

registerDecorator({
  name: 'customScoreLimit',
  target: () => number,
  options: (options: ValidationOptions) => ({
    message: 'Score must be between ${min} and ${max}',
    constraints: [options.min, options.max],
  }),
  validator: CustomScoreLimit,
});

interface SustainabilityScore {
  score1: number;
  score2: number;
}

class SustainabilityScoreValidator {
  @validate()
  @customScoreLimit(1, 100)
  score1!: number;

  @validate()
  @customScoreLimit(1, 100)
  score2!: number;

  async validate(): Promise<void> {
    const errors = await this.$validate();
    if (errors.length > 0) {
      throw new Error("Invalid scores provided.");
    }
  }
}

function isSustainabilityScore(obj: any): obj is SustainabilityScore {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'score1' in obj &&
    'score2' in obj &&
    typeof obj.score1 === 'number' &&
    typeof obj.score2 === 'number'
  );
}

async function calculateSustainabilityImpactScore(sustainabilityScore: SustainabilityScore): Promise<number> {
  if (!isSustainabilityScore(sustainabilityScore)) {
    throw new Error("Invalid scores provided.");
  }

  const validator = new SustainabilityScoreValidator();
  await validator.validate();

  // Calculate the sum of the scores
  const sum = sustainabilityScore.score1 + sustainabilityScore.score2;

  // Return the sum as the personalized sustainability impact score
  return sum;
}

import { validate, ValidationError, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';

// Custom validation decorator for score limits
@ValidatorConstraint({ name: 'customScoreLimit', async: true })
class CustomScoreLimit implements ValidatorConstraintInterface {
  validate(value: number, args: any[]) {
    const [min, max] = args;
    return value >= min && value <= max;
  }
}

registerDecorator({
  name: 'customScoreLimit',
  target: () => number,
  options: (options: ValidationOptions) => ({
    message: 'Score must be between ${min} and ${max}',
    constraints: [options.min, options.max],
  }),
  validator: CustomScoreLimit,
});

interface SustainabilityScore {
  score1: number;
  score2: number;
}

class SustainabilityScoreValidator {
  @validate()
  @customScoreLimit(1, 100)
  score1!: number;

  @validate()
  @customScoreLimit(1, 100)
  score2!: number;

  async validate(): Promise<void> {
    const errors = await this.$validate();
    if (errors.length > 0) {
      throw new Error("Invalid scores provided.");
    }
  }
}

function isSustainabilityScore(obj: any): obj is SustainabilityScore {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'score1' in obj &&
    'score2' in obj &&
    typeof obj.score1 === 'number' &&
    typeof obj.score2 === 'number'
  );
}

async function calculateSustainabilityImpactScore(sustainabilityScore: SustainabilityScore): Promise<number> {
  if (!isSustainabilityScore(sustainabilityScore)) {
    throw new Error("Invalid scores provided.");
  }

  const validator = new SustainabilityScoreValidator();
  await validator.validate();

  // Calculate the sum of the scores
  const sum = sustainabilityScore.score1 + sustainabilityScore.score2;

  // Return the sum as the personalized sustainability impact score
  return sum;
}