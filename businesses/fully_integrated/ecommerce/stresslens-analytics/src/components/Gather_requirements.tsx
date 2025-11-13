import React, { FC, useMemo, useState, createContext, useContext } from 'react';
import sanitizeHtml from 'sanitize-html';

// Create a context for managing the burnout risk
type MentalHealthContextData = {
  burnoutRisk: number;
  setBurnoutRisk: React.Dispatch<React.SetStateAction<number>>;
};
const MentalHealthContext = createContext<MentalHealthContextData>(
  {
    burnoutRisk: 0,
    setBurnoutRisk: () => {},
  } as MentalHealthContextData
);

// FunctionalComponent with improved resiliency, edge cases, accessibility, and maintainability
const FunctionalComponent: FC<{ message: string }> = ({ message }) => {
  // Sanitize user-generated content to prevent XSS attacks
  const sanitizedMessage = useMemo(() => sanitizeHtml(message, { allowedTags: [], allowedAttributes: {} }), [message]);

  // Optimize performance by memoizing the component if the message prop doesn't change
  const memoizedComponent = useMemo(() => <div className="stresslens-message" style={messageStyles}>{sanitizedMessage}</div>, [sanitizedMessage]);

  // Add a unique component name for better debugging and accessibility
  FunctionalComponent.displayName = 'StressLensAnalyticsMessage';

  // Add a context provider for burnout risk management
  const { burnoutRisk, setBurnoutRisk } = useContext(MentalHealthContext);

  // Add other component logic here

  return memoizedComponent;
};

// Export the FunctionalComponent and MentalHealthContext
export default FunctionalComponent;
export { MentalHealthContext, useMentalHealthContext };

// Define styles for the message component
const messageStyles = {
  // Add styles for better readability and accessibility
  color: '#333',
  fontSize: '16px',
  fontWeight: 'normal',
  lineHeight: '1.5',
  marginBottom: '1rem',
  userSelect: 'text', // Allow text selection for better accessibility
};

In this updated code, I've added a default value for the `MentalHealthContext` to handle cases where the context is not provided. I've also used the `useContext` hook to access the `burnoutRisk` and `setBurnoutRisk` values from the context. Additionally, I've memoized the component to optimize performance and added a `userSelect` style property for better accessibility.