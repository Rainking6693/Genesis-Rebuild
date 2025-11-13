import React, { FC, useMemo } from 'react';
import PropTypes from 'prop-types';
import { sanitizeHtml } from 'sanitize-html';
import { sanitize } from 'isomorphic-sanitize';

// Add a unique ID for accessibility and easier tracking
const customerSupportBotId = 'ecotrack-pro-customer-support-bot';

// Define allowed tags and attributes for sanitization
const allowedTags = {
  p: [],
  div: [],
  span: [],
  strong: [],
  em: [],
  a: {
    href: [],
    target: '_blank',
    rel: ['noopener', 'noreferrer'],
  },
};

// Sanitize user input to prevent XSS attacks
const sanitizeUserInput = (input: string | null | undefined) => {
  if (input) {
    return sanitizeHtml(input, {
      allowedTags,
      allowedAttributes: {},
    });
  }
  return '';
};

// Define the component props and type
interface Props {
  message: string;
  userInput?: string;
}

// CustomerSupportBot component
const CustomerSupportBot: FC<Props> = ({ message, userInput }) => {
  // Sanitize user input if provided
  const sanitizedMessage = userInput ? sanitizeUserInput(userInput) : message;

  return (
    <div id={customerSupportBotId} className="customer-support-bot" aria-label="Customer Support Bot">
      {sanitizedMessage}
    </div>
  );
};

// Memoize the component for performance optimization
const MemoizedCustomerSupportBot: FC<Props> = React.memo(CustomerSupportBot);

// Add PropTypes for type checking
CustomerSupportBot.propTypes = {
  message: PropTypes.string.isRequired,
  userInput: PropTypes.string,
};

// Export the memoized component
export default MemoizedCustomerSupportBot;

import React, { FC, useMemo } from 'react';
import PropTypes from 'prop-types';
import { sanitizeHtml } from 'sanitize-html';
import { sanitize } from 'isomorphic-sanitize';

// Add a unique ID for accessibility and easier tracking
const customerSupportBotId = 'ecotrack-pro-customer-support-bot';

// Define allowed tags and attributes for sanitization
const allowedTags = {
  p: [],
  div: [],
  span: [],
  strong: [],
  em: [],
  a: {
    href: [],
    target: '_blank',
    rel: ['noopener', 'noreferrer'],
  },
};

// Sanitize user input to prevent XSS attacks
const sanitizeUserInput = (input: string | null | undefined) => {
  if (input) {
    return sanitizeHtml(input, {
      allowedTags,
      allowedAttributes: {},
    });
  }
  return '';
};

// Define the component props and type
interface Props {
  message: string;
  userInput?: string;
}

// CustomerSupportBot component
const CustomerSupportBot: FC<Props> = ({ message, userInput }) => {
  // Sanitize user input if provided
  const sanitizedMessage = userInput ? sanitizeUserInput(userInput) : message;

  return (
    <div id={customerSupportBotId} className="customer-support-bot" aria-label="Customer Support Bot">
      {sanitizedMessage}
    </div>
  );
};

// Memoize the component for performance optimization
const MemoizedCustomerSupportBot: FC<Props> = React.memo(CustomerSupportBot);

// Add PropTypes for type checking
CustomerSupportBot.propTypes = {
  message: PropTypes.string.isRequired,
  userInput: PropTypes.string,
};

// Export the memoized component
export default MemoizedCustomerSupportBot;