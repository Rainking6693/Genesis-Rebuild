import React, { useState, useEffect, useRef } from 'react';
import { StripeProvider, Elements, CardElement, useStripe, useElements } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';

interface OffsetPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  carbonOffset: number;
}

interface Props {
  apiKey: string; // Stripe API key
  carbonFootprint: number; // Carbon footprint of the business
  offsetPackages: OffsetPackage[]; // Array of available carbon offset packages
}

const CarbonFlowCheckout: React.FC<Props> = ({ apiKey, carbonFootprint, offsetPackages }) => {
  const [loading, setLoading] = useState(true);
  const [selectedOffsetPackage, setSelectedOffsetPackage] = useState<OffsetPackage | null>(null);
  const [error, setError] = useState('');
  const stripeRef = useRef<any>(null);

  useEffect(() => {
    if (stripeRef.current) {
      stripeRef.current.clearQueue();
    }

    if (stripe && elements) {
      // Validate card element when it changes
      const handleChange = (event: any) => {
        if (event.empty) {
          setError('Your card was removed.');
        } else {
          setError('');
        }
      };

      elements.getElement(CardElement).addEventListener('change', handleChange);

      return () => {
        elements.getElement(CardElement).removeEventListener('change', handleChange);
      };
    }

    if (stripeRef.current) {
      stripeRef.current.update();
    }

    setLoading(false);
  }, [stripe, elements]);

  useEffect(() => {
    return () => {
      if (stripeRef.current) {
        stripeRef.current.clearQueue();
      }
    };
  }, []);

  const handleOffsetPackageChange = (packageId: string) => {
    const selectedPackage = offsetPackages.find((p) => p.id === packageId);
    setSelectedOffsetPackage(selectedPackage);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || !selectedOffsetPackage) return;

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) return;

    const { error } = await stripe.createToken(cardElement);

    if (error) {
      handleError(error);
    } else {
      // Send the token to your server and process the payment
    }
  };

  const handleError = (error: any) => {
    setError(error.message);
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!apiKey) {
    return <div>Missing Stripe API key</div>;
  }

  if (!offsetPackages || offsetPackages.length === 0) {
    return <div>No carbon offset packages available</div>;
  }

  return (
    <StripeProvider apiKey={apiKey} ref={stripeRef}>
      <form onSubmit={handleSubmit}>
        <Elements>
          <CheckoutForm
            carbonFootprint={carbonFootprint}
            offsetPackages={offsetPackages}
            selectedOffsetPackage={selectedOffsetPackage}
            onOffsetPackageChange={handleOffsetPackageChange}
          />
          <div className="form-row">
            <CardElement className="form-control" aria-label="Card element" />
            {error && <div className="error" aria-live="polite">{error}</div>}
            <button className="btn btn-primary" type="submit" disabled={!stripe || !selectedOffsetPackage}>
              Pay
            </button>
          </div>
        </Elements>
      </form>
    </StripeProvider>
  );
};

export default CarbonFlowCheckout;

// In the CheckoutForm component
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { CardNumberElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  carbonFootprint: number;
  offsetPackages: OffsetPackage[];
  selectedOffsetPackage: OffsetPackage | null;
  onOffsetPackageChange: (packageId: string) => void;
}

interface CheckoutFormRef {
  focus: () => void;
}

const CheckoutForm: React.ForwardRefRenderFunction<CheckoutFormRef, CheckoutFormProps> = (
  { carbonFootprint, offsetPackages, selectedOffsetPackage, onOffsetPackageChange },
  ref
) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardNumber, setCardNumber] = useState('');

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (elements && elements.getElement(CardNumberElement)) {
        elements.getElement(CardNumberElement).focus();
      }
    },
  }));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(event.target.value);
  };

  const handleBlur = async () => {
    if (stripe && cardNumber.length >= 16) {
      const validity = await stripe.validateCardNumber(cardNumber);
      if (!validity.complete) {
        setCardNumber('');
      }
    }
  };

  return (
    <div>
      <label htmlFor="offset-package">Select a carbon offset package:</label>
      <select
        id="offset-package"
        value={selectedOffsetPackage ? selectedOffsetPackage.id : ''}
        onChange={(event) => onOffsetPackageChange(event.target.value)}
      >
        <option value="">Select a package</option>
        {offsetPackages.map((package_) => (
          <option key={package_.id} value={package_.id}>
            {package_.name} - {package_.description} - ${package_.price}
          </option>
        ))}
      </select>
      <CardNumberElement
        id="card-number"
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus
        minLength={16}
        className="form-control"
        aria-label="Card number input"
      />
    </div>
  );
};

