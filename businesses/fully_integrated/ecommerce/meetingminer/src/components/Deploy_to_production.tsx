import React, { FC, useContext, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';

interface Props {
  message: string;
}

interface ValidatedMessage {
  value: string;
  isValid: boolean;
}

const DANGEROUS_CHARACTERS = /<script>/;

const validateMessage = (message: string): ValidatedMessage => {
  let isValid = true;
  let validatedMessage = message;

  // Implement validation logic here
  // For example, check if message is not empty or contains any dangerous characters
  if (!message || DANGEROUS_CHARACTERS.test(message)) {
    isValid = false;
    validatedMessage = '';
  }

  return { value: validatedMessage, isValid };
};

const MyComponent: FC<Props> = ({ message }) => {
  const { theme } = useContext(ThemeContext);
  const [validatedMessage, setValidatedMessage] = useState('');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const { value, isValid } = validateMessage(message);
    setValidatedMessage(value);
    setIsValid(isValid);
  }, [message]);

  if (!isValid) {
    return <div>Invalid message. Please provide a valid message.</div>;
  }

  return (
    <div data-testid="my-component" style={{ color: theme.textColor }}>
      <div dangerouslySetInnerHTML={{ __html: validatedMessage }} />
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { FC, useContext, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';

interface Props {
  message: string;
}

interface ValidatedMessage {
  value: string;
  isValid: boolean;
}

const DANGEROUS_CHARACTERS = /<script>/;

const validateMessage = (message: string): ValidatedMessage => {
  let isValid = true;
  let validatedMessage = message;

  // Implement validation logic here
  // For example, check if message is not empty or contains any dangerous characters
  if (!message || DANGEROUS_CHARACTERS.test(message)) {
    isValid = false;
    validatedMessage = '';
  }

  return { value: validatedMessage, isValid };
};

const MyComponent: FC<Props> = ({ message }) => {
  const { theme } = useContext(ThemeContext);
  const [validatedMessage, setValidatedMessage] = useState('');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const { value, isValid } = validateMessage(message);
    setValidatedMessage(value);
    setIsValid(isValid);
  }, [message]);

  if (!isValid) {
    return <div>Invalid message. Please provide a valid message.</div>;
  }

  return (
    <div data-testid="my-component" style={{ color: theme.textColor }}>
      <div dangerouslySetInnerHTML={{ __html: validatedMessage }} />
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.displayName = 'MyComponent';

export default MyComponent;