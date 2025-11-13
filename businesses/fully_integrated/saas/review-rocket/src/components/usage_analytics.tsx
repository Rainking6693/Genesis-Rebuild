import React, { FunctionComponent, useEffect } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import sentiment from 'sentiment';

interface Props {
  review: ReviewData | null;
}

interface ReviewData {
  platform: string;
  rating: number;
  content: string;
  isPositive?: boolean; // Added optional isPositive property
}

const UsageAnalyticsComponent: FunctionComponent<Props> = ({ review }) => {
  const { trackReviewResponse } = useAnalytics();

  const handleResponse = () => {
    if (review) {
      trackReviewResponse({
        platform: review.platform,
        rating: review.rating,
        content: review.content,
        isPositive: review?.isPositive || analyzeSentiment(review.content) > 0, // Use provided isPositive if available, otherwise use sentiment analysis
      });
    }
  };

  const analyzeSentiment = (text: string) => {
    try {
      const analysis = sentiment(text);
      return analysis.score > 0;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return false; // Return a default value if sentiment analysis fails
    }
  };

  useEffect(() => {
    if (review) {
      const { content } = review;
      const isPositive = analyzeSentiment(content) || review.isPositive; // Use provided isPositive if sentiment analysis fails

      let response: string;
      if (isPositive) {
        response = 'Thank you for your positive review! We appreciate your feedback.';
      } else {
        response = 'We're sorry to hear about your experience. Please let us know how we can improve.';
      }

      handleResponse();
    }
  }, [review]);

  return (
    <div>
      {review ? (
        <div>{response}</div>
      ) : (
        <div>No review data available</div>
      )}
      {!review && <div id="accessibility-message">No review data available. Screen reader users, please refer to the visible text.</div>}
    </div>
  );
};

export default UsageAnalyticsComponent;

import React, { FunctionComponent, useEffect } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import sentiment from 'sentiment';

interface Props {
  review: ReviewData | null;
}

interface ReviewData {
  platform: string;
  rating: number;
  content: string;
  isPositive?: boolean; // Added optional isPositive property
}

const UsageAnalyticsComponent: FunctionComponent<Props> = ({ review }) => {
  const { trackReviewResponse } = useAnalytics();

  const handleResponse = () => {
    if (review) {
      trackReviewResponse({
        platform: review.platform,
        rating: review.rating,
        content: review.content,
        isPositive: review?.isPositive || analyzeSentiment(review.content) > 0, // Use provided isPositive if available, otherwise use sentiment analysis
      });
    }
  };

  const analyzeSentiment = (text: string) => {
    try {
      const analysis = sentiment(text);
      return analysis.score > 0;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return false; // Return a default value if sentiment analysis fails
    }
  };

  useEffect(() => {
    if (review) {
      const { content } = review;
      const isPositive = analyzeSentiment(content) || review.isPositive; // Use provided isPositive if sentiment analysis fails

      let response: string;
      if (isPositive) {
        response = 'Thank you for your positive review! We appreciate your feedback.';
      } else {
        response = 'We're sorry to hear about your experience. Please let us know how we can improve.';
      }

      handleResponse();
    }
  }, [review]);

  return (
    <div>
      {review ? (
        <div>{response}</div>
      ) : (
        <div>No review data available</div>
      )}
      {!review && <div id="accessibility-message">No review data available. Screen reader users, please refer to the visible text.</div>}
    </div>
  );
};

export default UsageAnalyticsComponent;