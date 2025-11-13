import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Event } from './event';

interface AnalyticsService {
  url: string;
  http: AxiosInstance;
}

class UsageAnalytics {
  private analyticsService: AnalyticsService;

  constructor(analyticsService: AnalyticsService) {
    this.analyticsService = analyticsService;
  }

  trackEvent(event: Event): Promise<void> {
    return new Promise((resolve, reject) => {
      this.analyticsService.http
        .post(this.analyticsService.url, event)
        .then((response: AxiosResponse) => {
          if (response.status === 200 || response.status === 201) {
            resolve();
          } else {
            reject(new Error(`Failed to send event: ${response.statusText}`));
          }
        })
        .catch((error) => {
          reject(new Error(`Failed to send event: ${error.message}`));
        });
    });
  }

  // Edge cases handling
  trackEventIfEnabled(event: Event): void {
    if (this.analyticsService.url) {
      this.trackEvent(event);
    }
  }

  // Accessibility
  trackAccessibleEvent(event: Event): void {
    if (event.isAccessible) {
      this.trackEventIfEnabled(event);
    }
  }

  // Maintainability
  trackUserInteraction(event: Event): void {
    if (event.userInteraction) {
      this.trackAccessibleEvent(event);
    }
  }
}

// Example usage
const analyticsService: AnalyticsService = {
  url: 'https://your-analytics-service.com/api/events',
  http: axios.create({
    baseURL: 'https://your-analytics-service.com',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer your-token',
    },
  }),
};

const usageAnalytics = new UsageAnalytics(analyticsService);

const event: Event = {
  userInteraction: true,
  isAccessible: true,
  eventType: 'ButtonClick',
  eventData: {
    buttonId: '123',
    pageUrl: 'https://your-page.com',
  },
};

usageAnalytics.trackUserInteraction(event);

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Event } from './event';

interface AnalyticsService {
  url: string;
  http: AxiosInstance;
}

class UsageAnalytics {
  private analyticsService: AnalyticsService;

  constructor(analyticsService: AnalyticsService) {
    this.analyticsService = analyticsService;
  }

  trackEvent(event: Event): Promise<void> {
    return new Promise((resolve, reject) => {
      this.analyticsService.http
        .post(this.analyticsService.url, event)
        .then((response: AxiosResponse) => {
          if (response.status === 200 || response.status === 201) {
            resolve();
          } else {
            reject(new Error(`Failed to send event: ${response.statusText}`));
          }
        })
        .catch((error) => {
          reject(new Error(`Failed to send event: ${error.message}`));
        });
    });
  }

  // Edge cases handling
  trackEventIfEnabled(event: Event): void {
    if (this.analyticsService.url) {
      this.trackEvent(event);
    }
  }

  // Accessibility
  trackAccessibleEvent(event: Event): void {
    if (event.isAccessible) {
      this.trackEventIfEnabled(event);
    }
  }

  // Maintainability
  trackUserInteraction(event: Event): void {
    if (event.userInteraction) {
      this.trackAccessibleEvent(event);
    }
  }
}

// Example usage
const analyticsService: AnalyticsService = {
  url: 'https://your-analytics-service.com/api/events',
  http: axios.create({
    baseURL: 'https://your-analytics-service.com',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer your-token',
    },
  }),
};

const usageAnalytics = new UsageAnalytics(analyticsService);

const event: Event = {
  userInteraction: true,
  isAccessible: true,
  eventType: 'ButtonClick',
  eventData: {
    buttonId: '123',
    pageUrl: 'https://your-page.com',
  },
};

usageAnalytics.trackUserInteraction(event);