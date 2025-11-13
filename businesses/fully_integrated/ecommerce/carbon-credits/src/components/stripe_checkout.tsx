import React, { useEffect, useState } from 'react';
import { StripeProvider, Elements, ElementsProps, Loader, StripeElement, CardElement } from 'react-stripe-elements';

interface CarbonCreditsCheckoutProps extends ElementsProps {
  apiKey: string; // Stripe API key
  carbonCreditsSubscriptionId: string; // Unique identifier for the carbon credits subscription
  businessName: string; // Name of the business
}

const CarbonCreditsCheckout: React.FC<CarbonCreditsCheckoutProps> = ({ apiKey, carbonCreditsSubscriptionId, businessName, ...stripeOptions }) => {
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    if (!stripeLoaded && stripeOptions.stripeApiVersion) {
      const newStripe = Stripe(apiKey);
      setStripe(newStripe);
      setStripeLoaded(true);
    }
  }, [stripeLoaded, apiKey, stripeOptions.stripeApiVersion]);

  if (!stripeLoaded) {
    return <Loader />;
  }

  return (
    <StripeProvider apiKey={apiKey}>
      <Elements {...stripeOptions}>
        <CheckoutForm carbonCreditsSubscriptionId={carbonCreditsSubscriptionId} businessName={businessName} stripe={stripe} />
      </Elements>
    </StripeProvider>
  );
};

interface CheckoutFormProps extends Omit<CarbonCreditsCheckoutProps, 'apiKey'> {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ carbonCreditsSubscriptionId, businessName, onSubmit, stripe }) => {
  const [cardError, setCardError] = useState<string | null>(null);
  const [cardElement, setCardElement] = useState<CardElement | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !cardElement) {
      return;
    }

    const result = await stripe.createToken(cardElement);

    if (result.error) {
      setCardError(result.error.message);
    } else {
      // Send the token to your server and create the subscription
      onSubmit(event);
    }
  };

  const handleChange = (event: any) => {
    setCardError(event.error ? event.error.message : null);
    setCardElement(event.element);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="card-element">
        Credit card
      </label>
      <StripeElement id="card-element" element={<CardElement onChange={handleChange} />} />
      {cardError && <div style={{ color: 'red' }}>{cardError}</div>}
      <button type="submit" disabled={!stripe || !cardElement}>
        Subscribe
      </button>
    </form>
  );
};

export default CarbonCreditsCheckout;

In this updated code, I've added state to manage the Stripe instance and the CardElement, and I've moved the Stripe initialization to the useEffect hook. I've also added an onChange event handler for the CardElement to handle changes and update the cardError state accordingly. Additionally, I've added a check to ensure that both stripe and cardElement are present before attempting to create the token. This should help improve the resiliency and edge cases of your component. Lastly, I've made the component more accessible by adding labels for form elements and improved maintainability by separating the CheckoutForm into a separate component.