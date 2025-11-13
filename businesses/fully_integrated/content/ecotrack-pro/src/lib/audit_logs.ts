import { AuditLog, AuditLogEntry } from './audit_log_model';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export class AuditLogs {
  private logs: AuditLog[] = [];

  // Validate input parameters to ensure they are provided and are non-empty strings
  private validateInput(action: string, actor: string, resource: string, details: any): void {
    if (!action || !actor || !resource || !action.trim() || !actor.trim() || !resource.trim()) {
      throw new Error('Missing required input parameters or empty strings: action, actor, resource');
    }
  }

  public createLogEntry(action: string, actor: string, resource: string, details: any): void {
    this.validateInput(action, actor, resource, details);

    const logEntry: AuditLogEntry = {
      id: uuidv4(),
      action,
      actor,
      resource,
      details,
      timestamp: moment().format(),
    };

    this.logs.push(new AuditLog(logEntry));
  }

  public getLogs(): AuditLog[] {
    return this.logs.map(log => new AuditLog(log));
  }

  public clearLogs(): void {
    this.logs = [];
  }
}

// Update the AuditLog class to handle empty details object and ensure it's an object
export class AuditLog {
  constructor(private logEntry: AuditLogEntry) {
    if (!this.logEntry.details || !Object.prototype.toString.call(this.logEntry.details) === '[object Object]') {
      this.logEntry.details = {};
    }
  }

  public get id(): string {
    return this.logEntry.id;
  }

  public get action(): string {
    return this.logEntry.action;
  }

  public get actor(): string {
    return this.logEntry.actor;
  }

  public get resource(): string {
    return this.logEntry.resource;
  }

  public get details(): any {
    return this.logEntry.details;
  }

  public get timestamp(): string {
    return this.logEntry.timestamp;
  }
}

// Add a method to filter logs by action, actor, and resource
export class AuditLogs {
  private logs: AuditLog[] = [];

  // Validate input parameters to ensure they are provided
  private validateInput(action: string, actor: string, resource: string, details: any): void {
    if (!action || !actor || !resource) {
      throw new Error('Missing required input parameters: action, actor, resource');
    }
  }

  public createLogEntry(action: string, actor: string, resource: string, details: any): void {
    this.validateInput(action, actor, resource, details);

    const logEntry: AuditLogEntry = {
      id: uuidv4(),
      action,
      actor,
      resource,
      details,
      timestamp: moment().format(),
    };

    this.logs.push(new AuditLog(logEntry));
  }

  public getLogs(): AuditLog[] {
    return this.logs.map(log => new AuditLog(log));
  }

  public clearLogs(): void {
    this.logs = [];
  }

  // Filter logs based on provided filters
  public filterLogs(filters: { action?: string, actor?: string, resource?: string } = {}): AuditLog[] {
    return this.logs.filter(log => {
      const { action, actor, resource } = filters;
      return (!action || log.action === action) &&
             (!actor || log.actor === actor) &&
             (!resource || log.resource === resource);
    }).map(log => new AuditLog(log));
  }
}

import { AuditLog, AuditLogEntry } from './audit_log_model';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export class AuditLogs {
  private logs: AuditLog[] = [];

  // Validate input parameters to ensure they are provided and are non-empty strings
  private validateInput(action: string, actor: string, resource: string, details: any): void {
    if (!action || !actor || !resource || !action.trim() || !actor.trim() || !resource.trim()) {
      throw new Error('Missing required input parameters or empty strings: action, actor, resource');
    }
  }

  public createLogEntry(action: string, actor: string, resource: string, details: any): void {
    this.validateInput(action, actor, resource, details);

    const logEntry: AuditLogEntry = {
      id: uuidv4(),
      action,
      actor,
      resource,
      details,
      timestamp: moment().format(),
    };

    this.logs.push(new AuditLog(logEntry));
  }

  public getLogs(): AuditLog[] {
    return this.logs.map(log => new AuditLog(log));
  }

  public clearLogs(): void {
    this.logs = [];
  }
}

// Update the AuditLog class to handle empty details object and ensure it's an object
export class AuditLog {
  constructor(private logEntry: AuditLogEntry) {
    if (!this.logEntry.details || !Object.prototype.toString.call(this.logEntry.details) === '[object Object]') {
      this.logEntry.details = {};
    }
  }

  public get id(): string {
    return this.logEntry.id;
  }

  public get action(): string {
    return this.logEntry.action;
  }

  public get actor(): string {
    return this.logEntry.actor;
  }

  public get resource(): string {
    return this.logEntry.resource;
  }

  public get details(): any {
    return this.logEntry.details;
  }

  public get timestamp(): string {
    return this.logEntry.timestamp;
  }
}

// Add a method to filter logs by action, actor, and resource
export class AuditLogs {
  private logs: AuditLog[] = [];

  // Validate input parameters to ensure they are provided
  private validateInput(action: string, actor: string, resource: string, details: any): void {
    if (!action || !actor || !resource) {
      throw new Error('Missing required input parameters: action, actor, resource');
    }
  }

  public createLogEntry(action: string, actor: string, resource: string, details: any): void {
    this.validateInput(action, actor, resource, details);

    const logEntry: AuditLogEntry = {
      id: uuidv4(),
      action,
      actor,
      resource,
      details,
      timestamp: moment().format(),
    };

    this.logs.push(new AuditLog(logEntry));
  }

  public getLogs(): AuditLog[] {
    return this.logs.map(log => new AuditLog(log));
  }

  public clearLogs(): void {
    this.logs = [];
  }

  // Filter logs based on provided filters
  public filterLogs(filters: { action?: string, actor?: string, resource?: string } = {}): AuditLog[] {
    return this.logs.filter(log => {
      const { action, actor, resource } = filters;
      return (!action || log.action === action) &&
             (!actor || log.actor === actor) &&
             (!resource || log.resource === resource);
    }).map(log => new AuditLog(log));
  }
}