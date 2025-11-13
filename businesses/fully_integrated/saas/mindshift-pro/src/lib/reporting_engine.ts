import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from './encryption';
import { MoodData, TeamData, ProductivityData } from './data_models';

interface ReportingEngine {
  generateReport(teamId: string): Promise<Report | null>;
}

interface Report {
  teamId: string;
  reportId: string;
  moodData: MoodData[];
  productivityData: ProductivityData[];
  wellnessRecommendations: string[];
  reportData: string | null; // Added nullable type for reportData
}

interface DataStore<T> {
  set(teamId: string, data: T[]): void;
  get(teamId: string): T[] | undefined;
  has(teamId: string): boolean; // Added method to check if data exists for a team
}

class ReportingEngineImpl implements ReportingEngine {
  private teamDataStore: DataStore<TeamData>;
  private moodDataStore: DataStore<MoodData[]>;
  private productivityDataStore: DataStore<ProductivityData[]>;

  constructor(dataStores: { teamDataStore: DataStore<TeamData>; moodDataStore: DataStore<MoodData[]>; productivityDataStore: DataStore<ProductivityData[]> }) {
    this.teamDataStore = dataStores.teamDataStore;
    this.moodDataStore = dataStores.moodDataStore;
    this.productivityDataStore = dataStores.productivityDataStore;
  }

  public async generateReport(teamId: string): Promise<Report | null> {
    if (!this.teamDataStore.has(teamId)) {
      return null; // Return null if team data is not found
    }

    const teamData = this.teamDataStore.get(teamId);
    const moodData = this.moodDataStore.get(teamId) || [];
    const productivityData = this.productivityDataStore.get(teamId) || [];

    const reportId = uuidv4();
    const report: Report = {
      teamId,
      reportId,
      moodData,
      productivityData,
      wellnessRecommendations: this.generateWellnessRecommendations(moodData),
      reportData: null, // Initialize reportData to null
    };

    try {
      report.reportData = encrypt(JSON.stringify(report));
      this.moodDataStore.set(teamId, moodData); // Update moodData after encrypting the report
      this.productivityDataStore.set(teamId, productivityData); // Update productivityData after encrypting the report
    } catch (error) {
      console.error('Failed to encrypt the report data:', error);
      return null; // Return null if encrypting the report data fails
    }

    return report;
  }

  private generateWellnessRecommendations(moodData: MoodData[]): string[] {
    let recommendations: string[] = [];

    if (moodData.length === 0) {
      recommendations = ['No mood data available'];
    } else {
      const positiveMoodCount = moodData.filter(mood => mood.moodLevel === 'Positive').length;
      const neutralMoodCount = moodData.filter(mood => mood.moodLevel === 'Neutral').length;
      const negativeMoodCount = moodData.filter(mood => mood.moodLevel === 'Negative').length;

      if (positiveMoodCount > neutralMoodCount && positiveMoodCount > negativeMoodCount) {
        recommendations = ['Continue with current activities', 'Encourage team bonding'];
      } else if (negativeMoodCount > positiveMoodCount && negativeMoodCount > neutralMoodCount) {
        recommendations = ['Consider offering stress management workshops', 'Encourage breaks and relaxation'];
      } else {
        recommendations = ['Offer team-building activities', 'Encourage open communication'];
      }
    }

    return recommendations;
  }
}

export { ReportingEngine, ReportingEngineImpl };

// Data storage implementation

import { v4 as uuidv4 } from 'uuid';

interface DataStore<T> {
  set(teamId: string, data: T[]): void;
  get(teamId: string): T[] | undefined;
  has(teamId: string): boolean; // Added method to check if data exists for a team
}

class InMemoryDataStore<T> implements DataStore<T> {
  private data: Map<string, T[]> = new Map();

  public set(teamId: string, data: T[]): void {
    this.data.set(teamId, data);
  }

  public get(teamId: string): T[] | undefined {
    return this.data.get(teamId);
  }

  public has(teamId: string): boolean {
    return this.data.has(teamId);
  }
}

