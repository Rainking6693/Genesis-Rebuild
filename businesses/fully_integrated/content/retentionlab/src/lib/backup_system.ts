import { Config, Storage } from './interfaces';
import { BackupError } from './errors';

class BackupSystem {
  private config: Config;
  private storage: Storage;

  constructor(config: Config, storage: Storage) {
    this.config = config;
    this.storage = storage;
  }

  async backupContent(contentId: string): Promise<void> {
    try {
      // Check if the content exists
      if (!this.storage.hasContent(contentId)) {
        throw new BackupError(`Content with ID ${contentId} not found.`);
      }

      // Read the content from storage
      const content = await this.storage.readContent(contentId);

      // Check if the backup directory exists
      if (!this.storage.hasDirectory(this.config.backupDirectory)) {
        await this.storage.createDirectory(this.config.backupDirectory);
      }

      // Create a backup file with a timestamp
      const backupFileName = `${this.config.backupDirectory}/content_${contentId}_${new Date().toISOString()}.json`;

      // Write the content to the backup file
      await this.storage.writeFile(backupFileName, JSON.stringify(content));

      console.log(`Content with ID ${contentId} backed up successfully.`);
    } catch (error) {
      console.error(`Error backing up content with ID ${contentId}:`, error.message);
      throw error;
    }
  }

  async restoreContent(contentId: string): Promise<void> {
    try {
      // Check if the backup file exists
      const backupFileName = `${this.config.backupDirectory}/content_${contentId}_*.json`;
      const backupFiles = await this.storage.readDirectory(this.config.backupDirectory);
      const backupFile = backupFiles.find((file) => file.match(backupFileName));

      if (!backupFile) {
        throw new BackupError(`No backup found for content with ID ${contentId}.`);
      }

      // Read the backup file
      const backupContent = await this.storage.readFile(backupFile);
      const restoredContent = JSON.parse(backupContent);

      // Write the restored content to the storage
      await this.storage.writeContent(contentId, restoredContent);

      console.log(`Content with ID ${contentId} restored successfully.`);
    } catch (error) {
      console.error(`Error restoring content with ID ${contentId}:`, error.message);
      throw error;
    }
  }
}

// Example usage
const config: Config = {
  backupDirectory: './backups',
};

const storage = {
  hasContent(id: string): boolean {
    // Implement your storage logic here
    // For example, you can check if the content exists in a database or a file system
    return true;
  },

  readContent(id: string): Promise<any> {
    // Implement your storage logic here
    // For example, you can read the content from a database or a file system
    return new Promise((resolve) => resolve({ title: 'Example Content', content: 'This is an example.' }));
  },

  hasDirectory(dir: string): boolean {
    // Implement your storage logic here
    // For example, you can check if the directory exists in a file system
    return true;
  },

  createDirectory(dir: string): Promise<void> {
    // Implement your storage logic here
    // For example, you can create the directory in a file system
    return new Promise((resolve) => resolve());
  },

  readDirectory(dir: string): Promise<string[]> {
    // Implement your storage logic here
    // For example, you can read the directory contents from a file system
    return new Promise((resolve) => resolve(['backup_file_1.json', 'backup_file_2.json']));
  },

  readFile(file: string): Promise<string> {
    // Implement your storage logic here
    // For example, you can read the file contents from a file system
    return new Promise((resolve) => resolve('{"title": "Example Content", "content": "This is an example."}'));
  },

  writeFile(file: string, content: string): Promise<void> {
    // Implement your storage logic here
    // For example, you can write the content to a file in a file system
    return new Promise((resolve) => resolve());
  },

  writeContent(id: string, content: any): Promise<void> {
    // Implement your storage logic here
    // For example, you can write the content to a database or a file system
    return new Promise((resolve) => resolve());
  },
};

const backupSystem = new BackupSystem(config, storage);

