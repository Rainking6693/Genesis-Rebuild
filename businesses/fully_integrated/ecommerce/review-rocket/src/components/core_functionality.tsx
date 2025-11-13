import React from 'react';

interface ReviewRequestProps {
  productName: string;
  customerName: string;
  orderId: string;
  reviewLink: string;
  incentiveMessage?: string; // Optional incentive message
}

/**
 * ReviewRequest Component: Displays a personalized review request message.
 *
 * This component generates a review request message tailored to a specific customer and product.
 * It includes a link to submit a review and an optional incentive message to encourage participation.
 */
const ReviewRequest: React.FC<ReviewRequestProps> = ({
  productName = '',
  customerName = '',
  orderId = '',
  reviewLink = '',
  incentiveMessage = '',
}) => {
  // Input validation
  if (!productName || !customerName || !orderId || !reviewLink) {
    return (
      <div className="review-request">
        <p>
          <strong>Error:</strong> Missing required props for ReviewRequest component.
        </p>
      </div>
    );
  }

  // Sanitize input to prevent XSS attacks
  const sanitizedProductName = productName.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sanitizedCustomerName = customerName.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sanitizedOrderId = orderId.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return (
    <div className="review-request" aria-live="polite">
      <h2>Help us improve! Review your recent purchase.</h2>
      <p>
        Dear {sanitizedCustomerName},
      </p>
      <p>
        Thank you for your recent order (Order ID: {sanitizedOrderId}) of {sanitizedProductName}. We hope you're enjoying it!
      </p>
      <p>
        We'd love to hear about your experience. Your feedback helps us and other customers.
      </p>
      <p>
        <a
          href={reviewLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Click here to leave a review for ${sanitizedProductName}`}
        >
          Click here to leave a review!
        </a>
      </p>
      {incentiveMessage && (
        <div className="incentive-message">
          <p>{incentiveMessage}</p>
        </div>
      )}
      <p>
        Thanks again,
        <br />
        The Review Rocket Team
      </p>
    </div>
  );
};

export default ReviewRequest;

import React from 'react';

interface ReviewRequestProps {
  productName: string;
  customerName: string;
  orderId: string;
  reviewLink: string;
  incentiveMessage?: string; // Optional incentive message
}

/**
 * ReviewRequest Component: Displays a personalized review request message.
 *
 * This component generates a review request message tailored to a specific customer and product.
 * It includes a link to submit a review and an optional incentive message to encourage participation.
 */
const ReviewRequest: React.FC<ReviewRequestProps> = ({
  productName = '',
  customerName = '',
  orderId = '',
  reviewLink = '',
  incentiveMessage = '',
}) => {
  // Input validation
  if (!productName || !customerName || !orderId || !reviewLink) {
    return (
      <div className="review-request">
        <p>
          <strong>Error:</strong> Missing required props for ReviewRequest component.
        </p>
      </div>
    );
  }

  // Sanitize input to prevent XSS attacks
  const sanitizedProductName = productName.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sanitizedCustomerName = customerName.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sanitizedOrderId = orderId.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return (
    <div className="review-request" aria-live="polite">
      <h2>Help us improve! Review your recent purchase.</h2>
      <p>
        Dear {sanitizedCustomerName},
      </p>
      <p>
        Thank you for your recent order (Order ID: {sanitizedOrderId}) of {sanitizedProductName}. We hope you're enjoying it!
      </p>
      <p>
        We'd love to hear about your experience. Your feedback helps us and other customers.
      </p>
      <p>
        <a
          href={reviewLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Click here to leave a review for ${sanitizedProductName}`}
        >
          Click here to leave a review!
        </a>
      </p>
      {incentiveMessage && (
        <div className="incentive-message">
          <p>{incentiveMessage}</p>
        </div>
      )}
      <p>
        Thanks again,
        <br />
        The Review Rocket Team
      </p>
    </div>
  );
};

export default ReviewRequest;