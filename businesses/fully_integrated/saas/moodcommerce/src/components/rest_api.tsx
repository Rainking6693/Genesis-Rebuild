import { useState, useEffect } from 'react';
import axios from 'axios';

type ApiResponseData = {
  emotionalState?: string;
  mentalWellnessGoals?: string[];
  error?: string;
};

type CustomerApi = {
  (apiKey: string, customerId: string): Promise<ApiResponseData>;
};

interface Props {
  apiKey: string;
  customerId: string;
}

const MyComponent: React.FC<Props> = ({ apiKey, customerId }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const customerApi: CustomerApi = (apiKey, customerId) =>
    axios.get<ApiResponseData>(
      `https://api.moodcommerce.com/v1/customer/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customerApi(apiKey, customerId);

        if (response.data.error) {
          setMessage(response.data.error);
        } else if (response.data.emotionalState) {
          setMessage(
            `Welcome, we're here to help you shop based on your current emotional state: ${response.data.emotionalState} and your mental wellness goals: ${
              response.data.mentalWellnessGoals?.join(', ') || 'None specified'
            }`
          );
        } else {
          setMessage('We couldn't find any emotional state or mental wellness goals for this customer.');
        }
      } catch (error) {
        console.error(error);
        setMessage('An error occurred while fetching your data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiKey, customerId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{message}</div>;
};

export default MyComponent;

In this updated version, I've:

1. Created an `ApiResponseData` type that includes an `error` property to handle potential errors from the API.
2. Created a `CustomerApi` function to encapsulate the API call, making the code more maintainable.
3. Checked for the presence of `emotionalState` and `mentalWellnessGoals` properties in the response data before using them. If `mentalWellnessGoals` is not present, it will display "None specified" instead of an empty string.
4. Added a more descriptive error message when the API call fails.
5. Made the code more maintainable by using TypeScript interfaces and functions.