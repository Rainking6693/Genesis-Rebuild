import React, { PropsWithChildren, useState } from 'react';

interface ReviewResponseProps {
  customerReview: string;
  maxReviewLength?: number;
  minReviewLength?: number;
  isTruncated?: boolean;
}

const ReviewResponse: React.FC<PropsWithChildren<ReviewResponseProps>> = ({
  customerReview,
  maxReviewLength = 500,
  minReviewLength = 10,
  isTruncated = false,
  children,
}) => {
  const [truncated, setTruncated] = useState(false);

  const handleReviewLength = () => {
    if (customerReview.length > maxReviewLength) {
      setTruncated(true);
      return customerReview.slice(0, maxReviewLength) + '...';
    }
    return customerReview;
  };

  const reviewLengthWarning = truncatedReview.length < minReviewLength ? (
    <>
      <span role="img" aria-label="warning-sign">⚠️</span>
      <p>Review is too short</p>
    </>
  ) : null;

  const truncatedReviewMessage = isTruncated ? (
    <p>Review is truncated</p>
  ) : null;

  return (
    <div>
      {handleReviewLength()}
      {reviewLengthWarning}
      {truncatedReviewMessage}
      {children}
    </div>
  );
};

export default ReviewResponse;

import React, { PropsWithChildren, useState } from 'react';

interface ReviewResponseProps {
  customerReview: string;
  maxReviewLength?: number;
  minReviewLength?: number;
  isTruncated?: boolean;
}

const ReviewResponse: React.FC<PropsWithChildren<ReviewResponseProps>> = ({
  customerReview,
  maxReviewLength = 500,
  minReviewLength = 10,
  isTruncated = false,
  children,
}) => {
  const [truncated, setTruncated] = useState(false);

  const handleReviewLength = () => {
    if (customerReview.length > maxReviewLength) {
      setTruncated(true);
      return customerReview.slice(0, maxReviewLength) + '...';
    }
    return customerReview;
  };

  const reviewLengthWarning = truncatedReview.length < minReviewLength ? (
    <>
      <span role="img" aria-label="warning-sign">⚠️</span>
      <p>Review is too short</p>
    </>
  ) : null;

  const truncatedReviewMessage = isTruncated ? (
    <p>Review is truncated</p>
  ) : null;

  return (
    <div>
      {handleReviewLength()}
      {reviewLengthWarning}
      {truncatedReviewMessage}
      {children}
    </div>
  );
};

export default ReviewResponse;