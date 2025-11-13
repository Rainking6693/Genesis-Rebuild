import React, { FC, ReactNode } from 'react';

/**
 * Usage Analytics component for CarbonCred SaaS platform.
 * Displays a greeting message to the user based on the provided name.
 * This component handles edge cases, improves accessibility, and enhances maintainability.
 */

type Greeting = 'Hello' | 'Hi' | 'Greetings';

interface Props {
  // Update the name prop type to accept any valid ReactNode
  // Add a default value for the name prop to handle cases where it's not provided
  name?: ReactNode;
  // Add a prop for the greeting message to allow customization
  greeting?: Greeting;
}

// Use React.FC for functional components with props
const UsageAnalytics: FC<Props> = ({ name = 'User', greeting = 'Hello' }: Props) => {
  // Add a check to ensure the name is not null or undefined before rendering
  if (!name) return null;

  // Check if the greeting prop is valid
  if (!['Hello', 'Hi', 'Greetings'].includes(greeting)) {
    console.warn(`Invalid greeting prop "${greeting}". Using default value "Hello"`);
    greeting = 'Hello';
  }

  // Use a span with aria-label to improve accessibility
  return (
    <h1>
      {greeting}, <span aria-label={`Greeting for ${name}`}>{name}</span>!
    </h1>
  );
};

// Export the component
export default UsageAnalytics;

In this updated version, I've added a type for the greeting prop to ensure it's one of the predefined greetings. I've also added a check to ensure the greeting prop is valid, and if it's not, it will use the default value 'Hello'. This helps maintain the consistency of the greeting message. Additionally, I've added a check to ensure the name prop is not null or undefined before rendering to avoid potential errors.