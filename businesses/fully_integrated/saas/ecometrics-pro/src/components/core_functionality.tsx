import React, { FC, ReactNode, ReactElement } from 'react';

interface Props {
  message: string;
}

// Add a default message for edge cases
const defaultMessage = 'Invalid or empty message';

// Add a validation function for the message
const validateMessage = (message: string): ReactElement | null => {
  if (!message || !message.trim() || /<script|<svg|on|style=/.test(message)) {
    return null;
  }
  const safeHTML = { __html: message };
  return <div dangerouslySetInnerHTML={safeHTML} />;
};

// Use the validated message in the component
const MyComponent: FC<Props> = ({ message }) => {
  const validatedMessage = validateMessage(message);

  // Add a fallback for cases where the message is invalid or empty
  return (
    <>
      {validatedMessage || <div>{defaultMessage}</div>}
    </>
  );
};

// Add accessibility improvements by wrapping the component with a div and providing an aria-label
const MyAccessibleComponent: FC<Props> = ({ message }) => {
  const validatedMessage = validateMessage(message);

  return (
    <div aria-label="My Component" role="presentation">
      {validatedMessage}
    </div>
  );
};

// Export the accessible and validated component
export default MyAccessibleComponent;

import React, { FC, ReactNode, ReactElement } from 'react';

interface Props {
  message: string;
}

// Add a default message for edge cases
const defaultMessage = 'Invalid or empty message';

// Add a validation function for the message
const validateMessage = (message: string): ReactElement | null => {
  if (!message || !message.trim() || /<script|<svg|on|style=/.test(message)) {
    return null;
  }
  const safeHTML = { __html: message };
  return <div dangerouslySetInnerHTML={safeHTML} />;
};

// Use the validated message in the component
const MyComponent: FC<Props> = ({ message }) => {
  const validatedMessage = validateMessage(message);

  // Add a fallback for cases where the message is invalid or empty
  return (
    <>
      {validatedMessage || <div>{defaultMessage}</div>}
    </>
  );
};

// Add accessibility improvements by wrapping the component with a div and providing an aria-label
const MyAccessibleComponent: FC<Props> = ({ message }) => {
  const validatedMessage = validateMessage(message);

  return (
    <div aria-label="My Component" role="presentation">
      {validatedMessage}
    </div>
  );
};

// Export the accessible and validated component
export default MyAccessibleComponent;