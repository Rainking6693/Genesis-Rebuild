import React, { useMemo, useCallback } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitizer';

type SanitizeUserInputFunction = (input: string) => string;

// Add a type for the Props interface
interface Props {
  message: string;
}

// Add a type for the FunctionalComponent
const FunctionalComponent: React.FC<Props> = ({ message }) => {
  // Use useMemo to optimize performance
  const sanitizeMessage = useMemo<SanitizeUserInputFunction>(() => sanitizeUserInput, []);

  // Use useCallback to optimize performance of the sanitizeMessage function
  const sanitizedMessage = useMemo<string>(() => sanitizeMessage(message), [message, sanitizeMessage]);

  // Add a check for empty message to prevent errors
  if (!sanitizedMessage) return null;

  // Add a check for invalid HTML to prevent potential security risks
  const isValidHTML = useCallback(() => {
    const parser = new DOMParser();
    const sanitizedMessageDOM = parser.parseFromString(sanitizedMessage, 'text/html');
    return sanitizedMessageDOM.body.childNodes.length > 0;
  }, [sanitizedMessage]);

  const { isValid } = useMemo(() => {
    return { isValid: isValidHTML() };
  }, [isValidHTML]);

  if (!isValid) return <div>Invalid HTML detected. Please contact support.</div>;

  // Add a role and aria-label for accessibility
  return (
    <div role="presentation" aria-label="User message">
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

// Memoize the FunctionalComponent for performance optimization
export default React.memo(FunctionalComponent);

import React, { useMemo, useCallback } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitizer';

type SanitizeUserInputFunction = (input: string) => string;

// Add a type for the Props interface
interface Props {
  message: string;
}

// Add a type for the FunctionalComponent
const FunctionalComponent: React.FC<Props> = ({ message }) => {
  // Use useMemo to optimize performance
  const sanitizeMessage = useMemo<SanitizeUserInputFunction>(() => sanitizeUserInput, []);

  // Use useCallback to optimize performance of the sanitizeMessage function
  const sanitizedMessage = useMemo<string>(() => sanitizeMessage(message), [message, sanitizeMessage]);

  // Add a check for empty message to prevent errors
  if (!sanitizedMessage) return null;

  // Add a check for invalid HTML to prevent potential security risks
  const isValidHTML = useCallback(() => {
    const parser = new DOMParser();
    const sanitizedMessageDOM = parser.parseFromString(sanitizedMessage, 'text/html');
    return sanitizedMessageDOM.body.childNodes.length > 0;
  }, [sanitizedMessage]);

  const { isValid } = useMemo(() => {
    return { isValid: isValidHTML() };
  }, [isValidHTML]);

  if (!isValid) return <div>Invalid HTML detected. Please contact support.</div>;

  // Add a role and aria-label for accessibility
  return (
    <div role="presentation" aria-label="User message">
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

// Memoize the FunctionalComponent for performance optimization
export default React.memo(FunctionalComponent);