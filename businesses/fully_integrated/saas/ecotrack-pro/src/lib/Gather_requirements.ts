import React, { FC, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { sanitizeHtml } from 'dompurify';
import React from 'react';
import { useId } from '@reach/auto-id';

interface Props {
  message: string;
  maxLength?: number;
  // Add aria-label for accessibility
  ariaLabel?: string;
}

const EcoTrackProRequirement: FC<Props> = ({ message, maxLength, ariaLabel }) => {
  const id = useId();

  // Use a safe HTML library to prevent XSS attacks
  const sanitizedMessage = sanitizeHtml(message, { MAX_LENGTH: maxLength });

  return (
    <div id={id}>
      {/* Add aria-label for accessibility */}
      <label htmlFor={id} aria-label={ariaLabel}>
        {message}
      </label>
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        // Add role="presentation" to hide the div from screen readers
        role="presentation"
      />
    </div>
  );
};

EcoTrackProRequirement.defaultProps = {
  message: '',
  maxLength: 200,
  ariaLabel: 'Requirement',
};

EcoTrackProRequirement.propTypes = {
  message: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  ariaLabel: PropTypes.string,
};

export { EcoTrackProRequirement };

In this updated code:

1. I've added an `ariaLabel` property for accessibility.
2. I've used the `useId` hook from `@reach/auto-id` to generate unique IDs for the label and the hidden div.
3. I've added a `role="presentation"` to the hidden div to hide it from screen readers.
4. I've moved the `React` import to the top of the file for better maintainability.