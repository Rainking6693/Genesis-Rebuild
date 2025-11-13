import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  storeName: string;
  contentStats: ContentStatObject;
  performanceMetrics: PerformanceMetricObject;
  errorMessages?: string[];
}

interface ContentStatObject {
  generatedProductDescriptions: number;
  optimizedEmailSequences: number;
  createdSocialMediaContent: number;
}

interface PerformanceMetricObject {
  avgGenerationTime: number;
  avgOptimizationTime: number;
}

const DashboardUI: FC<Props> = ({
  title,
  subtitle,
  storeName,
  contentStats,
  performanceMetrics,
  errorMessages = [],
}) => {
  const getContentStat = (key: keyof ContentStatObject) => contentStats[key];
  const getPerformanceMetric = (key: keyof PerformanceMetricObject) => performanceMetrics[key];

  const errorList = errorMessages?.map((error, index) => (
    <li key={index} role="listitem">{error}</li>
  ));

  const contentStatsList = Object.entries(contentStats).map(([key, value]) => (
    <li key={key}>
      {key}: {value}
    </li>
  ));

  const performanceMetricsList = Object.entries(performanceMetrics).map(([key, value]) => (
    <li key={key}>
      {key}: {value} ms
    </li>
  ));

  return (
    <div className="dashboard-ui" data-testid="dashboard-ui">
      <header role="banner">
        <h1 aria-label="Dashboard title">{title}</h1>
        <h2 aria-label="Dashboard subtitle">{subtitle}</h2>
      </header>
      <main>
        <h3 aria-label="Store name">{storeName}</h3>
        <div>
          <h4 aria-label="Content stats">Content Stats:</h4>
          {contentStatsList.length > 0 && <ul role="list">{contentStatsList}</ul>}
        </div>
        <div>
          <h4 aria-label="Performance metrics">Performance Metrics:</h4>
          {performanceMetricsList.length > 0 && <ul role="list">{performanceMetricsList}</ul>}
        </div>
      </main>
      <footer>
        {errorMessages.length > 0 && (
          <div>
            <h4 aria-label="Error messages">Error Messages:</h4>
            <ul role="list">{errorList}</ul>
          </div>
        )}
      </footer>
    </div>
  );
};

export default DashboardUI;

This updated version includes better structure, accessibility, and testing capabilities, while still maintaining readability and ease of maintenance.