import React, { FC, useMemo } from 'react';
import { useXSS } from 'xss';

interface Props {
  message?: string; // Adding a '?' to indicate that message is optional
}

const CustomerSupportBot: FC<Props> = ({ message }) => {
  const sanitizeXSS = useXSS();

  const sanitizedMessage = useMemo(
    () => (message ? sanitizeXSS(message) : ''),
    [message]
  );

  // Check if sanitizedMessage is not null, undefined, or an empty string before rendering
  if (sanitizedMessage) {
    return (
      <div>
        {/* Add ARIA attributes for accessibility */}
        <p aria-label="Customer Support Bot Message" dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>
    );
  }

  return null; // Return null instead of an empty paragraph
};

export default React.memo(CustomerSupportBot);

// Comment explaining the purpose of the sanitization
// Sanitize user-generated messages to prevent Cross-Site Scripting (XSS) attacks

import React, { FC, useMemo } from 'react';
import { useXSS } from 'xss';

interface Props {
  message?: string; // Adding a '?' to indicate that message is optional
}

const CustomerSupportBot: FC<Props> = ({ message }) => {
  const sanitizeXSS = useXSS();

  const sanitizedMessage = useMemo(
    () => (message ? sanitizeXSS(message) : ''),
    [message]
  );

  // Check if sanitizedMessage is not null, undefined, or an empty string before rendering
  if (sanitizedMessage) {
    return (
      <div>
        {/* Add ARIA attributes for accessibility */}
        <p aria-label="Customer Support Bot Message" dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>
    );
  }

  return null; // Return null instead of an empty paragraph
};

export default React.memo(CustomerSupportBot);

// Comment explaining the purpose of the sanitization
// Sanitize user-generated messages to prevent Cross-Site Scripting (XSS) attacks