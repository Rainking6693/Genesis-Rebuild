import { AuditEvent } from './audit_event';

type AuditLogs = {
  logEvent: (event: AuditEvent) => void;
  getEvents: () => AuditEvent[];
  clearEvents: () => void;
  getEventCount: () => number;
  getLastEvent: () => AuditEvent | null;
  getEventsSince: (timestamp: Date) => AuditEvent[];
  clearEventsBefore: (timestamp: Date) => void;
  events: AuditEvent[];
};

class AuditLogs implements AuditLogs {
  private events: AuditEvent[] = [];
  private maxEventsCount: number = 1000;

  constructor(maxEventsCount?: number) {
    if (maxEventsCount) this.maxEventsCount = maxEventsCount;
  }

  public logEvent(event: AuditEvent): void {
    if (this.events.length >= this.maxEventsCount) {
      this.events = this.events.slice(1); // Shift array instead of using .shift() for better performance
    }
    this.events.push(event);
  }

  public getEvents(): AuditEvent[] {
    return this.events;
  }

  public clearEvents(): void {
    this.events = [];
  }

  public getEventCount(): number {
    return this.events.length;
  }

  public getLastEvent(): AuditEvent | null {
    return this.events[this.events.length - 1] || null;
  }

  public getEventsSince(timestamp: Date): AuditEvent[] {
    return this.events.filter((event) => event.timestamp >= timestamp);
  }

  public clearEventsBefore(timestamp: Date): void {
    this.events = this.events.filter((event) => event.timestamp >= timestamp);
  }
}

export { AuditLogs };

import { AuditEvent } from './audit_event';

type AuditLogs = {
  logEvent: (event: AuditEvent) => void;
  getEvents: () => AuditEvent[];
  clearEvents: () => void;
  getEventCount: () => number;
  getLastEvent: () => AuditEvent | null;
  getEventsSince: (timestamp: Date) => AuditEvent[];
  clearEventsBefore: (timestamp: Date) => void;
  events: AuditEvent[];
};

class AuditLogs implements AuditLogs {
  private events: AuditEvent[] = [];
  private maxEventsCount: number = 1000;

  constructor(maxEventsCount?: number) {
    if (maxEventsCount) this.maxEventsCount = maxEventsCount;
  }

  public logEvent(event: AuditEvent): void {
    if (this.events.length >= this.maxEventsCount) {
      this.events = this.events.slice(1); // Shift array instead of using .shift() for better performance
    }
    this.events.push(event);
  }

  public getEvents(): AuditEvent[] {
    return this.events;
  }

  public clearEvents(): void {
    this.events = [];
  }

  public getEventCount(): number {
    return this.events.length;
  }

  public getLastEvent(): AuditEvent | null {
    return this.events[this.events.length - 1] || null;
  }

  public getEventsSince(timestamp: Date): AuditEvent[] {
    return this.events.filter((event) => event.timestamp >= timestamp);
  }

  public clearEventsBefore(timestamp: Date): void {
    this.events = this.events.filter((event) => event.timestamp >= timestamp);
  }
}

export { AuditLogs };