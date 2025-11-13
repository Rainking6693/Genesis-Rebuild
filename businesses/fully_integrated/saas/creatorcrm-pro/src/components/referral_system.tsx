import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allows for custom content within the message
}

const ReferralSystemMessage: FC<Props> = ({ className, message, id, role, children, ...rest }) => {
  // Add a role attribute for better accessibility
  const defaultRole = 'alert';

  // Use a deterministic id for better accessibility and debugging
  const defaultId = 'referral-system-message';

  // If id is not provided, generate a unique id
  const finalId = id || `${defaultId}-${Math.random().toString(36).substring(7)}`;

  return (
    <div id={finalId} className={`referral-system-message ${className}`} role={role || defaultRole} {...rest}>
      {children || message}
    </div>
  );
};

// Add error handling and validation for message prop
ReferralSystemMessage.defaultProps = {
  message: 'Welcome to CreatorCRM Pro! Invite your friends and earn rewards.',
};

ReferralSystemMessage.propTypes = {
  message: React.PropTypes.string,
  children: React.PropTypes.node,
};

// Add unique component name for better debugging and accessibility
ReferralSystemMessage.displayName = 'ReferralSystemMessage';

export default ReferralSystemMessage;

In this updated version, I've added a `children` prop to allow for custom content within the message, and I've made the `id` and `role` props optional with default values. Additionally, I've added a check for the `message` prop to ensure it's a string.