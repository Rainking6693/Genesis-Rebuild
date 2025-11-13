import React, { FC, ReactNode, DefaultProps, PropsWithChildren } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DefaultProps {
  message: string;
  ariaLabel?: string;
  id?: string;
}

MyComponent.defaultProps = {
  message: '',
  ariaLabel: 'Moodboard Analytics Message',
};

const MyComponent: FC<Props> = ({ message, children, ariaLabel, id }) => {
  const sanitizedMessage = message || children;
  if (!sanitizedMessage) return null;

  const sanitizedMessageSafe = MyComponent.sanitizeMessage(sanitizedMessage);

  return (
    <div className="moodboard-analytics-message" id={id} aria-label={ariaLabel} aria-labelledby={id}>
      {sanitizedMessageSafe}
    </div>
  );
};

MyComponent.sanitizeMessage = (message: string) => {
  const sanitizedMessage = DOMPurify.sanitize(message);
  // Add support for HTML5 data attributes
  const sanitizedMessageWithDataAttributes = sanitizedMessage.replace(/(<[^>]+)(?:(?:\s+[^>]*?)*\/>)/g, (_, tag, end) => {
    const attributes = tag.match(/([^=]*)=["']([^"']*)["']/g);
    if (attributes) {
      const attributeString = attributes.map((attr) => attr.replace(/^([^=]*)=/, ` data-$1="`)).join(' ');
      return `<${tag} ${attributeString}${end}>`;
    }
    return `<${tag}${end}>`;
  });
  return sanitizedMessageWithDataAttributes;
};

MyComponent.propTypes = {
  message: React.PropTypes.string.isRequired,
  ariaLabel: React.PropTypes.string,
  id: React.PropTypes.string,
};

export default MyComponent;

import React, { FC, ReactNode, DefaultProps, PropsWithChildren } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DefaultProps {
  message: string;
  ariaLabel?: string;
  id?: string;
}

MyComponent.defaultProps = {
  message: '',
  ariaLabel: 'Moodboard Analytics Message',
};

const MyComponent: FC<Props> = ({ message, children, ariaLabel, id }) => {
  const sanitizedMessage = message || children;
  if (!sanitizedMessage) return null;

  const sanitizedMessageSafe = MyComponent.sanitizeMessage(sanitizedMessage);

  return (
    <div className="moodboard-analytics-message" id={id} aria-label={ariaLabel} aria-labelledby={id}>
      {sanitizedMessageSafe}
    </div>
  );
};

MyComponent.sanitizeMessage = (message: string) => {
  const sanitizedMessage = DOMPurify.sanitize(message);
  // Add support for HTML5 data attributes
  const sanitizedMessageWithDataAttributes = sanitizedMessage.replace(/(<[^>]+)(?:(?:\s+[^>]*?)*\/>)/g, (_, tag, end) => {
    const attributes = tag.match(/([^=]*)=["']([^"']*)["']/g);
    if (attributes) {
      const attributeString = attributes.map((attr) => attr.replace(/^([^=]*)=/, ` data-$1="`)).join(' ');
      return `<${tag} ${attributeString}${end}>`;
    }
    return `<${tag}${end}>`;
  });
  return sanitizedMessageWithDataAttributes;
};

MyComponent.propTypes = {
  message: React.PropTypes.string.isRequired,
  ariaLabel: React.PropTypes.string,
  id: React.PropTypes.string,
};

export default MyComponent;