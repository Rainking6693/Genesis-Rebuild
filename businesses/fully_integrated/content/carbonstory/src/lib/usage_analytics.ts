import { IUsageAnalytics, UsageAnalyticsEvent } from './interfaces';
import { v4 as uuidv4 } from 'uuid';

export interface UsageAnalyticsEvent {
  id: string;
  timestamp: Date;
  // Add relevant event properties here
  eventName: string;
  eventData?: any; // Add optional event data
}

export interface IUsageAnalytics {
  trackEvent(event: UsageAnalyticsEvent): void;
  getEvents(): UsageAnalyticsEvent[];
  clearEvents(): void;
  getTopNEvents(n: number): UsageAnalyticsEvent[];
}

export class UsageAnalytics implements IUsageAnalytics {
  private events: UsageAnalyticsEvent[] = [];
  private maxEventsSize = 1000; // Set the maximum size of the events array

  trackEvent(event: UsageAnalyticsEvent): void {
    if (!this.isValidEvent(event)) {
      throw new Error('Invalid event object');
    }

    const sanitizedEvent: UsageAnalyticsEvent = {
      ...event,
      id: uuidv4(),
      timestamp: new Date(event.timestamp || new Date()),
    };

    this.events.push(sanitizedEvent);
    this.pruneEvents();
  }

  getEvents(): UsageAnalyticsEvent[] {
    return this.events;
  }

  clearEvents(): void {
    this.events = [];
  }

  getTopNEvents(n: number): UsageAnalyticsEvent[] {
    return this.events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, n);
  }

  private isValidEvent(event: UsageAnalyticsEvent): event is UsageAnalyticsEvent {
    return (
      event.id &&
      event.timestamp &&
      event.eventName &&
      (typeof event.eventName === 'string' || event.eventName instanceof String)
    );
  }

  private pruneEvents(): void {
    if (this.events.length > this.maxEventsSize) {
      this.events.splice(0, this.events.length - this.maxEventsSize);
    }
  }

  private sanitizeEvent(event: UsageAnalyticsEvent): UsageAnalyticsEvent {
    // Validate event properties and remove any malicious content
    // ...

    return sanitizedEvent;
  }

  private handleUuidError(callback: () => void): void {
    try {
      callback();
    } catch (error) {
      console.error('Error generating UUID:', error);
    }
  }

  private handleDateError(callback: () => void): void {
    try {
      callback();
    } catch (error) {
      console.error('Error creating Date object:', error);
    }
  }
}

export function handleUuidErrorWrapper(callback: () => void): void {
  this.handleUuidError(() => callback());
}

export function handleDateErrorWrapper(callback: () => void): void {
  this.handleDateError(() => callback());
}

import { IUsageAnalytics, UsageAnalyticsEvent } from './interfaces';
import { v4 as uuidv4 } from 'uuid';

export interface UsageAnalyticsEvent {
  id: string;
  timestamp: Date;
  // Add relevant event properties here
  eventName: string;
  eventData?: any; // Add optional event data
}

export interface IUsageAnalytics {
  trackEvent(event: UsageAnalyticsEvent): void;
  getEvents(): UsageAnalyticsEvent[];
  clearEvents(): void;
  getTopNEvents(n: number): UsageAnalyticsEvent[];
}

export class UsageAnalytics implements IUsageAnalytics {
  private events: UsageAnalyticsEvent[] = [];
  private maxEventsSize = 1000; // Set the maximum size of the events array

  trackEvent(event: UsageAnalyticsEvent): void {
    if (!this.isValidEvent(event)) {
      throw new Error('Invalid event object');
    }

    const sanitizedEvent: UsageAnalyticsEvent = {
      ...event,
      id: uuidv4(),
      timestamp: new Date(event.timestamp || new Date()),
    };

    this.events.push(sanitizedEvent);
    this.pruneEvents();
  }

  getEvents(): UsageAnalyticsEvent[] {
    return this.events;
  }

  clearEvents(): void {
    this.events = [];
  }

  getTopNEvents(n: number): UsageAnalyticsEvent[] {
    return this.events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, n);
  }

  private isValidEvent(event: UsageAnalyticsEvent): event is UsageAnalyticsEvent {
    return (
      event.id &&
      event.timestamp &&
      event.eventName &&
      (typeof event.eventName === 'string' || event.eventName instanceof String)
    );
  }

  private pruneEvents(): void {
    if (this.events.length > this.maxEventsSize) {
      this.events.splice(0, this.events.length - this.maxEventsSize);
    }
  }

  private sanitizeEvent(event: UsageAnalyticsEvent): UsageAnalyticsEvent {
    // Validate event properties and remove any malicious content
    // ...

    return sanitizedEvent;
  }

  private handleUuidError(callback: () => void): void {
    try {
      callback();
    } catch (error) {
      console.error('Error generating UUID:', error);
    }
  }

  private handleDateError(callback: () => void): void {
    try {
      callback();
    } catch (error) {
      console.error('Error creating Date object:', error);
    }
  }
}

export function handleUuidErrorWrapper(callback: () => void): void {
  this.handleUuidError(() => callback());
}

export function handleDateErrorWrapper(callback: () => void): void {
  this.handleDateError(() => callback());
}