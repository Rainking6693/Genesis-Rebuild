import React, { useState, useEffect } from 'react';
import { SubscriptionPlan, SubscriptionPlanId } from './subscription-plans';

interface Props {
  initialSubscriptionPlan: SubscriptionPlan; // Pass the initial subscription plan as a prop
  onSubscriptionChange: (newSubscriptionPlan: SubscriptionPlan) => void; // Function to handle subscription changes
}

const MyComponent: React.FC<Props> = ({ initialSubscriptionPlan, onSubscriptionChange }) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(initialSubscriptionPlan);

  const handleSubscriptionChange = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    onSubscriptionChange(plan);
  };

  const isCurrentPlan = (planId: SubscriptionPlanId) => planId === selectedPlan?.id;

  useEffect(() => {
    setSelectedPlan(initialSubscriptionPlan);
  }, [initialSubscriptionPlan]);

  return (
    <div>
      {/* Display the current subscription plan details */}
      <div>Current Subscription Plan: {selectedPlan ? selectedPlan.name : 'None selected'}</div>
      {selectedPlan && (
        <>
          <div>Subscription Duration: {selectedPlan.duration}</div>
          <div>Subscription Price: {selectedPlan.price}</div>
        </>
      )}

      {/* Provide options to change the subscription plan */}
      <ul>
        {Object.values(SubscriptionPlan).map((plan) => (
          <li key={plan.id}>
            <button
              key={plan.id}
              onClick={() => handleSubscriptionChange(plan)}
              aria-label={`Change to ${plan.name}`}
              className={isCurrentPlan(plan.id) ? 'selected' : ''}
            >
              {isCurrentPlan(plan.id) ? 'Current' : 'Change to'} {plan.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Add a CSS class for the selected subscription plan button
const styles = {
  '.selected': {
    fontWeight: 'bold',
    backgroundColor: '#ddd',
  },
};

export default MyComponent;

In this updated version, I've added the `useEffect` hook to ensure that the initial subscription plan is set when the component mounts. I've also changed the layout of the subscription plan options from a series of buttons to an unordered list for better accessibility. Additionally, I've added a check for the subscription plan ID instead of comparing the entire subscription plan object to improve performance.