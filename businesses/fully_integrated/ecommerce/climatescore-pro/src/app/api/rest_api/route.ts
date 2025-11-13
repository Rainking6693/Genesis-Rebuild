import React, { FC, ReactElement } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

type Props = {
  message: string;
};

const ClimateScoreProApiComponent: FC<Props> = ({ message }: Props): ReactElement => {
  // Sanitize the input to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Check if the message is empty before rendering
  if (!sanitizedMessage.trim()) {
    return <div>No message available</div>;
  }

  // Ensure the sanitized message is always a valid HTML string
  if (typeof sanitizedMessage !== 'string') {
    return <div>Invalid sanitized message</div>;
  }

  // Use a div with an aria-label for accessibility
  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label="Climate Score API message"
    />
  );
};

ClimateScoreProApiComponent.defaultProps = {
  message: '',
};

ClimateScoreProApiComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export { ClimateScoreProApiComponent };

In this updated version, I've made the following improvements:

1. Imported the `React` library with the necessary components and functions.
2. Used the `DOMPurify` library to sanitize the input and prevent XSS attacks.
3. Checked if the message is empty before rendering and provided a fallback message.
4. Ensured the sanitized message is always a valid HTML string before rendering.
5. Added an `aria-label` to the div for accessibility purposes.