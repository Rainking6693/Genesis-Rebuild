import React, { FC, ReactNode, PropsWithChildren } from 'react';

interface Props {
  title: string;
  subtitle: string;
  carbonFootprint?: number;
  savings?: number;
  taxCredits?: number;
  ecoImprovements?: string[];
  className?: string;
  dataTestid?: string;
}

const DashboardUI: FC<Props> = ({
  title,
  subtitle,
  carbonFootprint = 0,
  savings = 0,
  taxCredits = 0,
  ecoImprovements = [],
  className,
  dataTestid,
  children,
}) => {
  // Added a check to ensure the title and subtitle are provided
  if (!title || !subtitle) {
    return <div>Title and subtitle are required</div>;
  }

  // Added a check to ensure the carbonFootprint, savings, and taxCredits are valid numbers and not negative
  if (
    (typeof carbonFootprint !== 'number' || carbonFootprint < 0) ||
    (typeof savings !== 'number' || savings < 0) ||
    (typeof taxCredits !== 'number' || taxCredits < 0)
  ) {
    return <div>Invalid or negative values for Carbon Footprint, Savings, and Tax Credits</div>;
  }

  // Added a check to ensure the ecoImprovements array is not empty
  if (ecoImprovements.length === 0) {
    return <div>No Eco Improvements found</div>;
  }

  // Added ARIA labels and roles for accessibility
  return (
    <div className={className} data-testid={dataTestid}>
      <h1 id="dashboard-title" role="heading" aria-level={1}>
        {title}
      </h1>
      <h2 id="dashboard-subtitle" role="heading" aria-level={2}>
        {subtitle}
      </h2>
      <div>
        <p>
          Carbon Footprint: <abbr title="kilograms of Carbon Dioxide equivalent">kg CO2e</abbr> {carbonFootprint}
        </p>
        <p>Savings: ${savings}</p>
        <p>Tax Credits: ${taxCredits}</p>
        {children}
      </div>
      <h3>Eco Improvements</h3>
      <ul>
        {ecoImprovements.map((improvement, index) => (
          <li key={index}>{improvement}</li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardUI;

In this updated code, I've added a `children` prop to allow for more flexibility in rendering additional content within the dashboard. The `children` prop can be used to render additional sections or components within the dashboard, making it more reusable and maintainable.