import React, { FC, ReactNode } from 'react';
import { IMessage, IErrorMessage } from './IMessage';

type MessageType = IMessage | IErrorMessage | null;

const MessageComponent: FC<{ message: MessageType }> = ({ message }) => {
  if (!message) return null;

  if (message instanceof Error) {
    return (
      <div className="error-message" role="alert">
        <p>{message.message}</p>
      </div>
    );
  }

  return (
    <div className={message ? 'message' : ''}>
      {typeof message === 'string' ? (
        <p>{message}</p>
      ) : (
        <div>{message.text}</div>
      )}
    </div>
  );
};

export default MessageComponent;

interface IMessage {
  text: string;
}

interface IErrorMessage extends Error {}

interface ICustomErrorMessage {
  error: string;
}

// Add a custom error message interface to handle non-Error objects

import React, { FC, ReactNode } from 'react';
import { IMessage, IErrorMessage } from './IMessage';

type MessageType = IMessage | IErrorMessage | null;

const MessageComponent: FC<{ message: MessageType }> = ({ message }) => {
  if (!message) return null;

  if (message instanceof Error) {
    return (
      <div className="error-message" role="alert">
        <p>{message.message}</p>
      </div>
    );
  }

  return (
    <div className={message ? 'message' : ''}>
      {typeof message === 'string' ? (
        <p>{message}</p>
      ) : (
        <div>{message.text}</div>
      )}
    </div>
  );
};

export default MessageComponent;

interface IMessage {
  text: string;
}

interface IErrorMessage extends Error {}

interface ICustomErrorMessage {
  error: string;
}

// Add a custom error message interface to handle non-Error objects