export { InMemoryDataStore };

import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from './encryption';
import { MoodData, TeamData, ProductivityData } from './data_models';

interface ReportingEngine {
  generateReport(teamId: string): Promise<Report | null>;
}

interface Report {
  teamId: string;
  reportId: string;
  moodData: MoodData[];
  productivityData: ProductivityData[];
  wellnessRecommendations: string[];
  reportData: string | null; // Added nullable type for reportData
}

interface DataStore<T> {
  set(teamId: string, data: T[]): void;
  get(teamId: string): T[] | undefined;
  has(teamId: string): boolean; // Added method to check if data exists for a team
}

class ReportingEngineImpl implements ReportingEngine {
  private teamDataStore: DataStore<TeamData>;
  private moodDataStore: DataStore<MoodData[]>;
  private productivityDataStore: DataStore<ProductivityData[]>;

  constructor(dataStores: { teamDataStore: DataStore<TeamData>; moodDataStore: DataStore<MoodData[]>; productivityDataStore: DataStore<ProductivityData[]> }) {
    this.teamDataStore = dataStores.teamDataStore;
    this.moodDataStore = dataStores.moodDataStore;
    this.productivityDataStore = dataStores.productivityDataStore;
  }

  public async generateReport(teamId: string): Promise<Report | null> {
    if (!this.teamDataStore.has(teamId)) {
      return null; // Return null if team data is not found
    }

    const teamData = this.teamDataStore.get(teamId);
    const moodData = this.moodDataStore.get(teamId) || [];
    const productivityData = this.productivityDataStore.get(teamId) || [];

    const reportId = uuidv4();
    const report: Report = {
      teamId,
      reportId,
      moodData,
      productivityData,
      wellnessRecommendations: this.generateWellnessRecommendations(moodData),
      reportData: null, // Initialize reportData to null
    };

    try {
      report.reportData = encrypt(JSON.stringify(report));
      this.moodDataStore.set(teamId, moodData); // Update moodData after encrypting the report
      this.productivityDataStore.set(teamId, productivityData); // Update productivityData after encrypting the report
    } catch (error) {
      console.error('Failed to encrypt the report data:', error);
      return null; // Return null if encrypting the report data fails
    }

    return report;
  }

  private generateWellnessRecommendations(moodData: MoodData[]): string[] {
    let recommendations: string[] = [];

    if (moodData.length === 0) {
      recommendations = ['No mood data available'];
    } else {
      const positiveMoodCount = moodData.filter(mood => mood.moodLevel === 'Positive').length;
      const neutralMoodCount = moodData.filter(mood => mood.moodLevel === 'Neutral').length;
      const negativeMoodCount = moodData.filter(mood => mood.moodLevel === 'Negative').length;

      if (positiveMoodCount > neutralMoodCount && positiveMoodCount > negativeMoodCount) {
        recommendations = ['Continue with current activities', 'Encourage team bonding'];
      } else if (negativeMoodCount > positiveMoodCount && negativeMoodCount > neutralMoodCount) {
        recommendations = ['Consider offering stress management workshops', 'Encourage breaks and relaxation'];
      } else {
        recommendations = ['Offer team-building activities', 'Encourage open communication'];
      }
    }

    return recommendations;
  }
}

export { ReportingEngine, ReportingEngineImpl };

// Data storage implementation

import { v4 as uuidv4 } from 'uuid';

interface DataStore<T> {
  set(teamId: string, data: T[]): void;
  get(teamId: string): T[] | undefined;
  has(teamId: string): boolean; // Added method to check if data exists for a team
}

class InMemoryDataStore<T> implements DataStore<T> {
  private data: Map<string, T[]> = new Map();

  public set(teamId: string, data: T[]): void {
    this.data.set(teamId, data);
  }

  public get(teamId: string): T[] | undefined {
    return this.data.get(teamId);
  }

  public has(teamId: string): boolean {
    return this.data.has(teamId);
  }
}

export { InMemoryDataStore };