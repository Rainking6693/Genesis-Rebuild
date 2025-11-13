import { Response, Request, NextFunction } from 'express';
import { json } from 'body-parser';

// Custom Error class for better error handling
class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

function isValidNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

function isNonEmptyString(value: any): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isValidJson(value: any): value is object {
  try {
    JSON.parse(JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

function handleMissingParams(req: Request, res: Response, next: NextFunction) {
  if (!isValidNumber(req.body.userId) || !isNonEmptyString(req.body.issue)) {
    res.status(400).json({ error: 'Missing required parameters: userId and issue' });
  } else {
    next();
  }
}

async function checkUserAuthorization(userId: number): Promise<boolean> {
  // Implement your authorization logic here
  // For now, we'll just return true for simplicity
  return true;
}

async function validateBotApiResponse(response: Response): Promise<void> {
  if (!response.ok) {
    throw new CustomError(`Error fetching bot response: ${response.statusText}`, response.status);
  }

  const botResponse = await response.text();

  if (!isValidJson(botResponse)) {
    throw new CustomError('Invalid bot response format');
  }
}

async function handleBotApiResponse(req: Request, res: Response): Promise<void> {
  await new Promise(handleMissingParams.bind(null, req, res));

  const isAuthorized = await checkUserAuthorization(req.body.userId);
  if (!isAuthorized) {
    res.status(401).json({ error: 'Unauthorized access' });
    return;
  }

  try {
    const response = await fetch(`/api/customer-support-bot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `userId=${req.body.userId}&issue=${encodeURIComponent(req.body.issue)}`,
    });

    await validateBotApiResponse(response);

    const botResponse = await response.json();

    if (botResponse.error) {
      throw new CustomError(botResponse.error);
    }

    res.json({ botResponse });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

app.use(json());
app.post('/api/customer-support', handleBotApiResponse);

import { Response, Request, NextFunction } from 'express';
import { json } from 'body-parser';

// Custom Error class for better error handling
class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

function isValidNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

function isNonEmptyString(value: any): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isValidJson(value: any): value is object {
  try {
    JSON.parse(JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

function handleMissingParams(req: Request, res: Response, next: NextFunction) {
  if (!isValidNumber(req.body.userId) || !isNonEmptyString(req.body.issue)) {
    res.status(400).json({ error: 'Missing required parameters: userId and issue' });
  } else {
    next();
  }
}

async function checkUserAuthorization(userId: number): Promise<boolean> {
  // Implement your authorization logic here
  // For now, we'll just return true for simplicity
  return true;
}

async function validateBotApiResponse(response: Response): Promise<void> {
  if (!response.ok) {
    throw new CustomError(`Error fetching bot response: ${response.statusText}`, response.status);
  }

  const botResponse = await response.text();

  if (!isValidJson(botResponse)) {
    throw new CustomError('Invalid bot response format');
  }
}

async function handleBotApiResponse(req: Request, res: Response): Promise<void> {
  await new Promise(handleMissingParams.bind(null, req, res));

  const isAuthorized = await checkUserAuthorization(req.body.userId);
  if (!isAuthorized) {
    res.status(401).json({ error: 'Unauthorized access' });
    return;
  }

  try {
    const response = await fetch(`/api/customer-support-bot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `userId=${req.body.userId}&issue=${encodeURIComponent(req.body.issue)}`,
    });

    await validateBotApiResponse(response);

    const botResponse = await response.json();

    if (botResponse.error) {
      throw new CustomError(botResponse.error);
    }

    res.json({ botResponse });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

app.use(json());
app.post('/api/customer-support', handleBotApiResponse);