import React, { FC, useMemo, ReactNode } from 'react';
import PropTypes from 'prop-types';

/**
 * MyComponent - A simple React component that displays a message.
 *
 * Props:
 * - message: The message to be displayed.
 * - data-testid: A data attribute for testing purposes.
 */
interface Props {
  message: string;
  dataTestId?: string;
}

const sanitizeMessage = (message: string): ReactNode => {
  try {
    const sanitizedMessage = new DOMParser().parseFromString(message, 'text/html').body.textContent;
    return sanitizedMessage;
  } catch (error) {
    console.error('Error sanitizing message:', error);
    return '';
  }
};

const MyComponent: FC<Props> = React.memo(({ message, dataTestId }) => {
  const sanitizedMessage = useMemo(() => sanitizeMessage(message), [message]);

  if (!sanitizedMessage) {
    return <div>An error occurred while sanitizing the message.</div>;
  }

  return (
    <div data-testid={dataTestId} aria-label="Message content">
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
});

MyComponent.defaultProps = {
  message: '',
  dataTestId: 'my-component',
};

MyComponent.propTypes = {
  message: PropTypes.string,
  dataTestId: PropTypes.string,
};

export default MyComponent;

In this updated version, I've added a `sanitizeMessage` function to handle the sanitization of the `message` prop. I've also added a `dataTestId` prop for easier testing and moved the default value for `dataTestId` to the defaultProps object. Additionally, I've added a check for when the sanitized message is empty or null and returned an error message in that case.