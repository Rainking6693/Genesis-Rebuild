import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { StressLevel, WellnessContent } from '../';

interface Props {
  teamId: string;
}

const MyComponent: React.FC<Props> = ({ teamId }) => {
  const [, , token] = useCookies(['teamToken']);
  const [stressLevel, setStressLevel] = useState<StressLevel>(StressLevel.Normal);
  const [wellnessContent, setWellnessContent] = useState<WellnessContent | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const determineOptimalMoment = () => {
    // Implement your logic for determining the optimal moment here
    // Return a boolean indicating whether it's time for a wellness break or not
  };

  const fetchData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const stressResponse = await fetch(`/api/team/${teamId}/stress-level`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!stressResponse.ok) throw new Error('Failed to fetch stress level');

      const stressData = await stressResponse.json();
      setStressLevel(stressData.stressLevel);

      const wellnessResponse = await fetch(`/api/team/${teamId}/wellness-content`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!wellnessResponse.ok) throw new Error('Failed to fetch wellness content');

      const wellnessData = await wellnessResponse.json();
      setWellnessContent(wellnessData);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    if (token) {
      fetchData();
    }

    return () => {
      mounted = false;
    };
  }, [teamId, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (stressLevel !== StressLevel.Normal) {
    return (
      <div>
        {error ? (
          <div role="alert">An error occurred: {error.message}</div>
        ) : null}
        You are experiencing high stress. {wellnessContent?.content}
      </div>
    );
  }

  const optimalMoment = determineOptimalMoment();

  if (optimalMoment) {
    return (
      <div>
        {error ? (
          <div role="alert">An error occurred: {error.message}</div>
        ) : null}
        It's time for a wellness break. {wellnessContent?.content}
      </div>
    );
  }

  return (
    <div>
      {error ? (
        <div role="alert">An error occurred: {error.message}</div>
      ) : null}
      Continue working. Remember to take breaks when needed.
    </div>
  );
};

export default MyComponent;