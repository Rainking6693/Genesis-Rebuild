import React, { FC, useState, useEffect } from 'react';

interface Props {
  message: string;
  error?: Error | null; // Add null as a possible value for error to handle cases where no error occurred
}

const BackupSystemMessage: FC<Props> = ({ message, error }) => {
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (error) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [error]);

  const errorMessage = error ? (
    <div>
      <p>An error occurred:</p>
      <pre className="error-message">{error.message}</pre>
    </div>
  ) : null;

  return (
    <div>
      {isError && errorMessage}
      <div className="message">{message}</div>
      <style jsx>{`
        .error-message {
          white-space: pre-wrap;
          background-color: #f5f5f5;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 1.2rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        .message {
          font-size: 1.2rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default BackupSystemMessage;

import React, { FC, useState, useEffect } from 'react';

interface Props {
  message: string;
  error?: Error | null; // Add null as a possible value for error to handle cases where no error occurred
}

const BackupSystemMessage: FC<Props> = ({ message, error }) => {
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (error) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [error]);

  const errorMessage = error ? (
    <div>
      <p>An error occurred:</p>
      <pre className="error-message">{error.message}</pre>
    </div>
  ) : null;

  return (
    <div>
      {isError && errorMessage}
      <div className="message">{message}</div>
      <style jsx>{`
        .error-message {
          white-space: pre-wrap;
          background-color: #f5f5f5;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 1.2rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        .message {
          font-size: 1.2rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default BackupSystemMessage;