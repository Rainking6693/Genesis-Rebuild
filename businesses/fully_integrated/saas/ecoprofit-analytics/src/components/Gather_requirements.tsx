import React, { useEffect, useState } from 'react';

interface Props {
  name: string;
}

const API_URL = 'https://api.example.com/data'; // Replace with your API URL
const TIMEOUT = 5000; // API call timeout in milliseconds

const fetchData = async (setData: React.Dispatch<React.SetStateAction<any>>) => {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (data.length === 0) {
      throw new Error('Empty response from API');
    }
    return data;
  } catch (error) {
    console.error('API error:', error);
    return [];
  }
};

const FunctionalComponent: React.FC<Props> = ({ name }) => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAndSetData = async () => {
      const fetchedData = await fetchData((data) => setData(data));
      if (isMounted) {
        setLoading(false);
      }
    };

    fetchAndSetData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {error && <div>An error occurred: {error.message}</div>}
      {loading ? <div>Loading...</div> : null}
      <h1>Hello, {name}!</h1>
      <ESGReporting data={data} />
    </>
  );
};

const ESGReporting: React.FC<{ data: any }> = ({ data }) => {
  return <div key={data.id}>ESG Reporting: {data.report}</div>;
};

export default FunctionalComponent;

In this updated code, I added a `timeout` for API calls, implemented a more descriptive error message, separated the API call logic into a separate function, and added a check for empty responses from the API. I also added a `key` prop to the `ESGReporting` component for better React performance.