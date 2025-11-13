import { EncryptedData, BackupResult } from './backupService';
import { validateBusinessId, validateBackupLocation } from './validation';
import { promisify } from 'util';
import crypto from 'crypto-js';
import fs from 'fs';
import path from 'path';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

function encryptData(data: any, encryptionKey: string): EncryptedData {
  const encrypted = crypto.AES.encrypt(JSON.stringify(data), encryptionKey).toString();
  return { encryptedData: encrypted };
}

function backupData(businessId: string, backupLocation: string, encryptionKey?: string): Promise<void> {
  // Validate businessId
  if (!validateBusinessId(businessId)) {
    throw new Error('Invalid business ID');
  }

  // Validate backupLocation
  if (!validateBackupLocation(backupLocation)) {
    throw new Error('Invalid backup location');
  }

  // Read business data
  const businessDataPath = path.join(__dirname, `../data/${businessId}.json`);
  let businessData: any;
  try {
    businessData = JSON.parse(await readFileAsync(businessDataPath, 'utf8'));
  } catch (error) {
    throw new Error(`Error reading business data for ID ${businessId}: ${error.message}`);
  }

  // Encrypt data before backup (if encryptionKey is provided)
  const encryptedData = encryptionKey ? encryptData(businessData, encryptionKey) : businessData;

  // Perform backup operation
  return backupService.backup(encryptedData, backupLocation)
    .then((result: BackupResult) => {
      if (result.isSuccess) {
        console.log(`Backup completed successfully for business ${businessId} at ${backupLocation}`);
      } else {
        throw new Error(`Backup failed for business ${businessId} at ${backupLocation}: ${result.errorMessage}`);
      }
    })
    .catch((error: Error) => {
      console.error(error.message);
      throw error;
    });
}

function validateBusinessId(businessId: string): boolean {
  // Implement business-specific validation rules for businessId
  // For example, check if businessId is a valid UUID or matches a specific pattern
  // ...
  const isValidUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(businessId);
  return isValidUuid;
}

function validateBackupLocation(backupLocation: string): boolean {
  // Implement validation rules for backupLocation
  // For example, check if backupLocation exists and has sufficient space
  // ...
  const exists = fs.existsSync(backupLocation);
  const isDirectory = fs.lstatSync(backupLocation).isDirectory();
  return exists && isDirectory;
}

import { EncryptedData, BackupResult } from './backupService';
import { validateBusinessId, validateBackupLocation } from './validation';
import { promisify } from 'util';
import crypto from 'crypto-js';
import fs from 'fs';
import path from 'path';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

function encryptData(data: any, encryptionKey: string): EncryptedData {
  const encrypted = crypto.AES.encrypt(JSON.stringify(data), encryptionKey).toString();
  return { encryptedData: encrypted };
}

function backupData(businessId: string, backupLocation: string, encryptionKey?: string): Promise<void> {
  // Validate businessId
  if (!validateBusinessId(businessId)) {
    throw new Error('Invalid business ID');
  }

  // Validate backupLocation
  if (!validateBackupLocation(backupLocation)) {
    throw new Error('Invalid backup location');
  }

  // Read business data
  const businessDataPath = path.join(__dirname, `../data/${businessId}.json`);
  let businessData: any;
  try {
    businessData = JSON.parse(await readFileAsync(businessDataPath, 'utf8'));
  } catch (error) {
    throw new Error(`Error reading business data for ID ${businessId}: ${error.message}`);
  }

  // Encrypt data before backup (if encryptionKey is provided)
  const encryptedData = encryptionKey ? encryptData(businessData, encryptionKey) : businessData;

  // Perform backup operation
  return backupService.backup(encryptedData, backupLocation)
    .then((result: BackupResult) => {
      if (result.isSuccess) {
        console.log(`Backup completed successfully for business ${businessId} at ${backupLocation}`);
      } else {
        throw new Error(`Backup failed for business ${businessId} at ${backupLocation}: ${result.errorMessage}`);
      }
    })
    .catch((error: Error) => {
      console.error(error.message);
      throw error;
    });
}

function validateBusinessId(businessId: string): boolean {
  // Implement business-specific validation rules for businessId
  // For example, check if businessId is a valid UUID or matches a specific pattern
  // ...
  const isValidUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(businessId);
  return isValidUuid;
}

function validateBackupLocation(backupLocation: string): boolean {
  // Implement validation rules for backupLocation
  // For example, check if backupLocation exists and has sufficient space
  // ...
  const exists = fs.existsSync(backupLocation);
  const isDirectory = fs.lstatSync(backupLocation).isDirectory();
  return exists && isDirectory;
}