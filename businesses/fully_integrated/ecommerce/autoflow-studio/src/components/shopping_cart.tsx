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
        // Fetch data from the server or API
        // Replace this with your actual data fetching logic
        const data = await fetch('https://api.example.com/cart');
        const json = await data.json();
        setMessage(json.message);
      } catch (error) {
        setError(true);
        setMessage(errorMessage || 'An error occurred while fetching the cart data.');
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading && <div>{loadingMessage || 'Loading...'}</div>}
      {error && <div role="alert">{errorMessage || 'An error occurred.'}</div>}
      {message && <div>{message}</div>}
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
        // Fetch data from the server or API
        // Replace this with your actual data fetching logic
        const data = await fetch('https://api.example.com/cart');
        const json = await data.json();
        setMessage(json.message);
      } catch (error) {
        setError(true);
        setMessage(errorMessage || 'An error occurred while fetching the cart data.');
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading && <div>{loadingMessage || 'Loading...'}</div>}
      {error && <div role="alert">{errorMessage || 'An error occurred.'}</div>}
      {message && <div>{message}</div>}
    </div>
  );
};

ShoppingCart.defaultProps = {
  initialMessage: '',
  errorMessage: '',
  loadingMessage: '',
};

export default ShoppingCart;