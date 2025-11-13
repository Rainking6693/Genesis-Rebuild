import React, { useEffect, useState } from 'react';

interface BusinessData {
  carbonFootprint: number;
  esgScore: number;
  communityChallenges: Array<{
    id: number;
    name: string;
    description: string;
    target: number;
    currentProgress: number;
  }>;
}

interface Props {
  apiKey: string;
  businessName: string;
  carbonFootprint?: number;
  esgScore?: number;
  communityChallenges?: Array<{
    id: number;
    name: string;
    description: string;
    target: number;
    currentProgress: number;
  }>;
}

const MyComponent: React.FC<Props> = ({
  apiKey,
  businessName,
  carbonFootprint = 0,
  esgScore = 0,
  communityChallenges = [],
}) => {
  const [data, setData] = useState<BusinessData>({ carbonFootprint, esgScore, communityChallenges });
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.climatecommit.com/business/${businessName}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const fetchedData = await response.json();
        setData(fetchedData);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [apiKey, businessName]);

  const handleDataError = () => (
    <div role="alert">
      <h1>Error fetching data</h1>
      <p>Please check your API key and business name.</p>
    </div>
  );

  if (error) {
    return handleDataError();
  }

  if (Object.keys(data).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 id="business-name">{businessName}</h1>
      <p>Carbon Footprint: {data.carbonFootprint} tons</p>
      <p>ESG Score: {data.esgScore}</p>
      <h2>Community Challenges</h2>
      <ul role="list">
        {data.communityChallenges.map((challenge) => (
          <li key={challenge.id} role="listitem">
            <h3>{challenge.name}</h3>
            <p>{challenge.description}</p>
            <p>Target: {challenge.target} tons</p>
            <p>Current Progress: {challenge.currentProgress} tons</p>
          </li>
        ))}
      </ul>
      {!data.carbonFootprint && !data.esgScore && !data.communityChallenges.length && (
        <div>No data found for this business.</div>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';

interface BusinessData {
  carbonFootprint: number;
  esgScore: number;
  communityChallenges: Array<{
    id: number;
    name: string;
    description: string;
    target: number;
    currentProgress: number;
  }>;
}

interface Props {
  apiKey: string;
  businessName: string;
  carbonFootprint?: number;
  esgScore?: number;
  communityChallenges?: Array<{
    id: number;
    name: string;
    description: string;
    target: number;
    currentProgress: number;
  }>;
}

const MyComponent: React.FC<Props> = ({
  apiKey,
  businessName,
  carbonFootprint = 0,
  esgScore = 0,
  communityChallenges = [],
}) => {
  const [data, setData] = useState<BusinessData>({ carbonFootprint, esgScore, communityChallenges });
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.climatecommit.com/business/${businessName}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const fetchedData = await response.json();
        setData(fetchedData);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [apiKey, businessName]);

  const handleDataError = () => (
    <div role="alert">
      <h1>Error fetching data</h1>
      <p>Please check your API key and business name.</p>
    </div>
  );

  if (error) {
    return handleDataError();
  }

  if (Object.keys(data).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 id="business-name">{businessName}</h1>
      <p>Carbon Footprint: {data.carbonFootprint} tons</p>
      <p>ESG Score: {data.esgScore}</p>
      <h2>Community Challenges</h2>
      <ul role="list">
        {data.communityChallenges.map((challenge) => (
          <li key={challenge.id} role="listitem">
            <h3>{challenge.name}</h3>
            <p>{challenge.description}</p>
            <p>Target: {challenge.target} tons</p>
            <p>Current Progress: {challenge.currentProgress} tons</p>
          </li>
        ))}
      </ul>
      {!data.carbonFootprint && !data.esgScore && !data.communityChallenges.length && (
        <div>No data found for this business.</div>
      )}
    </div>
  );
};

export default MyComponent;