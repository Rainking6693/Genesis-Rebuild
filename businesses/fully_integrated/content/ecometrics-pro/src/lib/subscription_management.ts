import React, { FC, useState } from 'react';
import PropTypes from 'prop-types';
import { SubscriptionPlan } from './SubscriptionPlan'; // Assuming SubscriptionPlan is a separate file

const SUBSCRIPTION_PLANS = {
  BASIC: SubscriptionPlan.BASIC,
  STANDARD: SubscriptionPlan.STANDARD,
  PREMIUM: SubscriptionPlan.PREMIUM,
};

interface Props {
  message: string;
  subscriptionPlan: SubscriptionPlan;
}

const MyComponent: FC<Props> = ({ message, subscriptionPlan, ...rest }) => {
  const [currentPlan, setCurrentPlan] = useState(subscriptionPlan);

  const handleSubscriptionChange = (newPlan: SubscriptionPlan) => {
    setCurrentPlan(newPlan);
    // Implement subscription plan change logic here
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSubscriptionChange(currentPlan);
    }
  };

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown}>
      <div dangerouslySetInnerHTML={{ __html: message }} />
      {/* Add a subscription plan selector or other UI elements here */}
      <button onClick={() => handleSubscriptionChange(currentPlan)}>
        Change Subscription Plan
      </button>
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  subscriptionPlan: SUBSCRIPTION_PLANS.BASIC,
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  subscriptionPlan: PropTypes.oneOf(Object.values(SUBSCRIPTION_PLANS)).isRequired,
};

export { MyComponent, SUBSCRIPTION_PLANS };

import React, { FC, useState } from 'react';
import PropTypes from 'prop-types';
import { SubscriptionPlan } from './SubscriptionPlan'; // Assuming SubscriptionPlan is a separate file

const SUBSCRIPTION_PLANS = {
  BASIC: SubscriptionPlan.BASIC,
  STANDARD: SubscriptionPlan.STANDARD,
  PREMIUM: SubscriptionPlan.PREMIUM,
};

interface Props {
  message: string;
  subscriptionPlan: SubscriptionPlan;
}

const MyComponent: FC<Props> = ({ message, subscriptionPlan, ...rest }) => {
  const [currentPlan, setCurrentPlan] = useState(subscriptionPlan);

  const handleSubscriptionChange = (newPlan: SubscriptionPlan) => {
    setCurrentPlan(newPlan);
    // Implement subscription plan change logic here
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSubscriptionChange(currentPlan);
    }
  };

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown}>
      <div dangerouslySetInnerHTML={{ __html: message }} />
      {/* Add a subscription plan selector or other UI elements here */}
      <button onClick={() => handleSubscriptionChange(currentPlan)}>
        Change Subscription Plan
      </button>
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  subscriptionPlan: SUBSCRIPTION_PLANS.BASIC,
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  subscriptionPlan: PropTypes.oneOf(Object.values(SUBSCRIPTION_PLANS)).isRequired,
};

export { MyComponent, SUBSCRIPTION_PLANS };