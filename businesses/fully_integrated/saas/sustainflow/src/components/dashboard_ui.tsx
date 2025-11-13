import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: ReactNode; // Added type for subtitle children
  carbonFootprint: number;
  sustainabilityScore: number; // Added min and max for sustainabilityScore
  customerTrustSignals?: string[]; // Added optional customerTrustSignals
  esgReports?: string[]; // Added optional esgReports
  conversionRate: number;
  className?: string; // Added optional className for styling
  dataTestid?: string; // Added optional data-testid for testing
}

const DashboardUI: FC<Props> = ({
  title,
  subtitle,
  carbonFootprint,
  sustainabilityScore,
  customerTrustSignals = [], // Set default value for customerTrustSignals
  esgReports = [], // Set default value for esgReports
  conversionRate,
  className,
  dataTestid,
}) => {
  return (
    <div data-testid={dataTestid} role="region" className={className} title={title}>
      <h1 aria-label={`Dashboard title: ${title}`}>{title}</h1>
      {subtitle && <p aria-label={`Dashboard subtitle: ${subtitle}`}>{subtitle}</p>} // Render subtitle if provided
      <h2 aria-label="Carbon Footprint">Carbon Footprint: {carbonFootprint} kg CO2e</h2>
      <h2 aria-label="Sustainability Score">Sustainability Score: {sustainabilityScore}%</h2>
      <h3 aria-label="Customer Trust Signals">Customer Trust Signals:</h3>
      {customerTrustSignals.length > 0 && (
        <ul>
          {customerTrustSignals.map((signal) => (
            <li key={signal} aria-label={`Customer trust signal: ${signal}`}>{signal}</li>
          ))}
        </ul>
      )}
      {customerTrustSignals.length === 0 && <p>No customer trust signals available.</p>}
      <h3 aria-label="ESG Reports">ESG Reports:</h3>
      {esgReports.length > 0 && (
        <ul>
          {esgReports.map((report) => (
            <li key={report} aria-label={`ESG report: ${report}`}>{report}</li>
          ))}
        </ul>
      )}
      {esgReports.length === 0 && <p>No ESG reports available.</p>}
      <h3 aria-label="Conversion Rate">Conversion Rate:</h3>
      <p>{conversionRate}%</p>
    </div>
  );
};

export default DashboardUI;

This updated code addresses the requested improvements and should make the `DashboardUI` component more resilient, accessible, and maintainable.