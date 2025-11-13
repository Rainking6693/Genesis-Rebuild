import React, { ReactNode, PropsWithChildren } from 'react';
import PropTypes from 'prop-types';

interface ReviewMessageProps {
  /**
   * The message to be displayed
   */
  message: string;

  /**
   * Optional prop for the message's variant (info, success, warning, error)
   */
  variant?: 'info' | 'success' | 'warning' | 'error';

  /**
   * Optional prop for the message's size (small, medium, large)
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Optional prop for the message's id for testing purposes
   */
  testId?: string;
}

ReviewMessage.propTypes = {
  message: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  testId: PropTypes.string,
};

const ReviewMessage: React.FC<PropsWithChildren<ReviewMessageProps>> = ({
  message,
  variant = 'info',
  size = 'medium',
  testId,
  children,
}) => {
  if (!['info', 'success', 'warning', 'error'].includes(variant)) {
    throw new Error(`Invalid variant prop: ${variant}`);
  }

  const messageClasses = `review-message review-message--${variant} review-message--${size}`;

  return (
    <div data-testid={testId} className={messageClasses} role="alert">
      <div>
        {children && <React.Fragment>{children}</React.Fragment>}
        {message}
      </div>
      <aria-label={`Review message: ${message}`} />
    </div>
  );
};

export default ReviewMessage;

This updated code includes prop types for better type checking, a validation check for the `variant` prop, semantic HTML elements for accessibility, and a `data-testid` attribute for testing purposes. Additionally, it uses a `Fragment` instead of spreading children directly into the div, which improves maintainability.