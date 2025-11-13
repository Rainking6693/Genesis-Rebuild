import React, { FC, ReactNode, PropsWithChildren } from 'react';
import { sanitize } from 'dompurify';
import { sanitizeUserInput } from '../../security/input_sanitization';
import PropTypes from 'prop-types';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessage = message ? sanitize(sanitizeUserInput(message)) : '';

  // Check if sanitizedMessage is empty or null before setting it as aria-label
  const ariaLabel = sanitizedMessage || 'No message provided';

  return (
    <div>
      {sanitizedMessage && (
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        />
      )}
      {!sanitizedMessage && (
        <div>
          No message provided
          <br />
          {/* Add ARIA live region for better accessibility */}
          <span aria-live="polite">{ariaLabel}</span>
        </div>
      )}
    </div>
  );
};

MyComponent.propTypes = {
  message: PropTypes.string,
};

export default MyComponent;

import React, { FC, ReactNode, PropsWithChildren } from 'react';
import { sanitize } from 'dompurify';
import { sanitizeUserInput } from '../../security/input_sanitization';
import PropTypes from 'prop-types';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessage = message ? sanitize(sanitizeUserInput(message)) : '';

  // Check if sanitizedMessage is empty or null before setting it as aria-label
  const ariaLabel = sanitizedMessage || 'No message provided';

  return (
    <div>
      {sanitizedMessage && (
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        />
      )}
      {!sanitizedMessage && (
        <div>
          No message provided
          <br />
          {/* Add ARIA live region for better accessibility */}
          <span aria-live="polite">{ariaLabel}</span>
        </div>
      )}
    </div>
  );
};

MyComponent.propTypes = {
  message: PropTypes.string,
};

export default MyComponent;