import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  data?: {
    score?: number;
    savings?: number;
    growth?: number;
  };
}

const getFormattedCurrency = (value: number | undefined) =>
  value !== undefined ? `$${value.toFixed(2)}` : 'N/A';

const getFormattedPercentage = (value: number | undefined) =>
  value !== undefined ? `${value}%` : 'N/A';

const DashboardUI: FC<Props> = ({ title, subtitle, data }) => {
  const renderData = () => {
    return (
      <div>
        <p aria-label="Sustainability Score">Sustainability Score: {data?.score || 'N/A'}</p>
        <p aria-label="Estimated Annual Savings">Estimated Annual Savings: {getFormattedCurrency(data?.savings)}</p>
        <p aria-label="Projected Organic Growth">Projected Organic Growth: {getFormattedPercentage(data?.growth)}</p>
      </div>
    );
  };

  return (
    <div>
      <h1 aria-label="Dashboard Title">{title}</h1>
      <h2 aria-label="Dashboard Subtitle">{subtitle}</h2>
      {renderData()}
    </div>
  );
};

export default DashboardUI;

In this updated version:

1. I added optional properties to the `data` interface to handle edge cases where some data might not be provided.
2. Created helper functions `getFormattedCurrency` and `getFormattedPercentage` to format the `savings` and `growth` values respectively, making the code more readable and maintainable.
3. Added a `renderData` function to separate the rendering of the data, making the component more modular and easier to test.
4. Added default values for the data properties when they are not provided, displaying 'N/A' instead.
5. Improved accessibility by providing proper ARIA labels for the headings and data elements.