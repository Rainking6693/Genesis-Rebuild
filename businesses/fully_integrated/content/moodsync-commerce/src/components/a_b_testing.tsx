import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { ABTester } from '../../ab_testing'; // Assuming you have an ab_testing service

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  testId: string; // Add testId for A/B testing
  fallbackMessage?: string; // Add fallbackMessage for edge cases
  dataTestId?: string; // Add dataTestId for accessibility and testing
}

const MyComponent: React.FC<Props> = ({ message, testId, fallbackMessage = '', dataTestId, children, ...rest }) => {
  const abTester = new ABTester(testId);
  const variant = abTester.getVariant();

  // Handle edge case when abTester.getVariant() returns null or undefined
  const content = variant === 'A' ? (
    <div>{message}</div>
  ) : (
    <div>{fallbackMessage || children}</div>
  );

  return (
    <div data-testid={dataTestId} {...rest}>
      {content}
    </div>
  );
};

export default MyComponent;

import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { ABTester } from '../../ab_testing'; // Assuming you have an ab_testing service

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  testId: string; // Add testId for A/B testing
  fallbackMessage?: string; // Add fallbackMessage for edge cases
  dataTestId?: string; // Add dataTestId for accessibility and testing
}

const MyComponent: React.FC<Props> = ({ message, testId, fallbackMessage = '', dataTestId, children, ...rest }) => {
  const abTester = new ABTester(testId);
  const variant = abTester.getVariant();

  // Handle edge case when abTester.getVariant() returns null or undefined
  const content = variant === 'A' ? (
    <div>{message}</div>
  ) : (
    <div>{fallbackMessage || children}</div>
  );

  return (
    <div data-testid={dataTestId} {...rest}>
      {content}
    </div>
  );
};

export default MyComponent;