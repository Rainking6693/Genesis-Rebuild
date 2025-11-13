import React, { useState, useEffect } from 'react';

interface CustomerSupportBotProps {
  title?: string;
  content?: string;
  onError?: (error: Error) => void;
}

const CustomerSupportBot: React.FC<CustomerSupportBotProps> = ({
  title = 'Customer Support Bot',
  content = 'How can I assist you today?',
  onError = (error) => console.error(error),
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (error: Error) => {
      setError(error);
      onError(error);
    };

    setIsLoading(true);
    // Simulate an asynchronous operation
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      // Clean up any resources or event listeners
      setIsLoading(false);
      setError(null);
    };
  }, [onError]);

  return (
    <div className="customer-support-bot" aria-live="polite">
      {isLoading ? (
        <div className="customer-support-bot__loading">Loading...</div>
      ) : error ? (
        <div className="customer-support-bot__error" role="alert">
          {error.message}
        </div>
      ) : (
        <>
          <h1 className="customer-support-bot__title" id="customer-support-bot-title">
            {title}
          </h1>
          <p className="customer-support-bot__content" aria-describedby="customer-support-bot-title">
            {content}
          </p>
        </>
      )}
    </div>
  );
};

export default CustomerSupportBot;

import React, { useState, useEffect } from 'react';

interface CustomerSupportBotProps {
  title?: string;
  content?: string;
  onError?: (error: Error) => void;
}

const CustomerSupportBot: React.FC<CustomerSupportBotProps> = ({
  title = 'Customer Support Bot',
  content = 'How can I assist you today?',
  onError = (error) => console.error(error),
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (error: Error) => {
      setError(error);
      onError(error);
    };

    setIsLoading(true);
    // Simulate an asynchronous operation
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      // Clean up any resources or event listeners
      setIsLoading(false);
      setError(null);
    };
  }, [onError]);

  return (
    <div className="customer-support-bot" aria-live="polite">
      {isLoading ? (
        <div className="customer-support-bot__loading">Loading...</div>
      ) : error ? (
        <div className="customer-support-bot__error" role="alert">
          {error.message}
        </div>
      ) : (
        <>
          <h1 className="customer-support-bot__title" id="customer-support-bot-title">
            {title}
          </h1>
          <p className="customer-support-bot__content" aria-describedby="customer-support-bot-title">
            {content}
          </p>
        </>
      )}
    </div>
  );
};

export default CustomerSupportBot;