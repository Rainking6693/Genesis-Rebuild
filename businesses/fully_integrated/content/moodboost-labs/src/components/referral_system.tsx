import React, { FC, useId } from 'react';

interface Props {
  message: string;
}

const ReferralSystemMessage: FC<Props> = ({ message }) => {
  const id = useId() || 'fallback-id';

  return (
    <div className="referral-system-message-container hidden" data-testid="referral-system-message" role="status" aria-labelledby={id} aria-describedby={id} tabIndex={0} data-message-id={id}>
      <div id={id} className="referral-system-message">
        {message}
      </div>
    </div>
  );
};

// Import and use the ReferralSystemMessage component in your main component
import ReferralSystemMessage from './ReferralSystemMessage';

// Main component
const MyComponent: React.FC<Props> = ({ message }) => {
  return (
    <div>
      {/* Add a header for better structure and accessibility */}
      <h2>Referral System Message</h2>

      {/* Wrap the message in a container for better styling and accessibility */}
      <div className="referral-system-message-container">
        {/* Use the ReferralSystemMessage component */}
        <ReferralSystemMessage message={message} />
      </div>
    </div>
  );
};

export default MyComponent;

This updated code addresses the requested improvements by adding unique IDs, ARIA attributes, and a container for better accessibility and maintainability. It also includes error handling for the `useId` hook, a fallback ID, and additional attributes for testing and styling hidden messages.