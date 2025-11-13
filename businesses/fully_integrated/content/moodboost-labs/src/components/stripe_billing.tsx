import React, { FC, ReactNode } from 'react';

type Props = {
  as?: 'error' | 'success' | 'info'; // Add error, success, and info variants for better resiliency and maintainability
  message: string;
  title?: string; // Allow for a title to provide more context
  description?: string; // Allow for a description to provide additional information
  className?: string; // Add optional className for custom styling
  children?: ReactNode; // Allow for additional content within the message
};

// Add a unique component name for better identification and accessibility
const MoodBoostBillingMessage: FC<Props> = ({ as, message, title, description, className, children }) => {
  // Add role="alert" for accessibility
  const variant = as || 'info';
  const classes = `moodboost-billing-message moodboost-billing-message--${variant} ${className || ''}`;

  return (
    <div className={classes} role="alert">
      {title && <h3 className="moodboost-billing-message__title">{title}</h3>}
      {message && <p className="moodboost-billing-message__message">{message}</p>}
      {description && <p className="moodboost-billing-message__description">{description}</p>}
      {children}
    </div>
  );
};

// Export default the component with a meaningful name
export default MoodBoostBillingMessage;

// Add error, success, and info variants for better resiliency and maintainability
import React from 'react';

const ErrorMessage = (props: Props) => {
  return <MoodBoostBillingMessage as="error" {...props} />;
};

const SuccessMessage = (props: Props) => {
  return <MoodBoostBillingMessage as="success" {...props} />;
};

const InfoMessage = (props: Props) => {
  return <MoodBoostBillingMessage as="info" {...props} />;
};

export { ErrorMessage, SuccessMessage, InfoMessage };

In this version, I've added an `as` prop to specify the variant (error, success, or info), and I've added optional `title`, `description`, and `children` props to provide more context and flexibility. I've also added separate `ErrorMessage`, `SuccessMessage`, and `InfoMessage` components for better maintainability.