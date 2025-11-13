import React, { useState, useEffect } from 'react';
import { sanitizeUserInput } from './inputSanitizer';

type MessageSource = 'userInput' | 'systemMessage';

interface Props {
  messageSource: MessageSource;
  message?: string; // Consider adding a default value for the message in case it's not provided
}

const FunctionalComponent: React.FC<Props> = ({ messageSource, message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<string | null>(message || null);

  useEffect(() => {
    if (messageSource === 'userInput' && message) {
      setSanitizedMessage(sanitizeUserInput(message));
    } else {
      setSanitizedMessage(message);
    }
  }, [message, messageSource]);

  // Optimize performance by memoizing the component if the sanitizedMessage prop doesn't change frequently
  const memoizedComponent = React.useMemo(
    () => (sanitizedMessage ? <div>{sanitizedMessage}</div> : <div>No message provided</div>),
    [sanitizedMessage]
  );

  // Improve accessibility by adding an ARIA label for screen readers
  const ariaLabel = messageSource === 'userInput' ? 'User message' : 'System message';

  return (
    <div>
      {/* Add a role="presentation" to hide the div from visual layout but still allow focus */}
      <div role="presentation" aria-label={ariaLabel}>
        {memoizedComponent}
      </div>
    </div>
  );
};

export default FunctionalComponent;

In this updated code, I've added a null check for the `sanitizedMessage` state, and a fallback message when the `message` prop is not provided. I've also improved the type definitions for the `messageSource` and `message` props. The component is now more resilient, maintainable, and accessible.