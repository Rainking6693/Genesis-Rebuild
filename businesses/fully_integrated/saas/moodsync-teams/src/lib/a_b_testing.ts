import { ABTest } from 'ab-testing-library';
import { MoodSyncData } from '../data/MoodSyncData';
import { MoodSyncConfig } from '../config/MoodSyncConfig';
import { MoodSyncLogger } from '../utils/MoodSyncLogger';

interface TestResult {
  testId: number;
  testVariant: string;
  result: string | null;
  startTime: Date;
  endTime?: Date;
}

enum TestStatus {
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

class MoodSyncABTesting {
  private readonly abTest: ABTest;
  private readonly data: MoodSyncData;
  private readonly config: MoodSyncConfig;
  private readonly logger: MoodSyncLogger;
  private testResults: TestResult[] = [];

  constructor() {
    this.data = new MoodSyncData();
    this.config = new MoodSyncConfig();
    this.logger = new MoodSyncLogger();
    this.abTest = new ABTest(this.config.getABTestKey(), this.data.getABTestData);
  }

  public runTest(testId: number, testVariant: string): void {
    const test = this.testResults.find((t) => t.testId === testId);

    if (test) {
      if (test.endTime) {
        this.logger.warn(`Test with ID ${testId} has already been completed.`);
        return;
      }
      this.logger.warn(`Test with ID ${testId} is still running.`);
      return;
    }

    const newTest: TestResult = {
      testId,
      testVariant,
      result: null,
      startTime: new Date(),
    };

    this.abTest.runTest(testId, testVariant, (result) => {
      newTest.result = result;
      newTest.endTime = new Date();
      this.testResults.push(newTest);
      this.logger.info(`Test result for testId ${testId}: ${result}`);
      // Perform actions based on the test result, such as applying interventions or adjusting team dynamics
    });
  }

  public getTestStatus(testId: number): TestStatus | null {
    const test = this.testResults.find((t) => t.testId === testId);

    if (!test) {
      return null;
    }

    if (test.endTime) {
      return test.result ? TestStatus.COMPLETED : TestStatus.FAILED;
    }

    return TestStatus.RUNNING;
  }

  public getTestResults(): TestResult[] {
    return this.testResults;
  }

  public clearTestResults(): void {
    this.testResults = [];
  }
}

export const abTesting = new MoodSyncABTesting();

import { ABTest } from 'ab-testing-library';
import { MoodSyncData } from '../data/MoodSyncData';
import { MoodSyncConfig } from '../config/MoodSyncConfig';
import { MoodSyncLogger } from '../utils/MoodSyncLogger';

interface TestResult {
  testId: number;
  testVariant: string;
  result: string | null;
  startTime: Date;
  endTime?: Date;
}

enum TestStatus {
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

class MoodSyncABTesting {
  private readonly abTest: ABTest;
  private readonly data: MoodSyncData;
  private readonly config: MoodSyncConfig;
  private readonly logger: MoodSyncLogger;
  private testResults: TestResult[] = [];

  constructor() {
    this.data = new MoodSyncData();
    this.config = new MoodSyncConfig();
    this.logger = new MoodSyncLogger();
    this.abTest = new ABTest(this.config.getABTestKey(), this.data.getABTestData);
  }

  public runTest(testId: number, testVariant: string): void {
    const test = this.testResults.find((t) => t.testId === testId);

    if (test) {
      if (test.endTime) {
        this.logger.warn(`Test with ID ${testId} has already been completed.`);
        return;
      }
      this.logger.warn(`Test with ID ${testId} is still running.`);
      return;
    }

    const newTest: TestResult = {
      testId,
      testVariant,
      result: null,
      startTime: new Date(),
    };

    this.abTest.runTest(testId, testVariant, (result) => {
      newTest.result = result;
      newTest.endTime = new Date();
      this.testResults.push(newTest);
      this.logger.info(`Test result for testId ${testId}: ${result}`);
      // Perform actions based on the test result, such as applying interventions or adjusting team dynamics
    });
  }

  public getTestStatus(testId: number): TestStatus | null {
    const test = this.testResults.find((t) => t.testId === testId);

    if (!test) {
      return null;
    }

    if (test.endTime) {
      return test.result ? TestStatus.COMPLETED : TestStatus.FAILED;
    }

    return TestStatus.RUNNING;
  }

  public getTestResults(): TestResult[] {
    return this.testResults;
  }

  public clearTestResults(): void {
    this.testResults = [];
  }
}

export const abTesting = new MoodSyncABTesting();