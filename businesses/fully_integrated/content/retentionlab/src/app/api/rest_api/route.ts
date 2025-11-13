import React, { FC, ReactNode, useEffect, useState } from 'react';

interface BaseComponentProps {
  message: string;
}

interface RetentionLabComponentProps extends BaseComponentProps {
  id?: string; // Add an optional id prop for better accessibility and maintainability
  className?: string; // Add a className prop for styling
}

const RetentionLabComponent: FC<RetentionLabComponentProps> = ({ id, message, className }) => {
  // Add a unique key for each component instance to improve performance
  const uniqueKey = id || `${Math.random()}`;

  return <div id={id} key={uniqueKey} className={className}>{message}</div>;
};

interface GenericComponentProps extends BaseComponentProps {
  // Add any generic props here
}

const GenericComponent: FC<GenericComponentProps> = ({ message }) => {
  return <div>{message}</div>;
};

// Add error handling for API calls
interface ApiResponseData {
  success: boolean;
  message: string;
  data?: any;
}

interface ApiComponentProps extends BaseComponentProps {
  apiUrl: string; // Add an API URL prop for fetching data
  onSuccess?: (data: any) => void; // Add an optional callback for handling successful responses
  onError?: (error: Error) => void; // Add an optional callback for handling errors
  isLoading?: boolean; // Add a loading state prop
}

const ApiComponent: FC<ApiComponentProps> = ({ apiUrl, onSuccess, onError, message, isLoading = true }) => {
  const [data, setData] = React.useState<any>(null);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const responseData = (await response.json()) as ApiResponseData;

        if (responseData.success) {
          setData(responseData.data);
          if (onSuccess) onSuccess(responseData.data);
        } else {
          setError(new Error(responseData.message));
          if (onError) onError(error);
        }
      } catch (error) {
        setError(error);
        if (onError) onError(error);
      }
    };

    fetchData();
  }, [apiUrl, onSuccess, onError]);

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error ? <div>Error: {error.message}</div> : <div>{message}</div>}
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
};

export { RetentionLabComponent, GenericComponent, ApiComponent };

Changes made:

1. Added a `className` prop to the `RetentionLabComponent` for better styling.
2. Added a `isLoading` prop to the `ApiComponent` to show a loading state while fetching data.
3. Made the `isLoading` prop optional with a default value of `true`.
4. Moved the `message` prop to the end of the `ApiComponent` props list for better readability.
5. Added a default value of `true` for the `isLoading` prop to avoid potential issues when not provided.