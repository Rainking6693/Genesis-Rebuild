import React, { FC, useContext, useState } from 'react';
import { XSSContext } from './XSSContext';

interface Props {
  message?: string;
  className?: string; // Added for accessibility and styling purposes
}

const ClimateScoreProESGReportComponent: FC<Props> = ({ message, className }) => {
  const { sanitize } = useContext(XSSContext);

  // Validate the input message and sanitize it before rendering
  const [safeMessage, setSafeMessage] = useState<string>('');

  React.useEffect(() => {
    const validatedMessage = validateMessage(message);
    if (validatedMessage) {
      setSafeMessage(sanitize(validatedMessage));
    }
  }, [message]);

  const validateMessage = (message: string) => {
    // Implement validation logic here, such as checking for XSS attacks
    // You can use libraries like DOMPurify for more robust XSS protection
    // ...
    return message;
  };

  return <div className={className} dangerouslySetInnerHTML={{ __html: safeMessage }} />;
};

ClimateScoreProESGReportComponent.defaultProps = {
  message: '',
  className: '',
};

// Create a custom XSS context for sanitizing the message
interface XSSContextValue {
  sanitize: (message: string) => string;
}

const XSSContext = React.createContext<XSSContextValue>({} as XSSContextValue);

export { ClimateScoreProESGReportComponent, XSSContext };

import React, { FC, useContext, useState } from 'react';
import { XSSContext } from './XSSContext';

interface Props {
  message?: string;
  className?: string; // Added for accessibility and styling purposes
}

const ClimateScoreProESGReportComponent: FC<Props> = ({ message, className }) => {
  const { sanitize } = useContext(XSSContext);

  // Validate the input message and sanitize it before rendering
  const [safeMessage, setSafeMessage] = useState<string>('');

  React.useEffect(() => {
    const validatedMessage = validateMessage(message);
    if (validatedMessage) {
      setSafeMessage(sanitize(validatedMessage));
    }
  }, [message]);

  const validateMessage = (message: string) => {
    // Implement validation logic here, such as checking for XSS attacks
    // You can use libraries like DOMPurify for more robust XSS protection
    // ...
    return message;
  };

  return <div className={className} dangerouslySetInnerHTML={{ __html: safeMessage }} />;
};

ClimateScoreProESGReportComponent.defaultProps = {
  message: '',
  className: '',
};

// Create a custom XSS context for sanitizing the message
interface XSSContextValue {
  sanitize: (message: string) => string;
}

const XSSContext = React.createContext<XSSContextValue>({} as XSSContextValue);

export { ClimateScoreProESGReportComponent, XSSContext };