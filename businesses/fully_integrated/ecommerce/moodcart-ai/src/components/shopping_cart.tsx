import React, { useState, useEffect } from 'react';

interface Props {
  initialMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
}

const ShoppingCart: React.FC<Props> = ({ initialMessage, errorMessage, loadingMessage }) => {
  const [message, setMessage] = useState(initialMessage || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch data from the server or local storage
        const data = await fetchDataFromSource();
        setMessage(data.message);
      } catch (error) {
        setError(true);
        setMessage(errorMessage || 'An error occurred while loading the cart.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClick = () => {
    // Handle click event, e.g., navigating to the checkout page
    navigateToCheckout();
  };

  return (
    <div role="region" aria-labelledby="shopping-cart-title" className="shopping-cart">
      {isLoading && <div className="loading">{loadingMessage || 'Loading...'}</div>}
      {error && <div className="error">{errorMessage || 'An error occurred while loading the cart.'}</div>}
      <h2 id="shopping-cart-title">Shopping Cart</h2>
      <div className="message">{message}</div>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Checkout'}
      </button>
    </div>
  );
};

ShoppingCart.defaultProps = {
  initialMessage: '',
  errorMessage: '',
  loadingMessage: '',
};

export default ShoppingCart;

import React, { useState, useEffect } from 'react';

interface Props {
  initialMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
}

const ShoppingCart: React.FC<Props> = ({ initialMessage, errorMessage, loadingMessage }) => {
  const [message, setMessage] = useState(initialMessage || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch data from the server or local storage
        const data = await fetchDataFromSource();
        setMessage(data.message);
      } catch (error) {
        setError(true);
        setMessage(errorMessage || 'An error occurred while loading the cart.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClick = () => {
    // Handle click event, e.g., navigating to the checkout page
    navigateToCheckout();
  };

  return (
    <div role="region" aria-labelledby="shopping-cart-title" className="shopping-cart">
      {isLoading && <div className="loading">{loadingMessage || 'Loading...'}</div>}
      {error && <div className="error">{errorMessage || 'An error occurred while loading the cart.'}</div>}
      <h2 id="shopping-cart-title">Shopping Cart</h2>
      <div className="message">{message}</div>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Checkout'}
      </button>
    </div>
  );
};

ShoppingCart.defaultProps = {
  initialMessage: '',
  errorMessage: '',
  loadingMessage: '',
};

export default ShoppingCart;