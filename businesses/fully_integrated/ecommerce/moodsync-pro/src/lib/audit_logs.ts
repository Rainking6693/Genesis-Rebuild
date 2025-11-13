import { AuditLogEntry, IAuditLogEntry } from './AuditLogEntry';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { readFileSync, writeFileSync } from 'fs';

// Promisify the fs.writeFile function for asynchronous writing
const writeFile = promisify(fs.writeFile);

// Define a constant for the logs file path
const LOGS_FILE_PATH = path.join(__dirname, 'audit_logs.json');

export async function logAudit(userID: string, action: string, data?: any): Promise<void> {
  const logEntry: IAuditLogEntry = {
    id: uuidv4(),
    userID,
    action,
    timestamp: new Date(),
    data,
  };

  // Store the log entry securely and efficiently
  try {
    const logs = readFileSync(LOGS_FILE_PATH, 'utf-8');
    const parsedLogs = JSON.parse(logs);
    await writeFile(LOGS_FILE_PATH, JSON.stringify([...parsedLogs, logEntry], null, 2));
  } catch (err) {
    console.error(`Error writing audit logs: ${err}`);
  }
}

export async function getAuditLogs(userID?: string, pageSize?: number, pageNumber?: number): Promise<AuditLogEntry[]> {
  let logsData: IAuditLogEntry[] = [];

  try {
    const rawData = await readFile(LOGS_FILE_PATH);
    logsData = JSON.parse(rawData);
  } catch (err) {
    console.error(`Error reading audit logs: ${err}`);
  }

  // Retrieve the logs securely and efficiently
  const filteredLogs = logsData.filter((log) => (userID ? log.userID === userID : true));

  // Implement pagination for large log files
  if (pageSize && pageNumber) {
    const startIndex = pageSize * pageNumber;
    return filteredLogs.slice(startIndex, startIndex + pageSize);
  }

  return filteredLogs;
}

// Helper function to read the logs file
function readFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error(`Error reading file: ${err}`);
    throw err;
  }
}

import { AuditLogEntry, IAuditLogEntry } from './AuditLogEntry';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { readFileSync, writeFileSync } from 'fs';

// Promisify the fs.writeFile function for asynchronous writing
const writeFile = promisify(fs.writeFile);

// Define a constant for the logs file path
const LOGS_FILE_PATH = path.join(__dirname, 'audit_logs.json');

export async function logAudit(userID: string, action: string, data?: any): Promise<void> {
  const logEntry: IAuditLogEntry = {
    id: uuidv4(),
    userID,
    action,
    timestamp: new Date(),
    data,
  };

  // Store the log entry securely and efficiently
  try {
    const logs = readFileSync(LOGS_FILE_PATH, 'utf-8');
    const parsedLogs = JSON.parse(logs);
    await writeFile(LOGS_FILE_PATH, JSON.stringify([...parsedLogs, logEntry], null, 2));
  } catch (err) {
    console.error(`Error writing audit logs: ${err}`);
  }
}

export async function getAuditLogs(userID?: string, pageSize?: number, pageNumber?: number): Promise<AuditLogEntry[]> {
  let logsData: IAuditLogEntry[] = [];

  try {
    const rawData = await readFile(LOGS_FILE_PATH);
    logsData = JSON.parse(rawData);
  } catch (err) {
    console.error(`Error reading audit logs: ${err}`);
  }

  // Retrieve the logs securely and efficiently
  const filteredLogs = logsData.filter((log) => (userID ? log.userID === userID : true));

  // Implement pagination for large log files
  if (pageSize && pageNumber) {
    const startIndex = pageSize * pageNumber;
    return filteredLogs.slice(startIndex, startIndex + pageSize);
  }

  return filteredLogs;
}

// Helper function to read the logs file
function readFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error(`Error reading file: ${err}`);
    throw err;
  }
}