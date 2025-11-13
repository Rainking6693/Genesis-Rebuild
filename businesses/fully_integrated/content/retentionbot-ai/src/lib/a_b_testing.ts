import { IABTest, ITestResult } from './interfaces';
import { v4 as uuidv4 } from 'uuid';

class ABTesting {
  private tests: Map<string, IABTest>;

  constructor() {
    this.tests = new Map();
  }

  public createTest(name: string, variationA: any, variationB: any): void {
    const test: IABTest = {
      id: uuidv4(),
      name,
      variations: [variationA, variationB],
      status: 'pending',
      results: [],
    };

    this.tests.set(test.id, test);
  }

  public startTest(testId: string): void {
    const test = this.tests.get(testId);

    if (!test) {
      throw new Error('Test not found');
    }

    if (test.status !== 'pending') {
      throw new Error('Test is already active or completed');
    }

    test.status = 'active';
  }

  public stopTest(testId: string): void {
    const test = this.tests.get(testId);

    if (!test) {
      throw new Error('Test not found');
    }

    if (test.status !== 'active') {
      throw new Error('Test is not active');
    }

    test.status = 'completed';
    test.results.push({
      timestamp: new Date(),
      // Add any metrics or user data you want to track
    });
  }

  public getTestResult(testId: string): ITestResult | null {
    const test = this.tests.get(testId);

    if (!test) {
      return null;
    }

    return test.results[test.results.length - 1];
  }

  public getTestByName(name: string): IABTest | null {
    return Array.from(this.tests.values()).find((test) => test.name === name);
  }

  public getTestByStatus(status: 'pending' | 'active' | 'completed'): IABTest[] {
    return Array.from(this.tests.values()).filter((test) => test.status === status);
  }

  public hasTest(testId: string): boolean {
    return this.tests.has(testId);
  }
}

export { ABTesting };

import { IABTest, ITestResult } from './interfaces';
import { v4 as uuidv4 } from 'uuid';

class ABTesting {
  private tests: Map<string, IABTest>;

  constructor() {
    this.tests = new Map();
  }

  public createTest(name: string, variationA: any, variationB: any): void {
    const test: IABTest = {
      id: uuidv4(),
      name,
      variations: [variationA, variationB],
      status: 'pending',
      results: [],
    };

    this.tests.set(test.id, test);
  }

  public startTest(testId: string): void {
    const test = this.tests.get(testId);

    if (!test) {
      throw new Error('Test not found');
    }

    if (test.status !== 'pending') {
      throw new Error('Test is already active or completed');
    }

    test.status = 'active';
  }

  public stopTest(testId: string): void {
    const test = this.tests.get(testId);

    if (!test) {
      throw new Error('Test not found');
    }

    if (test.status !== 'active') {
      throw new Error('Test is not active');
    }

    test.status = 'completed';
    test.results.push({
      timestamp: new Date(),
      // Add any metrics or user data you want to track
    });
  }

  public getTestResult(testId: string): ITestResult | null {
    const test = this.tests.get(testId);

    if (!test) {
      return null;
    }

    return test.results[test.results.length - 1];
  }

  public getTestByName(name: string): IABTest | null {
    return Array.from(this.tests.values()).find((test) => test.name === name);
  }

  public getTestByStatus(status: 'pending' | 'active' | 'completed'): IABTest[] {
    return Array.from(this.tests.values()).filter((test) => test.status === status);
  }

  public hasTest(testId: string): boolean {
    return this.tests.has(testId);
  }
}

export { ABTesting };