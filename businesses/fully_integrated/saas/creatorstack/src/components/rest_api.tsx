import React, { FC, useEffect, useState } from 'react';

interface Props {
  apiUrl: string;
  fallbackMessage?: string;
  loadingMessage?: string;
  errorMessage?: string;
  successMessage?: string;
  accessibilityLabel?: string;
}

const MyComponent: FC<Props> = ({
  apiUrl,
  fallbackMessage = 'Loading...',
  loadingMessage = 'Fetching data...',
  errorMessage = 'An error occurred while fetching the data.',
  successMessage = 'Data fetched successfully.',
  accessibilityLabel = 'MyComponent',
}) => {
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        setData(data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  if (error) {
    return (
      <div role="alert">
        <p>{errorMessage}</p>
        <details>
          <summary>Show details</summary>
          <pre>{error.message}</pre>
        </details>
      </div>
    );
  }

  if (isLoading) {
    return <div>{loadingMessage}</div>;
  }

  if (!data) {
    return <div>{fallbackMessage}</div>;
  }

  return (
    <div>
      <h2>{successMessage}</h2>
      <div
        dangerouslySetInnerHTML={{ __html: data }}
        aria-label={accessibilityLabel}
      />
    </div>
  );
};

export default MyComponent;

Changes made:

1. Added errorMessage, successMessage, and accessibilityLabel props for better customization.
2. Added role="alert" to the error component for better accessibility.
3. Added a details element with a summary to show the error details when clicked.
4. Added an aria-label to the dangerouslySetInnerHTML component for better accessibility.
5. Moved the setIsLoading(true) call before the try-catch block to ensure it's set before any potential errors occur.
6. Added a h2 element to display the success message.