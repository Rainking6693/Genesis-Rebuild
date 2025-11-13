import React, { FC, Key } from 'react';
import PropTypes from 'prop-types';

type Props = {
  message: string;
  className?: string;
  ariaLabel?: string;
  dataTestId?: string; // Added data-testid for testing purposes
};

const ReferralSystemMessage: FC<Props> = ({ message, className, ariaLabel, dataTestId }) => {
  return (
    <div data-testid={dataTestId} className={`referral-system-message ${className}`} aria-label={ariaLabel}>
      {message}
    </div>
  );
};

ReferralSystemMessage.defaultProps = {
  message: 'Welcome to the EcoCreator Hub Referral System!',
  className: '',
  ariaLabel: 'Referral system message',
  dataTestId: 'referral-system-message', // Added default data-testid
};

ReferralSystemMessage.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  dataTestId: PropTypes.string, // Added propTypes for data-testid
};

// Add a unique key for each message instance for React performance optimization
ReferralSystemMessage.defaultProps = {
  ...ReferralSystemMessage.defaultProps,
  key: new Date().getTime(),
};

// Use the Key type for the key prop to ensure type safety
ReferralSystemMessage.defaultProps = {
  ...ReferralSystemMessage.defaultProps,
  key as Key,
};

export default ReferralSystemMessage;

In this updated version, I've added the following improvements:

1. Added `dataTestId` prop for testing purposes.
2. Updated the defaultProps to include the new props.
3. Added TypeScript type annotations for the new props.
4. Used the `Key` type for the key prop to ensure type safety.

These changes make the component more flexible, accessible, maintainable, and testable.