import React, { FC, Key } from 'react';

interface Props {
  title: string;
  subtitle?: string | null;
  carbonFootprint?: number | null;
  carbonEmissionCategory: string;
  customerImpactScore?: number;
  carbonFootprintUnit?: string;
  carbonFootprintMaxDisplay?: number;
  carbonFootprintMinDisplay?: number;
  carbonFootprintSuffix?: string;
}

const DashboardUI: FC<Props> = ({
  title,
  subtitle,
  carbonFootprint,
  carbonEmissionCategory,
  customerImpactScore = 0,
  carbonFootprintUnit = 'kg',
  carbonFootprintMaxDisplay = 3,
  carbonFootprintMinDisplay = 0,
  carbonFootprintSuffix = ' CO2e',
}) => {
  const formattedCarbonFootprint =
    carbonFootprint !== null && carbonFootprint !== undefined
      ? `${Math.max(carbonFootprintMinDisplay, Math.min(carbonFootprint, carbonFootprintMaxDisplay))}${carbonFootprintSuffix}`
      : '';

  return (
    <div className="dashboard-ui" key={title}>
      <h1>{title}</h1>
      {subtitle !== null && (
        <p aria-label="Subtitle">{subtitle}</p>
      )}
      <div>
        <strong aria-label="Carbon Footprint">Carbon Footprint:</strong> {formattedCarbonFootprint}
      </div>
      <div>
        <strong aria-label="Carbon Emission Category">Carbon Emission Category:</strong> {carbonEmissionCategory}
      </div>
      <div>
        <strong aria-label="Customer Impact Score">Customer Impact Score:</strong> {customerImpactScore}
      </div>
    </div>
  );
};

export default DashboardUI;

This updated version of the `DashboardUI` component is more resilient, handles edge cases better, is more accessible, and easier to maintain.