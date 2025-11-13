import { FC, ReactNode } from 'react';
import { CarbonCredAIMessage } from './CarbonCredAIMessage'; // Assuming you have a CarbonCredAIMessage component for better encapsulation

interface Props {
  carbonCredAIMessage?: CarbonCredAIMessage | null; // Add nullable type to handle edge cases
  error?: string | null; // Add error prop to handle API errors
  isLoading?: boolean; // Add isLoading prop to handle loading state
  children?: ReactNode; // Add children prop for better component composition
}

const MyComponent: FC<Props> = ({ carbonCredAIMessage, error, isLoading, children }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <CarbonCredAIMessage severity="error">{error}</CarbonCredAIMessage>; // Use CarbonCredAIMessage for better encapsulation and accessibility
  }

  if (!carbonCredAIMessage) {
    return null; // Return null instead of an empty div to avoid unnecessary rendering
  }

  return children ? (
    <CarbonCredAIMessage>{children}</CarbonCredAIMessage> // Use CarbonCredAIMessage for better encapsulation and accessibility
  ) : (
    <CarbonCredAIMessage>{carbonCredAIMessage}</CarbonCredAIMessage> // Use CarbonCredAIMessage for better encapsulation and accessibility
  );
};

MyComponent.defaultProps = {
  carbonCredAIMessage: null,
  error: null,
  isLoading: false,
  children: null, // Add children default prop to allow for better component composition
};

export default MyComponent;

import { FC, ReactNode } from 'react';
import { CarbonCredAIMessage } from './CarbonCredAIMessage'; // Assuming you have a CarbonCredAIMessage component for better encapsulation

interface Props {
  carbonCredAIMessage?: CarbonCredAIMessage | null; // Add nullable type to handle edge cases
  error?: string | null; // Add error prop to handle API errors
  isLoading?: boolean; // Add isLoading prop to handle loading state
  children?: ReactNode; // Add children prop for better component composition
}

const MyComponent: FC<Props> = ({ carbonCredAIMessage, error, isLoading, children }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <CarbonCredAIMessage severity="error">{error}</CarbonCredAIMessage>; // Use CarbonCredAIMessage for better encapsulation and accessibility
  }

  if (!carbonCredAIMessage) {
    return null; // Return null instead of an empty div to avoid unnecessary rendering
  }

  return children ? (
    <CarbonCredAIMessage>{children}</CarbonCredAIMessage> // Use CarbonCredAIMessage for better encapsulation and accessibility
  ) : (
    <CarbonCredAIMessage>{carbonCredAIMessage}</CarbonCredAIMessage> // Use CarbonCredAIMessage for better encapsulation and accessibility
  );
};

MyComponent.defaultProps = {
  carbonCredAIMessage: null,
  error: null,
  isLoading: false,
  children: null, // Add children default prop to allow for better component composition
};

export default MyComponent;