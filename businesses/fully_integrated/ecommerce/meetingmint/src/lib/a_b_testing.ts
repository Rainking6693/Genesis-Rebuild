import { v4 as uuidv4 } from 'uuid';

enum TestStatus {
  ACTIVE = 'active',
  ENDED = 'ended',
  INVALID = 'invalid',
}

interface TestVariant {
  id: string;
  name: string;
  description: string;
  percentage: number;
}

interface TestEvent {
  type: TestStatus;
  testId: string;
  timestamp: Date;
}

interface Test {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: TestStatus;
  events: TestEvent[];
  variants: TestVariant[];
}

interface TestRepository {
  createTest(test: Test): Promise<Test>;
  getActiveTest(testId: string): Promise<Test | null>;
  getAllActiveTests(): Promise<Test[]>;
}

class TestService {
  private repository: TestRepository;

  constructor(repository: TestRepository) {
    this.repository = repository;
  }

  async createTest(name: string, description: string, startDate: Date, endDate: Date, variants: TestVariant[]): Promise<Test> {
    const test = this.validateTest(name, description, startDate, endDate, variants);
    const createdTest = await this.repository.createTest(test);
    this.repository.saveTestEvents(createdTest.id, TestStatus.ACTIVE, new Date());
    return createdTest;
  }

  private validateTest(name: string, description: string, startDate: Date, endDate: Date, variants: TestVariant[]): Test {
    const test = createTest(name, description, startDate, endDate, variants);
    this.validateTestInput(test);
    return test;
  }

  private validateTestInput(test: Test): void {
    if (!test.name || !test.description || !test.startDate || !test.endDate || !test.variants || test.variants.length < 2) {
      throw new Error('All input parameters are required.');
    }

    const totalPercentage = test.variants.reduce((acc, variant) => acc + variant.percentage, 0);

    test.variants.forEach((variant) => {
      if (variant.percentage <= 0 || variant.percentage >= 100 || variant.percentage > totalPercentage) {
        throw new Error('Variant percentage should be between 0 and 100 and should not exceed the total test percentage.');
      }
    });
  }

  private getActiveVariants(test: Test): TestVariant[] {
    return test.variants.filter((variant) => test.status === TestStatus.ACTIVE);
  }

  private getTotalActivePercentage(test: Test): number {
    return this.getActiveVariants(test).reduce((acc, variant) => acc + variant.percentage, 0);
  }

  private getRandomWeightedIndex(arr: number[], weights: number[]): number {
    let totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    let randomWeight = Math.random() * totalWeight;
    let cumulativeWeight = 0;

    for (let i = 0; i < arr.length; i++) {
      cumulativeWeight += weights[i];
      if (randomWeight <= cumulativeWeight) {
        return i;
      }
    }

    return arr.length - 1;
  }

  private selectVariant(test: Test, visitorId: string): TestVariant {
    const activeVariants = this.getActiveVariants(test);
    const totalActivePercentage = this.getTotalActivePercentage(test);
    const randomIndex = this.getRandomWeightedIndex(activeVariants.map((variant) => variant.percentage / totalActivePercentage), activeVariants.map((variant) => variant.percentage));
    return activeVariants[randomIndex];
  }

  private handleVisitorSelection(test: Test, visitorId: string): TestVariant {
    const selectedVariant = this.selectVariant(test, visitorId);
    this.repository.saveTestEvents(test.id, TestStatus.ACTIVE, new Date());
    return selectedVariant;
  }

  async runA_B_Test(testName: string, testDescription: string, startDate: Date, endDate: Date, variant1: TestVariant, variant2: TestVariant): Promise<Test> {
    const test = this.createTest(testName, testDescription, startDate, endDate, [variant1, variant2]);
    const createdTest = await this.repository.createTest(test);
    this.repository.saveTestEvents(createdTest.id, TestStatus.ACTIVE, new Date());
    return createdTest;
  }
}

import { TestService } from './test-service';
import { TestRepositoryInMemory } from './test-repository-in-memory';

const repository = new TestRepositoryInMemory();
const testService = new TestService(repository);

// Create a new test
const test = await testService.runA_B_Test('Test Name', 'Test Description', new Date(), new Date(new Date().getTime() + 3600000), {
  id: uuidv4(),
  name: 'Variant 1',
  description: 'Description for Variant 1',
  percentage: 50,
}, {
  id: uuidv4(),
  name: 'Variant 2',
  description: 'Description for Variant 2',
  percentage: 50,
});

// Handle a visitor's selection
const selectedVariant = testService.handleVisitorSelection(test, 'visitorId');

