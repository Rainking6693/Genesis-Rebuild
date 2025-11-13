import { ABTest } from 'ab-testing-library';
import { IUser, ITestVariant } from '../interfaces';

class ABBTesting {
  private abTest: ABTest;
  private users: IUser[];
  private testVariants: ITestVariant[];
  private testId: string;
  private testByName: Map<string, ITestVariant[]>;

  constructor() {
    this.abTest = new ABTest();
    this.testById = new Map<string, ITestVariant>();
    this.testByName = new Map<string, ITestVariant[]>();
    this.testId = generateUniqueTestId();
  }

  public initialize(testName: string, users: IUser[], testVariants: ITestVariant[]) {
    this.users = users;
    this.testVariants = testVariants;
    this.abTest.setTestId(this.testId);
    this.abTest.setTestName(testName);
    this.abTest.setUsers(this.users);
    this.abTest.setTestVariants(this.testVariants);

    this.testById.set(this.testId, this.testVariants[0]); // Set the default variant for the test
    this.testByName.set(testName, this.testVariants);
  }

  public assignTestVariants() {
    this.abTest.start();
  }

  public getUserTestVariant(userId: string) {
    return this.abTest.getVariantForUser(userId);
  }

  public getTestId() {
    return this.testId;
  }

  public getTestByName(testName: string): ITestVariant {
    const testVariants = this.testByName.get(testName);
    if (!testVariants) {
      throw new Error(`Test with name "${testName}" not found.`);
    }
    return this.testById.get(testName) || testVariants[0]; // Return the default variant if not specified
  }
}

function generateUniqueTestId() {
  let id = 'test_';
  let counter = 1;

  while (true) {
    id += counter++;
    if (!getTestById(id)) {
      return id;
    }
  }

  function getTestById(testId: string) {
    // Assuming you have a way to get tests by id, e.g., from a database or a cache
    // Replace this with your actual implementation
    return false;
  }
}

export { ABBTesting };

import { ABTest } from 'ab-testing-library';
import { IUser, ITestVariant } from '../interfaces';

class ABBTesting {
  private abTest: ABTest;
  private users: IUser[];
  private testVariants: ITestVariant[];
  private testId: string;
  private testByName: Map<string, ITestVariant[]>;

  constructor() {
    this.abTest = new ABTest();
    this.testById = new Map<string, ITestVariant>();
    this.testByName = new Map<string, ITestVariant[]>();
    this.testId = generateUniqueTestId();
  }

  public initialize(testName: string, users: IUser[], testVariants: ITestVariant[]) {
    this.users = users;
    this.testVariants = testVariants;
    this.abTest.setTestId(this.testId);
    this.abTest.setTestName(testName);
    this.abTest.setUsers(this.users);
    this.abTest.setTestVariants(this.testVariants);

    this.testById.set(this.testId, this.testVariants[0]); // Set the default variant for the test
    this.testByName.set(testName, this.testVariants);
  }

  public assignTestVariants() {
    this.abTest.start();
  }

  public getUserTestVariant(userId: string) {
    return this.abTest.getVariantForUser(userId);
  }

  public getTestId() {
    return this.testId;
  }

  public getTestByName(testName: string): ITestVariant {
    const testVariants = this.testByName.get(testName);
    if (!testVariants) {
      throw new Error(`Test with name "${testName}" not found.`);
    }
    return this.testById.get(testName) || testVariants[0]; // Return the default variant if not specified
  }
}

function generateUniqueTestId() {
  let id = 'test_';
  let counter = 1;

  while (true) {
    id += counter++;
    if (!getTestById(id)) {
      return id;
    }
  }

  function getTestById(testId: string) {
    // Assuming you have a way to get tests by id, e.g., from a database or a cache
    // Replace this with your actual implementation
    return false;
  }
}

export { ABBTesting };