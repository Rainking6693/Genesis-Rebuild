import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import DOMPurify from 'dompurify';

const COMPONENT_NAME = 'SocialMediaMessage';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  content?: string; // Add a prop for user-generated content
  componentName?: string; // Add a prop for error reporting and debugging
  children?: ReactNode; // Add a prop for additional content
  isError?: boolean; // Add a prop to handle error messages
}

const SocialMediaMessage: FC<Props> = ({ message, componentName = COMPONENT_NAME, key, children, isError = false, ...rest }) => {
  const sanitizedMessage = DOMPurify.sanitize(message); // Sanitize user-generated content

  // Add a class for error messages
  const messageClass = isError ? `${COMPONENT_NAME}-message error` : `${COMPONENT_NAME}-message`;

  return (
    <div key={key} {...rest} className={messageClass}>
      {children}
      {sanitizedMessage}
    </div>
  );
};

SocialMediaMessage.title = 'Social Media Message Component';
SocialMediaMessage.description = 'A reusable component for displaying messages on social media platforms.';

export default SocialMediaMessage;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import DOMPurify from 'dompurify';

const COMPONENT_NAME = 'SocialMediaMessage';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  content?: string; // Add a prop for user-generated content
  componentName?: string; // Add a prop for error reporting and debugging
  children?: ReactNode; // Add a prop for additional content
  isError?: boolean; // Add a prop to handle error messages
}

const SocialMediaMessage: FC<Props> = ({ message, componentName = COMPONENT_NAME, key, children, isError = false, ...rest }) => {
  const sanitizedMessage = DOMPurify.sanitize(message); // Sanitize user-generated content

  // Add a class for error messages
  const messageClass = isError ? `${COMPONENT_NAME}-message error` : `${COMPONENT_NAME}-message`;

  return (
    <div key={key} {...rest} className={messageClass}>
      {children}
      {sanitizedMessage}
    </div>
  );
};

SocialMediaMessage.title = 'Social Media Message Component';
SocialMediaMessage.description = 'A reusable component for displaying messages on social media platforms.';

export default SocialMediaMessage;