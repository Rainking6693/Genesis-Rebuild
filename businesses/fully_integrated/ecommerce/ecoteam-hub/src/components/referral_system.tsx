import React, { FC, Key } from 'react';
import PropTypes from 'prop-types';

interface Props {
  message: string;
}

const ReferralSystemMessage: FC<Props> = ({ message }) => {
  // Add ARIA attributes for accessibility
  const ariaLabel = 'Referral system message';
  const ariaDescription = message;

  return (
    <div className="referral-system-message" aria-label={ariaLabel} aria-describedby={ariaDescription}>
      {message}
    </div>
  );
};

ReferralSystemMessage.defaultProps = {
  message: 'Welcome to the EcoTeam Hub Referral System! Invite your friends and earn rewards for promoting sustainability.',
};

ReferralSystemMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

// Add a unique key for each message instance for performance optimization
function isServer() {
  return typeof window === 'undefined';
}

const ReferralSystemMessageWithKey: FC<Props> = (props: Props) => {
  // Validate the message prop and handle edge cases
  const message = props.message.trim();
  if (!message) {
    throw new Error('Referral system message cannot be empty.');
  }

  // Generate a unique key for each message instance on the client side
  const key = isServer() ? props.message : `referral-system-message-${message}` as Key;

  return <ReferralSystemMessage {...props} key={key} />;
};

export default ReferralSystemMessageWithKey;

In this updated code, I've added a check to generate a unique key only on the client side. This ensures that the key is generated consistently across different environments, including servers. Additionally, I've used a ternary operator to handle the unique key generation based on the environment.