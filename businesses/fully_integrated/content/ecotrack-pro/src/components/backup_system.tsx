import React, { FC, useState, useEffect } from 'react';

interface Props {
  message?: string;
  isLoading?: boolean;
  error?: Error;
}

const MyComponent: FC<Props> = ({ message, isLoading = false, error }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  let content;

  if (isLoading) {
    content = <div className="ecotrack-message ecotrack-message--loading" key="loading">Loading...</div>;
  } else if (error) {
    content = (
      <div className="ecotrack-message ecotrack-message--error" key="error">
        <div role="alert">
          <p>An error occurred: {error.message}</p>
        </div>
      </div>
    );
  } else if (message && isMounted) {
    content = <div className="ecotrack-message" key={message}>{message}</div>;
  } else {
    content = null;
  }

  return content;
};

export default MyComponent;

import React, { FC, useState, useEffect } from 'react';

interface Props {
  message?: string;
  isLoading?: boolean;
  error?: Error;
}

const MyComponent: FC<Props> = ({ message, isLoading = false, error }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  let content;

  if (isLoading) {
    content = <div className="ecotrack-message ecotrack-message--loading" key="loading">Loading...</div>;
  } else if (error) {
    content = (
      <div className="ecotrack-message ecotrack-message--error" key="error">
        <div role="alert">
          <p>An error occurred: {error.message}</p>
        </div>
      </div>
    );
  } else if (message && isMounted) {
    content = <div className="ecotrack-message" key={message}>{message}</div>;
  } else {
    content = null;
  }

  return content;
};

export default MyComponent;