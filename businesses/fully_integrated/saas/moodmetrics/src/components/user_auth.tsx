import React, { FC, useContext, useState } from 'react';
import { UserAuthContext } from './UserAuthContext';
import classnames from 'classnames';
import styles from './UserAuth.module.css';

interface Props {
  id: string;
  label: string;
}

interface Error {
  message: string;
}

const MyComponent: FC<Props> = ({ id, label }) => {
  const { user, setUser, errors, setErrors } = useContext(UserAuthContext);
  const [inputValue, setInputValue] = useState(user?.[id] || '');
  const [error, setError] = useState<Error | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setError(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Perform validation and authentication logic here
    // For example, you can use a library like Joi for validation
    // If validation passes, update the user state and clear errors
    // If validation fails, set the appropriate error message
  };

  const errorMessage = error ? <p className={styles.error}>{error.message}</p> : null;

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={inputValue}
        onChange={handleChange}
        className={classnames(styles.input, { [styles.error]: error })}
      />
      {errorMessage}
    </form>
  );
};

export default MyComponent;

import React, { FC, useContext, useState } from 'react';
import { UserAuthContext } from './UserAuthContext';
import classnames from 'classnames';
import styles from './UserAuth.module.css';

interface Props {
  id: string;
  label: string;
}

interface Error {
  message: string;
}

const MyComponent: FC<Props> = ({ id, label }) => {
  const { user, setUser, errors, setErrors } = useContext(UserAuthContext);
  const [inputValue, setInputValue] = useState(user?.[id] || '');
  const [error, setError] = useState<Error | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setError(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Perform validation and authentication logic here
    // For example, you can use a library like Joi for validation
    // If validation passes, update the user state and clear errors
    // If validation fails, set the appropriate error message
  };

  const errorMessage = error ? <p className={styles.error}>{error.message}</p> : null;

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={inputValue}
        onChange={handleChange}
        className={classnames(styles.input, { [styles.error]: error })}
      />
      {errorMessage}
    </form>
  );
};

export default MyComponent;