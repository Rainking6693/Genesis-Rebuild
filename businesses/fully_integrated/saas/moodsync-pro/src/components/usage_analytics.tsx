import React, { useState, useEffect } from 'react';

interface MoodSyncMessageProps {
  message: string;
}

interface MoodSyncComponentProps extends MoodSyncMessageProps {
  applicationId: string;
  isProduction: boolean;
}

const MoodSyncComponent: React.FC<MoodSyncComponentProps> = ({ message, applicationId, isProduction }) => {
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const sendAnalytics = async () => {
      if (!isProduction) return;
      setIsLoading(true);

      try {
        const response = await fetch(`https://analytics.example.com/api/v1/usage/${applicationId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
          signal: new AbortController().signal, // Add a signal to abort the request if the component unmounts
          timeout: 10000, // Set a timeout of 10 seconds
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (isMounted) {
          setIsSent(true);
          setIsLoading(false);
        }
      } catch (error) {
        setError(error);
        setIsLoading(false);
        console.error(`Error sending analytics message: ${error.message}`);
      }
    };

    sendAnalytics();
  }, [message, applicationId, isProduction]);

  return (
    <div>
      {isLoading && <span>Sending...</span>}
      {error && <span role="alert">Error: {error.message}</span>}
      {message}
      {isSent && <span role="status" aria-hidden="true">Sent</span>}
    </div>
  );
};

export default MoodSyncComponent;

import React, { useState, useEffect } from 'react';

interface MoodSyncMessageProps {
  message: string;
}

interface MoodSyncComponentProps extends MoodSyncMessageProps {
  applicationId: string;
  isProduction: boolean;
}

const MoodSyncComponent: React.FC<MoodSyncComponentProps> = ({ message, applicationId, isProduction }) => {
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const sendAnalytics = async () => {
      if (!isProduction) return;
      setIsLoading(true);

      try {
        const response = await fetch(`https://analytics.example.com/api/v1/usage/${applicationId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
          signal: new AbortController().signal, // Add a signal to abort the request if the component unmounts
          timeout: 10000, // Set a timeout of 10 seconds
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (isMounted) {
          setIsSent(true);
          setIsLoading(false);
        }
      } catch (error) {
        setError(error);
        setIsLoading(false);
        console.error(`Error sending analytics message: ${error.message}`);
      }
    };

    sendAnalytics();
  }, [message, applicationId, isProduction]);

  return (
    <div>
      {isLoading && <span>Sending...</span>}
      {error && <span role="alert">Error: {error.message}</span>}
      {message}
      {isSent && <span role="status" aria-hidden="true">Sent</span>}
    </div>
  );
};

export default MoodSyncComponent;