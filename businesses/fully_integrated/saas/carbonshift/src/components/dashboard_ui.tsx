import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  carbonData?: CarbonData;
  recommendations?: string[];
  className?: string;
}

interface CarbonData {
  totalEmissions?: number;
  breakdown?: {
    supplyChain?: number;
    shipping?: number;
    packaging?: number;
  };
}

const DashboardUIContainer: FC<Props> = ({ title, subtitle, carbonData, recommendations, className }) => {
  const getEmissions = (breakdown: CarbonData['breakdown'] | undefined) => {
    if (!breakdown) return null;

    return (
      <ul role="list">
        <li role="listitem">Supply Chain: {breakdown.supplyChain} kg CO2e</li>
        <li role="listitem">Shipping: {breakdown.shipping} kg CO2e</li>
        <li role="listitem">Packaging: {breakdown.packaging} kg CO2e</li>
      </ul>
    );
  };

  const getRecommendations = (recommendations: string[] | undefined) => {
    if (!recommendations) return null;

    return (
      <ul role="list">
        {recommendations.map((recommendation, index) => (
          <li key={index} role="listitem">{recommendation}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className={className}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div>
        <p>Total Emissions: {carbonData?.totalEmissions} kg CO2e</p>
        {getEmissions(carbonData?.breakdown)}
      </div>
      {getRecommendations(recommendations)}
    </div>
  );
};

const DashboardUI: FC<Props> = ({ className, ...props }) => {
  return <DashboardUIContainer className={className} {...props} />;
};

export default DashboardUI;

This refactoring separates the container component (`DashboardUIContainer`) from the presentational component (`DashboardUI`), making it easier to manage the component's state and logic. Additionally, the ARIA roles and keys have been added for better accessibility and performance.