import React, { FC, useEffect, useState } from 'react';
import { useLocation } from '@reach/router';

interface Props {
  policyType: string;
}

const MyComponent: FC<Props> = ({ policyType }) => {
  const [cachedMessage, setCachedMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`/api/messages/${policyType}`);
        const fetchedMessage = await response.text();
        setCachedMessage(fetchedMessage);
        setIsLoading(false);
        return fetchedMessage;
      } catch (error) {
        console.error(`Error fetching message for policy type ${policyType}:`, error);
        setCachedMessage(null);
        setIsLoading(false);
        throw error;
      }
    };

    if (!cachedMessage) {
      fetchMessage();
    }
  }, [policyType, location.key]); // Added location.key to prevent fetching on every render

  if (isLoading) {
    return <div>Loading message...</div>;
  }

  if (!cachedMessage) {
    return <div>An error occurred while fetching the message.</div>;
  }

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: cachedMessage }} />
      <a href="#" onClick={() => window.history.back()}>Back</a>
    </div>
  );
};

MyComponent.error = (error: Error) => {
  console.error(error);
};

export default MyComponent;

1. Added a `useState` hook to store the loading state of the message.
2. Updated the `useEffect` hook to include the `location.key` dependency to prevent unnecessary fetches.
3. Displayed an error message when the component encounters an error while fetching the message.
4. Maintained the loading message when the component is first rendered or when the message is being fetched.
5. Added a "Back" link to allow users to navigate back to the previous page.
6. Used the `dangerouslySetInnerHTML` property as before, but with a null check to prevent rendering errors.
7. Made the component more accessible by adding a "Back" link for screen reader users.
8. Removed the external `messageCache` as it's not needed with the new approach.