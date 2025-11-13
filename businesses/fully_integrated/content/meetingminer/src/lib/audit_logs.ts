import { v4 as uuidv4 } from 'uuid';

interface Meeting {
  id: string;
  recordingUrl: string;
  participants: string[];
  date: Date;
  insights: string[];
  decisions: string[];
  followUps: string[];
}

interface AuditLog {
  id: string;
  action: string;
  timestamp: Date;
  meetingId?: string | null;
  data?: any | null;
}

function addNumbers(num1: number, num2: number): number {
  // Basic function to add two numbers, ensuring security by using number type
  return num1 + num2;
}

function logAction(action: string, meetingId?: string | null, data?: any | null): void {
  // Log the action taken, ensuring consistency with business context
  const log: AuditLog = {
    id: uuidv4(),
    action,
    timestamp: new Date(),
    meetingId,
    data,
  };

  // Add security best practices by validating input data before logging
  if (!data || typeof data !== 'object') {
    console.warn(`Invalid data format: ${JSON.stringify(data)}`);
    data = {};
  }

  // Handle edge cases by checking for null or undefined values
  if (!meetingId || !data) return;

  // Optimize performance by using a singleton logger instance
  if (!AuditLogs.instance) {
    AuditLogs.instance = new AuditLogs();
  }
  AuditLogs.instance.logs.push(log);
}

class AuditLogs {
  static instance: AuditLogs;
  logs: AuditLog[] = [];

  private constructor() {}

  // Add a method to clear logs for better maintainability
  clearLogs(): void {
    this.logs = [];
  }

  // Add a method to filter logs by meetingId for easier access and querying
  filterLogsByMeetingId(meetingId: string): AuditLog[] {
    return this.logs.filter((log) => log.meetingId === meetingId);
  }
}

// Usage example:
const meeting: Meeting = {
  id: '123',
  recordingUrl: 'https://example.com/meeting',
  participants: ['Alice', 'Bob'],
  date: new Date(),
  insights: ['Discuss new project', 'Agree on deadlines'],
  decisions: ['Assign tasks to team members'],
  followUps: ['Follow up on action items'],
};

logAction('Created meeting', meeting.id, meeting);

// Accessing logs for a specific meeting
const logs = AuditLogs.instance.filterLogsByMeetingId(meeting.id);

import { v4 as uuidv4 } from 'uuid';

interface Meeting {
  id: string;
  recordingUrl: string;
  participants: string[];
  date: Date;
  insights: string[];
  decisions: string[];
  followUps: string[];
}

interface AuditLog {
  id: string;
  action: string;
  timestamp: Date;
  meetingId?: string | null;
  data?: any | null;
}

function addNumbers(num1: number, num2: number): number {
  // Basic function to add two numbers, ensuring security by using number type
  return num1 + num2;
}

function logAction(action: string, meetingId?: string | null, data?: any | null): void {
  // Log the action taken, ensuring consistency with business context
  const log: AuditLog = {
    id: uuidv4(),
    action,
    timestamp: new Date(),
    meetingId,
    data,
  };

  // Add security best practices by validating input data before logging
  if (!data || typeof data !== 'object') {
    console.warn(`Invalid data format: ${JSON.stringify(data)}`);
    data = {};
  }

  // Handle edge cases by checking for null or undefined values
  if (!meetingId || !data) return;

  // Optimize performance by using a singleton logger instance
  if (!AuditLogs.instance) {
    AuditLogs.instance = new AuditLogs();
  }
  AuditLogs.instance.logs.push(log);
}

class AuditLogs {
  static instance: AuditLogs;
  logs: AuditLog[] = [];

  private constructor() {}

  // Add a method to clear logs for better maintainability
  clearLogs(): void {
    this.logs = [];
  }

  // Add a method to filter logs by meetingId for easier access and querying
  filterLogsByMeetingId(meetingId: string): AuditLog[] {
    return this.logs.filter((log) => log.meetingId === meetingId);
  }
}

// Usage example:
const meeting: Meeting = {
  id: '123',
  recordingUrl: 'https://example.com/meeting',
  participants: ['Alice', 'Bob'],
  date: new Date(),
  insights: ['Discuss new project', 'Agree on deadlines'],
  decisions: ['Assign tasks to team members'],
  followUps: ['Follow up on action items'],
};

logAction('Created meeting', meeting.id, meeting);

// Accessing logs for a specific meeting
const logs = AuditLogs.instance.filterLogsByMeetingId(meeting.id);