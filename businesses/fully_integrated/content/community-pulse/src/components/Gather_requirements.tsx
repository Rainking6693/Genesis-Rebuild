import React, { FC, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Omit } from 'utility-types';
import DOMPurify from 'dompurify';
import { ContentContext } from './ContentContext';

type Props = Omit<React.HTMLAttributes<HTMLDivElement>, 'message' | 'dangerouslySetInnerHTML'>;

// XSS prevention function
const sanitizeMessage = (message: string) => DOMPurify.sanitize(message);

const MyComponent: FC<Props> = ({ message, ...props }) => {
  const { validateMessage = sanitizeMessage } = useContext(ContentContext);

  const sanitizedMessage = validateMessage(message);

  return (
    <div role="presentation" {...props} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string,
};

// Use named export for better code organization and maintainability
export const CommunityPulseComponent = MyComponent;

// ContentContext.ts
import React, { createContext, useState } from 'react';

interface ContentContextValue {
  validateMessage: (message: string) => string;
}

export const ContentContext = createContext<ContentContextValue>({
  validateMessage: (message) => message,
});

// ContentContext.Provider.tsx
import React from 'react';
import { ContentContext, ContentContextValue } from './ContentContext';
import DOMPurify from 'dompurify';

interface Props {
  children: React.ReactNode;
}

const ContentContextProvider: React.FC<Props> = ({ children }) => {
  const [validateMessage, setValidateMessage] = useState((message: string) => message);

  // Implement validation logic here, such as checking for XSS attacks
  const sanitizeMessage = (message: string) => DOMPurify.sanitize(message);

  const value: ContentContextValue = { validateMessage: sanitizeMessage };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export default ContentContextProvider;