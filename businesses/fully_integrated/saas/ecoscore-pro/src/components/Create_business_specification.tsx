import React, { useEffect, useState } from 'react';

interface Props {
  apiKey: string;
  businessId: string;
}

interface EcoScoreData {
  operationsScore?: number;
  supplyChainScore?: number;
  customerEngagementScore?: number;
  error?: string;
}

const MyComponent: React.FC<Props> = ({ apiKey, businessId }) => {
  const [ecoScoreData, setEcoScoreData] = useState<EcoScoreData>({ error: '' });

  useEffect(() => {
    const fetchEcoScore = async () => {
      let response;
      try {
        response = await fetch(`https://api.ecoscorepro.com/v1/businesses/${businessId}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setEcoScoreData({ ...data });
      } catch (error) {
        setEcoScoreData({ ...ecoScoreData, error: error.message });
      }
    };

    fetchEcoScore();
  }, [apiKey, businessId]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <div onKeyPress={handleKeyPress} role="region" aria-labelledby="business-id-label">
      <h1 id="business-id-label">EcoScore for Business ID: {businessId}</h1>
      {ecoScoreData.error && <p>Error: {ecoScoreData.error}</p>}
      {!ecoScoreData.error && (
        <>
          <p>Operations Score: {ecoScoreData.operationsScore || 'N/A'}</p>
          <p>Supply Chain Score: {ecoScoreData.supplyChainScore || 'N/A'}</p>
          <p>Customer Engagement Score: {ecoScoreData.customerEngagementScore || 'N/A'}</p>
        </>
      )}
    </div>
  );
};

export default MyComponent;

Changes made:

1. Storing the error message in the state from the beginning to handle the case when the component is initially rendered.
2. Adding a `handleKeyPress` function to prevent the tab key from navigating away from the component, improving accessibility.
3. Adding the `role` and `aria-labelledby` attributes to the div for better accessibility.
4. Including the `statusText` in the error message to provide more context about the API request failure.
5. Using template literals for better readability and maintainability.