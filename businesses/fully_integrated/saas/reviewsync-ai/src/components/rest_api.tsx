// Import necessary modules
import React, { useEffect, useState } from 'react';
import ReviewMessageDisplay from './ReviewMessageDisplay';

// Add interfaces for props and review data
interface ReviewMessageDisplayProps {
  reviewMessage: string;
}

interface ReviewData {
  id?: number;
  message: string;
}

// Improve ReviewMessageDisplay component
const ReviewMessageDisplay: React.FC<ReviewMessageDisplayProps> = ({ reviewMessage }) => {
  if (!reviewMessage) {
    return <div>No review message available</div>;
  }

  return (
    <div>
      <p aria-label="Review message">{reviewMessage}</p>
    </div>
  );
};

// Add error handling for fetching reviews
const Reviews: React.FC<ReviewsProps> = ({ reviewMessage }) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('https://api.example.com/reviews');
        const data = await response.json();
        setReviews(data.reviews.map((review: ReviewData) => ({ ...review, id: review.id || Date.now() }))); // Add unique id for each review
      } catch (error) {
        setError(error);
      }
    };

    if (reviewMessage) {
      setReviews([{ id: Date.now(), message: reviewMessage }]); // Set the initial review message as the first review
    }

    fetchReviews();
  }, []);

  return (
    <div>
      {reviews.map((review) => (
        <ReviewMessageDisplay key={review.id} reviewMessage={review.message} />
      ))}
      {error && <div>An error occurred while fetching reviews: {error.message}</div>}
    </div>
  );
};

export default Reviews;

// Import necessary modules
import React, { useEffect, useState } from 'react';
import ReviewMessageDisplay from './ReviewMessageDisplay';

// Add interfaces for props and review data
interface ReviewMessageDisplayProps {
  reviewMessage: string;
}

interface ReviewData {
  id?: number;
  message: string;
}

// Improve ReviewMessageDisplay component
const ReviewMessageDisplay: React.FC<ReviewMessageDisplayProps> = ({ reviewMessage }) => {
  if (!reviewMessage) {
    return <div>No review message available</div>;
  }

  return (
    <div>
      <p aria-label="Review message">{reviewMessage}</p>
    </div>
  );
};

// Add error handling for fetching reviews
const Reviews: React.FC<ReviewsProps> = ({ reviewMessage }) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('https://api.example.com/reviews');
        const data = await response.json();
        setReviews(data.reviews.map((review: ReviewData) => ({ ...review, id: review.id || Date.now() }))); // Add unique id for each review
      } catch (error) {
        setError(error);
      }
    };

    if (reviewMessage) {
      setReviews([{ id: Date.now(), message: reviewMessage }]); // Set the initial review message as the first review
    }

    fetchReviews();
  }, []);

  return (
    <div>
      {reviews.map((review) => (
        <ReviewMessageDisplay key={review.id} reviewMessage={review.message} />
      ))}
      {error && <div>An error occurred while fetching reviews: {error.message}</div>}
    </div>
  );
};

export default Reviews;