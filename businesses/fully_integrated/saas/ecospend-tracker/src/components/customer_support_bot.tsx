import React, { FC, DetailedHTMLProps, HTMLAttributes, Ref, forwardRef } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  className?: string;
}

const CustomerSupportBot: FC<Props & { ref?: Ref<HTMLDivElement> }> = forwardRef((props, ref) => {
  const { className, message, ...rest } = props;

  // Add a role attribute for accessibility
  const role = 'bot';

  // Check if className is provided and add the default class name
  const classes = className ? `${className} customer-support-bot` : 'customer-support-bot';

  // Ensure message is a non-empty string
  if (!message.trim()) {
    throw new Error('The "message" prop must be a non-empty string.');
  }

  return (
    <div {...rest} ref={ref} className={classes} role={role} aria-label="Customer Support Bot">
      {message}
    </div>
  );
});

// Add error handling and validation for props
CustomerSupportBot.defaultProps = {
  message: 'Welcome to EcoSpend Tracker! How can I assist you today?',
  className: '',
};

CustomerSupportBot.propTypes = {
  message: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
};

// Add data-testid for easier testing
CustomerSupportBot.displayName = 'CustomerSupportBot';
CustomerSupportBot.defaultProps = {
  'data-testid': 'customer-support-bot',
};

export default CustomerSupportBot;

import React, { FC, DetailedHTMLProps, HTMLAttributes, Ref, forwardRef } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  className?: string;
}

const CustomerSupportBot: FC<Props & { ref?: Ref<HTMLDivElement> }> = forwardRef((props, ref) => {
  const { className, message, ...rest } = props;

  // Add a role attribute for accessibility
  const role = 'bot';

  // Check if className is provided and add the default class name
  const classes = className ? `${className} customer-support-bot` : 'customer-support-bot';

  // Ensure message is a non-empty string
  if (!message.trim()) {
    throw new Error('The "message" prop must be a non-empty string.');
  }

  return (
    <div {...rest} ref={ref} className={classes} role={role} aria-label="Customer Support Bot">
      {message}
    </div>
  );
});

// Add error handling and validation for props
CustomerSupportBot.defaultProps = {
  message: 'Welcome to EcoSpend Tracker! How can I assist you today?',
  className: '',
};

CustomerSupportBot.propTypes = {
  message: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
};

// Add data-testid for easier testing
CustomerSupportBot.displayName = 'CustomerSupportBot';
CustomerSupportBot.defaultProps = {
  'data-testid': 'customer-support-bot',
};

export default CustomerSupportBot;