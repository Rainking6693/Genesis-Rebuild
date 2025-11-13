import { AuditLogEntry, AuditLogEntryData } from './audit_log_entry';

type ValidAction = 'create' | 'update' | 'delete' | 'login' | 'logout';

export function createAuditLogEntry(userID: number, action: ValidAction, data?: AuditLogEntryData): AuditLogEntry {
    const timestamp = new Date().toISOString();
    const logEntry: AuditLogEntry = {
        userID,
        action,
        data,
        timestamp,
    };

    // Validate userID and action
    if (!Number.isInteger(userID) || userID < 1) {
        throw new Error('Invalid userID provided');
    }

    if (!action || !Object.values(AuditLogEntry.Action).includes(action as ValidAction)) {
        throw new Error(`Invalid action provided. Valid actions are: ${Object.values(AuditLogEntry.Action).join(', ')}.`);
    }

    // Sanitize data
    if (data) {
        // Implement data sanitization based on the specific data structure and requirements
        // For example, if data is a string, ensure it doesn't exceed a certain length
        if (typeof data === 'string' && data.length > 255) {
            throw new Error('Data is too long');
        }

        // Handle null or undefined values for data properties
        if (data && typeof data !== 'object') {
            throw new Error('Data should be an object');
        }

        // Iterate through data properties and validate each one
        for (const key in data) {
            if (!data.hasOwnProperty(key)) continue;

            const propertyType = typeof data[key];
            const expectedType = (AuditLogEntryData as any)[key]?.type;

            if (propertyType !== expectedType) {
                throw new Error(`Invalid data property type for "${key}". Expected type: ${expectedType}.`);
            }

            // Add additional validation rules for each property as needed
        }
    }

    return logEntry;
}

import { AuditLogEntry, AuditLogEntryData } from './audit_log_entry';

type ValidAction = 'create' | 'update' | 'delete' | 'login' | 'logout';

export function createAuditLogEntry(userID: number, action: ValidAction, data?: AuditLogEntryData): AuditLogEntry {
    const timestamp = new Date().toISOString();
    const logEntry: AuditLogEntry = {
        userID,
        action,
        data,
        timestamp,
    };

    // Validate userID and action
    if (!Number.isInteger(userID) || userID < 1) {
        throw new Error('Invalid userID provided');
    }

    if (!action || !Object.values(AuditLogEntry.Action).includes(action as ValidAction)) {
        throw new Error(`Invalid action provided. Valid actions are: ${Object.values(AuditLogEntry.Action).join(', ')}.`);
    }

    // Sanitize data
    if (data) {
        // Implement data sanitization based on the specific data structure and requirements
        // For example, if data is a string, ensure it doesn't exceed a certain length
        if (typeof data === 'string' && data.length > 255) {
            throw new Error('Data is too long');
        }

        // Handle null or undefined values for data properties
        if (data && typeof data !== 'object') {
            throw new Error('Data should be an object');
        }

        // Iterate through data properties and validate each one
        for (const key in data) {
            if (!data.hasOwnProperty(key)) continue;

            const propertyType = typeof data[key];
            const expectedType = (AuditLogEntryData as any)[key]?.type;

            if (propertyType !== expectedType) {
                throw new Error(`Invalid data property type for "${key}". Expected type: ${expectedType}.`);
            }

            // Add additional validation rules for each property as needed
        }
    }

    return logEntry;
}