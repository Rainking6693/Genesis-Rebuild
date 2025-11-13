import { AuditLog, AuditLogEntry } from './audit_log_model';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { ILoggable } from '../interfaces/ILoggable';
import { promisify } from 'util';
import fs from 'fs';
import { encrypt, decrypt } from './encryption'; // Assuming you have an encryption module

export class AuditLogs implements ILoggable {
  private logs: AuditLog[] = [];
  private logFile = 'audit_logs.json';
  private maxLogSize = 10000; // Maximum number of logs to store

  public async log(entry: AuditLogEntry): Promise<void> {
    const logEntry: AuditLog = {
      id: uuidv4(),
      timestamp: moment().format(),
      user: entry.user || 'Anonymous',
      action: entry.action,
      data: entry.data,
      ipAddress: entry.ipAddress,
    };

    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogSize) {
      this.logs.shift(); // Remove the oldest log if the limit is reached
    }
    await this.saveLogs(logEntry);
  }

  private async saveLogs(logEntry: AuditLog): Promise<void> {
    try {
      const encryptedLogEntry = await encrypt(JSON.stringify(logEntry));
      await promisify(fs.appendFile)(this.logFile, encryptedLogEntry + '\n');
    } catch (error) {
      console.error(`Error saving log: ${error.message}`);
    }
  }

  public async getLogs(limit: number = 100): Promise<AuditLog[]> {
    let logs: AuditLog[] = [];

    try {
      const rawData = await promisify(fs.readFile)(this.logFile, 'utf8');
      const encryptedLogs = rawData.split('\n');
      logs = await Promise.all(encryptedLogs.slice(-limit).map(async (encryptedLog) => {
        if (encryptedLog) {
          const decryptedLog = await decrypt(encryptedLog);
          return JSON.parse(decryptedLog);
        }
        return null;
      }));
      logs = logs.filter((log): log is AuditLog => log !== null);
    } catch (error) {
      console.error(`Error loading logs: ${error.message}`);
    }

    return logs;
  }
}

import { AuditLog, AuditLogEntry } from './audit_log_model';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { ILoggable } from '../interfaces/ILoggable';
import { promisify } from 'util';
import fs from 'fs';
import { encrypt, decrypt } from './encryption'; // Assuming you have an encryption module

export class AuditLogs implements ILoggable {
  private logs: AuditLog[] = [];
  private logFile = 'audit_logs.json';
  private maxLogSize = 10000; // Maximum number of logs to store

  public async log(entry: AuditLogEntry): Promise<void> {
    const logEntry: AuditLog = {
      id: uuidv4(),
      timestamp: moment().format(),
      user: entry.user || 'Anonymous',
      action: entry.action,
      data: entry.data,
      ipAddress: entry.ipAddress,
    };

    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogSize) {
      this.logs.shift(); // Remove the oldest log if the limit is reached
    }
    await this.saveLogs(logEntry);
  }

  private async saveLogs(logEntry: AuditLog): Promise<void> {
    try {
      const encryptedLogEntry = await encrypt(JSON.stringify(logEntry));
      await promisify(fs.appendFile)(this.logFile, encryptedLogEntry + '\n');
    } catch (error) {
      console.error(`Error saving log: ${error.message}`);
    }
  }

  public async getLogs(limit: number = 100): Promise<AuditLog[]> {
    let logs: AuditLog[] = [];

    try {
      const rawData = await promisify(fs.readFile)(this.logFile, 'utf8');
      const encryptedLogs = rawData.split('\n');
      logs = await Promise.all(encryptedLogs.slice(-limit).map(async (encryptedLog) => {
        if (encryptedLog) {
          const decryptedLog = await decrypt(encryptedLog);
          return JSON.parse(decryptedLog);
        }
        return null;
      }));
      logs = logs.filter((log): log is AuditLog => log !== null);
    } catch (error) {
      console.error(`Error loading logs: ${error.message}`);
    }

    return logs;
  }
}