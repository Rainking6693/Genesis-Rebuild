import fetch from 'node-fetch';
import { AbortController } from 'abort-controller';
import { readFileSync } from 'fs';

interface SecureReadFileResult {
  readonly fileContent: string;
}

interface SecureHttpRequestOptions {
  readonly method: string;
  readonly url: string;
  readonly headers?: Record<string, string>;
  readonly body?: string;
  readonly signal?: AbortSignal;
}

interface SecureHttpRequestResponse {
  readonly statusCode: number;
  readonly body: string;
}

function deployToProduction(environment: string): void {
  if (!validateEnvironment(environment)) {
    throw new Error('Invalid environment. Please provide a string containing only alphanumeric characters and hyphens.');
  }

  if (!process.env.CONFIG_FILE) {
    throw new Error('Missing CONFIG_FILE environment variable.');
  }

  const configFile = secureReadFile(process.env.CONFIG_FILE);
  if (!validateConfigFile(configFile)) {
    throw new Error('Failed to read the configuration file.');
  }

  const { apiKey, apiSecret } = JSON.parse(configFile.fileContent);
  if (!validateApiKeys(apiKey, apiSecret)) {
    throw new Error('Missing or invalid API keys. Please check your configuration.');
  }

  const controller = new AbortController();
  const response = secureHttpRequest({
    method: 'POST',
    url: 'https://api.moodsync.com/deploy',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
      'Api-Secret': apiSecret
    },
    body: JSON.stringify({ environment }),
    signal: controller.signal
  });

  if (!response.statusCode || !response.body) {
    throw new Error('Failed to receive a valid response from the network request.');
  }

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`Failed to deploy to ${environment}. Status code: ${response.statusCode}`);
  }

  if (!console.log) {
    throw new Error('console.log is not defined. Please ensure it is available.');
  }

  console.log(`Successfully deployed MoodSync Teams to ${environment}`);

  // Cancel the request after a certain amount of time to prevent long-running requests from blocking the process
  setTimeout(() => controller.abort(), 60000);
}

function secureReadFile(filePath: string): Promise<SecureReadFileResult> {
  if (!validateFileExists(filePath)) {
    throw new Error('The specified file does not exist.');
  }

  return new Promise((resolve, reject) => {
    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      if (!validateSecureReadFileResult(fileContent)) {
        throw new Error('The file content is empty.');
      }
      resolve({ fileContent });
    } catch (error) {
      reject(error);
    }
  });
}

