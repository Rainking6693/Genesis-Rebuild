import { Experiment } from './experiment';

export interface AbTestResult {
  variant: 'A' | 'B';
  value: number;
}

export interface AbTestOptions {
  variantA: number;
  variantB: number;
  experimentId: string;
  sampleSize: number;
}

export class AbTest {
  private results: AbTestResult[] = [];

  public constructor(private options: AbTestOptions) {}

  public async run(): Promise<number> {
    // Create a new experiment instance with the provided details
    const experiment = new Experiment(this.options.experimentId, this.options.sampleSize);

    // Randomly assign the sampleSize number of users to either variant A or B
    try {
      this.results = await experiment.run(this.options.variantA, this.options.variantB);
    } catch (error) {
      console.error(`Error running A/B test: ${error}`);
      throw error;
    }

    // Calculate the sum of the results (either variant A or B, depending on the experiment outcome)
    let sum = 0;
    for (const result of this.results) {
      sum += result.value;
    }

    return sum;
  }
}

// Usage
const abTestOptions: AbTestOptions = {
  variantA: 10,
  variantB: 20,
  experimentId: 'my-experiment',
  sampleSize: 1000,
};

const abTest = new AbTest(abTestOptions);
abTest.run().then((result) => {
  console.log(`A/B test result: ${result}`);
}).catch((error) => {
  console.error(`Error: ${error}`);
});

import { Experiment } from './experiment';

export interface AbTestResult {
  variant: 'A' | 'B';
  value: number;
}

export interface AbTestOptions {
  variantA: number;
  variantB: number;
  experimentId: string;
  sampleSize: number;
}

export class AbTest {
  private results: AbTestResult[] = [];

  public constructor(private options: AbTestOptions) {}

  public async run(): Promise<number> {
    // Create a new experiment instance with the provided details
    const experiment = new Experiment(this.options.experimentId, this.options.sampleSize);

    // Randomly assign the sampleSize number of users to either variant A or B
    try {
      this.results = await experiment.run(this.options.variantA, this.options.variantB);
    } catch (error) {
      console.error(`Error running A/B test: ${error}`);
      throw error;
    }

    // Calculate the sum of the results (either variant A or B, depending on the experiment outcome)
    let sum = 0;
    for (const result of this.results) {
      sum += result.value;
    }

    return sum;
  }
}

// Usage
const abTestOptions: AbTestOptions = {
  variantA: 10,
  variantB: 20,
  experimentId: 'my-experiment',
  sampleSize: 1000,
};

const abTest = new AbTest(abTestOptions);
abTest.run().then((result) => {
  console.log(`A/B test result: ${result}`);
}).catch((error) => {
  console.error(`Error: ${error}`);
});