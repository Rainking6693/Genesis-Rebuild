import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  carbonFootprint?: number;
  esgScore?: number;
  carbonOffsetAmount?: number;
  complianceStatus?: string;
  actionRecommendations?: string[];
  children?: ReactNode;
  className?: string;
  dataTestid?: string;
}

const DashboardUI: FC<Props> = ({
  title,
  subtitle,
  carbonFootprint = 0,
  esgScore = 0,
  carbonOffsetAmount = 0,
  complianceStatus = '',
  actionRecommendations = [],
  children,
  className,
  dataTestid,
}) => {
  const hasActionRecommendations = actionRecommendations.length > 0;

  return (
    <div className={className} data-testid={dataTestid}>
      <h1 role="heading" aria-level={1}>
        {title}
      </h1>
      <p role="heading" aria-level={2} style={{ minWidth: '300px', maxWidth: '600px' }}>
        {subtitle}
      </p>
      <h2>Carbon Footprint: {carbonFootprint > 0 ? carbonFootprint : 'N/A'} tons</h2>
      <h2>ESG Score: {esgScore > 0 ? esgScore : 'N/A'}</h2>
      <h2>Carbon Offset Amount: {carbonOffsetAmount > 0 ? carbonOffsetAmount : 'N/A'} tons</h2>
      <h2>Compliance Status: {complianceStatus}</h2>
      {hasActionRecommendations && (
        <>
          <h3>Action Recommendations:</h3>
          <ul>
            {actionRecommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </>
      )}
      {children}
    </div>
  );
};

export default DashboardUI;

This updated version of the `DashboardUI` component addresses the requested improvements in resiliency, edge cases, accessibility, and maintainability.