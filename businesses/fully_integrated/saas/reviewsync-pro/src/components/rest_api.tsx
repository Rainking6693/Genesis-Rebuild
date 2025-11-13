import React, { useState, useEffect, useRef } from 'react';

interface Review {
  rating: number;
  content: string;
  platform: string;
}

interface MyComponentProps {
  reviewId: string;
  review?: Review | null;
  onReviewLoad: (reviewId: string) => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ reviewId, review, onReviewLoad }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!reviewId) return;
    setLoading(true);
    setError(null);

    onReviewLoad(reviewId)
      .then((fetchedReview) => {
        setReview(fetchedReview);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [reviewId, onReviewLoad]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      reviewRef.current?.focus();
    }
  };

  const review = review || {};

  return (
    <div
      ref={reviewRef}
      role="region"
      aria-labelledby="review-title"
      aria-describedby={`review-rating-${review.rating} review-content ${error ? 'error' : ''}`}
    >
      {loading && <p>Loading review...</p>}
      {error && <p role="alert">Error: {error.message}</p>}
      {!loading && (
        <>
          <h2 id="review-title">Review for {reviewId}</h2>
          <p id="review-rating">Rating: {review.rating}</p>
          <p id="review-content">{review.content}</p>
          <p id="review-platform">Platform: {review.platform}</p>
        </>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useRef } from 'react';

interface Review {
  rating: number;
  content: string;
  platform: string;
}

interface MyComponentProps {
  reviewId: string;
  review?: Review | null;
  onReviewLoad: (reviewId: string) => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ reviewId, review, onReviewLoad }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!reviewId) return;
    setLoading(true);
    setError(null);

    onReviewLoad(reviewId)
      .then((fetchedReview) => {
        setReview(fetchedReview);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [reviewId, onReviewLoad]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      reviewRef.current?.focus();
    }
  };

  const review = review || {};

  return (
    <div
      ref={reviewRef}
      role="region"
      aria-labelledby="review-title"
      aria-describedby={`review-rating-${review.rating} review-content ${error ? 'error' : ''}`}
    >
      {loading && <p>Loading review...</p>}
      {error && <p role="alert">Error: {error.message}</p>}
      {!loading && (
        <>
          <h2 id="review-title">Review for {reviewId}</h2>
          <p id="review-rating">Rating: {review.rating}</p>
          <p id="review-content">{review.content}</p>
          <p id="review-platform">Platform: {review.platform}</p>
        </>
      )}
    </div>
  );
};

export default MyComponent;