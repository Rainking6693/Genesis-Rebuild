import React, { FC, ReactNode, Ref, ForwardRefExoticComponent, PropsWithChildren, useState } from 'react';
import PropTypes from 'prop-types';
import logger from '../../utils/logger';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message: string;
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
}

const CustomerSupportBot: ForwardRefExoticComponent<Props & { ref?: Ref<HTMLDivElement> }> = (
  { children, className, color, backgroundColor, fontSize, ...rest },
  ref
) => {
  const [isActive, setIsActive] = useState(true);

  // Add a role attribute for accessibility
  const role = 'bot';

  // Add a fallback for screen readers
  const fallback = (
    <>
      <span className={`sr-only`}>Customer Support Bot:</span>
      {children}
    </>
  );

  // Handle edge cases where the children prop may contain invalid elements
  const validChildren = React.Children.map(children, (child) =>
    React.isValidElement(child) ? child : fallback
  );

  // Log the bot's messages for debugging and auditing purposes
  React.useEffect(() => {
    if (isActive) {
      logger.info(`Customer Support Bot: ${message}`);
    }
  }, [message, isActive]);

  return (
    <div
      ref={ref}
      className={`customer-support-bot-message ${className} ${color ? `text-${color}` : ''} ${
        backgroundColor ? `bg-${backgroundColor}` : ''
      } ${fontSize ? `font-size-${fontSize}` : ''}`}
      role={role}
      {...rest}
    >
      {validChildren}
    </div>
  );
};

CustomerSupportBot.defaultProps = {
  message: 'Welcome to EcoTeam Hub! How can I assist you with your sustainability goals?',
  color: 'blue',
  backgroundColor: 'white',
  fontSize: '16px',
};

CustomerSupportBot.propTypes = {
  message: PropTypes.string.isRequired,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  fontSize: PropTypes.string,
};

CustomerSupportBot.logEvent = (message: string) => {
  logger.info(`Customer Support Bot: ${message}`);
};

export default CustomerSupportBot;

These changes should make the component more resilient, accessible, and maintainable, while also making it more interactive and customizable.