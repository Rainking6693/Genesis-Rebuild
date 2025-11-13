import React, { FC, useEffect, useState } from 'react';

interface Props {
  name: string;
  onError?: (error: Error) => void;
}

const MyComponent: FC<Props> = ({ name, onError }) => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the REST API
        // Replace this with your actual API call
        const response = await fetch('https://api.example.com/user');
        const data = await response.json();
        setMessage(`Hello, ${data.name}!`);
      } catch (error) {
        if (onError) {
          onError(error);
        }
      }
    };

    fetchData();
  }, []);

  if (message === null) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{message}</h1>
      {/* Add ARIA attributes for accessibility */}
      <p role="alert" aria-live="polite">
        {message}
      </p>
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';

interface Props {
  name: string;
  onError?: (error: Error) => void;
}

const MyComponent: FC<Props> = ({ name, onError }) => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the REST API
        // Replace this with your actual API call
        const response = await fetch('https://api.example.com/user');
        const data = await response.json();
        setMessage(`Hello, ${data.name}!`);
      } catch (error) {
        if (onError) {
          onError(error);
        }
      }
    };

    fetchData();
  }, []);

  if (message === null) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{message}</h1>
      {/* Add ARIA attributes for accessibility */}
      <p role="alert" aria-live="polite">
        {message}
      </p>
    </div>
  );
};

export default MyComponent;