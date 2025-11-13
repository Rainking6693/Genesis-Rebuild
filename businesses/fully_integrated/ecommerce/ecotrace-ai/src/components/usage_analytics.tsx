import React, { FC, useEffect, useState } from 'react';

interface Props {
  appId: string;
  message: string;
}

const MyComponent: FC<Props> = ({ appId, message }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const analyticsScript = document.createElement('script');
    analyticsScript.src = `https://${appId}.com/analytics.js`;
    analyticsScript.async = true;
    analyticsScript.onerror = () => {
      setError('Error loading analytics script');
    };
    document.body.appendChild(analyticsScript);

    analyticsScript.onload = () => {
      setIsLoaded(true);
      sendAnalyticsEvent(message);
    };

    return () => {
      document.body.removeChild(analyticsScript);
    };
  }, [appId, message]);

  if (!isLoaded && error) {
    return <div>{error}</div>;
  }

  if (!isLoaded) {
    return <div>Loading analytics script...</div>;
  }

  return <div>{message}</div>;
};

const sendAnalyticsEvent = (eventName: string) => {
  // Implement your analytics event sending logic here
  console.log(`Analytics event: ${eventName}`);
};

export default MyComponent;

In this updated version, I added an error state to handle cases where the analytics script fails to load. I also added an `onerror` event listener to the analytics script to catch any errors that might occur during loading. Additionally, I moved the check for `isLoaded` before the check for `error` to ensure that the error message is only displayed if the script has failed to load.

For accessibility, I didn't make any changes as the original component doesn't contain any interactive elements. However, if you plan to add interactivity, make sure to follow accessibility best practices, such as providing proper ARIA roles, labels, and descriptions.

Lastly, for maintainability, I kept the code clean and easy to understand. If the component grows in complexity, consider breaking it down into smaller, more manageable components. Also, consider adding comments to explain any complex logic or unusual decisions.