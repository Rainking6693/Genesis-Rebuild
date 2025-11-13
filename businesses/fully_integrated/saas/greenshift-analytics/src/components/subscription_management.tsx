import React, { FC, ReactNode, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

interface Props {
  message: string;
  className?: string;
  loading?: boolean;
  error?: Error;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

interface State {
  message: string;
}

const SubscriptionManagement: FC<Props> = ({
  message,
  className,
  loading = false,
  error,
  onLoad,
  onError,
  ...rest
}) => {
  const [state, setState] = useState<State>({ message });

  useEffect(() => {
    if (message !== state.message) {
      setState((prevState) => ({ ...prevState, message }));
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      onError?.(error);
    }

    if (!error && onLoad) {
      onLoad();
    }
  }, [error, onLoad]);

  const subscriptionManagementClasses = classnames('subscription-management-message', className, {
    'loading': loading,
    'error': Boolean(error),
  });

  return (
    <div data-testid="subscription-management" className={subscriptionManagementClasses} {...rest}>
      {loading && <span>Loading...</span>}
      {error && (
        <>
          <span className="visually-hidden">Error:</span>
          <span>{error.message}</span>
        </>
      )}
      {state.message}
    </div>
  );
};

SubscriptionManagement.displayName = 'SubscriptionManagement';

SubscriptionManagement.defaultProps = {
  message: 'Welcome to GreenShift Analytics Subscription Management',
};

SubscriptionManagement.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.instanceOf(Error),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

export default SubscriptionManagement;

This updated version of the SubscriptionManagement component is more resilient, handles edge cases, is more accessible, and is more maintainable. It now supports asynchronous data, error handling, and custom callbacks for load and error events. Additionally, it uses TypeScript interfaces for props and states to improve type safety.