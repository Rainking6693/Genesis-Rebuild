import React, { FC, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

declare namespace React {
  interface Attributes {
    dangerouslySetInnerHTML?: { __html: string };
    role?: string;
    data-testid?: string;
  }

  type FC<P = {}> = FunctionComponent<P>;
}

interface Props {
  message: string;
  isTrusted?: boolean; // Add a flag to indicate if the HTML is trusted
}

const MyComponent: FC<Props> = ({ message, isTrusted = false }) => {
  const [error, setError] = useState(null);

  const handleError = (error: Error) => {
    setError(error);
  };

  const safeDangerouslySetInnerHTML = useMemo(
    () => ({ __html: message }),
    [message]
  );

  const isValidHTML = useMemo(
    () => DOMParser.parseFromString(message, 'text/html').body.childNodes.length > 0,
    [message]
  );

  if (!isValidHTML && !isTrusted) {
    // Add a warning for untrusted HTML with invalid structure
    console.warn(
      'Warning: Using dangerouslySetInnerHTML with untrusted HTML can lead to XSS attacks. Also, the provided HTML seems to be invalid.'
    );
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  if (!message || message.trim() === '') {
    // Return null or a placeholder if message is empty
    return null;
  }

  if (!isTrusted) {
    // Add a warning for untrusted HTML
    console.warn(
      'Warning: Using dangerouslySetInnerHTML with untrusted HTML can lead to XSS attacks.'
    );
  }

  return (
    <div data-testid="my-component" role="presentation">
      <div dangerouslySetInnerHTML={safeDangerouslySetInnerHTML} />
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  isTrusted: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
};

export default MyComponent;

import React, { FC, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

declare namespace React {
  interface Attributes {
    dangerouslySetInnerHTML?: { __html: string };
    role?: string;
    data-testid?: string;
  }

  type FC<P = {}> = FunctionComponent<P>;
}

interface Props {
  message: string;
  isTrusted?: boolean; // Add a flag to indicate if the HTML is trusted
}

const MyComponent: FC<Props> = ({ message, isTrusted = false }) => {
  const [error, setError] = useState(null);

  const handleError = (error: Error) => {
    setError(error);
  };

  const safeDangerouslySetInnerHTML = useMemo(
    () => ({ __html: message }),
    [message]
  );

  const isValidHTML = useMemo(
    () => DOMParser.parseFromString(message, 'text/html').body.childNodes.length > 0,
    [message]
  );

  if (!isValidHTML && !isTrusted) {
    // Add a warning for untrusted HTML with invalid structure
    console.warn(
      'Warning: Using dangerouslySetInnerHTML with untrusted HTML can lead to XSS attacks. Also, the provided HTML seems to be invalid.'
    );
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  if (!message || message.trim() === '') {
    // Return null or a placeholder if message is empty
    return null;
  }

  if (!isTrusted) {
    // Add a warning for untrusted HTML
    console.warn(
      'Warning: Using dangerouslySetInnerHTML with untrusted HTML can lead to XSS attacks.'
    );
  }

  return (
    <div data-testid="my-component" role="presentation">
      <div dangerouslySetInnerHTML={safeDangerouslySetInnerHTML} />
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  isTrusted: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
};

export default MyComponent;