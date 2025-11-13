import React, { forwardRef, ReactNode, useContext } from 'react';
import { ComponentPropsWithRef } from 'react';
import { TestContext } from './TestContext';

interface Props extends ComponentPropsWithRef<HTMLDivElement> {
  message: string;
  className?: string; // Add a prop for custom classes
  children?: ReactNode; // Allow for additional content within the component
  error?: boolean; // Flag for error messages
  testMessage?: string; // Test message for testing purposes
  testMessageClassName?: string; // Custom class for test message
  testMessageStyle?: React.CSSProperties; // Custom style for test message
  testMessageId?: string; // Custom id for test message
  testMessageRef?: React.RefObject<HTMLDivElement>; // Custom ref for test message
}

const FunctionalComponent = forwardRef<HTMLDivElement, Props>(({ message, className, children, error = false, testMessage, testMessageClassName, testMessageStyle, testMessageId, testMessageRef, ...rest }, ref) => {
  const { darkMode } = useContext(TestContext);
  const errorClass = error ? 'error' : '';
  const darkModeClass = darkMode ? 'dark-mode' : '';

  // Handle null or undefined props
  const customMessage = message || testMessage || '';
  const customClassName = className || '';
  const customId = testMessageId || 'write-tests-component';
  const customRef = testMessageRef || ref;

  // Add maxLength for message
  const maxLength = 100;
  if (customMessage.length > maxLength) {
    customMessage = customMessage.substring(0, maxLength) + '...';
  }

  return (
    <div
      {...rest}
      ref={customRef}
      id={customId}
      className={`write-tests-component ${customClassName} ${errorClass} ${darkModeClass}`} // Use className prop if provided, otherwise use default class
      aria-live="polite" // Add ARIA attribute for accessibility
    >
      <div
        style={testMessageStyle}
        className={`test-message ${testMessageClassName || ''}`}
        id={customId}
        ref={customRef}
      >
        {customMessage}
      </div>
      {children}
    </div>
  );
});

FunctionalComponent.displayName = 'WriteTestsComponent'; // Set a displayName for easier debugging

export default FunctionalComponent;

import React, { forwardRef, ReactNode, useContext } from 'react';
import { ComponentPropsWithRef } from 'react';
import { TestContext } from './TestContext';

interface Props extends ComponentPropsWithRef<HTMLDivElement> {
  message: string;
  className?: string; // Add a prop for custom classes
  children?: ReactNode; // Allow for additional content within the component
  error?: boolean; // Flag for error messages
  testMessage?: string; // Test message for testing purposes
  testMessageClassName?: string; // Custom class for test message
  testMessageStyle?: React.CSSProperties; // Custom style for test message
  testMessageId?: string; // Custom id for test message
  testMessageRef?: React.RefObject<HTMLDivElement>; // Custom ref for test message
}

const FunctionalComponent = forwardRef<HTMLDivElement, Props>(({ message, className, children, error = false, testMessage, testMessageClassName, testMessageStyle, testMessageId, testMessageRef, ...rest }, ref) => {
  const { darkMode } = useContext(TestContext);
  const errorClass = error ? 'error' : '';
  const darkModeClass = darkMode ? 'dark-mode' : '';

  // Handle null or undefined props
  const customMessage = message || testMessage || '';
  const customClassName = className || '';
  const customId = testMessageId || 'write-tests-component';
  const customRef = testMessageRef || ref;

  // Add maxLength for message
  const maxLength = 100;
  if (customMessage.length > maxLength) {
    customMessage = customMessage.substring(0, maxLength) + '...';
  }

  return (
    <div
      {...rest}
      ref={customRef}
      id={customId}
      className={`write-tests-component ${customClassName} ${errorClass} ${darkModeClass}`} // Use className prop if provided, otherwise use default class
      aria-live="polite" // Add ARIA attribute for accessibility
    >
      <div
        style={testMessageStyle}
        className={`test-message ${testMessageClassName || ''}`}
        id={customId}
        ref={customRef}
      >
        {customMessage}
      </div>
      {children}
    </div>
  );
});

FunctionalComponent.displayName = 'WriteTestsComponent'; // Set a displayName for easier debugging

export default FunctionalComponent;