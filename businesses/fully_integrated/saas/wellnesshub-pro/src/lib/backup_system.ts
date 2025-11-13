import { Logger } from 'winston';

interface BackupOptions {
  source: string;
  destination: string;
  compression?: string;
}

interface BackupResult {
  success: boolean;
  message?: string;
}

class Backup {
  constructor(private logger: Logger, private options: BackupOptions) {}

  private validateOptions(options: BackupOptions): void {
    if (!options.source || !options.destination) {
      throw new Error('Both source and destination must be provided.');
    }

    if (typeof options.source !== 'string' || typeof options.destination !== 'string') {
      throw new Error('Source and destination must be strings.');
    }
  }

  public async backup(): Promise<BackupResult> {
    this.validateOptions(this.options);

    let result: BackupResult = { success: false };

    try {
      this.logger.info('Backup started...');
      // Perform the backup
      // ...
      this.logger.info('Backup completed.');
      result = { success: true };
    } catch (error) {
      this.logger.error(`Backup failed: ${error.message}`);
      result.message = error.message;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(result);
      }, 3000);
    });
  }

  public static createBackupTask(logger: Logger, options: BackupOptions): BackupTask {
    return new BackupTask(logger, options);
  }
}

interface BackupTask {
  run(): Promise<BackupResult>;
}

class BackupTask implements BackupTask {
  constructor(private logger: Logger, private options: BackupOptions) {}

  public run(): Promise<BackupResult> {
    return Backup.backup(this.logger, this.options);
  }
}

import { Logger } from 'winston';

interface BackupOptions {
  source: string;
  destination: string;
  compression?: string;
}

interface BackupResult {
  success: boolean;
  message?: string;
}

class Backup {
  constructor(private logger: Logger, private options: BackupOptions) {}

  private validateOptions(options: BackupOptions): void {
    if (!options.source || !options.destination) {
      throw new Error('Both source and destination must be provided.');
    }

    if (typeof options.source !== 'string' || typeof options.destination !== 'string') {
      throw new Error('Source and destination must be strings.');
    }
  }

  public async backup(): Promise<BackupResult> {
    this.validateOptions(this.options);

    let result: BackupResult = { success: false };

    try {
      this.logger.info('Backup started...');
      // Perform the backup
      // ...
      this.logger.info('Backup completed.');
      result = { success: true };
    } catch (error) {
      this.logger.error(`Backup failed: ${error.message}`);
      result.message = error.message;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(result);
      }, 3000);
    });
  }

  public static createBackupTask(logger: Logger, options: BackupOptions): BackupTask {
    return new BackupTask(logger, options);
  }
}

interface BackupTask {
  run(): Promise<BackupResult>;
}

class BackupTask implements BackupTask {
  constructor(private logger: Logger, private options: BackupOptions) {}

  public run(): Promise<BackupResult> {
    return Backup.backup(this.logger, this.options);
  }
}