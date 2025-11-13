import { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
  apiKey: string;
}

interface ResponseData {
  burnoutRisk?: number;
  wellnessInterventions?: string[];
  error?: string;
}

const MyComponent: React.FC<Props> = ({ apiKey }) => {
  const [data, setData] = useState<ResponseData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await axios.get('/api/analyze', {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });

        setData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiKey]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data.burnoutRisk && !data.wellnessInterventions) {
    return <div>No data available</div>;
  }

  return (
    <>
      {data.burnoutRisk && <div>Burnout Risk: {data.burnoutRisk}</div>}
      {data.wellnessInterventions && (
        <div>
          <div>Wellness Interventions:</div>
          <ul>
            {data.wellnessInterventions.map((intervention, index) => (
              <li key={index}>{intervention}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default MyComponent;