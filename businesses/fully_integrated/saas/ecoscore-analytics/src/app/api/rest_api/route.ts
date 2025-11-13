import React, { FC, useState, useEffect, useContext } from 'react';
import propTypes from 'prop-types';
import { API_ENDPOINT } from './constants';
import { ErrorContext } from './ErrorContext';

interface Props {
  message: string;
}

interface ErrorContextData {
  error: Error | null;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [data, setData] = useState<any>(null);
  const { setError } = useContext(ErrorContext);

  useEffect(() => {
    const fetchData = async () => {
      let error: Error | null = null;

      try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
          error = new Error(`HTTP error! status: ${response.status}`);
        }

        if (!error) {
          const data = await response.json();
          setData(data);
          setError(null);
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <button onClick={() => fetchData()}>Fetch Data</button>
      {data && <div>{data.message}</div>}
      {!data && !setError && <div>{message}</div>}
      {setError && <div>An error occurred: {setError.message}</div>}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: propTypes.string.isRequired,
};

// Create ErrorContext
const ErrorContextDefaultValue: ErrorContextData = {
  error: null,
};

export const ErrorContextProvider = React.createContext<ErrorContextData>(ErrorContextDefaultValue);

// Wrap MyComponent with ErrorContextProvider
export const WrappedMyComponent = () => (
  <ErrorContextProvider>
    <MyComponent />
  </ErrorContextProvider>
);

export { MyComponent };

In this version, I've created an `ErrorContext` to handle errors more gracefully and provide a better user experience. The `ErrorContextProvider` wraps the `MyComponent` to make the error context available to it.

I've also added a check for the `setError` state to ensure that the message is only rendered when there's no data and no error. When an error occurs, the error message is displayed instead.

Lastly, I've wrapped the `MyComponent` with the `ErrorContextProvider` to improve maintainability and make it easier to handle errors across multiple components.