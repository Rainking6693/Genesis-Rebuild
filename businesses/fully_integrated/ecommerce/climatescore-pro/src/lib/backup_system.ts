import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from './encryption';
import { BackupStorage } from './backup_storage';

interface BackupData {
  id: string;
  timestamp: Date;
  data: string; // Changed to string to avoid type coercion issues
}

export type BackupSystemInstance = ReturnType<BackupSystem['createBackupInstance']>;

export class BackupSystem {
  private storage: BackupStorage;

  constructor(private backupStorage: BackupStorage) {
    this.storage = backupStorage;
  }

  public static createBackupInstance(backupStorage: BackupStorage): BackupSystemInstance {
    return new BackupSystem(backupStorage);
  }

  public async createBackup(data: any): Promise<void> {
    if (!data) {
      throw new Error('Data is required');
    }

    const backupData: BackupData = {
      id: uuidv4(),
      timestamp: new Date(),
      data: encrypt(JSON.stringify(data)),
    };

    try {
      await this.storage.saveBackup(backupData);
    } catch (error) {
      throw new Error(`Failed to create backup: ${error.message}`);
    }
  }

  public async restoreBackup(id: string): Promise<any> {
    const backupData = await this.storage.getBackup(id);

    if (!backupData) {
      throw new Error('Backup not found');
    }

    try {
      return decrypt(backupData.data);
    } catch (error) {
      throw new Error(`Failed to restore backup: ${error.message}`);
    }
  }
}

// Usage example:
import BackupSystem from './backup_system';
import BackupStorage from './backup_storage';

const backupStorage = new BackupStorage();
const backupSystem = BackupSystem.createBackupInstance(backupStorage);

// ...
await backupSystem.createBackup(data);
const restoredData = await backupSystem.restoreBackup(id);

In this version, I've added type checks for the `data` parameter in the `createBackup` method to ensure it's not null. I've also made the `BackupSystemInstance` type explicit by using the `ReturnType` utility type. This makes it clearer that `BackupSystem.createBackupInstance` returns an instance of the `BackupSystem` class. Additionally, I've made the code more modular by separating the usage example from the class definition.