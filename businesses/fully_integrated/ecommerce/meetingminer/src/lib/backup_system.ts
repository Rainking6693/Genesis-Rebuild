import { Backup } from './Backup';
import { Encryptor } from './Encryptor';

interface BackupSystemOptions {
  maxBackupCount?: number;
  backupRetentionDays?: number;
}

interface BackupData {
  id?: string;
  data: any;
  createdAt: Date;
}

class BackupSystem {
  private backup: Backup<BackupData>;
  private encryptor: Encryptor;
  private maxBackupCount: number;
  private backupRetentionDays: number;

  constructor(options?: BackupSystemOptions) {
    this.backup = new Backup<BackupData>();
    this.encryptor = new Encryptor();
    this.maxBackupCount = options?.maxBackupCount || 10;
    this.backupRetentionDays = options?.backupRetentionDays || 30;
  }

  public backupData(data: any, backupId?: string): void {
    const encryptedData = this.encryptor.encrypt(data);
    const backup = { data: encryptedData, createdAt: new Date() } as BackupData;
    if (backupId) backup.id = backupId;
    this.backup.save(backup);

    // Clean up old backups
    this.cleanupOldBackups();
  }

  public restoreData(backupId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const backup = this.backup.retrieve(backupId);
      if (!backup) {
        return reject(new Error('Backup not found'));
      }
      this.encryptor.decrypt(backup.data)
        .then(decryptedData => resolve(decryptedData))
        .catch(error => reject(error));
    });
  }

  private cleanupOldBackups(): void {
    const currentDate = new Date();
    const backups = this.backup.getAll();

    backups.forEach((backup, index) => {
      const backupDate = new Date(backup.createdAt);
      const ageInDays = Math.ceil((currentDate - backupDate) / (1000 * 60 * 60 * 24));

      if (index < this.maxBackupCount && ageInDays > this.backupRetentionDays) {
        this.backup.remove(backup.id);
      }
    });
  }
}

import { Backup } from './Backup';
import { Encryptor } from './Encryptor';

interface BackupSystemOptions {
  maxBackupCount?: number;
  backupRetentionDays?: number;
}

interface BackupData {
  id?: string;
  data: any;
  createdAt: Date;
}

class BackupSystem {
  private backup: Backup<BackupData>;
  private encryptor: Encryptor;
  private maxBackupCount: number;
  private backupRetentionDays: number;

  constructor(options?: BackupSystemOptions) {
    this.backup = new Backup<BackupData>();
    this.encryptor = new Encryptor();
    this.maxBackupCount = options?.maxBackupCount || 10;
    this.backupRetentionDays = options?.backupRetentionDays || 30;
  }

  public backupData(data: any, backupId?: string): void {
    const encryptedData = this.encryptor.encrypt(data);
    const backup = { data: encryptedData, createdAt: new Date() } as BackupData;
    if (backupId) backup.id = backupId;
    this.backup.save(backup);

    // Clean up old backups
    this.cleanupOldBackups();
  }

  public restoreData(backupId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const backup = this.backup.retrieve(backupId);
      if (!backup) {
        return reject(new Error('Backup not found'));
      }
      this.encryptor.decrypt(backup.data)
        .then(decryptedData => resolve(decryptedData))
        .catch(error => reject(error));
    });
  }

  private cleanupOldBackups(): void {
    const currentDate = new Date();
    const backups = this.backup.getAll();

    backups.forEach((backup, index) => {
      const backupDate = new Date(backup.createdAt);
      const ageInDays = Math.ceil((currentDate - backupDate) / (1000 * 60 * 60 * 24));

      if (index < this.maxBackupCount && ageInDays > this.backupRetentionDays) {
        this.backup.remove(backup.id);
      }
    });
  }
}