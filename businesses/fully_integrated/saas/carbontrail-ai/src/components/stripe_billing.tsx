import React, { FC, useState } from 'react';
import axios from 'axios';

interface Props {
  message: string;
}

interface StripeError {
  message: string;
}

interface StripeChargeResponse {
  success: boolean;
  error?: StripeError;
}

interface StripeToken {
  id: string;
  card: {
    brand: string;
    last4: string;
  };
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<StripeError | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStripeBilling = async (amount: number, token: StripeToken) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.post('/api/stripe/charge', { amount, token });
      if (response.data.success) {
        // Handle successful charge
        setLoading(false);
      } else if (response.data.error) {
        setError(response.data.error);
        setLoading(false);
      } else {
        setError({ message: 'An unexpected error occurred.' });
        setLoading(false);
      }
    } catch (error) {
      setError({ message: 'Network error. Please try again later.' });
      setLoading(false);
    }
  };

  return (
    <div>
      {message}
      {error && <div role="alert" aria-live="assertive">{error.message}</div>}
      <button disabled={loading} onClick={() => handleStripeBilling({ amount: 100, id: 'token_id', card: { brand: 'Visa', last4: '1234' } })}>
        {loading ? 'Charging...' : 'Charge'}
      </button>
    </div>
  );
};

MyComponent.handleStripeBilling = handleStripeBilling;

export default MyComponent;

// Added a loading state to prevent multiple requests and display a loading message
// Added aria-live="assertive" to the error message to announce the error to screen readers
// Disabled the button while charging to prevent multiple clicks

import React, { FC, useState } from 'react';
import axios from 'axios';

interface Props {
  message: string;
}

interface StripeError {
  message: string;
}

interface StripeChargeResponse {
  success: boolean;
  error?: StripeError;
}

interface StripeToken {
  id: string;
  card: {
    brand: string;
    last4: string;
  };
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<StripeError | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStripeBilling = async (amount: number, token: StripeToken) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.post('/api/stripe/charge', { amount, token });
      if (response.data.success) {
        // Handle successful charge
        setLoading(false);
      } else if (response.data.error) {
        setError(response.data.error);
        setLoading(false);
      } else {
        setError({ message: 'An unexpected error occurred.' });
        setLoading(false);
      }
    } catch (error) {
      setError({ message: 'Network error. Please try again later.' });
      setLoading(false);
    }
  };

  return (
    <div>
      {message}
      {error && <div role="alert" aria-live="assertive">{error.message}</div>}
      <button disabled={loading} onClick={() => handleStripeBilling({ amount: 100, id: 'token_id', card: { brand: 'Visa', last4: '1234' } })}>
        {loading ? 'Charging...' : 'Charge'}
      </button>
    </div>
  );
};

MyComponent.handleStripeBilling = handleStripeBilling;

export default MyComponent;

// Added a loading state to prevent multiple requests and display a loading message
// Added aria-live="assertive" to the error message to announce the error to screen readers
// Disabled the button while charging to prevent multiple clicks