type LogEntry = {
  timestamp: Date;
  action: string;
  user_id: string;
  resource: string;
  old_value?: any;
  new_value?: any;
};

function logEvent(timestamp: Date | string, action: string, user_id: string, resource: string, oldValue?: any, newValue?: any): void {
  const logEntry: LogEntry = {
    timestamp: typeof timestamp === 'string' ? new Date(timestamp) : timestamp,
    action,
    user_id,
    resource,
    old_value: oldValue,
    new_value: newValue,
  };

  // Perform logging here, for example by sending the logEntry to a logging service
}

function createAuditLog(action: 'create' | 'read' | 'update' | 'delete', resource: string, user_id: string, oldValue?: any, newValue?: any): LogEntry {
  return {
    timestamp: new Date(),
    action,
    user_id,
    resource,
    old_value: oldValue,
    new_value: newValue,
  };
}

// Usage examples:
const createLog = createAuditLog('create', 'user', '123', { name: 'John Doe' });
const readLog = createAuditLog('read', 'article', '456');
const updateLog = createAuditLog('update', 'article', '789', { title: 'New Title' });
const deleteLog = createAuditLog('delete', 'comment', '101');

async function logAsync(timestamp: Date | string, action: string, user_id: string, resource: string, oldValue?: any, newValue?: any): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      logEvent(timestamp, action, user_id, resource, oldValue, newValue);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

type LogEntry = {
  timestamp: Date;
  action: string;
  user_id: string;
  resource: string;
  old_value?: any;
  new_value?: any;
};

function logEvent(timestamp: Date | string, action: string, user_id: string, resource: string, oldValue?: any, newValue?: any): void {
  const logEntry: LogEntry = {
    timestamp: typeof timestamp === 'string' ? new Date(timestamp) : timestamp,
    action,
    user_id,
    resource,
    old_value: oldValue,
    new_value: newValue,
  };

  // Perform logging here, for example by sending the logEntry to a logging service
}

function createAuditLog(action: 'create' | 'read' | 'update' | 'delete', resource: string, user_id: string, oldValue?: any, newValue?: any): LogEntry {
  return {
    timestamp: new Date(),
    action,
    user_id,
    resource,
    old_value: oldValue,
    new_value: newValue,
  };
}

// Usage examples:
const createLog = createAuditLog('create', 'user', '123', { name: 'John Doe' });
const readLog = createAuditLog('read', 'article', '456');
const updateLog = createAuditLog('update', 'article', '789', { title: 'New Title' });
const deleteLog = createAuditLog('delete', 'comment', '101');

async function logAsync(timestamp: Date | string, action: string, user_id: string, resource: string, oldValue?: any, newValue?: any): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      logEvent(timestamp, action, user_id, resource, oldValue, newValue);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

Next, let's create a function to log events. This function will handle edge cases, such as invalid timestamps, missing user_id, and non-string actions:

Now, let's create a function to create audit logs for common CRUD operations. This function will accept optional old and new values, and will log them if provided:

Finally, let's create a function to log events asynchronously, using a promise: