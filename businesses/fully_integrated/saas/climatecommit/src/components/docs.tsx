import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  title: string;
  description: string;
}

interface EsgScoreProps {
  esgScore: number | null;
  ariaLabel: string;
}

const EsgScore: React.FC<EsgScoreProps> = ({ esgScore, ariaLabel }) => {
  if (esgScore === null) return null;

  return (
    <div role="presentation">
      <h3>ESG Score:</h3>
      <span aria-label={ariaLabel}>{esgScore}</span>
    </div>
  );
};

const MyComponent: React.FC<Props> = ({ title, description }) => {
  const [esgScore, setESGScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      let response;
      try {
        response = await axios.get('https://api.climatecommit.com/esg-score');
      } catch (error) {
        console.error(error);
        // Handle error cases, e.g., network errors, invalid responses, etc.
        // You may want to show an error message to the user or log the error for further analysis.
        return;
      }

      if (!response || !response.data || !response.data.esg_score) {
        // Handle edge cases where the response is invalid or missing the required data.
        console.error('Invalid or missing ESG score data.');
        return;
      }

      setESGScore(response.data.esg_score);
    };

    fetchData();
  }, []);

  const esgScoreAriaLabel = `ESG Score: ${esgScore || '(loading...)'}`;

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <EsgScore esgScore={esgScore} ariaLabel={esgScoreAriaLabel} />
    </div>
  );
};

export default MyComponent;

In this updated code, I've added state management for the ESG score, improved error handling, and added ARIA attributes for accessibility. Additionally, I've extracted the ESG score display component for better maintainability. I've also added a check for invalid or missing ESG score data to handle edge cases.