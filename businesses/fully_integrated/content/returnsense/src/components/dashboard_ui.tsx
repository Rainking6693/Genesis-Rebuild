import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  data?: {
    totalReturns?: number;
    returnRate?: number;
    averageCost?: number;
    topReturnedProducts?: string[];
  };
}

const DashboardUI: FC<Props> = ({ title, subtitle, data }) => {
  const renderData = () => {
    if (!data) return null;

    return (
      <div>
        <p>Total Returns: {data.totalReturns || 0}</p>
        <p>Return Rate: {data.returnRate || 0}%</p>
        <p>Average Cost: ${(data.averageCost || 0).toFixed(2)}</p>
      </div>
    );
  };

  return (
    <div>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      {renderData()}
      {data?.topReturnedProducts?.length > 0 && (
        <>
          <h3>Top Returned Products</h3>
          <ul>
            {data?.topReturnedProducts?.map((product, index) => (
              <li key={index}>{product}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default DashboardUI;

1. Added optional properties to the `data` interface to handle edge cases where some data might be missing.
2. Added a `renderData` function to make the code more readable and maintainable.
3. Added a null check for the `data` object to prevent any errors when it's not provided.
4. Added a check for the `topReturnedProducts` array to prevent any errors when it's not provided and only render the list when it has items.
5. Added a `key` prop to the `li` elements to ensure they have unique keys for better performance.
6. Formatted the average cost to 2 decimal places for better readability.
7. Added accessibility by providing proper heading levels (h1, h2, h3) for screen readers.
8. Wrapped the top returned products section in a conditional to only render it when there are items in the array.