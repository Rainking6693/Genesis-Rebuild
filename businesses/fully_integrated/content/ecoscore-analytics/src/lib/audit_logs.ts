import { v4 as uuidv4 } from 'uuid';
import logger from './logger';

type AuditEvent = {
  id: string;
  timestamp: Date;
  user_id: string;
  action: string;
  resource: string;
  details?: any; // details is optional
};

function validateUserID(user_id: string): string | null {
  const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!regex.test(user_id)) {
    logger.warn(`Invalid user ID provided: ${user_id}`);
    return null;
  }
  return user_id;
}

export function logAuditEvent(user_id: string, action: string, resource: string, details?: any): void {
  const validatedUserID = validateUserID(user_id);

  if (!validatedUserID) {
    logger.error('Error logging audit event: Invalid user ID');
    return;
  }

  const event: AuditEvent = {
    id: uuidv4(),
    timestamp: new Date(),
    user_id: validatedUserID,
    action,
    resource,
    details,
  };

  logger.info(`Audit Event: ${JSON.stringify(event)}`);
}

import { v4 as uuidv4 } from 'uuid';
import logger from './logger';

type AuditEvent = {
  id: string;
  timestamp: Date;
  user_id: string;
  action: string;
  resource: string;
  details?: any; // details is optional
};

function validateUserID(user_id: string): string | null {
  const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!regex.test(user_id)) {
    logger.warn(`Invalid user ID provided: ${user_id}`);
    return null;
  }
  return user_id;
}

export function logAuditEvent(user_id: string, action: string, resource: string, details?: any): void {
  const validatedUserID = validateUserID(user_id);

  if (!validatedUserID) {
    logger.error('Error logging audit event: Invalid user ID');
    return;
  }

  const event: AuditEvent = {
    id: uuidv4(),
    timestamp: new Date(),
    user_id: validatedUserID,
    action,
    resource,
    details,
  };

  logger.info(`Audit Event: ${JSON.stringify(event)}`);
}