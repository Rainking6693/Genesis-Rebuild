import { Storage } from '@google-cloud/storage';
import { URLSearchParams } from 'url';

// Initialize Google Cloud Storage client
const storage = new Storage();

// Function to check if a string is a valid URL
function isValidUrl(url: string): boolean {
  try {
    new URLSearchParams(url);
    return true;
  } catch (_) {
    return false;
  }
}

// Function to backup content
async function backupContent(contentId: string, contentUrl: string): Promise<void> {
  // Check if contentId and contentUrl are provided
  if (!contentId || !contentUrl) {
    throw new Error('Both contentId and contentUrl must be provided.');
  }

  // Check if contentUrl is a valid URL
  if (!isValidUrl(contentUrl)) {
    throw new Error('contentUrl must be a valid URL.');
  }

  // Download content from the URL and save it to Google Cloud Storage
  const bucketName = 'my-content-backup';
  const bucket = storage.bucket(bucketName);
  const fileName = `content-${contentId}.json`;
  const file = bucket.file(fileName);

  try {
    const response = await fetch(contentUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch content with status code ${response.status}`);
    }
    const content = await response.json();
    await file.save(JSON.stringify(content));
    console.log(`Content with id ${contentId} has been backed up.`);
  } catch (error) {
    console.error(`Error backing up content with id ${contentId}:`, error);
    throw error;
  }
}

// Function to calculate sum (maintainability)
function calculateSum(num1: number, num2: number): number {
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    throw new Error('Both arguments must be numbers.');
  }
  return num1 + num2;
}

// Function to handle errors and log them to a centralized error reporting service (edge case)
function reportError(error: Error): void {
  // Implement error reporting logic here
  console.error(`Error: ${error.message}`);
}

// Function to check if a contentId exists in Google Cloud Storage (resiliency)
async function checkContentIdExists(contentId: string): Promise<boolean> {
  const bucketName = 'my-content-backup';
  const bucket = storage.bucket(bucketName);
  const fileName = `content-${contentId}.json`;
  const file = bucket.file(fileName);

  try {
    await file.exists();
    return true;
  } catch (error) {
    if (error.code === 404) {
      return false;
    }
    throw error;
  }
}

// Function to backup or update content based on whether it exists in Google Cloud Storage (resiliency)
async function backupOrUpdateContent(contentId: string, contentUrl: string): Promise<void> {
  if (await checkContentIdExists(contentId)) {
    console.log(`Content with id ${contentId} already exists. Updating...`);
    await backupContent(contentId, contentUrl);
  } else {
    console.log(`Content with id ${contentId} does not exist. Creating...`);
    await backupContent(contentId, contentUrl);
  }
}

import { Storage } from '@google-cloud/storage';
import { URLSearchParams } from 'url';

// Initialize Google Cloud Storage client
const storage = new Storage();

// Function to check if a string is a valid URL
function isValidUrl(url: string): boolean {
  try {
    new URLSearchParams(url);
    return true;
  } catch (_) {
    return false;
  }
}

// Function to backup content
async function backupContent(contentId: string, contentUrl: string): Promise<void> {
  // Check if contentId and contentUrl are provided
  if (!contentId || !contentUrl) {
    throw new Error('Both contentId and contentUrl must be provided.');
  }

  // Check if contentUrl is a valid URL
  if (!isValidUrl(contentUrl)) {
    throw new Error('contentUrl must be a valid URL.');
  }

  // Download content from the URL and save it to Google Cloud Storage
  const bucketName = 'my-content-backup';
  const bucket = storage.bucket(bucketName);
  const fileName = `content-${contentId}.json`;
  const file = bucket.file(fileName);

  try {
    const response = await fetch(contentUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch content with status code ${response.status}`);
    }
    const content = await response.json();
    await file.save(JSON.stringify(content));
    console.log(`Content with id ${contentId} has been backed up.`);
  } catch (error) {
    console.error(`Error backing up content with id ${contentId}:`, error);
    throw error;
  }
}

// Function to calculate sum (maintainability)
function calculateSum(num1: number, num2: number): number {
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    throw new Error('Both arguments must be numbers.');
  }
  return num1 + num2;
}

// Function to handle errors and log them to a centralized error reporting service (edge case)
function reportError(error: Error): void {
  // Implement error reporting logic here
  console.error(`Error: ${error.message}`);
}

// Function to check if a contentId exists in Google Cloud Storage (resiliency)
async function checkContentIdExists(contentId: string): Promise<boolean> {
  const bucketName = 'my-content-backup';
  const bucket = storage.bucket(bucketName);
  const fileName = `content-${contentId}.json`;
  const file = bucket.file(fileName);

  try {
    await file.exists();
    return true;
  } catch (error) {
    if (error.code === 404) {
      return false;
    }
    throw error;
  }
}

// Function to backup or update content based on whether it exists in Google Cloud Storage (resiliency)
async function backupOrUpdateContent(contentId: string, contentUrl: string): Promise<void> {
  if (await checkContentIdExists(contentId)) {
    console.log(`Content with id ${contentId} already exists. Updating...`);
    await backupContent(contentId, contentUrl);
  } else {
    console.log(`Content with id ${contentId} does not exist. Creating...`);
    await backupContent(contentId, contentUrl);
  }
}