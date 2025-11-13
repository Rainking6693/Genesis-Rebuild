import React, { FC, useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useId } from '@reach/auto-id';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const id = useId();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      validateMessage(message);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  }, [message]);

  return (
    <div id={id} aria-labelledby={id} aria-invalid={error ? 'true' : 'false'}>
      <div id={`${id}-message`}>{error ? <div>{error}</div> : <div dangerouslySetInnerHTML={{ __html: message }} />}</div>
      {message && <div id={`${id}-label`}>{message}</div>}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

// Validate props and handle edge cases
const validateMessage = (message: string) => {
  if (!message || typeof message !== 'string') {
    throw new Error('Invalid or missing message');
  }
  return message;
};

MyComponent.validate = (props: Props) => {
  const { message } = props;
  try {
    validateMessage(message);
  } catch (error) {
    return error.message;
  }
};

// Optimize performance by memoizing the component if props don't change
const MemoizedMyComponent: FC<Props> = React.memo(({ message }) => {
  const validatedMessage = validateMessage(message);
  return <MyComponent message={validatedMessage} />;
});

export default MemoizedMyComponent;

import React, { FC, useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useId } from '@reach/auto-id';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const id = useId();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      validateMessage(message);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  }, [message]);

  return (
    <div id={id} aria-labelledby={id} aria-invalid={error ? 'true' : 'false'}>
      <div id={`${id}-message`}>{error ? <div>{error}</div> : <div dangerouslySetInnerHTML={{ __html: message }} />}</div>
      {message && <div id={`${id}-label`}>{message}</div>}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

// Validate props and handle edge cases
const validateMessage = (message: string) => {
  if (!message || typeof message !== 'string') {
    throw new Error('Invalid or missing message');
  }
  return message;
};

MyComponent.validate = (props: Props) => {
  const { message } = props;
  try {
    validateMessage(message);
  } catch (error) {
    return error.message;
  }
};

// Optimize performance by memoizing the component if props don't change
const MemoizedMyComponent: FC<Props> = React.memo(({ message }) => {
  const validatedMessage = validateMessage(message);
  return <MyComponent message={validatedMessage} />;
});

export default MemoizedMyComponent;