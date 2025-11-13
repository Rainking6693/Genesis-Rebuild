import { v4 as uuidv4 } from 'uuid';
import { IExperiment, ITestResult } from './interfaces';

interface IA_B_Testing {
  createExperiment(experimentConfig: IExperiment): string;
  enrollUserInExperiment(userId: string, experimentId: string): void;
  assignVariation(userId: string, experimentId: string, variation: number): void;
  recordUserAction(userId: string, event: string, experimentId?: string): void;
  getTestResult(experimentId: string): ITestResult | null;
}

class A_B_Testing implements IA_B_Testing {
  private experiments: Map<string, IExperiment> = new Map();
  private userActions: Map<string, Map<string, { count: number; experimentId: string }>> = new Map();

  constructor(private readonly userNotEnrolledErrorMessage = 'User not enrolled in experiment with ID {experimentId}.') {
  }

  createExperiment(experimentConfig: IExperiment): string {
    const id = uuidv4();
    this.experiments.set(id, experimentConfig);
    return id;
  }

  enrollUserInExperiment(userId: string, experimentId: string): void {
    if (!this.experiments.has(experimentId)) {
      throw new Error(`Experiment with ID ${experimentId} not found.`);
    }

    if (!this.userActions.has(userId)) {
      this.userActions.set(userId, new Map());
    }

    const userExperiments = this.userActions.get(userId);
    if (!userExperiments.has(experimentId)) {
      userExperiments.set(experimentId, { count: 0, experimentId });
    }
  }

  assignVariation(userId: string, experimentId: string, variation: number): void {
    if (!this.experiments.has(experimentId)) {
      throw new Error(`Experiment with ID ${experimentId} not found.`);
    }

    const userExperiments = this.userActions.get(userId);
    if (!userExperiments || !userExperiments.has(experimentId)) {
      throw new Error(this.userNotEnrolledErrorMessage);
    }

    userExperiments.set(experimentId, { count: 0, experimentId, variation });
  }

  recordUserAction(userId: string, event: string, experimentId?: string): void {
    if (!this.userActions.has(userId)) {
      throw new Error(`User not found.`);
    }

    const userActions = this.userActions.get(userId);
    if (!userActions) {
      return;
    }

    if (!experimentId) {
      userActions.forEach((value, key) => {
        if (key === event) {
          value.count++;
        }
      });
    } else {
      userActions.forEach((value, key) => {
        if (key === event && value.experimentId === experimentId) {
          value.count++;
        }
      });
    }
  }

  getTestResult(experimentId: string): ITestResult | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      return null;
    }

    const results: { [key: number]: number[] } = {};

    this.userActions.forEach((userActions, userId) => {
      userActions.forEach((value, key) => {
        if (key === experimentId) {
          if (!results[value.variation]) {
            results[value.variation] = [];
          }
          results[value.variation].push(value.count);
        }
      });
    });

    const totalUsers = this.userActions.size;
    const maxVariation = Math.max(...Object.keys(results));
    const bestVariationResult = results[maxVariation];

    return {
      experimentId,
      variation: maxVariation,
      totalUsers,
      averageEvents: bestVariationResult.reduce((acc, val) => acc + val, 0) / bestVariationResult.length,
      bestResultEvents: bestVariationResult,
    };
  }
}

export { A_B_Testing };

import { v4 as uuidv4 } from 'uuid';
import { IExperiment, ITestResult } from './interfaces';

interface IA_B_Testing {
  createExperiment(experimentConfig: IExperiment): string;
  enrollUserInExperiment(userId: string, experimentId: string): void;
  assignVariation(userId: string, experimentId: string, variation: number): void;
  recordUserAction(userId: string, event: string, experimentId?: string): void;
  getTestResult(experimentId: string): ITestResult | null;
}

class A_B_Testing implements IA_B_Testing {
  private experiments: Map<string, IExperiment> = new Map();
  private userActions: Map<string, Map<string, { count: number; experimentId: string }>> = new Map();

  constructor(private readonly userNotEnrolledErrorMessage = 'User not enrolled in experiment with ID {experimentId}.') {
  }

  createExperiment(experimentConfig: IExperiment): string {
    const id = uuidv4();
    this.experiments.set(id, experimentConfig);
    return id;
  }

  enrollUserInExperiment(userId: string, experimentId: string): void {
    if (!this.experiments.has(experimentId)) {
      throw new Error(`Experiment with ID ${experimentId} not found.`);
    }

    if (!this.userActions.has(userId)) {
      this.userActions.set(userId, new Map());
    }

    const userExperiments = this.userActions.get(userId);
    if (!userExperiments.has(experimentId)) {
      userExperiments.set(experimentId, { count: 0, experimentId });
    }
  }

  assignVariation(userId: string, experimentId: string, variation: number): void {
    if (!this.experiments.has(experimentId)) {
      throw new Error(`Experiment with ID ${experimentId} not found.`);
    }

    const userExperiments = this.userActions.get(userId);
    if (!userExperiments || !userExperiments.has(experimentId)) {
      throw new Error(this.userNotEnrolledErrorMessage);
    }

    userExperiments.set(experimentId, { count: 0, experimentId, variation });
  }

  recordUserAction(userId: string, event: string, experimentId?: string): void {
    if (!this.userActions.has(userId)) {
      throw new Error(`User not found.`);
    }

    const userActions = this.userActions.get(userId);
    if (!userActions) {
      return;
    }

    if (!experimentId) {
      userActions.forEach((value, key) => {
        if (key === event) {
          value.count++;
        }
      });
    } else {
      userActions.forEach((value, key) => {
        if (key === event && value.experimentId === experimentId) {
          value.count++;
        }
      });
    }
  }

  getTestResult(experimentId: string): ITestResult | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      return null;
    }

    const results: { [key: number]: number[] } = {};

    this.userActions.forEach((userActions, userId) => {
      userActions.forEach((value, key) => {
        if (key === experimentId) {
          if (!results[value.variation]) {
            results[value.variation] = [];
          }
          results[value.variation].push(value.count);
        }
      });
    });

    const totalUsers = this.userActions.size;
    const maxVariation = Math.max(...Object.keys(results));
    const bestVariationResult = results[maxVariation];

    return {
      experimentId,
      variation: maxVariation,
      totalUsers,
      averageEvents: bestVariationResult.reduce((acc, val) => acc + val, 0) / bestVariationResult.length,
      bestResultEvents: bestVariationResult,
    };
  }
}

export { A_B_Testing };