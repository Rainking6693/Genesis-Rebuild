interface Props {
  title: string;
  subtitle: string;
  audienceGrowth: number | undefined;
  monetizationRevenue: number | undefined;
  engagementMetrics: {
    likes?: number;
    comments?: number;
    shares?: number;
  } | undefined;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

<h1 id="dashboard-title">{title || fallbackTitle}</h1>
<h2 id="dashboard-subtitle">{subtitle || fallbackSubtitle}</h2>

<div>
  <strong>Engagement Metrics:</strong>
  <ul>
    {Object.entries(engagementMetrics || {}).map(([key, value]) => (
      <li key={key}>{key}: {value || 'N/A'}</li>
    ))}
  </ul>
</div>

<li key={key}>{key}: {value || 'N/A'}</li>

import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  audienceGrowth: number | undefined;
  monetizationRevenue: number | undefined;
  engagementMetrics: {
    likes?: number;
    comments?: number;
    shares?: number;
  } | undefined;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

const getPercentage = (value: number | undefined) => (value !== undefined ? `${value}%` : 'N/A');
const getCurrency = (value: number | undefined) => (value !== undefined ? `$${value}` : 'N/A');

const DashboardUI: FC<Props> = ({
  title = 'Dashboard',
  subtitle = 'Overview',
  audienceGrowth,
  monetizationRevenue,
  engagementMetrics,
  fallbackTitle = title,
  fallbackSubtitle = subtitle,
}) => {
  return (
    <div>
      <h1 id="dashboard-title">{title || fallbackTitle}</h1>
      <h2 id="dashboard-subtitle">{subtitle || fallbackSubtitle}</h2>
      <div>
        <strong>Audience Growth:</strong> {getPercentage(audienceGrowth)}
      </div>
      <div>
        <strong>Monetization Revenue:</strong> {getCurrency(monetizationRevenue)}
      </div>
      <div>
        <strong>Engagement Metrics:</strong>
        <ul>
          {Object.entries(engagementMetrics || {}).map(([key, value]) => (
            <li key={key}>{key}: {value || 'N/A'}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardUI;

interface Props {
  title: string;
  subtitle: string;
  audienceGrowth: number | undefined;
  monetizationRevenue: number | undefined;
  engagementMetrics: {
    likes?: number;
    comments?: number;
    shares?: number;
  } | undefined;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

<h1 id="dashboard-title">{title || fallbackTitle}</h1>
<h2 id="dashboard-subtitle">{subtitle || fallbackSubtitle}</h2>

<div>
  <strong>Engagement Metrics:</strong>
  <ul>
    {Object.entries(engagementMetrics || {}).map(([key, value]) => (
      <li key={key}>{key}: {value || 'N/A'}</li>
    ))}
  </ul>
</div>

<li key={key}>{key}: {value || 'N/A'}</li>

import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  audienceGrowth: number | undefined;
  monetizationRevenue: number | undefined;
  engagementMetrics: {
    likes?: number;
    comments?: number;
    shares?: number;
  } | undefined;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

const getPercentage = (value: number | undefined) => (value !== undefined ? `${value}%` : 'N/A');
const getCurrency = (value: number | undefined) => (value !== undefined ? `$${value}` : 'N/A');

const DashboardUI: FC<Props> = ({
  title = 'Dashboard',
  subtitle = 'Overview',
  audienceGrowth,
  monetizationRevenue,
  engagementMetrics,
  fallbackTitle = title,
  fallbackSubtitle = subtitle,
}) => {
  return (
    <div>
      <h1 id="dashboard-title">{title || fallbackTitle}</h1>
      <h2 id="dashboard-subtitle">{subtitle || fallbackSubtitle}</h2>
      <div>
        <strong>Audience Growth:</strong> {getPercentage(audienceGrowth)}
      </div>
      <div>
        <strong>Monetization Revenue:</strong> {getCurrency(monetizationRevenue)}
      </div>
      <div>
        <strong>Engagement Metrics:</strong>
        <ul>
          {Object.entries(engagementMetrics || {}).map(([key, value]) => (
            <li key={key}>{key}: {value || 'N/A'}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardUI;

2. The `fallbackTitle` and `fallbackSubtitle` props are already added.

3. The `getPercentage` and `getCurrency` functions are already created.

4. Added `id` attributes to the `h1` and `h2` elements:

5. Used the `Object.entries` method to iterate through the `engagementMetrics` object and map each entry to a list item:

6. Added `key` attributes to the list items: