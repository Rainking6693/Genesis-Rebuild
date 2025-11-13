import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

declare global {
  interface Window {
    stripe: any;
  }
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

interface CheckoutProps {
  clientSecret: string;
}

const Checkout: React.FC<CheckoutProps> = ({ clientSecret }) => {
  const [stripeApi, setStripeApi] = useState<any>(null);

  useEffect(() => {
    if (!stripePromise) return;

    stripePromise.then((stripeInstance) => {
      setStripeApi(stripeInstance);
    });
  }, []);

  if (!stripeApi) {
    return <div>Loading Stripe...</div>;
  }

  return (
    <Elements stripe={stripeApi}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
};

export default Checkout;

// CheckoutForm.tsx

import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Form, FormikProvider, Field } from 'formik';
import { Button } from '@material-ui/core';

interface CheckoutFormValues {
  email: string;
}

const validationSchema = yup.object({
  email: yup.string().email().required(),
});

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const formik = useFormik<CheckoutFormValues>({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values, { setErrors }) => {
      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(
        formik.values.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
          email: values.email,
        }
      );

      if (result.error) {
        setErrors({ paymentError: result.error.message });
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // Handle successful payment
        }
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off">
        <label htmlFor="email">Email</label>
        <Field name="email" type="email" />
        {formik.errors.email && formik.touched.email ? (
          <div>{formik.errors.email}</div>
        ) : null}
        <CardElement />
        {formik.errors.paymentError && (
          <div style={{ color: 'red' }}>{formik.errors.paymentError}</div>
        )}
        <Button type="submit" disabled={!stripe || !formik.isValid || formik.isSubmitting}>
          Pay
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default CheckoutForm;

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

declare global {
  interface Window {
    stripe: any;
  }
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

interface CheckoutProps {
  clientSecret: string;
}

const Checkout: React.FC<CheckoutProps> = ({ clientSecret }) => {
  const [stripeApi, setStripeApi] = useState<any>(null);

  useEffect(() => {
    if (!stripePromise) return;

    stripePromise.then((stripeInstance) => {
      setStripeApi(stripeInstance);
    });
  }, []);

  if (!stripeApi) {
    return <div>Loading Stripe...</div>;
  }

  return (
    <Elements stripe={stripeApi}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
};

export default Checkout;

// CheckoutForm.tsx

import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Form, FormikProvider, Field } from 'formik';
import { Button } from '@material-ui/core';

interface CheckoutFormValues {
  email: string;
}

const validationSchema = yup.object({
  email: yup.string().email().required(),
});

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const formik = useFormik<CheckoutFormValues>({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values, { setErrors }) => {
      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(
        formik.values.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
          email: values.email,
        }
      );

      if (result.error) {
        setErrors({ paymentError: result.error.message });
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // Handle successful payment
        }
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off">
        <label htmlFor="email">Email</label>
        <Field name="email" type="email" />
        {formik.errors.email && formik.touched.email ? (
          <div>{formik.errors.email}</div>
        ) : null}
        <CardElement />
        {formik.errors.paymentError && (
          <div style={{ color: 'red' }}>{formik.errors.paymentError}</div>
        )}
        <Button type="submit" disabled={!stripe || !formik.isValid || formik.isSubmitting}>
          Pay
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default CheckoutForm;