import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  carbonFootprint: number;
  carbonCreditsGenerated: number;
  revenueFromCarbonCredits: number;
  children?: ReactNode;
}

const DashboardUI: FC<Props> = ({
  title,
  subtitle = '',
  carbonFootprint,
  carbonCreditsGenerated,
  revenueFromCarbonCredits,
  children,
}) => {
  if (!title || !carbonFootprint || !carbonCreditsGenerated || !revenueFromCarbonCredits) {
    return null;
  }

  return (
    <div className="dashboard-ui">
      <h1>{title}</h1>
      {subtitle && <p aria-label="Subtitle">{subtitle}</p>}

      <div>
        <strong aria-label="Carbon Footprint">Carbon Footprint:</strong> {carbonFootprint} kg CO2e
      </div>
      <div>
        <strong aria-label="Carbon Credits Generated">Carbon Credits Generated:</strong> {carbonCreditsGenerated}
      </div>
      <div>
        <strong aria-label="Revenue from Carbon Credits">Revenue from Carbon Credits:</strong> ${revenueFromCarbonCredits}
      </div>

      {children}
    </div>
  );
};

export default DashboardUI;

In this updated version, I've added type checking for the `children` prop, provided a default value for the `subtitle` property, added checks for null or undefined values of the props, and improved the accessibility of the component by adding ARIA labels for the labels. Additionally, I've added a CSS class for styling and better maintainability.