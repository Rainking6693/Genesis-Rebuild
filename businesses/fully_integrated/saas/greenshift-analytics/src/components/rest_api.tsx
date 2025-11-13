import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren<{}> {
  message?: string; // Make message optional
  error?: Error;
  isLoading?: boolean;
}

const GreenShiftAPI: FunctionComponent<Props> = ({ message, error, isLoading = false, children }) => {
  const [apiMessage, setApiMessage] = useState(message || 'Initial message'); // Set default message

  useEffect(() => {
    setApiMessage(message || 'Initial message'); // Update default message if message is undefined
  }, [message]);

  if (error) {
    setApiMessage(`Error: ${error.message}`);
  }

  if (isLoading) {
    setApiMessage('Loading...');
  }

  return (
    <div className="green-shift-api-message" role="alert" aria-live="polite">
      {apiMessage}
      {children}
    </div>
  );
};

GreenShiftAPI.displayName = 'GreenShiftAPI';

export default GreenShiftAPI;

import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren<{}> {
  message?: string; // Make message optional
  error?: Error;
  isLoading?: boolean;
}

const GreenShiftAPI: FunctionComponent<Props> = ({ message, error, isLoading = false, children }) => {
  const [apiMessage, setApiMessage] = useState(message || 'Initial message'); // Set default message

  useEffect(() => {
    setApiMessage(message || 'Initial message'); // Update default message if message is undefined
  }, [message]);

  if (error) {
    setApiMessage(`Error: ${error.message}`);
  }

  if (isLoading) {
    setApiMessage('Loading...');
  }

  return (
    <div className="green-shift-api-message" role="alert" aria-live="polite">
      {apiMessage}
      {children}
    </div>
  );
};

GreenShiftAPI.displayName = 'GreenShiftAPI';

export default GreenShiftAPI;