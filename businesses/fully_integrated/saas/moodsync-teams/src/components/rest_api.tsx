import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface Props {
  apiBaseUrl: string;
  teamId: string;
}

interface ResponseData {
  burnoutRisk?: number;
  wellbeingScores?: {
    stress?: number;
    engagement?: number;
    motivation?: number;
  };
  productivityInsights?: {
    communicationEffectiveness?: number;
    taskCompletionRate?: number;
  };
  error?: string;
}

const MyComponent: React.FC<Props> = ({ apiBaseUrl, teamId }) => {
  const [data, setData] = useState<ResponseData>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ResponseData>(`${apiBaseUrl}/teams/${teamId}/analysis`);
        setData(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setData({ error: error.message });
        } else {
          console.error(error);
          setData({ error: 'An unexpected error occurred.' });
        }
      }
    };

    fetchData();
  }, [apiBaseUrl, teamId]);

  if ('error' in data) {
    return <div>An error occurred: {data.error}</div>;
  }

  if (!data.burnoutRisk && !Object.values(data.wellbeingScores || {}).some(Boolean) && !Object.values(data.productivityInsights || {}).some(Boolean)) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h2>Burnout Risk:</h2>
      {data.burnoutRisk && <p>{data.burnoutRisk.toFixed(2)}%</p>}

      <h2>Wellbeing Scores:</h2>
      {Object.entries(data.wellbeingScores || {}).map(([key, value]) => (
        <li key={key}>
          {key}: {value?.toFixed(2)}
        </li>
      ))}

      <h2>Productivity Insights:</h2>
      {Object.entries(data.productivityInsights || {}).map(([key, value]) => (
        <li key={key}>
          {key}: {value?.toFixed(2)}%
        </li>
      ))}
    </div>
  );
};

export default MyComponent;

1. Added optional properties to the `ResponseData` interface to handle potential edge cases where some data might not be available.
2. Checked if the error is an `AxiosError` before setting the error message in the state.
3. Used `Object.entries()` to iterate through the wellbeing scores and productivity insights objects more efficiently.
4. Added accessibility by providing keys to the list items.
5. Improved maintainability by using TypeScript interfaces and type checking throughout the code.
6. Checked if all wellbeing scores, burnout risk, and productivity insights are available before rendering the component to avoid potential errors.