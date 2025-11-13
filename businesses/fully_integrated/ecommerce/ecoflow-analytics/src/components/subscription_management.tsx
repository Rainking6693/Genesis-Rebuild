import React, { useState, useEffect } from 'react';
import { useXSS } from 'xss';
import { useLocale } from './locale';
import { useSubscription } from './subscription';

interface Props {
  messageId: string;
}

const MyComponent: React.FC<Props> = ({ messageId }) => {
  const { sanitize } = useXSS();
  const { t } = useLocale();
  const { data, isLoading, error } = useSubscription(messageId);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>{sanitize(data?.message || t(messageId))}</div>
      )}
    </div>
  );
};

export default MyComponent;

// subscription.ts
import { useSubscription } from 'react-query';
import { fetcher } from './fetcher';

interface SubscriptionData {
  message: string;
}

interface UseSubscriptionResult {
  data?: SubscriptionData;
  isLoading: boolean;
  error?: Error;
}

export const useSubscription = (messageId: string) => {
  const subscriptionId = getSubscriptionIdFromMessageId(messageId);

  return useSubscription<SubscriptionData>({
    queryKey: ['subscription', subscriptionId],
    queryFn: () => fetcher(`/api/subscriptions/${subscriptionId}`),
  });
};

const getSubscriptionIdFromMessageId = (messageId: string) => {
  // Implement your logic to get the subscriptionId from the messageId
  // For example, if the messageId is in the format "subscription-123", you can return "123"
  return messageId.split('-')[1];
};

// fetcher.ts
import axios from 'axios';

export const fetcher = (url: string) => async () => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

In this updated version, I've made the following improvements:

1. Added `useSubscription` custom hook to fetch subscription data from the server using `react-query`.
2. Extracted the logic to get the subscriptionId from the messageId into a separate function `getSubscriptionIdFromMessageId`.
3. Improved resiliency by using `react-query` for data fetching, which handles retries and caching automatically.
4. Made the component more maintainable by separating concerns and using custom hooks.
5. Added type definitions for the data and the custom hook result.
6. Improved error handling by using `react-query`'s built-in error handling.
7. Added a null check for the message data to prevent potential errors when the message is not found.
8. Used `useSubscription` hook instead of manual fetching in the `useEffect` hook.
9. Added a `fetcher` function to centralize the fetching logic.