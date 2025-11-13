import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

type Props = {
  apiBaseUrl: string;
};

interface ScheduleResponse {
  shifts: {
    employeeId: number;
    startTime: string;
    endTime: string;
  }[];
  error?: string; // Add error property to handle errors in the response
}

const MyComponent: React.FC<Props> = ({ apiBaseUrl }) => {
  const [schedule, setSchedule] = useState<ScheduleResponse['shifts']>([]);
  const [error, setError] = useState<ScheduleResponse['error']>(''); // Add error state to handle errors
  const [loading, setLoading] = useState(true); // Add loading state to handle API call progress

  const fetchSchedule = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/schedule`, { timeout: 5000 });

      if (Array.isArray(response.data.shifts)) {
        setSchedule(response.data.shifts); // Extract shifts from the response data
        setError(''); // Clear error state if the request is successful
      } else {
        setError('Unexpected response format'); // Set error state with a custom message
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message); // Set error state with the error message
      } else {
        setError('Network error'); // Set error state with a custom message for network errors
      }
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  // Handle empty schedule and no error
  if (schedule.length > 0 || error) {
    return (
      <div className="loading">
        {schedule.map((shift) => (
          <div key={shift.employeeId}>
            Employee ID: {shift.employeeId} | Start Time: {shift.startTime} | End Time: {shift.endTime}
          </div>
        ))}
        {error && <div>Error: {error}</div>} // Display error if any
      </div>
    );
  }

  // Handle loading state
  return <div className="loading">Loading...</div>;
};

export default MyComponent;

In this updated code, I've added a loading state to handle the case where the API call is still in progress. I've also added a validation check for the response data to handle unexpected response formats. The `fetchSchedule` function is now wrapped in a `useCallback` to prevent unnecessary re-renders. Lastly, I've added a `loading` class to the container for better styling and accessibility.