import { FC, ReactNode, SyntheticEvent, useState } from 'react';
import { IMessageProps, validateMessage } from './IMessageProps';
import sanitizeHtml from 'sanitize-html';

type SanitizedMessage = ReturnType<typeof sanitizeHtml>;

const validateMessageFunction = (message: SanitizedMessage) => {
  // Add your validation logic here
  return message.trim().length > 0;
};

const IMessagePropsValidation = (props: IMessageProps) => {
  const { message } = props;

  if (!message) {
    throw new Error('Message is required');
  }

  const sanitizedMessage = sanitizeHtml(message, {
    allowedTags: [],
    allowedAttributes: {},
  });

  if (!validateMessageFunction(sanitizedMessage)) {
    throw new Error('Invalid message');
  }

  return props;
};

const MyComponent: FC<IMessageProps> = ({ message, title, className, onClick }) => {
  const [error, setError] = useState('');

  const handleClick = (event: SyntheticEvent) => {
    event.stopPropagation();
    setError('');
  };

  const validatedProps = IMessagePropsValidation(
    // eslint-disable-next-line react/jsx-props-no-spreading
    { ...props }
  );

  return (
    <div
      title={title}
      className={className}
      onClick={handleClick}
      role="button"
      aria-label="Dismiss message"
    >
      {error && <div className="error">{error}</div>}
      <div dangerouslySetInnerHTML={{ __html: validatedProps.message }} />
    </div>
  );
};

export default MyComponent;

import { FC, ReactNode, SyntheticEvent, useState } from 'react';
import { IMessageProps, validateMessage } from './IMessageProps';
import sanitizeHtml from 'sanitize-html';

type SanitizedMessage = ReturnType<typeof sanitizeHtml>;

const validateMessageFunction = (message: SanitizedMessage) => {
  // Add your validation logic here
  return message.trim().length > 0;
};

const IMessagePropsValidation = (props: IMessageProps) => {
  const { message } = props;

  if (!message) {
    throw new Error('Message is required');
  }

  const sanitizedMessage = sanitizeHtml(message, {
    allowedTags: [],
    allowedAttributes: {},
  });

  if (!validateMessageFunction(sanitizedMessage)) {
    throw new Error('Invalid message');
  }

  return props;
};

const MyComponent: FC<IMessageProps> = ({ message, title, className, onClick }) => {
  const [error, setError] = useState('');

  const handleClick = (event: SyntheticEvent) => {
    event.stopPropagation();
    setError('');
  };

  const validatedProps = IMessagePropsValidation(
    // eslint-disable-next-line react/jsx-props-no-spreading
    { ...props }
  );

  return (
    <div
      title={title}
      className={className}
      onClick={handleClick}
      role="button"
      aria-label="Dismiss message"
    >
      {error && <div className="error">{error}</div>}
      <div dangerouslySetInnerHTML={{ __html: validatedProps.message }} />
    </div>
  );
};

export default MyComponent;