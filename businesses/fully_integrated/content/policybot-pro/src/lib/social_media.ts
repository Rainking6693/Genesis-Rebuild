import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string; // Adding optional prop for message
  children?: ReactNode; // Adding support for custom content
}

const PolicyBotProSocialMedia: FC<Props> = ({ className, message, children, ...rest }) => {
  // Add role="status" for accessibility
  // Add support for custom content (message or children)
  return (
    <div className={`policybot-pro-message ${className}`} role="status" {...rest}>
      {message || children}
    </div>
  );
};

PolicyBotProSocialMedia.displayName = 'PolicyBotProSocialMedia';

// Add type checking for message prop and default value
PolicyBotProSocialMedia.defaultProps = {
  message: 'Welcome to PolicyBot Pro! Simplifying your business policies with AI.',
};

// Use named export for better code organization and easier testing
export { PolicyBotProSocialMedia };

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string; // Adding optional prop for message
  children?: ReactNode; // Adding support for custom content
}

const PolicyBotProSocialMedia: FC<Props> = ({ className, message, children, ...rest }) => {
  // Add role="status" for accessibility
  // Add support for custom content (message or children)
  return (
    <div className={`policybot-pro-message ${className}`} role="status" {...rest}>
      {message || children}
    </div>
  );
};

PolicyBotProSocialMedia.displayName = 'PolicyBotProSocialMedia';

// Add type checking for message prop and default value
PolicyBotProSocialMedia.defaultProps = {
  message: 'Welcome to PolicyBot Pro! Simplifying your business policies with AI.',
};

// Use named export for better code organization and easier testing
export { PolicyBotProSocialMedia };