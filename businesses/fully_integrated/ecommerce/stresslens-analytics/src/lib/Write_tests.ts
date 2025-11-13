import { ICommunicationData, IBurnoutRisk, IWellnessIntervention } from './interfaces';
import { CustomError } from './logging';

export function analyzeCommunicationPatterns(communicationData: ICommunicationData): IBurnoutRisk & IWellnessIntervention {
  validateInputData(communicationData);

  const burnoutRisk = calculateBurnoutRisk(communicationData);
  const wellnessInterventions = generateWellnessInterventions(communicationData, burnoutRisk);

  return { burnoutRisk, wellnessInterventions };
}

function validateInputData(communicationData: ICommunicationData) {
  if (communicationData === null) {
    throw new CustomError('Input data is null');
  } else if (communicationData === undefined) {
    throw new CustomError('Input data is undefined');
  } else if (!communicationData.slack || !communicationData.emails || !communicationData.meetings) {
    throw new CustomError(`Missing properties in communication data: ${JSON.stringify(communicationData)}`);
  } else if (
    !Array.isArray(communicationData.slack) ||
    !Array.isArray(communicationData.emails) ||
    !Array.isArray(communicationData.meetings) ||
    communicationData.slack.length === 0 ||
    communicationData.emails.length === 0 ||
    communicationData.meetings.length === 0
  ) {
    throw new CustomError(`Communication data should be non-empty arrays: ${JSON.stringify(communicationData)}`);
  }

  // ... existing code ...
}

// ... other helper functions ...

// In logging.ts
export class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

import { ICommunicationData, IBurnoutRisk, IWellnessIntervention } from './interfaces';
import { CustomError } from './logging';

export function analyzeCommunicationPatterns(communicationData: ICommunicationData): IBurnoutRisk & IWellnessIntervention {
  validateInputData(communicationData);

  const burnoutRisk = calculateBurnoutRisk(communicationData);
  const wellnessInterventions = generateWellnessInterventions(communicationData, burnoutRisk);

  return { burnoutRisk, wellnessInterventions };
}

function validateInputData(communicationData: ICommunicationData) {
  if (communicationData === null) {
    throw new CustomError('Input data is null');
  } else if (communicationData === undefined) {
    throw new CustomError('Input data is undefined');
  } else if (!communicationData.slack || !communicationData.emails || !communicationData.meetings) {
    throw new CustomError(`Missing properties in communication data: ${JSON.stringify(communicationData)}`);
  } else if (
    !Array.isArray(communicationData.slack) ||
    !Array.isArray(communicationData.emails) ||
    !Array.isArray(communicationData.meetings) ||
    communicationData.slack.length === 0 ||
    communicationData.emails.length === 0 ||
    communicationData.meetings.length === 0
  ) {
    throw new CustomError(`Communication data should be non-empty arrays: ${JSON.stringify(communicationData)}`);
  }

  // ... existing code ...
}

// ... other helper functions ...

// In logging.ts
export class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}