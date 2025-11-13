import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  isError?: boolean;
}

const FunctionalComponent: React.FC<Props> = ({ message, isError = false }) => {
  const className = isError ? 'error-message' : 'message';

  return (
    <div className={className}>
      <span className="sr-only">{message}</span>
      {message}
    </div>
  );
};

export default FunctionalComponent;

// Add a custom error message style for accessibility
const errorMessageStyle = {
  color: 'red',
  fontWeight: 'bold',
};

// Add a custom message style for regular messages
const messageStyle = {
  fontSize: '1rem',
};

// Utilize a CSS-in-JS approach for styling
const getMessageClassName = (isError: boolean) =>
  isError ? 'error-message' : 'message';

const getMessageStyle = (isError: boolean) =>
  isError ? { ...errorMessageStyle, ...messageStyle } : messageStyle;

// Update the FunctionalComponent to use the new styles
const FunctionalComponent: React.FC<Props> = ({ message, isError = false }) => {
  const className = getMessageClassName(isError);
  const style = getMessageStyle(isError);

  return (
    <div className={className} style={style}>
      <span className="sr-only">{message}</span>
      {message}
    </div>
  );
};

export default FunctionalComponent;

In this updated code, I've added an `isError` prop to the component to handle error messages differently from regular messages. I've also added a screen reader-only text for accessibility. Additionally, I've extracted the styles for error messages and regular messages into separate variables and functions for better maintainability. Lastly, I've used a CSS-in-JS approach to style the messages.