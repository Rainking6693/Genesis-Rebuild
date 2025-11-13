import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  carbonData?: {
    totalCO2?: number;
    reductionPercentage?: number;
  };
  greenBadges?: string[];
}

const DashboardUI: FC<Props> = ({ title, subtitle, carbonData, greenBadges }) => {
  const getCarbonDataDisplay = () => {
    if (!carbonData) return null;
    return (
      <div>
        <p>Total CO2 Emissions: {carbonData.totalCO2 ?? 0} kg</p>
        <p>Reduction Percentage: {carbonData.reductionPercentage ?? 0}%</p>
      </div>
    );
  };

  return (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {getCarbonDataDisplay()}
      <div>
        {greenBadges?.map((badge) => (
          <img key={badge} src={`/images/${badge}.png`} alt={badge} />
        ))}
      </div>
    </div>
  );
};

export default DashboardUI;

1. Added optional properties to the `carbonData` and `greenBadges` interfaces to handle edge cases where these props might not be provided.
2. Created a helper function `getCarbonDataDisplay()` to separate the carbon data display logic, making the component more maintainable.
3. Added null checks and default values to handle cases where the data might not be available.
4. Added accessibility by providing alt text for the green badges images.
5. Improved maintainability by using the nullish coalescing operator (`??`) to provide default values when accessing the `totalCO2` and `reductionPercentage` properties of the `carbonData` object.