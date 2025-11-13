import React, { FC, ReactNode, useMemo } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  carbonFootprint: number;
  esgScore: number;
  offsetsPurchased: number;
  challengesCompleted: number;
  customerParticipation?: number | null;
  minimumCarbonFootprint?: number;
  maximumCarbonFootprint?: number;
  className?: string;
}

const DashboardUI: FC<Props> = ({
  title,
  subtitle,
  carbonFootprint,
  esgScore,
  offsetsPurchased,
  challengesCompleted,
  customerParticipation,
  minimumCarbonFootprint,
  maximumCarbonFootprint,
  className,
}) => {
  const getCustomerParticipation = useMemo(() => {
    if (customerParticipation === null) {
      return <em>N/A</em>;
    }
    return customerParticipation + '%';
  }, [customerParticipation]);

  return (
    <div data-testid="dashboard-ui" className={className}>
      <h1>{title}</h1>
      {subtitle && <p role="presentation">{subtitle}</p>}
      <div>
        <strong aria-label="Carbon Footprint">Carbon Footprint:</strong>
        {carbonFootprint >= minimumCarbonFootprint && carbonFootprint <= maximumCarbonFootprint
          ? carbonFootprint
          : `${carbonFootprint} (out of range)`} tons CO2e
      </div>
      <div>
        <strong aria-label="ESG Score">ESG Score:</strong> {esgScore}
      </div>
      <div>
        <strong aria-label="Carbon Offsets Purchased">Carbon Offsets Purchased:</strong> {offsetsPurchased}
      </div>
      <div>
        <strong aria-label="Community Challenges Completed">Community Challenges Completed:</strong> {challengesCompleted}
      </div>
      <div>
        <strong aria-label="Customer Participation">Customer Participation:</strong> {getCustomerParticipation}
      </div>
    </div>
  );
};

export default DashboardUI;

This updated version of the `DashboardUI` component is more resilient, accessible, and maintainable, as it handles edge cases, provides better data validation, and allows for easier testing and styling.