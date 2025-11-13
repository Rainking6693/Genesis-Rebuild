import { Campaign, CampaignMetrics, Influencer } from './dataTypes';

// Function signature with clear purpose and input validation
function displayDashboard(campaignId: number): void {
  // Input validation to ensure correct usage
  if (!Number.isInteger(campaignId) || campaignId < 1) {
    throw new Error('Invalid campaign ID');
  }

  // Consistency with business context: use descriptive variable names
  let campaign: Campaign | null = null;
  let influencers: Influencer[] = [];
  let campaignMetrics: CampaignMetrics | null = null;

  // Performance optimization: lazy load data and use caching where possible
  const preloadCampaignDataPromise = preloadCampaignData(campaignId);

  // Maintainability: separate concerns and use modular design
  Promise.all([
    getCampaignById(campaignId).then((data) => {
      campaign = sanitizeCampaignData(data);
    }),
    getInfluencersByCampaignId(campaignId).then((data) => {
      influencers = sanitizeInfluencerData(data);
    }),
    getCampaignMetrics(campaignId).then((data) => {
      campaignMetrics = sanitizeMetricsData(data);
    }),
    preloadCampaignDataPromise,
  ]).catch((error) => {
    console.error(error);
  });

  // Maintainability: separate rendering concerns
  renderCampaignDetails(campaign);
  renderInfluencerList(influencers, campaign);
  renderMetrics(campaignMetrics, campaign);
}

// Helper functions for maintainability
function getCampaignById(id: number): Promise<Campaign | null> {
  // Implementation details omitted for brevity

  // Add error handling for API calls
  return fetch(`/api/campaigns/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch campaign data');
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

function getInfluencersByCampaignId(campaignId: number): Promise<Influencer[]> {
  // Implementation details omitted for brevity

  // Add error handling for API calls
  return fetch(`/api/influencers?campaignId=${campaignId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch influencer data');
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
}

function getCampaignMetrics(campaignId: number): Promise<CampaignMetrics | null> {
  // Implementation details omitted for brevity

  // Add error handling for API calls
  return fetch(`/api/campaign-metrics/${campaignId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch campaign metrics data');
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

function sanitizeCampaignData(campaign: Campaign): Campaign {
  // Implementation details omitted for brevity

  // Add accessibility considerations by using ARIA attributes
  campaign.name = {
    ...campaign.name,
    'aria-label': 'Campaign name',
  };

  return campaign;
}

function sanitizeInfluencerData(influencers: Influencer[]): Influencer[] {
  // Implementation details omitted for brevity

  // Add accessibility considerations by using ARIA attributes
  influencers.forEach((influencer) => {
    influencer.name = {
      ...influencer.name,
      'aria-label': 'Influencer name',
    };
  });

  return influencers;
}

function sanitizeMetricsData(metrics: CampaignMetrics): CampaignMetrics {
  // Implementation details omitted for brevity

  // Add accessibility considerations by using ARIA attributes
  metrics.impressions = {
    ...metrics.impressions,
    'aria-label': 'Number of impressions',
  };

  return metrics;
}

function preloadCampaignData(campaignId: number): Promise<void> {
  // Implementation details omitted for brevity

  // Add error handling for API calls
  return fetch(`/api/preload-campaign-data/${campaignId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to preload campaign data');
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function renderCampaignDetails(campaign: Campaign | null): void {
  // Implementation details omitted for brevity
}

function renderInfluencerList(influencers: Influencer[], campaign: Campaign | null): void {
  // Implementation details omitted for brevity
}

function renderMetrics(metrics: CampaignMetrics | null, campaign: Campaign | null): void {
  // Implementation details omitted for brevity
}

import { Campaign, CampaignMetrics, Influencer } from './dataTypes';

// Function signature with clear purpose and input validation
function displayDashboard(campaignId: number): void {
  // Input validation to ensure correct usage
  if (!Number.isInteger(campaignId) || campaignId < 1) {
    throw new Error('Invalid campaign ID');
  }

  // Consistency with business context: use descriptive variable names
  let campaign: Campaign | null = null;
  let influencers: Influencer[] = [];
  let campaignMetrics: CampaignMetrics | null = null;

  // Performance optimization: lazy load data and use caching where possible
  const preloadCampaignDataPromise = preloadCampaignData(campaignId);

  // Maintainability: separate concerns and use modular design
  Promise.all([
    getCampaignById(campaignId).then((data) => {
      campaign = sanitizeCampaignData(data);
    }),
    getInfluencersByCampaignId(campaignId).then((data) => {
      influencers = sanitizeInfluencerData(data);
    }),
    getCampaignMetrics(campaignId).then((data) => {
      campaignMetrics = sanitizeMetricsData(data);
    }),
    preloadCampaignDataPromise,
  ]).catch((error) => {
    console.error(error);
  });

  // Maintainability: separate rendering concerns
  renderCampaignDetails(campaign);
  renderInfluencerList(influencers, campaign);
  renderMetrics(campaignMetrics, campaign);
}

// Helper functions for maintainability
function getCampaignById(id: number): Promise<Campaign | null> {
  // Implementation details omitted for brevity

  // Add error handling for API calls
  return fetch(`/api/campaigns/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch campaign data');
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

function getInfluencersByCampaignId(campaignId: number): Promise<Influencer[]> {
  // Implementation details omitted for brevity

  // Add error handling for API calls
  return fetch(`/api/influencers?campaignId=${campaignId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch influencer data');
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
}

function getCampaignMetrics(campaignId: number): Promise<CampaignMetrics | null> {
  // Implementation details omitted for brevity

  // Add error handling for API calls
  return fetch(`/api/campaign-metrics/${campaignId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch campaign metrics data');
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

function sanitizeCampaignData(campaign: Campaign): Campaign {
  // Implementation details omitted for brevity

  // Add accessibility considerations by using ARIA attributes
  campaign.name = {
    ...campaign.name,
    'aria-label': 'Campaign name',
  };

  return campaign;
}

function sanitizeInfluencerData(influencers: Influencer[]): Influencer[] {
  // Implementation details omitted for brevity

  // Add accessibility considerations by using ARIA attributes
  influencers.forEach((influencer) => {
    influencer.name = {
      ...influencer.name,
      'aria-label': 'Influencer name',
    };
  });

  return influencers;
}

function sanitizeMetricsData(metrics: CampaignMetrics): CampaignMetrics {
  // Implementation details omitted for brevity

  // Add accessibility considerations by using ARIA attributes
  metrics.impressions = {
    ...metrics.impressions,
    'aria-label': 'Number of impressions',
  };

  return metrics;
}

function preloadCampaignData(campaignId: number): Promise<void> {
  // Implementation details omitted for brevity

  // Add error handling for API calls
  return fetch(`/api/preload-campaign-data/${campaignId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to preload campaign data');
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function renderCampaignDetails(campaign: Campaign | null): void {
  // Implementation details omitted for brevity
}

function renderInfluencerList(influencers: Influencer[], campaign: Campaign | null): void {
  // Implementation details omitted for brevity
}

function renderMetrics(metrics: CampaignMetrics | null, campaign: Campaign | null): void {
  // Implementation details omitted for brevity
}