import React, { FC, ReactNode } from 'react';

interface Props {
  reportTitle: string;
  reportData?: {
    engagementMetrics?: EngagementMetrics;
    contentRecommendations?: string[];
  };
}

interface EngagementMetrics {
  totalMembers?: number;
  activeMembers?: number;
  newMembers?: number;
  memberRetentionRate?: number;
}

const ReportingEngine: FC<Props> = ({ reportTitle, reportData }) => {
  const getEngagementMetrics = () => {
    if (!reportData?.engagementMetrics) return null;

    return (
      <ul>
        <li>Total Members: {reportData.engagementMetrics?.totalMembers || 0}</li>
        <li>Active Members: {reportData.engagementMetrics?.activeMembers || 0}</li>
        <li>New Members: {reportData.engagementMetrics?.newMembers || 0}</li>
        <li>Member Retention Rate: {reportData.engagementMetrics?.memberRetentionRate || 0}%</li>
      </ul>
    );
  };

  const getContentRecommendations = () => {
    if (!reportData?.contentRecommendations) return null;

    return (
      <ul>
        {reportData.contentRecommendations.map((recommendation, index) => (
          <li key={index}>{recommendation}</li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h1>{reportTitle}</h1>
      {getEngagementMetrics()}
      <h2>Content Recommendations</h2>
      {getContentRecommendations()}
    </div>
  );
};

export default ReportingEngine;

import React, { FC, ReactNode } from 'react';

interface Props {
  reportTitle: string;
  reportData?: {
    engagementMetrics?: EngagementMetrics;
    contentRecommendations?: string[];
  };
}

interface EngagementMetrics {
  totalMembers?: number;
  activeMembers?: number;
  newMembers?: number;
  memberRetentionRate?: number;
}

const ReportingEngine: FC<Props> = ({ reportTitle, reportData }) => {
  const getEngagementMetrics = () => {
    if (!reportData?.engagementMetrics) return null;

    return (
      <ul>
        <li>Total Members: {reportData.engagementMetrics?.totalMembers || 0}</li>
        <li>Active Members: {reportData.engagementMetrics?.activeMembers || 0}</li>
        <li>New Members: {reportData.engagementMetrics?.newMembers || 0}</li>
        <li>Member Retention Rate: {reportData.engagementMetrics?.memberRetentionRate || 0}%</li>
      </ul>
    );
  };

  const getContentRecommendations = () => {
    if (!reportData?.contentRecommendations) return null;

    return (
      <ul>
        {reportData.contentRecommendations.map((recommendation, index) => (
          <li key={index}>{recommendation}</li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h1>{reportTitle}</h1>
      {getEngagementMetrics()}
      <h2>Content Recommendations</h2>
      {getContentRecommendations()}
    </div>
  );
};

export default ReportingEngine;