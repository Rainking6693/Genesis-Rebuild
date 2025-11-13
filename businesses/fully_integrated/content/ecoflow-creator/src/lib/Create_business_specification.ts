import React, { FC, useContext, useState } from 'react';
import { ErrorContext } from './ErrorContext';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useContext(ErrorContext);
  const [validatedMessage, setValidatedMessage] = useState<string | null>(null);

  const handleMessageError = (error: Error) => {
    setError(error.message);
  };

  const validateMessage = (message: string) => {
    if (!message || message.includes('<script>')) {
      throw new Error('Invalid message');
    }
    return message;
  };

  try {
    const validatedMessageTemp = validateMessage(message);
    setValidatedMessage(validatedMessageTemp);
    return <div dangerouslySetInnerHTML={{ __html: validatedMessageTemp }} />;
  } catch (error) {
    handleMessageError(error);
    return null;
  }
};

MyComponent.defaultProps = {
  message: '',
};

// Create ErrorContext for error handling
const ErrorContext = React.createContext<React.Dispatch<React.SetStateAction<string>>>(() => {});

// Add a custom hook for fetching and validating ESG data
import { useFetch, FetchResult } from 'use-fetch';

const useESGData = () => {
  const [error, setError] = useContext(ErrorContext);
  const [validatedData, setValidatedData] = useState<FetchResult<any> | null>(null);

  const handleESGDataError = (error: Error) => {
    setError(error.message);
  };

  const validateESGData = (data: any) => {
    if (!data || !data.hasOwnProperty('carbonFootprint') || !data.hasOwnProperty('renewableEnergyUsage')) {
      throw new Error('Invalid ESG data');
    }
    return data;
  };

  const { data, error: fetchError, isLoading } = useFetch<FetchResult<any>>('https://api.ecoflowcreator.com/esg-data');

  try {
    if (data) {
      const validatedDataTemp = validateESGData(data.data);
      setValidatedData(validatedDataTemp);
    }
    return { validatedData, fetchError, isLoading };
  } catch (error) {
    handleESGDataError(error);
    return { validatedData: null, fetchError: error, isLoading: false };
  }
};

export { MyComponent, ErrorContext, useESGData };

import React, { FC, useContext, useState } from 'react';
import { ErrorContext } from './ErrorContext';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useContext(ErrorContext);
  const [validatedMessage, setValidatedMessage] = useState<string | null>(null);

  const handleMessageError = (error: Error) => {
    setError(error.message);
  };

  const validateMessage = (message: string) => {
    if (!message || message.includes('<script>')) {
      throw new Error('Invalid message');
    }
    return message;
  };

  try {
    const validatedMessageTemp = validateMessage(message);
    setValidatedMessage(validatedMessageTemp);
    return <div dangerouslySetInnerHTML={{ __html: validatedMessageTemp }} />;
  } catch (error) {
    handleMessageError(error);
    return null;
  }
};

MyComponent.defaultProps = {
  message: '',
};

// Create ErrorContext for error handling
const ErrorContext = React.createContext<React.Dispatch<React.SetStateAction<string>>>(() => {});

// Add a custom hook for fetching and validating ESG data
import { useFetch, FetchResult } from 'use-fetch';

const useESGData = () => {
  const [error, setError] = useContext(ErrorContext);
  const [validatedData, setValidatedData] = useState<FetchResult<any> | null>(null);

  const handleESGDataError = (error: Error) => {
    setError(error.message);
  };

  const validateESGData = (data: any) => {
    if (!data || !data.hasOwnProperty('carbonFootprint') || !data.hasOwnProperty('renewableEnergyUsage')) {
      throw new Error('Invalid ESG data');
    }
    return data;
  };

  const { data, error: fetchError, isLoading } = useFetch<FetchResult<any>>('https://api.ecoflowcreator.com/esg-data');

  try {
    if (data) {
      const validatedDataTemp = validateESGData(data.data);
      setValidatedData(validatedDataTemp);
    }
    return { validatedData, fetchError, isLoading };
  } catch (error) {
    handleESGDataError(error);
    return { validatedData: null, fetchError: error, isLoading: false };
  }
};

export { MyComponent, ErrorContext, useESGData };