function secureHttpRequest(options: SecureHttpRequestOptions): Promise<SecureHttpRequestResponse> {
  if (!validateOptions(options)) {
    throw new Error('Invalid options. Please provide a valid SecureHttpRequestOptions object.');
  }

  return fetch(options.url, {
    method: options.method,
    headers: options.headers,
    body: options.body,
    signal: options.signal
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to deploy to ${options.url}. Status code: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => validateJsonResponse(json))
    .then((json) => ({ statusCode: json.statusCode, body: json.body }));
}

// Validation functions
function validateEnvironment(environment: string): boolean {
  return /^[a-zA-Z0-9\-]+$/.test(environment);
}

function validateApiKeys(apiKey: string, apiSecret: string): boolean {
  return /^[a-zA-Z0-9\.\_\-]+$/.test(apiKey) && /^[a-zA-Z0-9\.\_\-]+$/.test(apiSecret);
}

function validateConfigFile(configFile: SecureReadFileResult): boolean {
  return configFile.fileContent.length > 0;
}

function validateJsonResponse(json: any): any {
  if (!json || !json.statusCode) {
    throw new Error('Invalid JSON response.');
  }
  return json;
}

function validateOptions(options: SecureHttpRequestOptions): boolean {
  return (
    options.method &&
    options.url &&
    (options.headers || {}) &&
    (options.body || '') &&
    (options.signal || {}) instanceof AbortSignal
  );
}

function validateSecureReadFileResult(fileContent: string): boolean {
  return fileContent.length > 0;
}

function validateSecureHttpRequestResult(response: SecureHttpRequestResponse): boolean {
  return response.statusCode && response.body;
}

function validateFileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

import fetch from 'node-fetch';
import { AbortController } from 'abort-controller';
import { readFileSync } from 'fs';

interface SecureReadFileResult {
  readonly fileContent: string;
}

interface SecureHttpRequestOptions {
  readonly method: string;
  readonly url: string;
  readonly headers?: Record<string, string>;
  readonly body?: string;
  readonly signal?: AbortSignal;
}

interface SecureHttpRequestResponse {
  readonly statusCode: number;
  readonly body: string;
}

function deployToProduction(environment: string): void {
  if (!validateEnvironment(environment)) {
    throw new Error('Invalid environment. Please provide a string containing only alphanumeric characters and hyphens.');
  }

  if (!process.env.CONFIG_FILE) {
    throw new Error('Missing CONFIG_FILE environment variable.');
  }

  const configFile = secureReadFile(process.env.CONFIG_FILE);
  if (!validateConfigFile(configFile)) {
    throw new Error('Failed to read the configuration file.');
  }

  const { apiKey, apiSecret } = JSON.parse(configFile.fileContent);
  if (!validateApiKeys(apiKey, apiSecret)) {
    throw new Error('Missing or invalid API keys. Please check your configuration.');
  }

  const controller = new AbortController();
  const response = secureHttpRequest({
    method: 'POST',
    url: 'https://api.moodsync.com/deploy',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
      'Api-Secret': apiSecret
    },
    body: JSON.stringify({ environment }),
    signal: controller.signal
  });

  if (!response.statusCode || !response.body) {
    throw new Error('Failed to receive a valid response from the network request.');
  }

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`Failed to deploy to ${environment}. Status code: ${response.statusCode}`);
  }

  if (!console.log) {
    throw new Error('console.log is not defined. Please ensure it is available.');
  }

  console.log(`Successfully deployed MoodSync Teams to ${environment}`);

  // Cancel the request after a certain amount of time to prevent long-running requests from blocking the process
  setTimeout(() => controller.abort(), 60000);
}

function secureReadFile(filePath: string): Promise<SecureReadFileResult> {
  if (!validateFileExists(filePath)) {
    throw new Error('The specified file does not exist.');
  }

  return new Promise((resolve, reject) => {
    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      if (!validateSecureReadFileResult(fileContent)) {
        throw new Error('The file content is empty.');
      }
      resolve({ fileContent });
    } catch (error) {
      reject(error);
    }
  });
}

function secureHttpRequest(options: SecureHttpRequestOptions): Promise<SecureHttpRequestResponse> {
  if (!validateOptions(options)) {
    throw new Error('Invalid options. Please provide a valid SecureHttpRequestOptions object.');
  }

  return fetch(options.url, {
    method: options.method,
    headers: options.headers,
    body: options.body,
    signal: options.signal
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to deploy to ${options.url}. Status code: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => validateJsonResponse(json))
    .then((json) => ({ statusCode: json.statusCode, body: json.body }));
}

// Validation functions
function validateEnvironment(environment: string): boolean {
  return /^[a-zA-Z0-9\-]+$/.test(environment);
}

function validateApiKeys(apiKey: string, apiSecret: string): boolean {
  return /^[a-zA-Z0-9\.\_\-]+$/.test(apiKey) && /^[a-zA-Z0-9\.\_\-]+$/.test(apiSecret);
}

function validateConfigFile(configFile: SecureReadFileResult): boolean {
  return configFile.fileContent.length > 0;
}

function validateJsonResponse(json: any): any {
  if (!json || !json.statusCode) {
    throw new Error('Invalid JSON response.');
  }
  return json;
}

function validateOptions(options: SecureHttpRequestOptions): boolean {
  return (
    options.method &&
    options.url &&
    (options.headers || {}) &&
    (options.body || '') &&
    (options.signal || {}) instanceof AbortSignal
  );
}

function validateSecureReadFileResult(fileContent: string): boolean {
  return fileContent.length > 0;
}

function validateSecureHttpRequestResult(response: SecureHttpRequestResponse): boolean {
  return response.statusCode && response.body;
}

function validateFileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}