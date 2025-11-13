import React, { useEffect, useState } from 'react';

interface Props {
  name: string;
  business: EcoFlowAnalytics;
}

const MyComponent: React.FC<Props> = ({ name, business }) => {
  const [sustainabilityScore, setSustainabilityScore] = useState<number | null>(null);
  const [greenInitiatives, setGreenInitiatives] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initialize analytics tracking for the business
    business.track('ComponentLoaded', { component: 'MyComponent' });

    const fetchData = async () => {
      try {
        const score = await business.getSustainabilityScore();
        setSustainabilityScore(score);

        const initiatives = await business.getGreenInitiatives();
        setGreenInitiatives(initiatives);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [business]);

  return (
    <>
      <h1>Hello, {name}!</h1>
      <div>
        {/* Display the business's sustainability score */}
        {sustainabilityScore && <p>Sustainability Score: {sustainabilityScore}</p>}
        {/* Display the error if an error occurred while fetching data */}
        {error && <p>Error fetching data: {error.message}</p>}
        {/* Display the business's green initiatives */}
        {greenInitiatives.length > 0 && (
          <ul>
            {greenInitiatives.map((initiative, index) => (
              <li key={index}>{initiative}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';

interface Props {
  name: string;
  business: EcoFlowAnalytics;
}

const MyComponent: React.FC<Props> = ({ name, business }) => {
  const [sustainabilityScore, setSustainabilityScore] = useState<number | null>(null);
  const [greenInitiatives, setGreenInitiatives] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initialize analytics tracking for the business
    business.track('ComponentLoaded', { component: 'MyComponent' });

    const fetchData = async () => {
      try {
        const score = await business.getSustainabilityScore();
        setSustainabilityScore(score);

        const initiatives = await business.getGreenInitiatives();
        setGreenInitiatives(initiatives);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [business]);

  return (
    <>
      <h1>Hello, {name}!</h1>
      <div>
        {/* Display the business's sustainability score */}
        {sustainabilityScore && <p>Sustainability Score: {sustainabilityScore}</p>}
        {/* Display the error if an error occurred while fetching data */}
        {error && <p>Error fetching data: {error.message}</p>}
        {/* Display the business's green initiatives */}
        {greenInitiatives.length > 0 && (
          <ul>
            {greenInitiatives.map((initiative, index) => (
              <li key={index}>{initiative}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default MyComponent;