import { v4 as uuidv4 } from 'uuid';

type AuditLog = {
  id: string;
  timestamp: Date;
  action: string;
  data: Record<string, any>; // Use Record to ensure keys are strings
};

const auditLogs: AuditLog[] = [];

function validateInput(input: AuditLog): asserts input is AuditLog {
  if (
    !input ||
    typeof input.timestamp !== 'object' ||
    !input.timestamp instanceof Date ||
    typeof input.action !== 'string' ||
    !Array.isArray(input.data) && !isPlainObject(input.data)
  ) {
    throw new Error('Invalid audit log format.');
  }
}

function isPlainObject(obj: any): obj is Record<string, any> {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function add(action: string, data: Record<string, any>): AuditLog {
  const log: AuditLog = {
    id: uuidv4(),
    timestamp: new Date(),
    action,
    data,
  };

  // Input validation to ensure correctness and quality
  validateInput(log);

  // Add the log to the array and log it for auditing
  auditLogs.push(log);
  logAndAudit(log);

  // Return the log for further processing if needed
  return log;
}

function logAndAudit(log: AuditLog) {
  console.log(`[Audit Log] ${JSON.stringify(log)}`);
}

// Example usage:
const log = add('Content created', { title: 'My awesome content', author: 'John Doe' });
console.log(`Added log with ID: ${log.id}`);

// Add error handling for writing audit logs to a file or database
function writeAuditLogs() {
  try {
    // Write audit logs to a file or database
    // ...
  } catch (error) {
    console.error(`Error writing audit logs: ${error.message}`);
  }
}

import { v4 as uuidv4 } from 'uuid';

type AuditLog = {
  id: string;
  timestamp: Date;
  action: string;
  data: Record<string, any>; // Use Record to ensure keys are strings
};

const auditLogs: AuditLog[] = [];

function validateInput(input: AuditLog): asserts input is AuditLog {
  if (
    !input ||
    typeof input.timestamp !== 'object' ||
    !input.timestamp instanceof Date ||
    typeof input.action !== 'string' ||
    !Array.isArray(input.data) && !isPlainObject(input.data)
  ) {
    throw new Error('Invalid audit log format.');
  }
}

function isPlainObject(obj: any): obj is Record<string, any> {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function add(action: string, data: Record<string, any>): AuditLog {
  const log: AuditLog = {
    id: uuidv4(),
    timestamp: new Date(),
    action,
    data,
  };

  // Input validation to ensure correctness and quality
  validateInput(log);

  // Add the log to the array and log it for auditing
  auditLogs.push(log);
  logAndAudit(log);

  // Return the log for further processing if needed
  return log;
}

function logAndAudit(log: AuditLog) {
  console.log(`[Audit Log] ${JSON.stringify(log)}`);
}

// Example usage:
const log = add('Content created', { title: 'My awesome content', author: 'John Doe' });
console.log(`Added log with ID: ${log.id}`);

// Add error handling for writing audit logs to a file or database
function writeAuditLogs() {
  try {
    // Write audit logs to a file or database
    // ...
  } catch (error) {
    console.error(`Error writing audit logs: ${error.message}`);
  }
}