import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  isError?: boolean;
}

const MyComponent: React.FC<Props> = ({ message, isError = false }) => {
  const className = `social-media-message ${isError ? 'error' : ''}`;

  return (
    <div className={className}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  isError: false,
};

interface FallbackProps {
  errorMessage: string;
}

const Fallback: React.FC<FallbackProps> = ({ errorMessage }) => {
  return (
    <div className="social-media-error">
      <h2>An error occurred:</h2>
      <p>{errorMessage}</p>
    </div>
  );
};

export interface SocialMediaProps {
  message: string;
  error?: Error;
}

export const SocialMedia: React.FC<SocialMediaProps> = ({ message, error }) => {
  if (error) {
    return <Fallback errorMessage={error.message} />;
  }

  return <MyComponent message={message} />;
};

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  isError?: boolean;
}

const MyComponent: React.FC<Props> = ({ message, isError = false }) => {
  const className = `social-media-message ${isError ? 'error' : ''}`;

  return (
    <div className={className}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  isError: false,
};

interface FallbackProps {
  errorMessage: string;
}

const Fallback: React.FC<FallbackProps> = ({ errorMessage }) => {
  return (
    <div className="social-media-error">
      <h2>An error occurred:</h2>
      <p>{errorMessage}</p>
    </div>
  );
};

export interface SocialMediaProps {
  message: string;
  error?: Error;
}

export const SocialMedia: React.FC<SocialMediaProps> = ({ message, error }) => {
  if (error) {
    return <Fallback errorMessage={error.message} />;
  }

  return <MyComponent message={message} />;
};