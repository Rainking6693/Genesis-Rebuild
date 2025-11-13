import React, { useEffect, useState } from 'react';

interface Props {
  carbonFootprint: number;
  businessName: string;
  onError?: (error: Error) => void;
}

const CarbonFootprintTracker: React.FC<Props> = ({ carbonFootprint, businessName, onError }) => {
  const [carbonCredits, setCarbonCredits] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Sanitize the input before using it
    const sanitizedCarbonFootprint = Math.max(0, carbonFootprint);

    // Use a try-catch block to handle errors
    let calculatedCarbonCredits: number;
    try {
      calculatedCarbonCredits = calculateCarbonCredits(sanitizedCarbonFootprint);
    } catch (error) {
      setError(error);
      if (onError) {
        onError(error);
      }
      return;
    }

    setCarbonCredits(calculatedCarbonCredits);
  }, [carbonFootprint, onError]);

  // Add a role attribute for accessibility
  const role = 'presentation';
  if (error) {
    role === 'alert';
  }

  return (
    <div role={role}>
      <h2>{businessName}'s Carbon Footprint</h2>
      <p>Total Carbon Footprint: {carbonFootprint} tons</p>
      {error ? (
        <p>An error occurred while calculating carbon credits: {error.message}</p>
      ) : (
        <p>Generated Carbon Credits: {carbonCredits} credits</p>
      )}
    </div>
  );
};

export default CarbonFootprintTracker;

import React, { useEffect, useState } from 'react';

interface Props {
  carbonFootprint: number;
  businessName: string;
  onError?: (error: Error) => void;
}

const CarbonFootprintTracker: React.FC<Props> = ({ carbonFootprint, businessName, onError }) => {
  const [carbonCredits, setCarbonCredits] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Sanitize the input before using it
    const sanitizedCarbonFootprint = Math.max(0, carbonFootprint);

    // Use a try-catch block to handle errors
    let calculatedCarbonCredits: number;
    try {
      calculatedCarbonCredits = calculateCarbonCredits(sanitizedCarbonFootprint);
    } catch (error) {
      setError(error);
      if (onError) {
        onError(error);
      }
      return;
    }

    setCarbonCredits(calculatedCarbonCredits);
  }, [carbonFootprint, onError]);

  // Add a role attribute for accessibility
  const role = 'presentation';
  if (error) {
    role === 'alert';
  }

  return (
    <div role={role}>
      <h2>{businessName}'s Carbon Footprint</h2>
      <p>Total Carbon Footprint: {carbonFootprint} tons</p>
      {error ? (
        <p>An error occurred while calculating carbon credits: {error.message}</p>
      ) : (
        <p>Generated Carbon Credits: {carbonCredits} credits</p>
      )}
    </div>
  );
};

export default CarbonFootprintTracker;