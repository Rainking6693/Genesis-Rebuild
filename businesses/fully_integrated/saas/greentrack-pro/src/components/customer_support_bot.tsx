import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { logEvent } from '../../utils/logger';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allow for additional content within the bot container
}

const CustomerSupportBot: FC<Props> = ({ className, message, children, ...rest }) => {
  // Add a role attribute for accessibility
  const divProps = {
    ...rest,
    className: `customer-support-bot ${className}`,
    role: 'region',
    'aria-label': 'Customer Support Bot',
  };

  // Log the message for debugging and auditing purposes
  logEvent(`Customer Support Bot Message: ${message}`);

  return (
    <div {...divProps}>
      {/* Allow for additional content within the bot container */}
      {children}
      <div>{message}</div>
    </div>
  );
};

CustomerSupportBot.defaultProps = {
  message: 'Welcome to GreenTrack Pro! How can I assist you today?',
  children: null, // Set default children to null
};

CustomerSupportBot.propTypes = {
  message: PropTypes.string.isRequired,
  children: PropTypes.node, // Allow for any React node as children
};

export default CustomerSupportBot;

In this updated version, I've added the following improvements:

1. Allowed for additional content within the bot container by adding a `children` prop.
2. Set a default value for the `children` prop to `null`.
3. Updated the `PropTypes` for the `children` prop to accept any React node.
4. Wrapped the message within a separate `div` element to maintain the structure and allow for additional content within the bot container.

Now, the component is more flexible and can handle edge cases where additional content might be needed within the bot container.