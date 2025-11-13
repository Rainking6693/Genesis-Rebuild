import React from 'react';
import PropTypes from 'prop-types';
import { useSafeHTML } from 'react-safe-html-dom';
import { EcoSellAcademyNewsletterMessage } from './EcoSellAcademyNewsletterMessage';

interface Props {
  newsletterMessage: EcoSellAcademyNewsletterMessageProps;
  className?: string;
  testID?: string;
}

const MyComponent: React.FC<Props> = ({ newsletterMessage, className, testID }) => {
  const safeHTML = useSafeHTML(newsletterMessage.message);

  return (
    <div className={className} data-testid={testID} key={newsletterMessage.message}>
      {safeHTML}
      <div aria-hidden="true">{newsletterMessage.message}</div>
    </div>
  );
};

MyComponent.propTypes = {
  newsletterMessage: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
  testID: PropTypes.string,
};

export default MyComponent;

// EcoSellAcademyNewsletterMessage.tsx
import React from 'react';
import PropTypes from 'prop-types';

const EcoSellAcademyNewsletterMessage: React.FC<EcoSellAcademyNewsletterMessageProps> = ({ message }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: message }}
      aria-label="Newsletter message"
      role="presentation"
    >
      <div aria-hidden="true">{message}</div>
    </div>
  );
};

EcoSellAcademyNewsletterMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default EcoSellAcademyNewsletterMessage;

// EcoSellAcademyNewsletterMessageProps.ts
export interface EcoSellAcademyNewsletterMessageProps {
  message: string;
}

In this updated code, I've added an `aria-hidden="true"` to the `div` containing the sanitized HTML and the raw HTML message. This ensures that screen readers will ignore the content, but it's still available for non-visual users if needed. Additionally, I've added an `aria-label` to the newsletter message component for better accessibility.

I've also added type checks for the `message` property in both components to ensure that it's always a string. This helps with maintainability and prevents potential errors.

Lastly, I've added the `key` prop to the `MyComponent` to ensure that each newsletter message has a unique key for better performance in lists.