import React, { FC, ReactNode, Key } from 'react';

interface Props {
  id?: string; // Add an optional id for better identification and debugging
  message: string;
  className?: string; // Allow custom classes for styling
  children?: ReactNode; // Allow additional elements within the message
}

// Add a unique component name for better identification and debugging
const MoodSyncTeamBillingMessage: FC<Props> = ({ id, message, className, children, ...rest }) => {
  // Add a role attribute for accessibility
  const role = 'alert';

  // Add a data-testid attribute for testing purposes
  const dataTestId = id ? `moodsync-team-billing-message-${id}` : 'moodsync-team-billing-message';

  // Handle edge case when children are not provided and message is empty
  if (!children && !message) {
    return null;
  }

  // Add key prop for accessibility and performance
  const keyProp = id ? id : `${dataTestId}-${Math.random().toString(36).substring(7)}`;

  return (
    <div className={`moodsync-team-billing-message ${className}`} data-testid={dataTestId} role={role} {...rest} key={keyProp}>
      {children || message}
    </div>
  );
};

// Export the component with a descriptive name that aligns with the business context
export { MoodSyncTeamBillingMessage };

import React, { FC, ReactNode, Key } from 'react';

interface Props {
  id?: string; // Add an optional id for better identification and debugging
  message: string;
  className?: string; // Allow custom classes for styling
  children?: ReactNode; // Allow additional elements within the message
}

// Add a unique component name for better identification and debugging
const MoodSyncTeamBillingMessage: FC<Props> = ({ id, message, className, children, ...rest }) => {
  // Add a role attribute for accessibility
  const role = 'alert';

  // Add a data-testid attribute for testing purposes
  const dataTestId = id ? `moodsync-team-billing-message-${id}` : 'moodsync-team-billing-message';

  // Handle edge case when children are not provided and message is empty
  if (!children && !message) {
    return null;
  }

  // Add key prop for accessibility and performance
  const keyProp = id ? id : `${dataTestId}-${Math.random().toString(36).substring(7)}`;

  return (
    <div className={`moodsync-team-billing-message ${className}`} data-testid={dataTestId} role={role} {...rest} key={keyProp}>
      {children || message}
    </div>
  );
};

// Export the component with a descriptive name that aligns with the business context
export { MoodSyncTeamBillingMessage };