import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';

// Define the interface for the component's props
interface ReviewResponseMessageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  reviewResponse: string;
  isError?: boolean;
}

// Create a function component with the defined props
const ReviewResponseMessage: React.FC<ReviewResponseMessageProps> = ({ className, role, children, reviewResponse, isError = false }) => {
  // Add a data-testid attribute for testing purposes
  const dataTestId = 'review-response-message';

  // Render the review response in a div with appropriate styling, accessibility, and testability
  const messageClass = `review-response-message ${isError ? 'error' : ''}`;

  return (
    <div
      className={`${messageClass} ${className}`}
      data-testid={dataTestId}
      role={role}
    >
      <p>{reviewResponse}</p>
    </div>
  );
};

// Export the component
export default ReviewResponseMessage;

import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';

// Define the interface for the component's props
interface ReviewResponseMessageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  reviewResponse: string;
  isError?: boolean;
}

// Create a function component with the defined props
const ReviewResponseMessage: React.FC<ReviewResponseMessageProps> = ({ className, role, children, reviewResponse, isError = false }) => {
  // Add a data-testid attribute for testing purposes
  const dataTestId = 'review-response-message';

  // Render the review response in a div with appropriate styling, accessibility, and testability
  const messageClass = `review-response-message ${isError ? 'error' : ''}`;

  return (
    <div
      className={`${messageClass} ${className}`}
      data-testid={dataTestId}
      role={role}
    >
      <p>{reviewResponse}</p>
    </div>
  );
};

// Export the component
export default ReviewResponseMessage;