import React, { FC, PropsWithChildren, DetailedHTMLProps } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ children, message, ...rest }) => {
  const sanitizedMessage = MyComponent.sanitizeContent(message);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} {...rest} />;
};

MyComponent.sanitizeContent = (content: string) => {
  // Use DOMPurify for content sanitization
  const sanitizedContent = DOMPurify.sanitize(content);
  return sanitizedContent;
};

MyComponent.defaultProps = {
  // Add default props for accessibility
  role: 'text',
};

export default MyComponent;

import React, { FC, PropsWithChildren, DetailedHTMLProps } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ children, message, ...rest }) => {
  const sanitizedMessage = MyComponent.sanitizeContent(message);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} {...rest} />;
};

MyComponent.sanitizeContent = (content: string) => {
  // Use DOMPurify for content sanitization
  const sanitizedContent = DOMPurify.sanitize(content);
  return sanitizedContent;
};

MyComponent.defaultProps = {
  // Add default props for accessibility
  role: 'text',
};

export default MyComponent;