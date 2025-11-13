import React, { FC, useEffect, useState } from 'react';

interface Props {
  businessName: string; // Update the prop name to reflect the business context
}

const MyComponent: FC<Props> = ({ businessName }) => {
  const [loading, setLoading] = useState(true);
  const [billingStatus, setBillingStatus] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Checking billing status...');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    handleStripeBilling(businessName);
  }, [businessName]);

  const handleStripeBilling = async (businessName: string) => {
    try {
      setLoading(true);
      setLoadingMessage('Checking billing status...');
      setHasError(false);

      const response = await axios.get(`/api/stripe/billing/${businessName}`);

      if (response.data && response.data.status) {
        setBillingStatus(response.data.status);
      } else {
        setHasError(true);
        setErrorMessage('An error occurred while fetching the billing status.');
      }
    } catch (error) {
      console.error('Error fetching billing status:', error);
      setHasError(true);
      setErrorMessage('An error occurred while fetching the billing status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 key={businessName}>Welcome to EcoTrace AI, {businessName}!</h1>
      {loading && <p>{loadingMessage}</p>}
      {hasError && <p>{errorMessage}</p>}
      {!loading && billingStatus && <p>Your billing status: {billingStatus}</p>}
    </div>
  );
};

export { MyComponent };

This updated component will now display the billing status, handle errors, and provide a better user experience.