import React, { useState, useEffect } from 'react';
import { Stripe, StripeElementsOptions } from '@stripe/stripe-js';
import axios from 'axios';

interface Props {
  stripeKey: string;
  options?: StripeElementsOptions;
  children: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ stripeKey, options, children }) => {
  const [apiKeyLoaded, setApiKeyLoaded] = useState(false);
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);

  useEffect(() => {
    if (!stripeKey) {
      throw new Error('Stripe key is required');
    }

    const stripe = new Stripe(stripeKey);
    setStripeInstance(stripe);
    setApiKeyLoaded(true);

    return () => {
      stripe.close();
    };
  }, [stripeKey]);

  if (!apiKeyLoaded) {
    return null;
  }

  return (
    <Elements options={options} stripe={stripeInstance}>
      {children}
    </Elements>
  );
};

interface MoodTrackerProps {
  onRecommendationReceived: (recommendation: string) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ onRecommendationReceived }) => {
  const [mood, setMood] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/wellness', { mood });
      onRecommendationReceived(response.data.recommendation);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="mood">How are you feeling today?</label>
      <input
        type="text"
        id="mood"
        value={mood}
        onChange={(event) => setMood(event.target.value)}
        aria-label="Enter your mood"
        required
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

// Combine Stripe billing and MoodTracker components
const MindShiftPro: React.FC = () => {
  const [stripeKey, setStripeKey] = useState('');
  const [options, setOptions] = useState<StripeElementsOptions>({});

  const handleStripeKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStripeKey(event.target.value);
  };

  const handleOptionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOptions({ [event.target.name]: event.target.value });
  };

  return (
    <>
      <h1>MindShift Pro</h1>
      <label htmlFor="stripeKey">Stripe API Key:</label>
      <input
        type="text"
        id="stripeKey"
        value={stripeKey}
        onChange={handleStripeKeyChange}
        aria-label="Enter your Stripe API key"
        required
      />
      <label htmlFor="options">Options:</label>
      <input
        type="text"
        id="options"
        name="publishableKey"
        value={options.publishableKey || ''}
        onChange={handleOptionsChange}
        aria-label="Enter Stripe publishable key options"
      />
      <MyComponent stripeKey={stripeKey} options={options}>
        <MoodTracker onRecommendationReceived={(recommendation) => console.log(recommendation)} />
      </MyComponent>
    </>
  );
};

export default MindShiftPro;

Changes made:

1. Created a `stripeInstance` state to store the Stripe object and close it when the component unmounts.
2. Added a `isSubmitting` state to MoodTracker to disable the form during submission.
3. Updated the MoodTracker's handleSubmit function to set `isSubmitting` to true before making the API call, and set it back to false after the API call or an error.
4. Added a `disabled` attribute to the submit button to disable it during submission.
5. Updated the MyComponent to accept and use the `StripeElementsOptions` type for the options prop.