import React, { useState, useEffect } from 'react';

interface Props {
  subject: string; // Add subject for email personalization
  from: string; // Add sender's email address for email header
  message: string;
  unsubscribeUrl: string; // Add unsubscribe URL for compliance with CAN-SPAM Act
  confirmUrl: string; // Add confirmation URL for unsubscribe
}

const MyComponent: React.FC<Props> = ({ subject, from, message, unsubscribeUrl, confirmUrl }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);

  useEffect(() => {
    if (isUnsubscribed) {
      window.location.href = confirmUrl;
    }
  }, [isUnsubscribed, confirmUrl]);

  const handleUnsubscribe = async () => {
    setIsLoading(true);

    try {
      // Add your unsubscribe logic here
      // After unsubscribing, set the isUnsubscribed state to true
      setIsUnsubscribed(true);
    } catch (error) {
      console.error('Error during unsubscribe:', error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Use HTML for email formatting */}
      <div dangerouslySetInnerHTML={{ __html: message }} />

      {/* Add unsubscribe link for compliance with CAN-SPAM Act */}
      <a href={unsubscribeUrl} onClick={handleUnsubscribe} disabled={isLoading}>
        {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
      </a>

      {/* Add aria-label for accessibility */}
      <a href="#" aria-label="Skip to main content">Skip to main content</a>
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';

interface Props {
  subject: string; // Add subject for email personalization
  from: string; // Add sender's email address for email header
  message: string;
  unsubscribeUrl: string; // Add unsubscribe URL for compliance with CAN-SPAM Act
  confirmUrl: string; // Add confirmation URL for unsubscribe
}

const MyComponent: React.FC<Props> = ({ subject, from, message, unsubscribeUrl, confirmUrl }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);

  useEffect(() => {
    if (isUnsubscribed) {
      window.location.href = confirmUrl;
    }
  }, [isUnsubscribed, confirmUrl]);

  const handleUnsubscribe = async () => {
    setIsLoading(true);

    try {
      // Add your unsubscribe logic here
      // After unsubscribing, set the isUnsubscribed state to true
      setIsUnsubscribed(true);
    } catch (error) {
      console.error('Error during unsubscribe:', error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Use HTML for email formatting */}
      <div dangerouslySetInnerHTML={{ __html: message }} />

      {/* Add unsubscribe link for compliance with CAN-SPAM Act */}
      <a href={unsubscribeUrl} onClick={handleUnsubscribe} disabled={isLoading}>
        {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
      </a>

      {/* Add aria-label for accessibility */}
      <a href="#" aria-label="Skip to main content">Skip to main content</a>
    </div>
  );
};

export default MyComponent;