// Example usage of backupContent and restoreContent methods
backupSystem.backupContent('example_content');
backupSystem.restoreContent('example_content');

import { Config, Storage } from './interfaces';
import { BackupError } from './errors';

class BackupSystem {
  private config: Config;
  private storage: Storage;

  constructor(config: Config, storage: Storage) {
    this.config = config;
    this.storage = storage;
  }

  async backupContent(contentId: string): Promise<void> {
    try {
      // Check if the content exists
      if (!this.storage.hasContent(contentId)) {
        throw new BackupError(`Content with ID ${contentId} not found.`);
      }

      // Read the content from storage
      const content = await this.storage.readContent(contentId);

      // Check if the backup directory exists
      if (!this.storage.hasDirectory(this.config.backupDirectory)) {
        await this.storage.createDirectory(this.config.backupDirectory);
      }

      // Create a backup file with a timestamp
      const backupFileName = `${this.config.backupDirectory}/content_${contentId}_${new Date().toISOString()}.json`;

      // Write the content to the backup file
      await this.storage.writeFile(backupFileName, JSON.stringify(content));

      console.log(`Content with ID ${contentId} backed up successfully.`);
    } catch (error) {
      console.error(`Error backing up content with ID ${contentId}:`, error.message);
      throw error;
    }
  }

  async restoreContent(contentId: string): Promise<void> {
    try {
      // Check if the backup file exists
      const backupFileName = `${this.config.backupDirectory}/content_${contentId}_*.json`;
      const backupFiles = await this.storage.readDirectory(this.config.backupDirectory);
      const backupFile = backupFiles.find((file) => file.match(backupFileName));

      if (!backupFile) {
        throw new BackupError(`No backup found for content with ID ${contentId}.`);
      }

      // Read the backup file
      const backupContent = await this.storage.readFile(backupFile);
      const restoredContent = JSON.parse(backupContent);

      // Write the restored content to the storage
      await this.storage.writeContent(contentId, restoredContent);

      console.log(`Content with ID ${contentId} restored successfully.`);
    } catch (error) {
      console.error(`Error restoring content with ID ${contentId}:`, error.message);
      throw error;
    }
  }
}

// Example usage
const config: Config = {
  backupDirectory: './backups',
};

const storage = {
  hasContent(id: string): boolean {
    // Implement your storage logic here
    // For example, you can check if the content exists in a database or a file system
    return true;
  },

  readContent(id: string): Promise<any> {
    // Implement your storage logic here
    // For example, you can read the content from a database or a file system
    return new Promise((resolve) => resolve({ title: 'Example Content', content: 'This is an example.' }));
  },

  hasDirectory(dir: string): boolean {
    // Implement your storage logic here
    // For example, you can check if the directory exists in a file system
    return true;
  },

  createDirectory(dir: string): Promise<void> {
    // Implement your storage logic here
    // For example, you can create the directory in a file system
    return new Promise((resolve) => resolve());
  },

  readDirectory(dir: string): Promise<string[]> {
    // Implement your storage logic here
    // For example, you can read the directory contents from a file system
    return new Promise((resolve) => resolve(['backup_file_1.json', 'backup_file_2.json']));
  },

  readFile(file: string): Promise<string> {
    // Implement your storage logic here
    // For example, you can read the file contents from a file system
    return new Promise((resolve) => resolve('{"title": "Example Content", "content": "This is an example."}'));
  },

  writeFile(file: string, content: string): Promise<void> {
    // Implement your storage logic here
    // For example, you can write the content to a file in a file system
    return new Promise((resolve) => resolve());
  },

  writeContent(id: string, content: any): Promise<void> {
    // Implement your storage logic here
    // For example, you can write the content to a database or a file system
    return new Promise((resolve) => resolve());
  },
};

const backupSystem = new BackupSystem(config, storage);

// Example usage of backupContent and restoreContent methods
backupSystem.backupContent('example_content');
backupSystem.restoreContent('example_content');