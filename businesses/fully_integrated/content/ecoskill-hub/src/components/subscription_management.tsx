import React, { useState, useEffect } from 'react';
import { Subscription } from 'subscriptions-transport-husbandry';
import { useSubscription } from '@apollo/client';
import { isEmpty, isError } from 'lodash';

interface Props {
  subscriptionName: string;
  initialData?: any;
  onError?: (error: Error) => void;
}

const MyComponent: React.FC<Props> = ({ subscriptionName, initialData, onError }) => {
  const [data, setData] = useState(initialData);
  const subscription = useSubscription(Subscription.create({ name: subscriptionName }));

  useEffect(() => {
    if (!isEmpty(subscription.data) && !isEmpty(subscription.data[subscriptionName])) {
      setData(subscription.data[subscriptionName]);
    }

    if (isError(subscription.error)) {
      onError?.(subscription.error);
    }
  }, [subscription.data, subscription.error, subscriptionName]);

  return <div>{data}</div>;
};

MyComponent.defaultProps = {
  onError: (error: Error) => {
    console.error('An error occurred while fetching the subscription data.', error);
  },
};

export default MyComponent;

// Added lodash to handle empty values
import _ from 'lodash';

import React, { useState, useEffect } from 'react';
import { Subscription } from 'subscriptions-transport-husbandry';
import { useSubscription } from '@apollo/client';
import { isEmpty, isError } from 'lodash';

interface Props {
  subscriptionName: string;
  initialData?: any;
  onError?: (error: Error) => void;
}

const MyComponent: React.FC<Props> = ({ subscriptionName, initialData, onError }) => {
  const [data, setData] = useState(initialData);
  const subscription = useSubscription(Subscription.create({ name: subscriptionName }));

  useEffect(() => {
    if (!isEmpty(subscription.data) && !isEmpty(subscription.data[subscriptionName])) {
      setData(subscription.data[subscriptionName]);
    }

    if (isError(subscription.error)) {
      onError?.(subscription.error);
    }
  }, [subscription.data, subscription.error, subscriptionName]);

  return <div>{data}</div>;
};

MyComponent.defaultProps = {
  onError: (error: Error) => {
    console.error('An error occurred while fetching the subscription data.', error);
  },
};

export default MyComponent;

// Added lodash to handle empty values
import _ from 'lodash';