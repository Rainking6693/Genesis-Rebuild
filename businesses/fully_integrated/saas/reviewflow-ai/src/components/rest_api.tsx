import { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  apiKey: string;
  customerId: string;
}

interface ApiError {
  message: string;
}

interface ResponseData {
  reviewRequestSequence: string[];
  followUpCampaign: string[];
  error?: ApiError | null; // Add error property to handle API errors
}

const MyComponent: React.FC<Props> = ({ apiKey, customerId }) => {
  const [reviewRequestSequence, setReviewRequestSequence] = useState<string[]>([]);
  const [followUpCampaign, setFollowUpCampaign] = useState<string[]>([]);
  const [error, setError] = useState<ApiError | null>(null); // State to handle errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ResponseData>(`https://api.reviewflow.ai/v1/sequences?api_key=${apiKey}&customer_id=${customerId}`);

        if (response.data.error) {
          setError(response.data.error); // Set error if API returns an error
          return; // Exit the function if an error occurs
        }

        setReviewRequestSequence(response.data.reviewRequestSequence);
        setFollowUpCampaign(response.data.followUpCampaign);
      } catch (error) {
        console.error(error);
        setError({ message: `An error occurred while fetching data: ${error.message}` }); // Set error if an axios error occurs
      }
    };

    fetchData();
  }, [apiKey, customerId]);

  if (error) {
    return (
      <div role="alert">
        <p>Error:</p>
        <p>{error.message}</p>
      </div>
    ); // Render an error message with proper ARIA role for accessibility
  }

  return (
    <div>
      {reviewRequestSequence.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
      {followUpCampaign.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
};

export default MyComponent;

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  apiKey: string;
  customerId: string;
}

interface ApiError {
  message: string;
}

interface ResponseData {
  reviewRequestSequence: string[];
  followUpCampaign: string[];
  error?: ApiError | null; // Add error property to handle API errors
}

const MyComponent: React.FC<Props> = ({ apiKey, customerId }) => {
  const [reviewRequestSequence, setReviewRequestSequence] = useState<string[]>([]);
  const [followUpCampaign, setFollowUpCampaign] = useState<string[]>([]);
  const [error, setError] = useState<ApiError | null>(null); // State to handle errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ResponseData>(`https://api.reviewflow.ai/v1/sequences?api_key=${apiKey}&customer_id=${customerId}`);

        if (response.data.error) {
          setError(response.data.error); // Set error if API returns an error
          return; // Exit the function if an error occurs
        }

        setReviewRequestSequence(response.data.reviewRequestSequence);
        setFollowUpCampaign(response.data.followUpCampaign);
      } catch (error) {
        console.error(error);
        setError({ message: `An error occurred while fetching data: ${error.message}` }); // Set error if an axios error occurs
      }
    };

    fetchData();
  }, [apiKey, customerId]);

  if (error) {
    return (
      <div role="alert">
        <p>Error:</p>
        <p>{error.message}</p>
      </div>
    ); // Render an error message with proper ARIA role for accessibility
  }

  return (
    <div>
      {reviewRequestSequence.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
      {followUpCampaign.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
};

export default MyComponent;