import React, { useEffect, useState } from 'react';

interface Props {
  name: string;
  apiKey: string;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  timestamp: Date;
}

const MyComponent: React.FC<Props> = ({ name, apiKey }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!apiKey) return;

    const fetchReviewContent = async () => {
      try {
        const response = await fetch(`https://reviewflow-api.com/api/v1/content?api_key=${apiKey}&business_name=${name}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching review content: ${response.statusText}`);
        }

        const data = await response.json();
        setReviews(data);
        setIsLoading(false);
        // Use the generated review response templates and sentiment-driven marketing content
        // Transform negative reviews into retention opportunities and positive reviews into viral social media content
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchReviewContent();
  }, [apiKey, name]);

  if (error) {
    return (
      <div>
        <h2>An error occurred:</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div>
        <h2>No reviews found for {name}</h2>
        <p>Please consider leaving a review to help others make informed decisions.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <div>
        {reviews.map((review) => (
          <div key={review.id}>
            <h3>Review #{review.id}</h3>
            <p>Rating: {review.rating}</p>
            <p>Comment: {review.comment}</p>
            <p>Timestamp: {review.timestamp.toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';

interface Props {
  name: string;
  apiKey: string;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  timestamp: Date;
}

const MyComponent: React.FC<Props> = ({ name, apiKey }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!apiKey) return;

    const fetchReviewContent = async () => {
      try {
        const response = await fetch(`https://reviewflow-api.com/api/v1/content?api_key=${apiKey}&business_name=${name}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching review content: ${response.statusText}`);
        }

        const data = await response.json();
        setReviews(data);
        setIsLoading(false);
        // Use the generated review response templates and sentiment-driven marketing content
        // Transform negative reviews into retention opportunities and positive reviews into viral social media content
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchReviewContent();
  }, [apiKey, name]);

  if (error) {
    return (
      <div>
        <h2>An error occurred:</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div>
        <h2>No reviews found for {name}</h2>
        <p>Please consider leaving a review to help others make informed decisions.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <div>
        {reviews.map((review) => (
          <div key={review.id}>
            <h3>Review #{review.id}</h3>
            <p>Rating: {review.rating}</p>
            <p>Comment: {review.comment}</p>
            <p>Timestamp: {review.timestamp.toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyComponent;