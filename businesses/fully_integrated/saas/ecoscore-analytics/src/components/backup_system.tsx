import React, { FC, PropsWithChildren, useEffect, useRef, useContext } from 'react';
import { ErrorContext } from './ErrorContext';

interface Props extends PropsWithChildren {
  message?: string;
  id?: string;
  className?: string;
}

const MyComponent: FC<Props> = ({ children, message = 'No message provided', id, className }) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const { logError } = useContext(ErrorContext);

  useEffect(() => {
    if (messageRef.current) {
      try {
        messageRef.current.innerHTML = message;
      } catch (error) {
        logError(`Error setting message in MyComponent: ${error.message}`);
      }
    }
  }, [message]);

  // Add a default message for cases when the props are not provided
  MyComponent.defaultProps = {
    message: 'No message provided',
  };

  // Add accessibility improvements by wrapping the message in an aria-label
  return (
    <div id={id} className={className}>
      <div ref={messageRef} aria-label={message}>
        <div dangerouslySetInnerHTML={{ __html: children }} />
      </div>
    </div>
  );
};

export default MyComponent;

import React, { FC, PropsWithChildren, useEffect, useRef, useContext } from 'react';
import { ErrorContext } from './ErrorContext';

interface Props extends PropsWithChildren {
  message?: string;
  id?: string;
  className?: string;
}

const MyComponent: FC<Props> = ({ children, message = 'No message provided', id, className }) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const { logError } = useContext(ErrorContext);

  useEffect(() => {
    if (messageRef.current) {
      try {
        messageRef.current.innerHTML = message;
      } catch (error) {
        logError(`Error setting message in MyComponent: ${error.message}`);
      }
    }
  }, [message]);

  // Add a default message for cases when the props are not provided
  MyComponent.defaultProps = {
    message: 'No message provided',
  };

  // Add accessibility improvements by wrapping the message in an aria-label
  return (
    <div id={id} className={className}>
      <div ref={messageRef} aria-label={message}>
        <div dangerouslySetInnerHTML={{ __html: children }} />
      </div>
    </div>
  );
};

export default MyComponent;