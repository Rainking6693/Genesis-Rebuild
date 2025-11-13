import { v4 as uuidv4 } from 'uuid';
import { Encryptor } from '../security/encryptor';
import { IUsageAnalyticsData } from './usage_analytics_data';

export interface IUsageAnalytics {
  logUsageData(data: IUsageAnalyticsData): Promise<void>;
}

export class UsageAnalytics implements IUsageAnalytics {
  private encryptor: Encryptor;
  private dataStore: Map<string, IUsageAnalyticsData>;
  private maxDataStoreSize: number;
  private logger: (message: string) => void;

  constructor(maxDataStoreSize: number = 10000, logger: (message: string) => void = console.log) {
    this.encryptor = new Encryptor();
    this.dataStore = new Map();
    this.maxDataStoreSize = maxDataStoreSize;
    this.logger = logger;
  }

  public async logUsageData(data: IUsageAnalyticsData): Promise<void> {
    if (!data) {
      throw new Error('UsageAnalyticsData is required');
    }

    const encryptedData = this.encryptor.encrypt(JSON.stringify(data));
    const id = uuidv4();
    this.dataStore.set(id, { ...data, id });

    // Optimize the logging process by using a queue or batching the data
    // before sending it to the actual data storage service.
    // For simplicity, we'll remove old data when the limit is reached.
    if (this.dataStore.size > this.maxDataStoreSize) {
      this.dataStore.clear();
    }

    // Log the data to the console for debugging purposes
    this.logger(`Logged usage data with ID: ${id}`, encryptedData);
  }
}

import { v4 as uuidv4 } from 'uuid';
import { Encryptor } from '../security/encryptor';
import { IUsageAnalyticsData } from './usage_analytics_data';

export interface IUsageAnalytics {
  logUsageData(data: IUsageAnalyticsData): Promise<void>;
}

export class UsageAnalytics implements IUsageAnalytics {
  private encryptor: Encryptor;
  private dataStore: Map<string, IUsageAnalyticsData>;
  private maxDataStoreSize: number;
  private logger: (message: string) => void;

  constructor(maxDataStoreSize: number = 10000, logger: (message: string) => void = console.log) {
    this.encryptor = new Encryptor();
    this.dataStore = new Map();
    this.maxDataStoreSize = maxDataStoreSize;
    this.logger = logger;
  }

  public async logUsageData(data: IUsageAnalyticsData): Promise<void> {
    if (!data) {
      throw new Error('UsageAnalyticsData is required');
    }

    const encryptedData = this.encryptor.encrypt(JSON.stringify(data));
    const id = uuidv4();
    this.dataStore.set(id, { ...data, id });

    // Optimize the logging process by using a queue or batching the data
    // before sending it to the actual data storage service.
    // For simplicity, we'll remove old data when the limit is reached.
    if (this.dataStore.size > this.maxDataStoreSize) {
      this.dataStore.clear();
    }

    // Log the data to the console for debugging purposes
    this.logger(`Logged usage data with ID: ${id}`, encryptedData);
  }
}