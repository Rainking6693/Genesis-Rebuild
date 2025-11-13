import React, { useEffect, useState } from 'react';
import { useRefetch } from './useApi'; // Assuming useApi returns a refetch function

interface SubscriptionData {
  // Define your subscription data structure here
}

interface SubscriptionState {
  data: any;
  loading: boolean;
  error: null | Error;
}

const SubscriptionManagement: React.FC<{ subscriptionId: string }> = ({ subscriptionId }) => {
  const [state, setState] = useState<SubscriptionState>({ data: null, loading: true, error: null });
  const { refetch } = useRefetch<SubscriptionData>('/api/subscriptions'); // Assuming the API endpoint
  const refetchHandler = React.useCallback(() => {
    setState({ loading: true, error: null });
    refetch(subscriptionId).then((data) => {
      setState({ loading: false, data });
    }).catch((error) => {
      setState({ loading: false, error });
    }).finally(() => {
      setState({ loading: false });
    });
  }, [refetch, subscriptionId]);

  useEffect(() => {
    if (!state.data) {
      refetchHandler();
    }
  }, [refetchHandler, state.data, subscriptionId]);

  // Add ARIA attributes for accessibility
  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return (
      <div role="alert">
        <p>An error occurred: {state.error.message}</p>
      </div>
    );
  }

  // Render your subscription data here
  return (
    <div>
      {/* Your subscription data UI */}
      <button onClick={refetchHandler}>Refetch</button>
    </div>
  );
};

export default SubscriptionManagement;

import React, { useEffect, useState } from 'react';
import { useRefetch } from './useApi'; // Assuming useApi returns a refetch function

interface SubscriptionData {
  // Define your subscription data structure here
}

interface SubscriptionState {
  data: any;
  loading: boolean;
  error: null | Error;
}

const SubscriptionManagement: React.FC<{ subscriptionId: string }> = ({ subscriptionId }) => {
  const [state, setState] = useState<SubscriptionState>({ data: null, loading: true, error: null });
  const { refetch } = useRefetch<SubscriptionData>('/api/subscriptions'); // Assuming the API endpoint
  const refetchHandler = React.useCallback(() => {
    setState({ loading: true, error: null });
    refetch(subscriptionId).then((data) => {
      setState({ loading: false, data });
    }).catch((error) => {
      setState({ loading: false, error });
    }).finally(() => {
      setState({ loading: false });
    });
  }, [refetch, subscriptionId]);

  useEffect(() => {
    if (!state.data) {
      refetchHandler();
    }
  }, [refetchHandler, state.data, subscriptionId]);

  // Add ARIA attributes for accessibility
  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return (
      <div role="alert">
        <p>An error occurred: {state.error.message}</p>
      </div>
    );
  }

  // Render your subscription data here
  return (
    <div>
      {/* Your subscription data UI */}
      <button onClick={refetchHandler}>Refetch</button>
    </div>
  );
};

export default SubscriptionManagement;