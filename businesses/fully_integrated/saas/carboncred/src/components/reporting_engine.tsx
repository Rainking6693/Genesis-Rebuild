import React from 'react';

// Assuming CarbonFootprintData and CarbonEmissions are defined elsewhere
type CarbonFootprintData = {
  carbonEmissions: CarbonEmissions;
  carbonCreditsGenerated: CarbonEmissions;
};

type CarbonEmissions = number | null | undefined;

interface Props {
  carbonFootprintData: CarbonFootprintData;
}

const ReportingEngine: React.FC<Props> = ({ carbonFootprintData }) => {
  const { carbonEmissions, carbonCreditsGenerated } = carbonFootprintData;

  if (!carbonFootprintData) {
    return <div>No carbon footprint data provided.</div>;
  }

  const totalCarbonCredits = calculateTotalCarbonCredits(carbonEmissions);

  const canSellCarbonCredits = carbonCreditsGenerated >= totalCarbonCredits;

  if (!canSellCarbonCredits) {
    return (
      <div>
        <h1>Carbon Footprint Report</h1>
        <p aria-label="Total carbon emissions">Total Carbon Emissions:</p>
        <p>{carbonEmissions} tons</p>
        <p aria-label="Carbon credits generated">Carbon Credits Generated:</p>
        <p>{carbonCreditsGenerated} tons</p>
        <p>You cannot sell carbon credits at this time.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Carbon Footprint Report</h1>
      <p aria-label="Total carbon emissions">Total Carbon Emissions:</p>
      <p>{carbonEmissions} tons</p>
      <p aria-label="Carbon credits generated">Carbon Credits Generated:</p>
      <p>{carbonCreditsGenerated} tons</p>
      <p>You can sell {totalCarbonCredits} tons of carbon credits.</p>
    </div>
  );
};

// Function to calculate total carbon credits that can be generated or sold
function calculateTotalCarbonCredits(carbonEmissions: CarbonEmissions): CarbonEmissions {
  // Implement the logic to calculate the total carbon credits based on the carbon emissions
  // For example, let's assume that 1 ton of carbon emissions can generate 1 carbon credit
  // Add a default value in case carbonEmissions is undefined or null
  return carbonEmissions !== undefined && carbonEmissions !== null ? carbonEmissions : 0;
}

ReportingEngine.displayName = 'ReportingEngine';
ReportingEngine.whyDidYouRender = true; // For debugging purposes, you can remove this in production

export default ReportingEngine;

This updated code addresses the requested improvements by adding type safety, handling edge cases, improving accessibility, and ensuring maintainability.