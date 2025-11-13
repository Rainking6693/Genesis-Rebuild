import React, { FC, ReactNode, PropsWithChildren } from 'react';

interface Props {
  title: string;
  carbonFootprint?: number | null;
  carbonCreditsPurchased?: number | null;
  sustainabilityScore?: number | null;
  greenRecommendations?: string[] | null;
  esgComplianceStatus?: string | null;
  costSavings?: number | null;
  marketingCredibility?: string | null;
  className?: string;
}

const DashboardUI: FC<Props & PropsWithChildren> = ({
  title,
  carbonFootprint,
  carbonCreditsPurchased,
  sustainabilityScore,
  greenRecommendations,
  esgComplianceStatus,
  costSavings,
  marketingCredibility,
  children,
  className,
}) => {
  const isDataAvailable =
    title !== undefined &&
    (carbonFootprint !== null ||
      carbonCreditsPurchased !== null ||
      sustainabilityScore !== null ||
      greenRecommendations !== null ||
      esgComplianceStatus !== null ||
      costSavings !== null ||
      marketingCredibility !== null);

  return (
    <div className={className} data-testid="dashboard-ui">
      <h1>{title}</h1>
      <div role="group">
        <strong>Carbon Footprint:</strong> {carbonFootprint || <em>N/A</em>}
      </div>
      <div role="group">
        <strong>Purchased Carbon Credits:</strong> {carbonCreditsPurchased || <em>N/A</em>}
      </div>
      <div role="group">
        <strong>Sustainability Score:</strong> {sustainabilityScore || <em>N/A</em>}
      </div>
      <div role="group">
        <strong>Green Recommendations:</strong>
        {greenRecommendations?.length > 0 ? (
          <>
            {greenRecommendations.map((recommendation, index) => (
              <p key={index}>{recommendation}</p>
            ))}
          </>
        ) : (
          <em>No recommendations available</em>
        )}
      </div>
      <div role="group">
        <strong>ESG Compliance Status:</strong> {esgComplianceStatus || <em>N/A</em>}
      </div>
      <div role="group">
        <strong>Cost Savings:</strong> {costSavings || <em>N/A</em>}
      </div>
      <div role="group">
        <strong>Marketing Credibility:</strong> {marketingCredibility || <em>N/A</em>}
      </div>
      {isDataAvailable && children}
    </div>
  );
};

export default DashboardUI;

import React, { FC, ReactNode, PropsWithChildren } from 'react';

interface Props {
  title: string;
  carbonFootprint?: number | null;
  carbonCreditsPurchased?: number | null;
  sustainabilityScore?: number | null;
  greenRecommendations?: string[] | null;
  esgComplianceStatus?: string | null;
  costSavings?: number | null;
  marketingCredibility?: string | null;
  className?: string;
}

const DashboardUI: FC<Props & PropsWithChildren> = ({
  title,
  carbonFootprint,
  carbonCreditsPurchased,
  sustainabilityScore,
  greenRecommendations,
  esgComplianceStatus,
  costSavings,
  marketingCredibility,
  children,
  className,
}) => {
  const isDataAvailable =
    title !== undefined &&
    (carbonFootprint !== null ||
      carbonCreditsPurchased !== null ||
      sustainabilityScore !== null ||
      greenRecommendations !== null ||
      esgComplianceStatus !== null ||
      costSavings !== null ||
      marketingCredibility !== null);

  return (
    <div className={className} data-testid="dashboard-ui">
      <h1>{title}</h1>
      <div role="group">
        <strong>Carbon Footprint:</strong> {carbonFootprint || <em>N/A</em>}
      </div>
      <div role="group">
        <strong>Purchased Carbon Credits:</strong> {carbonCreditsPurchased || <em>N/A</em>}
      </div>
      <div role="group">
        <strong>Sustainability Score:</strong> {sustainabilityScore || <em>N/A</em>}
      </div>
      <div role="group">
        <strong>Green Recommendations:</strong>
        {greenRecommendations?.length > 0 ? (
          <>
            {greenRecommendations.map((recommendation, index) => (
              <p key={index}>{recommendation}</p>
            ))}
          </>
        ) : (
          <em>No recommendations available</em>
        )}
      </div>
      <div role="group">
        <strong>ESG Compliance Status:</strong> {esgComplianceStatus || <em>N/A</em>}
      </div>
      <div role="group">
        <strong>Cost Savings:</strong> {costSavings || <em>N/A</em>}
      </div>
      <div role="group">
        <strong>Marketing Credibility:</strong> {marketingCredibility || <em>N/A</em>}
      </div>
      {isDataAvailable && children}
    </div>
  );
};

export default DashboardUI;