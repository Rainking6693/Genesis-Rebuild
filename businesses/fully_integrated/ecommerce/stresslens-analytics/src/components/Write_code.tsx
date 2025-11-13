import React, { useEffect, useState } from 'react';
import localize from './localization'; // Assuming you have a localization module

interface Props {
  name: string;
}

const MyComponent: React.FC<Props> = ({ name }) => {
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) {
      setNameError('Name is required');
      return;
    }

    // Validate name for edge cases like special characters, empty spaces, etc.
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      setNameError('Name should only contain alphabets and spaces');
      return;
    }

    setNameError(null);
  }, [name]);

  useEffect(() => {
    if (error || nameError) {
      // Prevent the component from re-rendering unnecessarily when errors are present
      return;
    }

    setError(null);
  }, [error, nameError]);

  const greeting = localize('greeting'); // Assuming you have a 'greeting' key in your localization file

  return (
    <div className="text-center">
      {nameError && <p className="text-danger">{nameError}</p>}
      {error && <p className="text-danger">{error}</p>}
      <h1>{greeting} {name}!</h1>
    </div>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import localize from './localization'; // Assuming you have a localization module

interface Props {
  name: string;
}

const MyComponent: React.FC<Props> = ({ name }) => {
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) {
      setNameError('Name is required');
      return;
    }

    // Validate name for edge cases like special characters, empty spaces, etc.
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      setNameError('Name should only contain alphabets and spaces');
      return;
    }

    setNameError(null);
  }, [name]);

  useEffect(() => {
    if (error || nameError) {
      // Prevent the component from re-rendering unnecessarily when errors are present
      return;
    }

    setError(null);
  }, [error, nameError]);

  const greeting = localize('greeting'); // Assuming you have a 'greeting' key in your localization file

  return (
    <div className="text-center">
      {nameError && <p className="text-danger">{nameError}</p>}
      {error && <p className="text-danger">{error}</p>}
      <h1>{greeting} {name}!</h1>
    </div>
  );
};

export default MyComponent;