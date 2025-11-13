import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { MoodSyncAPI } from '../services/MoodSyncAPI';

interface Props {
  teamId?: string;
}

const MyComponent: React.FC<Props> = ({ teamId }) => {
  const [cookies, , token] = useCookies(['moodsync_token']);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Missing moodsync_token cookie.');
        return;
      }

      try {
        const response = await MoodSyncAPI.getTeamMood(teamId!, token);

        if (!response.ok) {
          setError(`Error fetching team mood: ${response.statusText}`);
          return;
        }

        setMessage(response.data.message);
      } catch (error) {
        setError(`Error fetching team mood: ${error.message}`);
      }
    };

    if (token) {
      fetchData();
    }
  }, [teamId, token]);

  return (
    <div>
      {error && <p style={{ color: 'red', userSelect: 'none' }}>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default MyComponent;

Changes made:

1. Added nullable types to `message` and `error` states to handle cases where no message or error is present.
2. Added `userSelect: 'none'` to the error message style to prevent users from selecting the error message, improving accessibility.
3. Wrapped the message and error in a `div` for better structure and maintainability.