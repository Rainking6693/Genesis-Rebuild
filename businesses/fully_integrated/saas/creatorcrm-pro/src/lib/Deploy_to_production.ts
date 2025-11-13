import React, { FC, ReactNode, useContext } from 'react';
import PropTypes from 'prop-types';
import { createContext } from 'react';
import DOMPurify from 'dompurify';

interface SanitizedMessageContextValue {
  sanitizedMessage: string | null;
}

const SanitizedMessageContext = createContext<SanitizedMessageContextValue>({
  sanitizedMessage: null,
});

const FunctionalComponent: FC<Props> = ({ message }: Props) => {
  const { setSanitizedMessage } = useContext(SanitizedMessageContext);

  // Sanitize the user-provided HTML to prevent XSS attacks
  const sanitizedMessage = setSanitizedMessage(DOMPurify.sanitize(message));

  // Add a fallback for when the message prop is not provided
  if (!sanitizedMessage) {
    return <div>No message provided</div>;
  }

  // Validate the message prop and provide a helpful error message if it fails
  if (!sanitizedMessage.trim()) {
    return <div>Message cannot be empty</div>;
  }

  return <SanitizedMessageContext.Provider value={{ sanitizedMessage }}>{sanitizedMessage}</SanitizedMessageContext.Provider>;
};

FunctionalComponent.defaultProps = {
  message: '',
};

FunctionalComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

const SanitizedMessageContextProvider = ({ children }: { children: ReactNode }) => {
  const [sanitizedMessage, setSanitizedMessage] = React.useState<string | null>(null);

  return (
    <SanitizedMessageContext.Provider value={{ sanitizedMessage, setSanitizedMessage }}>
      {children}
    </SanitizedMessageContext.Provider>
  );
};

SanitizedMessageContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { FunctionalComponent, SanitizedMessageContextProvider };

import React, { FC, ReactNode, useContext } from 'react';
import PropTypes from 'prop-types';
import { createContext } from 'react';
import DOMPurify from 'dompurify';

interface SanitizedMessageContextValue {
  sanitizedMessage: string | null;
}

const SanitizedMessageContext = createContext<SanitizedMessageContextValue>({
  sanitizedMessage: null,
});

const FunctionalComponent: FC<Props> = ({ message }: Props) => {
  const { setSanitizedMessage } = useContext(SanitizedMessageContext);

  // Sanitize the user-provided HTML to prevent XSS attacks
  const sanitizedMessage = setSanitizedMessage(DOMPurify.sanitize(message));

  // Add a fallback for when the message prop is not provided
  if (!sanitizedMessage) {
    return <div>No message provided</div>;
  }

  // Validate the message prop and provide a helpful error message if it fails
  if (!sanitizedMessage.trim()) {
    return <div>Message cannot be empty</div>;
  }

  return <SanitizedMessageContext.Provider value={{ sanitizedMessage }}>{sanitizedMessage}</SanitizedMessageContext.Provider>;
};

FunctionalComponent.defaultProps = {
  message: '',
};

FunctionalComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

const SanitizedMessageContextProvider = ({ children }: { children: ReactNode }) => {
  const [sanitizedMessage, setSanitizedMessage] = React.useState<string | null>(null);

  return (
    <SanitizedMessageContext.Provider value={{ sanitizedMessage, setSanitizedMessage }}>
      {children}
    </SanitizedMessageContext.Provider>
  );
};

SanitizedMessageContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { FunctionalComponent, SanitizedMessageContextProvider };