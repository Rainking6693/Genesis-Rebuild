import React, {
  FC,
  useState,
  useEffect,
  useCallback,
  useMemo,
  CSSProperties,
} from 'react';
import styled from 'styled-components';

// Define a more robust type for subscription plans
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  is_active: boolean;
  description?: string; // Optional description
  currency?: string; // Optional currency
  interval?: 'month' | 'year'; // Optional billing interval
  error?: string; // Optional error message for inactive plans
}

interface Props {
  userId: string; // Required: User identifier
  initialSubscription?: SubscriptionPlan | null; // Optional: Initial subscription data
  onSubscriptionChange?: (newSubscription: SubscriptionPlan | null) => void; // Optional: Callback for subscription changes
  errorBoundary?: React.ComponentType<{ children: React.ReactNode }>; // Optional: Custom error boundary component
  style?: CSSProperties; // Optional: Custom styles for the component
  className?: string; // Optional: Custom CSS class name
  ariaLabel?: string; // Optional: Aria label for accessibility
}

// Styled components for better visual presentation
const SubscriptionContainer = styled.div`
  border: 1px solid #ddd;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-family: sans-serif;
  ${(props) => props.style}
`;

const PlanList = styled.ul`
  list-style: none;
  padding: 0;
`;

const PlanItem = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const PlanButton = styled.button<{ isLoading: boolean }>`
  background-color: #4CAF50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #367c39;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  &:disabled:hover {
    background-color: #cccccc;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 8px;
`;

const LoadingMessage = styled.div`
  color: grey;
  margin-top: 8px;
`;

// Utility function to simulate fetching subscription plans (replace with actual API call)
const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  // Simulate an API call with a delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulate fetching subscription plans from an API
  return [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      features: ['Feature 1', 'Feature 2'],
      is_active: true,
      currency: 'USD',
      interval: 'month',
      description: 'Basic plan for individuals',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 29.99,
      features: ['All Features', 'Priority Support'],
      is_active: true,
      currency: 'USD',
      interval: 'month',
      description: 'Premium plan for businesses',
    },
    {
      id: 'yearly_premium',
      name: 'Premium Yearly',
      price: 299.99,
      features: ['All Features', 'Priority Support'],
      is_active: false, // Inactive plan for demonstration purposes
      currency: 'USD',
      interval: 'year',
      error: 'This plan is currently unavailable.',
    },
  ];
};

// Utility function to simulate updating a subscription (replace with actual API call)
const updateSubscription = async (
  userId: string,
  newSubscriptionId: string | null
): Promise<SubscriptionPlan | null> => {
  // Simulate an API call with a delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (newSubscriptionId === null) {
    return null; // Simulate unsubscribing
  }

  const plans = await fetchSubscriptionPlans();
  const newSubscription = plans.find((plan) => plan.id === newSubscriptionId);

  if (!newSubscription) {
    throw new Error(`Subscription plan with id ${newSubscriptionId} not found.`);
  }

  // Simulate updating the subscription in the backend
  console.log(`Subscription updated for user ${userId} to plan ${newSubscriptionId}`);
  return newSubscription;
};

// Custom Error Boundary Component (Fallback UI)
const DefaultErrorBoundary: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: Error, info: React.ErrorInfo) => {
      console.error('Caught an error: ', error, info);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <ErrorMessage>
        Oops! Something went wrong. Please try again later.
      </ErrorMessage>
    );
  }

  return <>{children}</>;
};

const SubscriptionManagement: FC<Props> = ({
  userId,
  initialSubscription,
  onSubscriptionChange,
  errorBoundary: ErrorBoundary = DefaultErrorBoundary,
  style,
  className,
  ariaLabel,
}) => {
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<SubscriptionPlan | null>(initialSubscription || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription plans on component mount
  useEffect(() => {
    const loadSubscriptionPlans = async () => {
      setIsLoading(true);
      try {
        const plans = await fetchSubscriptionPlans();
        setAvailablePlans(plans);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch subscription plans:', err);
        setError('Failed to load subscription plans. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscriptionPlans();
  }, []);

  // Function to handle subscription changes
  const handleSubscriptionChange = useCallback(
    async (newSubscriptionId: string | null) => {
      setIsLoading(true);
      try {
        const updatedSubscription = await updateSubscription(
          userId,
          newSubscriptionId
        );
        setCurrentSubscription(updatedSubscription);
        setError(null);

        if (onSubscriptionChange) {
          onSubscriptionChange(updatedSubscription);
        }
      } catch (err: any) {
        console.error('Failed to update subscription:', err);
        setError('Failed to update subscription. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [userId, onSubscriptionChange]
  );

  const handleUnsubscribe = useCallback(async () => {
    await handleSubscriptionChange(null);
  }, [handleSubscriptionChange]);

  const memoizedPlanList = useMemo(() => {
    return (
      <PlanList>
        {availablePlans.map((plan) => (
          <PlanItem key={plan.id}>
            {plan.name} - {plan.price} {plan.currency} / {plan.interval}
            {plan.error && <span>{plan.error}</span>}
            <PlanButton
              onClick={() => handleSubscriptionChange(plan.id)}
              disabled={isLoading || currentSubscription?.id === plan.id}
            >
              {currentSubscription?.id === plan.id ? 'Subscribed' : 'Subscribe'}
            </PlanButton>
          </PlanItem>
        ))}
      </PlanList>
    );
  }, [availablePlans, currentSubscription, isLoading, handleSubscriptionChange]);

  return (
    <SubscriptionContainer
      style={style}
      className={className}
      aria-label={ariaLabel || 'Subscription Management'}
    >
      <ErrorBoundary>
        <h2>Subscription Management</h2>
        {isLoading && <LoadingMessage>Loading subscription plans...</LoadingMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {!isLoading && !error && (
          <>
            {currentSubscription ? (
              <div>
                <p>
                  Current Subscription: {currentSubscription.name} ({currentSubscription.price} {currentSubscription.currency} / {currentSubscription.interval})
                </p>
                <PlanButton onClick={handleUnsubscribe} disabled={isLoading}>
                  Unsubscribe
                </PlanButton>
              </div>
            ) : (
              <p>You are not currently subscribed to any plan.</p>
            )}

            <h3>Available Plans:</h3>
            {memoizedPlanList}
          </>
        )}
      </ErrorBoundary>
    </SubscriptionContainer>
  );
};

export default SubscriptionManagement;

In this version, I've added an `error` property to the `SubscriptionPlan` interface to handle inactive plans. I've also added an error message for inactive plans in the rendered UI. Additionally, I've added a disabled state to the PlanButton when it's loading, and I've improved the accessibility of the component by adding aria-labels and proper use of the `key` prop in the PlanList.