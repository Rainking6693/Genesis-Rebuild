import React, { useEffect, useState } from 'react';

interface Props {
  name: string;
}

interface CarbonCredData {
  carbonFootprint: number;
  sustainabilityScore: number;
  esgComplianceStatus: string;
  greenRecommendations: string[];
  costSavings: string[];
  marketingCredibilityBadge: string;
}

interface CarbonCredApiError {
  message: string;
}

const MyComponent: React.FC<Props> = ({ name }) => {
  const [data, setData] = useState<CarbonCredData | null>(null);
  const [error, setError] = useState<CarbonCredApiError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/carbon-cred/${name}`);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const json = await response.json();

        if (json && Object.keys(json).length > 0) {
          setData(json);
          setIsLoading(false);
        }
      } catch (error) {
        setError(error as CarbonCredApiError);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [name]);

  const marketingCredibilityBadgeUrl = data?.marketingCredibilityBadge;

  const hasValidMarketingCredibilityBadge = marketingCredibilityBadgeUrl && /^(https?:\/\/)/.test(marketingCredibilityBadgeUrl);

  if (isLoading) {
    return <div className="loading" aria-label="Loading component data">Loading...</div>;
  }

  if (error) {
    return <div className="has-error" aria-label="An error occurred while fetching component data">Error: {error.message}</div>;
  }

  if (!data) {
    return <div className="no-data" aria-label="No data available for the given name">No data available for {name}</div>;
  }

  if (!hasValidMarketingCredibilityBadge) {
    console.warn(`Invalid marketingCredibilityBadge URL: ${marketingCredibilityBadgeUrl}`);
    return null;
  }

  return (
    <>
      <h1>Hello, {name}!</h1>
      <div>
        {/* Display carbon footprint, sustainability score, and ESG compliance status */}
        <p>Carbon Footprint: {data.carbonFootprint}</p>
        <p>Sustainability Score: {data.sustainabilityScore}</p>
        <p>ESG Compliance Status: {data.esgComplianceStatus}</p>
      </div>
      <div>
        {/* Provide green recommendations and cost savings */}
        <h3 aria-label="Green Recommendations">Green Recommendations:</h3>
        <ul>
          {data.greenRecommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
        <h3 aria-label="Cost Savings">Cost Savings:</h3>
        <ul>
          {data.costSavings.map((saving, index) => (
            <li key={index}>{saving}</li>
          ))}
        </ul>
      </div>
      <div>
        {/* Show marketing credibility badge */}
        <img src={data.marketingCredibilityBadge} alt="Marketing Credibility Badge" aria-label="Marketing Credibility Badge" />
      </div>
    </>
  );
};

export default MyComponent;

This updated version addresses the issues mentioned and provides a more robust and maintainable component.