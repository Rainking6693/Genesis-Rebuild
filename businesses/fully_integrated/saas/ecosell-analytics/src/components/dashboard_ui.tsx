import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string; // Added optional subtitle
  carbonFootprint: number;
  customerSustainabilityScore: number;
  greenMarketingContent: string;
  children?: ReactNode; // Added optional children prop
}

const DashboardUI: FC<Props> = ({
  title,
  subtitle,
  carbonFootprint,
  customerSustainabilityScore,
  greenMarketingContent,
  children,
}) => {
  // Added role="region" for accessibility
  // Added a check for children before rendering them to avoid errors when no children are provided
  return (
    <div role="region">
      <h1>{title}</h1>
      {subtitle && <p role="presentation">{subtitle}</p>} // Added role="presentation" to avoid screen reader confusion
      <div>
        <strong>Carbon Footprint:</strong> {carbonFootprint}
      </div>
      <div>
        <strong>Customer Sustainability Score:</strong> {customerSustainabilityScore}
      </div>
      <div dangerouslySetInnerHTML={{ __html: greenMarketingContent }} />
      {children && <div>{children}</div>}
    </div>
  );
};

export default DashboardUI;

Changes made:

1. Added a check for children before rendering them to avoid errors when no children are provided.
2. Added `role="presentation"` to the subtitle paragraph to avoid screen reader confusion.
3. Moved the subtitle check inside the JSX to improve readability.
4. Kept the existing changes (added optional `subtitle` prop, added `children` prop, and added `role="region"` for accessibility).