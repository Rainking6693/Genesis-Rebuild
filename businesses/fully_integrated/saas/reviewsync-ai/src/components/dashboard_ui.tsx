import React, { FC, useRef, useState } from 'react';

interface Props {
  reviewCount: number;
  averageRating: number;
  positiveReviewCount: number;
  negativeReviewCount: number;
  recentReview: RecentReview;
  handleResponse: (reviewId: string, responseText: string) => void;
}

interface RecentReview {
  id: string;
  rating: number;
  reviewerName: string;
  reviewText: string;
  responseStatus: 'unresponded' | 'responded';
  responseText?: string;
}

const DashboardUI: FC<Props> = ({
  reviewCount,
  averageRating,
  positiveReviewCount,
  negativeReviewCount,
  recentReview,
  handleResponse,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [responseText, setResponseText] = useState<string>('');

  const handleReviewResponse = () => {
    if (recentReview.responseStatus === 'unresponded') {
      setResponseText(textareaRef.current?.value || '');
      handleResponse(recentReview.id, responseText);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponseText(event.target.value);
  };

  return (
    <div role="dashboard">
      <h1>ReviewSync AI Dashboard</h1>
      <div role="review-count">Total Reviews: {reviewCount}</div>
      <div role="average-rating">Average Rating: {averageRating}</div>
      <div role="positive-reviews">Positive Reviews: {positiveReviewCount}</div>
      <div role="negative-reviews">Negative Reviews: {negativeReviewCount}</div>
      <div role="recent-review">
        <h2>Recent Review</h2>
        <ul role="review-list">
          <li role="review-id">ID: {recentReview.id}</li>
          <li role="review-rating">Rating: {recentReview.rating}</li>
          <li role="reviewer-name">Reviewer: {recentReview.reviewerName}</li>
          <li role="review-text">Text: {recentReview.reviewText}</li>
          <li role="response-status">Response Status: {recentReview.responseStatus}</li>
          {recentReview.responseStatus === 'unresponded' && (
            <>
              <li role="your-response">Your Response:</li>
              <li role="response-textarea">
                <textarea ref={textareaRef} rows={4} placeholder="Enter your response" onChange={handleTextChange} />
              </li>
              <li role="response-button">
                <button onClick={handleReviewResponse}>Respond</button>
              </li>
            </>
          )}
          {recentReview.responseStatus === 'responded' && (
            <li role="response-text">Response Text: {recentReview.responseText}</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardUI;

In this updated version, I've made the following changes:

1. Added a `responseText` property to the `RecentReview` interface to store the response text if the review has already been responded to.
2. Used the `useRef` hook to store the textarea element reference, making it easier to access the input value when handling the response.
3. Added an edge case for when the review has already been responded to, displaying the response text instead of the response form.
4. Improved accessibility by adding proper semantic HTML structure and ARIA attributes.
5. Made the component more maintainable by separating the logic for handling the review response into a separate function and adding a state for the response text.
6. Added an `onChange` event handler to the textarea to update the response text state as the user types.