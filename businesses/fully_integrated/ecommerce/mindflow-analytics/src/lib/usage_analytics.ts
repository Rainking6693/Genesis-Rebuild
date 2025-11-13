import { validateEvent } from './event-validation';
import winston from 'winston';

interface IEventProperties {
  [key: string]: any;
}

interface IEvent {
  name: string;
  category: string;
  timestamp?: Date;
  properties?: IEventProperties;
}

function logEvent(event: IEvent): void {
  // Validate the event before logging
  const validatedEvent = validateEvent(event);

  if (!validatedEvent) {
    console.error('Invalid event object');
    return;
  }

  // Perform event logging
  const { name, category, timestamp, properties } = validatedEvent;
  const eventProperties = properties ? JSON.stringify(properties, null, 2) : '';
  winston.info(`Event Name: ${name}`, {
    timestamp,
    category,
    properties: eventProperties,
  });
}

const purchaseEvent: IEvent = {
  name: 'Purchase',
  category: 'Ecommerce',
  timestamp: new Date(),
  properties: {
    productId: '12345',
    productName: 'Product A',
    quantity: 2,
    totalPrice: 100.00,
  },
};

logEvent(purchaseEvent);

const eventToLog: IEvent = {
  name: 'Add to Cart',
  category: 'Ecommerce',
  timestamp: new Date(),
  properties: {
    productId: '67890',
    productName: 'Product B',
    quantity: 1,
  },
};

logEvent(eventToLog);

// event-validation.ts

function isValidPropertyName(name: string): boolean {
  // Add your custom validation logic here
  return /^[a-zA-Z0-9_]+$/.test(name);
}

function validateEvent(event: IEvent): IEvent | null {
  if (!event || !event.name || !event.category) {
    return null;
  }

  const eventProperties = event.properties || {};

  for (const propertyName in eventProperties) {
    if (!isValidPropertyName(propertyName)) {
      return null;
    }
  }

  return event;
}

import { validateEvent } from './event-validation';
import winston from 'winston';

interface IEventProperties {
  [key: string]: any;
}

interface IEvent {
  name: string;
  category: string;
  timestamp?: Date;
  properties?: IEventProperties;
}

function logEvent(event: IEvent): void {
  // Validate the event before logging
  const validatedEvent = validateEvent(event);

  if (!validatedEvent) {
    console.error('Invalid event object');
    return;
  }

  // Perform event logging
  const { name, category, timestamp, properties } = validatedEvent;
  const eventProperties = properties ? JSON.stringify(properties, null, 2) : '';
  winston.info(`Event Name: ${name}`, {
    timestamp,
    category,
    properties: eventProperties,
  });
}

const purchaseEvent: IEvent = {
  name: 'Purchase',
  category: 'Ecommerce',
  timestamp: new Date(),
  properties: {
    productId: '12345',
    productName: 'Product A',
    quantity: 2,
    totalPrice: 100.00,
  },
};

logEvent(purchaseEvent);

const eventToLog: IEvent = {
  name: 'Add to Cart',
  category: 'Ecommerce',
  timestamp: new Date(),
  properties: {
    productId: '67890',
    productName: 'Product B',
    quantity: 1,
  },
};

logEvent(eventToLog);

// event-validation.ts

function isValidPropertyName(name: string): boolean {
  // Add your custom validation logic here
  return /^[a-zA-Z0-9_]+$/.test(name);
}

function validateEvent(event: IEvent): IEvent | null {
  if (!event || !event.name || !event.category) {
    return null;
  }

  const eventProperties = event.properties || {};

  for (const propertyName in eventProperties) {
    if (!isValidPropertyName(propertyName)) {
      return null;
    }
  }

  return event;
}