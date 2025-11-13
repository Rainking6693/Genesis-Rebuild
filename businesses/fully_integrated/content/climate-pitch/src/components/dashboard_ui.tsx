import React, { FC, ReactNode, useState } from 'react';

interface Props {
  title: string;
  subtitle: string;
  carbonImpactData?: CarbonImpactData;
  businessName?: string;
  businessLogo?: string;
  children?: ReactNode;
  className?: string;
  loading?: boolean;
  error?: Error;
  testId?: string;
}

interface CarbonImpactData {
  emissions?: number;
  reduction?: number;
}

const DashboardUI: FC<Props> = ({
  title,
  subtitle,
  carbonImpactData,
  businessName,
  businessLogo,
  children,
  className,
  loading,
  error,
  testId,
}) => {
  const logoAltText = businessName ? `${businessName} logo` : 'Content business logo';

  const [carbonImpactDataDisplay, setCarbonImpactDataDisplay] = useState({
    emissions: carbonImpactData?.emissions || 0,
    reduction: carbonImpactData?.reduction || 0,
  });

  return (
    <div data-testid={testId} className={className}>
      <h1 aria-label="Dashboard title">{title}</h1>
      <h2 aria-label="Dashboard subtitle">{subtitle}</h2>
      {businessLogo && <img src={businessLogo} alt={logoAltText} />}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <>
          <p>Total Emissions: {carbonImpactDataDisplay.emissions} tons</p>
          <p>Carbon Reduction: {carbonImpactDataDisplay.reduction} tons</p>
        </>
      )}
      {children}
    </div>
  );
};

export default DashboardUI;

In this updated version, I added a `loading` prop to display a loading message when data is still being fetched or is unavailable. I also added an `error` prop to display an error message when there's an error fetching the data. The `carbonImpactData` is now stored in a state variable `carbonImpactDataDisplay` to ensure that the component doesn't re-render unnecessarily when the props change. I also added a `testId` prop for easier testing.