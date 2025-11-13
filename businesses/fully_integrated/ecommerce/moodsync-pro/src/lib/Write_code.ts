import { MoodSyncAPIClient } from './MoodSyncAPIClient';
import { TeamCommunicationPatternAnalyzer } from './TeamCommunicationPatternAnalyzer';
import { BurnoutRiskPredictor } from './BurnoutRiskPredictor';
import { PersonalizedInterventionSuggestor } from './PersonalizedInterventionSuggestor';
import { ProductivityTools } from './ProductivityTools';

interface IMoodSyncPro {
  analyzeCommunicationPatterns(teamId: string): Promise<void>;
  predictBurnoutRisks(teamId: string): Promise<void>;
  suggestInterventions(teamId: string): Promise<void>;
  enableProductivityTools(teamId: string): Promise<void>;
  disableProductivityTools(teamId: string): Promise<void>;
}

class MoodSyncPro implements IMoodSyncPro {
  private apiClient: MoodSyncAPIClient;
  private analyzer: TeamCommunicationPatternAnalyzer;
  private predictor: BurnoutRiskPredictor;
  private suggestor: PersonalizedInterventionSuggestor;
  private productivityTools: ProductivityTools;

  constructor(apiClient: MoodSyncAPIClient) {
    this.apiClient = apiClient;
    this.analyzer = new TeamCommunicationPatternAnalyzer(this.apiClient);
    this.predictor = new BurnoutRiskPredictor();
    this.suggestor = new PersonalizedInterventionSuggestor();
    this.productivityTools = new ProductivityTools();
  }

  public async analyzeCommunicationPatterns(teamId: string): Promise<void> {
    try {
      await this.analyzer.analyze(teamId);
    } catch (error) {
      console.error(`Error analyzing communication patterns for team ${teamId}:`, error);
      throw error;
    }
  }

  public async predictBurnoutRisks(teamId: string): Promise<void> {
    try {
      const communicationPatterns = await this.analyzer.getCommunicationPatterns(teamId);
      const risks = this.predictor.predict(communicationPatterns);
      await this.apiClient.sendBurnoutRisks(teamId, risks);
    } catch (error) {
      console.error(`Error predicting burnout risks for team ${teamId}:`, error);
      throw error;
    }
  }

  public async suggestInterventions(teamId: string): Promise<void> {
    try {
      const risks = await this.apiClient.getBurnoutRisks(teamId);
      const interventions = this.suggestor.suggest(risks);
      await this.apiClient.sendInterventionSuggestions(teamId, interventions);
    } catch (error) {
      console.error(`Error suggesting interventions for team ${teamId}:`, error);
      throw error;
    }
  }

  public async enableProductivityTools(teamId: string): Promise<void> {
    try {
      await this.productivityTools.enable(teamId);
    } catch (error) {
      console.error(`Error enabling productivity tools for team ${teamId}:`, error);
      throw error;
    }
  }

  public async disableProductivityTools(teamId: string): Promise<void> {
    try {
      await this.productivityTools.disable(teamId);
    } catch (error) {
      console.error(`Error disabling productivity tools for team ${teamId}:`, error);
      throw error;
    }
  }
}

export { MoodSyncPro };

import { MoodSyncAPIClient } from './MoodSyncAPIClient';
import { TeamCommunicationPatternAnalyzer } from './TeamCommunicationPatternAnalyzer';
import { BurnoutRiskPredictor } from './BurnoutRiskPredictor';
import { PersonalizedInterventionSuggestor } from './PersonalizedInterventionSuggestor';
import { ProductivityTools } from './ProductivityTools';

interface IMoodSyncPro {
  analyzeCommunicationPatterns(teamId: string): Promise<void>;
  predictBurnoutRisks(teamId: string): Promise<void>;
  suggestInterventions(teamId: string): Promise<void>;
  enableProductivityTools(teamId: string): Promise<void>;
  disableProductivityTools(teamId: string): Promise<void>;
}

class MoodSyncPro implements IMoodSyncPro {
  private apiClient: MoodSyncAPIClient;
  private analyzer: TeamCommunicationPatternAnalyzer;
  private predictor: BurnoutRiskPredictor;
  private suggestor: PersonalizedInterventionSuggestor;
  private productivityTools: ProductivityTools;

  constructor(apiClient: MoodSyncAPIClient) {
    this.apiClient = apiClient;
    this.analyzer = new TeamCommunicationPatternAnalyzer(this.apiClient);
    this.predictor = new BurnoutRiskPredictor();
    this.suggestor = new PersonalizedInterventionSuggestor();
    this.productivityTools = new ProductivityTools();
  }

  public async analyzeCommunicationPatterns(teamId: string): Promise<void> {
    try {
      await this.analyzer.analyze(teamId);
    } catch (error) {
      console.error(`Error analyzing communication patterns for team ${teamId}:`, error);
      throw error;
    }
  }

  public async predictBurnoutRisks(teamId: string): Promise<void> {
    try {
      const communicationPatterns = await this.analyzer.getCommunicationPatterns(teamId);
      const risks = this.predictor.predict(communicationPatterns);
      await this.apiClient.sendBurnoutRisks(teamId, risks);
    } catch (error) {
      console.error(`Error predicting burnout risks for team ${teamId}:`, error);
      throw error;
    }
  }

  public async suggestInterventions(teamId: string): Promise<void> {
    try {
      const risks = await this.apiClient.getBurnoutRisks(teamId);
      const interventions = this.suggestor.suggest(risks);
      await this.apiClient.sendInterventionSuggestions(teamId, interventions);
    } catch (error) {
      console.error(`Error suggesting interventions for team ${teamId}:`, error);
      throw error;
    }
  }

  public async enableProductivityTools(teamId: string): Promise<void> {
    try {
      await this.productivityTools.enable(teamId);
    } catch (error) {
      console.error(`Error enabling productivity tools for team ${teamId}:`, error);
      throw error;
    }
  }

  public async disableProductivityTools(teamId: string): Promise<void> {
    try {
      await this.productivityTools.disable(teamId);
    } catch (error) {
      console.error(`Error disabling productivity tools for team ${teamId}:`, error);
      throw error;
    }
  }
}

export { MoodSyncPro };