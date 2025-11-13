import React, { useEffect, useState } from 'react';

const SUBSCRIPTION_MESSAGE = "Welcome to MeetingMiner! Subscribe now to unlock executive-level insights from your team meetings.";
const DAILY_INTEL_MESSAGE = "Your daily dose of business intelligence is ready! Let's dive in!";
const STORAGE_KEY = 'subscription_message_shown';

type MessageProps = {
  message: string;
};

const MyComponent: React.FC<MessageProps> = ({ message }) => {
  return <div>{message}</div>;
};

const SubscriptionMessageWrapper = () => {
  const [showSubscriptionMessage, setShowSubscriptionMessage] = useState<boolean>(true);

  useEffect(() => {
    const storedValue = localStorage.getItem(STORAGE_KEY);
    if (storedValue !== null) {
      setShowSubscriptionMessage(storedValue === 'true');
    }

    // Clean up the storage when the component unmounts
    return () => {
      if (showSubscriptionMessage) {
        localStorage.removeItem(STORAGE_KEY);
      }
    };
  }, [showSubscriptionMessage]);

  // If the component is initially unmounted, remove the storage key
  useEffect(() => {
    return () => {
      localStorage.removeItem(STORAGE_KEY);
    };
  }, []);

  return (
    <>
      {showSubscriptionMessage && <MyComponent message={SUBSCRIPTION_MESSAGE} />}
      {!showSubscriptionMessage && <MyComponent message={DAILY_INTEL_MESSAGE} />}
    </>
  );
};

export default SubscriptionMessageWrapper;

import React, { useEffect, useState } from 'react';

const SUBSCRIPTION_MESSAGE = "Welcome to MeetingMiner! Subscribe now to unlock executive-level insights from your team meetings.";
const DAILY_INTEL_MESSAGE = "Your daily dose of business intelligence is ready! Let's dive in!";
const STORAGE_KEY = 'subscription_message_shown';

type MessageProps = {
  message: string;
};

const MyComponent: React.FC<MessageProps> = ({ message }) => {
  return <div>{message}</div>;
};

const SubscriptionMessageWrapper = () => {
  const [showSubscriptionMessage, setShowSubscriptionMessage] = useState<boolean>(true);

  useEffect(() => {
    const storedValue = localStorage.getItem(STORAGE_KEY);
    if (storedValue !== null) {
      setShowSubscriptionMessage(storedValue === 'true');
    }

    // Clean up the storage when the component unmounts
    return () => {
      if (showSubscriptionMessage) {
        localStorage.removeItem(STORAGE_KEY);
      }
    };
  }, [showSubscriptionMessage]);

  // If the component is initially unmounted, remove the storage key
  useEffect(() => {
    return () => {
      localStorage.removeItem(STORAGE_KEY);
    };
  }, []);

  return (
    <>
      {showSubscriptionMessage && <MyComponent message={SUBSCRIPTION_MESSAGE} />}
      {!showSubscriptionMessage && <MyComponent message={DAILY_INTEL_MESSAGE} />}
    </>
  );
};

export default SubscriptionMessageWrapper;