export default forwardRef(CheckoutForm);

import React, { useState, useEffect, useRef } from 'react';
import { StripeProvider, Elements, CardElement, useStripe, useElements } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';

interface OffsetPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  carbonOffset: number;
}

interface Props {
  apiKey: string; // Stripe API key
  carbonFootprint: number; // Carbon footprint of the business
  offsetPackages: OffsetPackage[]; // Array of available carbon offset packages
}

const CarbonFlowCheckout: React.FC<Props> = ({ apiKey, carbonFootprint, offsetPackages }) => {
  const [loading, setLoading] = useState(true);
  const [selectedOffsetPackage, setSelectedOffsetPackage] = useState<OffsetPackage | null>(null);
  const [error, setError] = useState('');
  const stripeRef = useRef<any>(null);

  useEffect(() => {
    if (stripeRef.current) {
      stripeRef.current.clearQueue();
    }

    if (stripe && elements) {
      // Validate card element when it changes
      const handleChange = (event: any) => {
        if (event.empty) {
          setError('Your card was removed.');
        } else {
          setError('');
        }
      };

      elements.getElement(CardElement).addEventListener('change', handleChange);

      return () => {
        elements.getElement(CardElement).removeEventListener('change', handleChange);
      };
    }

    if (stripeRef.current) {
      stripeRef.current.update();
    }

    setLoading(false);
  }, [stripe, elements]);

  useEffect(() => {
    return () => {
      if (stripeRef.current) {
        stripeRef.current.clearQueue();
      }
    };
  }, []);

  const handleOffsetPackageChange = (packageId: string) => {
    const selectedPackage = offsetPackages.find((p) => p.id === packageId);
    setSelectedOffsetPackage(selectedPackage);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || !selectedOffsetPackage) return;

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) return;

    const { error } = await stripe.createToken(cardElement);

    if (error) {
      handleError(error);
    } else {
      // Send the token to your server and process the payment
    }
  };

  const handleError = (error: any) => {
    setError(error.message);
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!apiKey) {
    return <div>Missing Stripe API key</div>;
  }

  if (!offsetPackages || offsetPackages.length === 0) {
    return <div>No carbon offset packages available</div>;
  }

  return (
    <StripeProvider apiKey={apiKey} ref={stripeRef}>
      <form onSubmit={handleSubmit}>
        <Elements>
          <CheckoutForm
            carbonFootprint={carbonFootprint}
            offsetPackages={offsetPackages}
            selectedOffsetPackage={selectedOffsetPackage}
            onOffsetPackageChange={handleOffsetPackageChange}
          />
          <div className="form-row">
            <CardElement className="form-control" aria-label="Card element" />
            {error && <div className="error" aria-live="polite">{error}</div>}
            <button className="btn btn-primary" type="submit" disabled={!stripe || !selectedOffsetPackage}>
              Pay
            </button>
          </div>
        </Elements>
      </form>
    </StripeProvider>
  );
};

export default CarbonFlowCheckout;

// In the CheckoutForm component
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { CardNumberElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  carbonFootprint: number;
  offsetPackages: OffsetPackage[];
  selectedOffsetPackage: OffsetPackage | null;
  onOffsetPackageChange: (packageId: string) => void;
}

interface CheckoutFormRef {
  focus: () => void;
}

const CheckoutForm: React.ForwardRefRenderFunction<CheckoutFormRef, CheckoutFormProps> = (
  { carbonFootprint, offsetPackages, selectedOffsetPackage, onOffsetPackageChange },
  ref
) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardNumber, setCardNumber] = useState('');

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (elements && elements.getElement(CardNumberElement)) {
        elements.getElement(CardNumberElement).focus();
      }
    },
  }));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(event.target.value);
  };

  const handleBlur = async () => {
    if (stripe && cardNumber.length >= 16) {
      const validity = await stripe.validateCardNumber(cardNumber);
      if (!validity.complete) {
        setCardNumber('');
      }
    }
  };

  return (
    <div>
      <label htmlFor="offset-package">Select a carbon offset package:</label>
      <select
        id="offset-package"
        value={selectedOffsetPackage ? selectedOffsetPackage.id : ''}
        onChange={(event) => onOffsetPackageChange(event.target.value)}
      >
        <option value="">Select a package</option>
        {offsetPackages.map((package_) => (
          <option key={package_.id} value={package_.id}>
            {package_.name} - {package_.description} - ${package_.price}
          </option>
        ))}
      </select>
      <CardNumberElement
        id="card-number"
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus
        minLength={16}
        className="form-control"
        aria-label="Card number input"
      />
    </div>
  );
};

export default forwardRef(CheckoutForm);