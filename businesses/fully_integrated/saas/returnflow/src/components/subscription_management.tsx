import React, { useState, useEffect, useCallback } from 'react';

interface SubscriptionData {
  title: string;
  content: string;
}

interface SubscriptionManagementProps {
  initialTitle: string;
  initialContent: string;
  fetchData: () => Promise<SubscriptionData>;
  onError?: (error: Error) => void;
  loadingIndicator?: React.ReactNode;
  errorIndicator?: (error: Error) => React.ReactNode;
}

const defaultLoadingIndicator = <div className="subscription-management__loading">Loading...</div>;

const defaultErrorIndicator = (error: Error) => (
  <div className="subscription-management__error" role="alert">
    Error: {error.message}
  </div>
);

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({
  initialTitle,
  initialContent,
  fetchData,
  onError,
  loadingIndicator = defaultLoadingIndicator,
  errorIndicator = defaultErrorIndicator,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleError = useCallback(
    (error: Error) => {
      console.error("SubscriptionManagement Error:", error);
      setError(error);
      onError?.(error); // Optional chaining for onError
    },
    [onError]
  );

  useEffect(() => {
    const loadSubscriptionData = async () => {
      setIsLoading(true);
      setError(null); // Clear any previous errors

      try {
        const data = await fetchData();
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        let errorToHandle: Error;
        if (err instanceof Error) {
          errorToHandle = err;
        } else {
          errorToHandle = new Error(String(err)); // Convert to Error object
        }
        handleError(errorToHandle);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscriptionData();
  }, [fetchData, handleError]);

  return (
    <div className="subscription-management">
      {isLoading ? (
        loadingIndicator
      ) : error ? (
        errorIndicator(error)
      ) : (
        <>
          <h1 className="subscription-management__title" aria-labelledby="subscriptionTitle">
            {title}
          </h1>
          <p className="subscription-management__content" id="subscriptionTitle">
            {content}
          </p>
        </>
      )}
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState, useEffect, useCallback } from 'react';

interface SubscriptionData {
  title: string;
  content: string;
}

interface SubscriptionManagementProps {
  initialTitle: string;
  initialContent: string;
  fetchData: () => Promise<SubscriptionData>;
  onError?: (error: Error) => void;
  loadingIndicator?: React.ReactNode;
  errorIndicator?: (error: Error) => React.ReactNode;
}

const defaultLoadingIndicator = <div className="subscription-management__loading">Loading...</div>;

const defaultErrorIndicator = (error: Error) => (
  <div className="subscription-management__error" role="alert">
    Error: {error.message}
  </div>
);

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({
  initialTitle,
  initialContent,
  fetchData,
  onError,
  loadingIndicator = defaultLoadingIndicator,
  errorIndicator = defaultErrorIndicator,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleError = useCallback(
    (error: Error) => {
      console.error("SubscriptionManagement Error:", error);
      setError(error);
      onError?.(error); // Optional chaining for onError
    },
    [onError]
  );

  useEffect(() => {
    const loadSubscriptionData = async () => {
      setIsLoading(true);
      setError(null); // Clear any previous errors

      try {
        const data = await fetchData();
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        let errorToHandle: Error;
        if (err instanceof Error) {
          errorToHandle = err;
        } else {
          errorToHandle = new Error(String(err)); // Convert to Error object
        }
        handleError(errorToHandle);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscriptionData();
  }, [fetchData, handleError]);

  return (
    <div className="subscription-management">
      {isLoading ? (
        loadingIndicator
      ) : error ? (
        errorIndicator(error)
      ) : (
        <>
          <h1 className="subscription-management__title" aria-labelledby="subscriptionTitle">
            {title}
          </h1>
          <p className="subscription-management__content" id="subscriptionTitle">
            {content}
          </p>
        </>
      )}
    </div>
  );
};

export default SubscriptionManagement;