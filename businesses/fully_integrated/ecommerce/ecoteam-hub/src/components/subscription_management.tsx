import React, { useState, useEffect } from 'react';
import { Subscription, SubscriptionStatus } from './subscription.model';
import { useSubscription } from './subscription.hooks';
import { useAuth } from '../auth/auth.context';
import { useToast } from '@chakra-ui/react';
import { useIsMounted } from '@chakra-ui/react';

interface Props {
  subscriptionId?: string;
}

const MyComponent: React.FC<Props> = ({ subscriptionId }) => {
  const auth = useAuth();
  const subscription = useSubscription(subscriptionId, auth.user.id);
  const toast = useToast();
  const isMounted = useIsMounted();

  const handleRenewSubscription = async () => {
    if (!subscription) return;

    try {
      await api.put(`/subscriptions/${subscription.id}/renew`);
      if (isMounted()) {
        toast({
          title: 'Subscription renewed successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      if (isMounted()) {
        toast({
          title: 'Error renewing subscription.',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    try {
      await api.delete(`/subscriptions/${subscription.id}`);
      if (isMounted()) {
        toast({
          title: 'Subscription cancelled successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      if (isMounted()) {
        toast({
          title: 'Error cancelling subscription.',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  if (!subscription) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Subscription Details</h2>
      <p>Status: {subscription.status === SubscriptionStatus.ACTIVE ? 'Active' : 'Inactive'}</p>
      <p>Expiry Date: {subscription.formattedExpiryDate}</p>
      {subscription.status === SubscriptionStatus.INACTIVE && (
        <>
          <button onClick={handleRenewSubscription}>Renew Subscription</button>
          <button onClick={handleCancelSubscription}>Cancel Subscription</button>
        </>
      )}
    </div>
  );
};

export default MyComponent;

// subscription.model.ts
import moment from 'moment';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  expiryDate: Date;
  // Add more properties as needed

  get formattedExpiryDate(): string {
    return moment(this.expiryDate).format('LL');
  }
}

// subscription.hooks.ts
import { useEffect, useState } from 'react';
import { Subscription, SubscriptionStatus } from './subscription.model';
import { api } from '../api';
import { useAuth } from '../auth/auth.context';

export const useSubscription = (subscriptionId: string, userId: string) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await api.get(`/subscriptions/${subscriptionId}`);
        setSubscription(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (subscriptionId) {
      fetchSubscription();
    }
  }, [subscriptionId]);

  return subscription;
};

// Import Chakra UI's Toast and useIsMounted components
import { useToast } from '@chakra-ui/react';
import { useIsMounted } from '@chakra-ui/react';

Changes made:

1. Imported `useIsMounted` from Chakra UI to ensure that the toast messages are only displayed when the component is still mounted.
2. Checked if `subscription` is defined before calling the renew and cancel functions.
3. Used `subscription.formattedExpiryDate` instead of `subscription.expiryDate.toLocaleDateString()`.
4. Added `useIsMounted` to the imports.

Now, the component is more resilient, handles edge cases better, and is more accessible and maintainable.