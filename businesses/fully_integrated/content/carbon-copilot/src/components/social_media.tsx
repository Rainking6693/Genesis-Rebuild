import React, { FC, ReactNode, PropsWithChildren } from 'react';
import DOMPurify from 'dompurify';

interface Props extends PropsWithChildren<{ message?: string }> {
  // Add a defaultProps object to set a default value for message
  defaultMessage?: string;
}

const sanitizeHtml = (html: string) => {
  // Use DOMPurify for sanitization
  const sanitized = DOMPurify.sanitize(html);
  return sanitized;
};

const SocialMediaMessage: FC<Props> = ({ children, defaultMessage = 'An error occurred while rendering the message.' }) => {
  const sanitizedChildren = sanitizeHtml(children as string);
  const content = sanitizedChildren || defaultMessage;

  // Use a fragment to improve accessibility and avoid rendering extra divs
  return (
    <React.Fragment>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </React.Fragment>
  );
};

export default SocialMediaMessage;

import React, { FC, ReactNode, PropsWithChildren } from 'react';
import DOMPurify from 'dompurify';

interface Props extends PropsWithChildren<{ message?: string }> {
  // Add a defaultProps object to set a default value for message
  defaultMessage?: string;
}

const sanitizeHtml = (html: string) => {
  // Use DOMPurify for sanitization
  const sanitized = DOMPurify.sanitize(html);
  return sanitized;
};

const SocialMediaMessage: FC<Props> = ({ children, defaultMessage = 'An error occurred while rendering the message.' }) => {
  const sanitizedChildren = sanitizeHtml(children as string);
  const content = sanitizedChildren || defaultMessage;

  // Use a fragment to improve accessibility and avoid rendering extra divs
  return (
    <React.Fragment>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </React.Fragment>
  );
};

export default SocialMediaMessage;