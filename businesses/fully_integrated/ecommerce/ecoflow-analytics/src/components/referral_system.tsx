import React, { FC, ReactNode, Key } from 'react';
import PropTypes from 'prop-types';
import { sanitizeUserInput } from '../../utils/security';

interface Props {
  message: string;
  children?: ReactNode; // Allows for custom content within the message
  isError?: boolean; // Flag to indicate if the message is an error
}

const ReferralSystemMessage: FC<Props> = ({ message, children, isError }) => {
  // Sanitize user input before rendering to prevent XSS attacks
  const sanitizedMessage = sanitizeUserInput(message);

  // Add a unique key for each rendered element for performance optimization
  const uniqueKey = `referral-message-${Math.random().toString(36).substring(7)}`;

  // Add ARIA attributes for accessibility
  const ariaRole = isError ? 'alert' : 'status';
  const ariaLabel = `Referral system message: ${sanitizedMessage}`;

  return (
    <div
      className={`referral-message ${isError ? 'error' : ''}`}
      data-testid="referral-message"
      key={uniqueKey}
      role={ariaRole}
      aria-label={ariaLabel}
    >
      {sanitizedMessage}
      {children}
    </div>
  );
};

ReferralSystemMessage.displayName = 'ReferralSystemMessage';
ReferralSystemMessage.propTypes = {
  message: PropTypes.string.isRequired,
  children: PropTypes.node,
  isError: PropTypes.bool,
};

export default ReferralSystemMessage;

In this updated code, I've added:

1. An `isError` prop to indicate if the message is an error, which can be used to style the message differently and provide better context for screen readers.
2. ARIA attributes for accessibility, including `aria-role` and `aria-label`, to help screen readers understand the content and purpose of the message.
3. Styling classes for error messages to make it clear that the message is an error.
4. Removed the unnecessary `MyComponent` component and used the `ReferralSystemMessage` component directly.