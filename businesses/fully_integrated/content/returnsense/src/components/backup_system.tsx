import React, { FunctionComponent, ReactNode, useEffect, useRef } from 'react';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  message: string;
}> & {
  id?: string; // Add an optional id for accessibility purposes
};

const sanitizeXSS = (input: string) => {
  // Implement a library or function to sanitize the input against XSS attacks
  // For example, you can use DOMPurify: https://github.com/cure53/DOMPurify
  // This is just a placeholder function
  return input.replace(/<[^>]+>/gm, '');
};

const BackupSystemMessage: FunctionComponent<Props> = ({ message, id }) => {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current) {
      const sanitizedMessage = sanitizeXSS(message);
      messageRef.current.innerHTML = sanitizedMessage;
    }
  }, [message]);

  return (
    <div id={id} ref={messageRef} />
  );
};

BackupSystemMessage.defaultProps = {
  id: 'backup-system-message', // Set a default id for accessibility purposes
};

BackupSystemMessage.errorHandler = (error: Error) => {
  console.error('XSS attack detected:', error);
};

export default BackupSystemMessage;

import React, { FunctionComponent, ReactNode, useEffect, useRef } from 'react';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  message: string;
}> & {
  id?: string; // Add an optional id for accessibility purposes
};

const sanitizeXSS = (input: string) => {
  // Implement a library or function to sanitize the input against XSS attacks
  // For example, you can use DOMPurify: https://github.com/cure53/DOMPurify
  // This is just a placeholder function
  return input.replace(/<[^>]+>/gm, '');
};

const BackupSystemMessage: FunctionComponent<Props> = ({ message, id }) => {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current) {
      const sanitizedMessage = sanitizeXSS(message);
      messageRef.current.innerHTML = sanitizedMessage;
    }
  }, [message]);

  return (
    <div id={id} ref={messageRef} />
  );
};

BackupSystemMessage.defaultProps = {
  id: 'backup-system-message', // Set a default id for accessibility purposes
};

BackupSystemMessage.errorHandler = (error: Error) => {
  console.error('XSS attack detected:', error);
};

export default BackupSystemMessage;