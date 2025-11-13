import React, { FC, ReactNode } from 'react';

interface ReviewRocketProps {
  message?: string;
  review?: {
    rating: number;
    content: string;
    platform: string;
  };
}

const BaseComponent: FC<ReviewRocketProps> = ({ message, review }) => {
  if (!message && !review) {
    return null;
  }

  return (
    <div role="region" aria-label={message || `Review from ${review?.platform}`}>
      {message && <p>{message}</p>}
      {review && (
        <article>
          <p>Rating: {review.rating}</p>
          <p>Content: {review.content}</p>
          <p>Platform: {review.platform}</p>
          {/* Implement your AI-powered review response automation logic here */}
        </article>
      )}
    </div>
  );
};

export const MessageComponent: FC<Pick<ReviewRocketProps, 'message'>> = (props) => {
  return <BaseComponent {...props} />;
};

export const ReviewComponent: FC<Pick<ReviewRocketProps, 'review'>> = (props) => {
  return <BaseComponent {...props} />;
};

import React, { FC, ReactNode } from 'react';

interface ReviewRocketProps {
  message?: string;
  review?: {
    rating: number;
    content: string;
    platform: string;
  };
}

const BaseComponent: FC<ReviewRocketProps> = ({ message, review }) => {
  if (!message && !review) {
    return null;
  }

  return (
    <div role="region" aria-label={message || `Review from ${review?.platform}`}>
      {message && <p>{message}</p>}
      {review && (
        <article>
          <p>Rating: {review.rating}</p>
          <p>Content: {review.content}</p>
          <p>Platform: {review.platform}</p>
          {/* Implement your AI-powered review response automation logic here */}
        </article>
      )}
    </div>
  );
};

export const MessageComponent: FC<Pick<ReviewRocketProps, 'message'>> = (props) => {
  return <BaseComponent {...props} />;
};

export const ReviewComponent: FC<Pick<ReviewRocketProps, 'review'>> = (props) => {
  return <BaseComponent {...props} />;
};