import { v4 as uuidv4 } from 'uuid';

enum TestStatus {
  ACTIVE = 'active',
  ENDED = 'ended',
  INVALID = 'invalid',
}

interface TestVariant {
  id: string;
  name: string;
  description: string;
  percentage: number;
}

interface TestEvent {
  type: TestStatus;
  testId: string;
  timestamp: Date;
}

interface Test {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: TestStatus;
  events: TestEvent[];
  variants: TestVariant[];
}

interface TestRepository {
  createTest(test: Test): Promise<Test>;
  getActiveTest(testId: string): Promise<Test | null>;
  getAllActiveTests(): Promise<Test[]>;
}

class TestService {
  private repository: TestRepository;

  constructor(repository: TestRepository) {
    this.repository = repository;
  }

  async createTest(name: string, description: string, startDate: Date, endDate: Date, variants: TestVariant[]): Promise<Test> {
    const test = this.validateTest(name, description, startDate, endDate, variants);
    const createdTest = await this.repository.createTest(test);
    this.repository.saveTestEvents(createdTest.id, TestStatus.ACTIVE, new Date());
    return createdTest;
  }

  private validateTest(name: string, description: string, startDate: Date, endDate: Date, variants: TestVariant[]): Test {
    const test = createTest(name, description, startDate, endDate, variants);
    this.validateTestInput(test);
    return test;
  }

  private validateTestInput(test: Test): void {
    if (!test.name || !test.description || !test.startDate || !test.endDate || !test.variants || test.variants.length < 2) {
      throw new Error('All input parameters are required.');
    }

    const totalPercentage = test.variants.reduce((acc, variant) => acc + variant.percentage, 0);

    test.variants.forEach((variant) => {
      if (variant.percentage <= 0 || variant.percentage >= 100 || variant.percentage > totalPercentage) {
        throw new Error('Variant percentage should be between 0 and 100 and should not exceed the total test percentage.');
      }
    });
  }

  private getActiveVariants(test: Test): TestVariant[] {
    return test.variants.filter((variant) => test.status === TestStatus.ACTIVE);
  }

  private getTotalActivePercentage(test: Test): number {
    return this.getActiveVariants(test).reduce((acc, variant) => acc + variant.percentage, 0);
  }

  private getRandomWeightedIndex(arr: number[], weights: number[]): number {
    let totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    let randomWeight = Math.random() * totalWeight;
    let cumulativeWeight = 0;

    for (let i = 0; i < arr.length; i++) {
      cumulativeWeight += weights[i];
      if (randomWeight <= cumulativeWeight) {
        return i;
      }
    }

    return arr.length - 1;
  }

  private selectVariant(test: Test, visitorId: string): TestVariant {
    const activeVariants = this.getActiveVariants(test);
    const totalActivePercentage = this.getTotalActivePercentage(test);
    const randomIndex = this.getRandomWeightedIndex(activeVariants.map((variant) => variant.percentage / totalActivePercentage), activeVariants.map((variant) => variant.percentage));
    return activeVariants[randomIndex];
  }

  private handleVisitorSelection(test: Test, visitorId: string): TestVariant {
    const selectedVariant = this.selectVariant(test, visitorId);
    this.repository.saveTestEvents(test.id, TestStatus.ACTIVE, new Date());
    return selectedVariant;
  }

  async runA_B_Test(testName: string, testDescription: string, startDate: Date, endDate: Date, variant1: TestVariant, variant2: TestVariant): Promise<Test> {
    const test = this.createTest(testName, testDescription, startDate, endDate, [variant1, variant2]);
    const createdTest = await this.repository.createTest(test);
    this.repository.saveTestEvents(createdTest.id, TestStatus.ACTIVE, new Date());
    return createdTest;
  }
}

import { TestService } from './test-service';
import { TestRepositoryInMemory } from './test-repository-in-memory';

const repository = new TestRepositoryInMemory();
const testService = new TestService(repository);

// Create a new test
const test = await testService.runA_B_Test('Test Name', 'Test Description', new Date(), new Date(new Date().getTime() + 3600000), {
  id: uuidv4(),
  name: 'Variant 1',
  description: 'Description for Variant 1',
  percentage: 50,
}, {
  id: uuidv4(),
  name: 'Variant 2',
  description: 'Description for Variant 2',
  percentage: 50,
});

// Handle a visitor's selection
const selectedVariant = testService.handleVisitorSelection(test, 'visitorId');

You can now use the `TestService` class to manage your A/B testing component: