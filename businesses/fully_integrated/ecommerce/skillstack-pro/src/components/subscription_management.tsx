import React, { useState } from 'react';
import { SubscriptionPlan } from './subscription-plans'; // Assuming subscription plans are defined in a separate file

interface Props {
  subscriptionPlan: SubscriptionPlan; // Add subscription plan as prop
  onSubscriptionChange: (newSubscription: SubscriptionPlan) => void; // Add callback for subscription change
}

const SubscriptionManagement: React.FC<Props> = ({ subscriptionPlan, onSubscriptionChange }) => {
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionPlan | null>(subscriptionPlan);

  const handleSubscriptionChange = (newSubscription: SubscriptionPlan) => {
    setSelectedSubscription(newSubscription);
    onSubscriptionChange(newSubscription);
  };

  const isUpgradeAvailable = (plan: SubscriptionPlan) => plan.id > subscriptionPlan.id;

  // Add a check to ensure the selectedSubscription is a valid subscription plan
  const isValidSubscription = (subscription: SubscriptionPlan | null) => subscription !== null && subscription.id !== undefined;

  // Add a check to ensure the subscriptionPlan is a valid subscription plan
  const isValidSubscriptionPlan = (plan: SubscriptionPlan) => plan.id !== undefined;

  return (
    <div>
      {/* Display current subscription plan */}
      <div>Current Subscription: {isValidSubscription(subscriptionPlan) ? subscriptionPlan.name : 'Invalid Subscription'} </div>

      {/* Provide options to change subscription plan */}
      <button disabled={!isUpgradeAvailable(SubscriptionPlan.Basic) || !isValidSubscriptionPlan(SubscriptionPlan.Basic)} onClick={() => handleSubscriptionChange(SubscriptionPlan.Basic)}>Upgrade to Basic</button>
      <button disabled={!isUpgradeAvailable(SubscriptionPlan.Pro) || !isValidSubscriptionPlan(SubscriptionPlan.Pro)} onClick={() => handleSubscriptionChange(SubscriptionPlan.Pro)}>Upgrade to Pro</button>
      <button disabled={!isUpgradeAvailable(SubscriptionSubscriptionPlan.Enterprise) || !isValidSubscriptionPlan(SubscriptionSubscriptionPlan.Enterprise)} onClick={() => handleSubscriptionChange(SubscriptionSubscriptionPlan.Enterprise)}>Upgrade to Enterprise</button>

      {/* Display selected subscription plan if any */}
      {isValidSubscription(selectedSubscription) && <div>Selected Subscription: {selectedSubscription.name}</div>}
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState } from 'react';
import { SubscriptionPlan } from './subscription-plans'; // Assuming subscription plans are defined in a separate file

interface Props {
  subscriptionPlan: SubscriptionPlan; // Add subscription plan as prop
  onSubscriptionChange: (newSubscription: SubscriptionPlan) => void; // Add callback for subscription change
}

const SubscriptionManagement: React.FC<Props> = ({ subscriptionPlan, onSubscriptionChange }) => {
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionPlan | null>(subscriptionPlan);

  const handleSubscriptionChange = (newSubscription: SubscriptionPlan) => {
    setSelectedSubscription(newSubscription);
    onSubscriptionChange(newSubscription);
  };

  const isUpgradeAvailable = (plan: SubscriptionPlan) => plan.id > subscriptionPlan.id;

  // Add a check to ensure the selectedSubscription is a valid subscription plan
  const isValidSubscription = (subscription: SubscriptionPlan | null) => subscription !== null && subscription.id !== undefined;

  // Add a check to ensure the subscriptionPlan is a valid subscription plan
  const isValidSubscriptionPlan = (plan: SubscriptionPlan) => plan.id !== undefined;

  return (
    <div>
      {/* Display current subscription plan */}
      <div>Current Subscription: {isValidSubscription(subscriptionPlan) ? subscriptionPlan.name : 'Invalid Subscription'} </div>

      {/* Provide options to change subscription plan */}
      <button disabled={!isUpgradeAvailable(SubscriptionPlan.Basic) || !isValidSubscriptionPlan(SubscriptionPlan.Basic)} onClick={() => handleSubscriptionChange(SubscriptionPlan.Basic)}>Upgrade to Basic</button>
      <button disabled={!isUpgradeAvailable(SubscriptionPlan.Pro) || !isValidSubscriptionPlan(SubscriptionPlan.Pro)} onClick={() => handleSubscriptionChange(SubscriptionPlan.Pro)}>Upgrade to Pro</button>
      <button disabled={!isUpgradeAvailable(SubscriptionSubscriptionPlan.Enterprise) || !isValidSubscriptionPlan(SubscriptionSubscriptionPlan.Enterprise)} onClick={() => handleSubscriptionChange(SubscriptionSubscriptionPlan.Enterprise)}>Upgrade to Enterprise</button>

      {/* Display selected subscription plan if any */}
      {isValidSubscription(selectedSubscription) && <div>Selected Subscription: {selectedSubscription.name}</div>}
    </div>
  );
};

export default SubscriptionManagement;