import { AuditLog } from './AuditLog';

/**
 * Interface for validating the input array of event IDs
 */
interface ValidEventList {
  length: number;
  every(callback: (value: number) => boolean): boolean;
}

/**
 * Function to log events related to the CarbonCopy AI platform usage
 * @param eventList - List of events to be logged
 */
export function logEvents(eventList: number[]): void {
  // Validate input and handle edge cases
  if (!Array.isArray(eventList)) {
    throw new Error('Invalid input. Please provide an array.');
  }

  const isValidEventList = (arr: number[]): arr is ValidEventList =>
    arr.every((item) => typeof item === 'number');

  const validEventList = eventList.filter(isValidEventList);

  if (validEventList.length === 0) {
    throw new Error('Invalid input. Please provide an array of numbers.');
  }

  // Log events
  validEventList.forEach((event) => {
    // Create an instance of AuditLog and log the event
    const log = new AuditLog(event);
    log.save()
      .catch((error) => {
        console.error(`Failed to log event ${event}:`, error);
      });
  });
}

import { AuditLog } from './AuditLog';

/**
 * Interface for validating the input array of event IDs
 */
interface ValidEventList {
  length: number;
  every(callback: (value: number) => boolean): boolean;
}

/**
 * Function to log events related to the CarbonCopy AI platform usage
 * @param eventList - List of events to be logged
 */
export function logEvents(eventList: number[]): void {
  // Validate input and handle edge cases
  if (!Array.isArray(eventList)) {
    throw new Error('Invalid input. Please provide an array.');
  }

  const isValidEventList = (arr: number[]): arr is ValidEventList =>
    arr.every((item) => typeof item === 'number');

  const validEventList = eventList.filter(isValidEventList);

  if (validEventList.length === 0) {
    throw new Error('Invalid input. Please provide an array of numbers.');
  }

  // Log events
  validEventList.forEach((event) => {
    // Create an instance of AuditLog and log the event
    const log = new AuditLog(event);
    log.save()
      .catch((error) => {
        console.error(`Failed to log event ${event}:`, error);
      });
  });
}