import React, { useState } from 'react';
import { styled } from 'styled-components';

type SubscriptionManagementProps = {
  subscriptionMessage?: string;
  role?: string;
  ariaLabel?: string;
};

const SubscriptionMessageLabel = ({ ariaLabel }: { ariaLabel: string }) => (
  <label htmlFor="subscription-message" id="subscription-message-label">
    {ariaLabel}
  </label>
);

const SubscriptionMessage = styled.div<{ error?: boolean }>`
  /* Add your custom styles here */
  color: ${(props) => (props.error ? 'red' : 'black')};
`;

const SubscriptionContainer = styled.div<SubscriptionManagementProps>`
  /* Add your custom styles here */
`;

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({
  subscriptionMessage = 'No subscription message provided',
  role = 'alert',
  ariaLabel = 'Subscription management',
}) => {
  const [error, setError] = useState(false);

  if (!subscriptionMessage) {
    setError(true);
  }

  return (
    <SubscriptionContainer role={role} aria-labelledby="subscription-message-label">
      <SubscriptionMessageLabel ariaLabel={ariaLabel} />
      <SubscriptionMessage aria-labelledby="subscription-message-label" error={error}>
        {subscriptionMessage}
      </SubscriptionMessage>
    </SubscriptionContainer>
  );
};

SubscriptionManagement.defaultProps = {
  role: 'alert',
  ariaLabel: 'Subscription management',
};

export default SubscriptionManagement;

In this updated code, I've added error handling for invalid props and null values, added ARIA attributes for accessibility, added a default message for edge cases where no message is provided, and added a prop for the component's role and ARIA-labelledby for better accessibility. I've also used styled-components for CSS-in-JS styling, making it more maintainable. Additionally, I've added a SubscriptionMessageLabel component to separate the ARIA label from the actual message for better accessibility and maintainability.