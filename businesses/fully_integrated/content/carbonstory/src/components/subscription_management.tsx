import React, { useState, useEffect } from 'react';
import { Subscription, SubscriptionStatus } from 'subscriptions-transport-hs';
import { useSubscription, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Button, Typography } from '@material-ui/core'; // Add Material-UI for accessible and consistent UI components

interface Props {
  subscriptionId: string;
}

interface SubscriptionData {
  carbonStorySubscription: Subscription;
  status: SubscriptionStatus;
}

interface CarbonStoryData {
  carbonStory: {
    carbonFootprint: number;
    brandSustainabilityInitiatives: string[];
  };
}

const MY_SUBSCRIPTION = gql`
  subscription CarbonStorySubscription($id: ID!) {
    carbonStory(id: $id) {
      carbonFootprint
      brandSustainabilityInitiatives
    }
  }
`;

const GET_SUBSCRIPTION_STATUS = gql`
  query GetSubscriptionStatus($id: ID!) {
    carbonStorySubscription(id: $id) {
      status
    }
  }
`;

const MyComponent: React.FC<Props> = ({ subscriptionId }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [subscriptionError, setSubscriptionError] = useState<Error | null>(null);
  const [statusError, setStatusError] = useState<Error | null>(null);

  const { data: subscriptionData, loading: subscriptionLoading, error: subscriptionSubscriptionError } = useSubscription<SubscriptionData>(MY_SUBSCRIPTION, {
    variables: { id: subscriptionId },
    onError: (err) => {
      setSubscriptionError(err);
    },
  });

  const { data: statusData, loading: statusLoading, error: statusSubscriptionError } = useQuery<{ carbonStorySubscription: { status: SubscriptionStatus } }>(GET_SUBSCRIPTION_STATUS, {
    variables: { id: subscriptionId },
    onError: (err) => {
      setStatusError(err);
    },
  });

  useEffect(() => {
    if (!subscriptionData || subscriptionError || statusData || statusError) return;
    setSubscriptionStatus(statusData?.carbonStorySubscription?.status);
  }, [subscriptionData, subscriptionError, statusData, statusError]);

  if (subscriptionSubscriptionError) {
    return <Typography variant="body1">Error: {subscriptionSubscriptionError.message}</Typography>;
  }

  if (statusSubscriptionError) {
    return <Typography variant="body1">Error: {statusSubscriptionError.message}</Typography>;
  }

  if (subscriptionLoading || statusLoading) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  const { carbonStory } = subscriptionData;

  return (
    <div>
      <Typography variant="h5" component="h2">
        Your Carbon Footprint and Brand Sustainability Report
      </Typography>
      {subscriptionError && <Typography variant="body1">Error: {subscriptionError.message}</Typography>}
      {statusError && <Typography variant="body1">Error: {statusError.message}</Typography>}
      {!subscriptionError && !statusError && (
        <>
          <Typography variant="body1">Carbon Footprint: {carbonStory?.carbonFootprint}</Typography>
          <Typography variant="body1">Brand Sustainability Initiatives: {carbonStory?.brandSustainabilityInitiatives.join(', ')}</Typography>
          {subscriptionStatus === SubscriptionStatus.ACTIVE && (
            <>
              <Button variant="contained" color="primary" disabled={subscriptionLoading || statusLoading}>
                Pause Subscription
              </Button>
              <Button variant="contained" color="secondary" disabled={subscriptionLoading || statusLoading}>
                Cancel Subscription
              </Button>
            </>
          )}
          {subscriptionStatus === SubscriptionStatus.INACTIVE && (
            <Button variant="contained" color="primary" disabled={subscriptionLoading || statusLoading}>
              Resume Subscription
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default MyComponent;

In this updated version, I've added error handling for both the subscription and subscription status queries using the `onError` prop. I've also separated the error messages from the main content to make it more readable. Additionally, I've used Material-UI's `Typography` component for more accessible and consistent text styling.