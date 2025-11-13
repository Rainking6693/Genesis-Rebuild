import React, { FC, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  source: 'user' | 'system';
}

const MyComponent: FC<Props> = ({ message, source }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    setSanitizedMessage(DOMPurify.sanitize(message));
  }, [message, source]);

  return (
    <div
      data-testid="backup-system-component"
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  );
};

MyComponent.error = (error: Error) => {
  console.error(`XSS error in ${COMPONENT_NAME}:`, error);
};

const COMPONENT_NAME = 'MyComponent';

export default MyComponent;

export const sanitizeMessage = (message: string): string => {
  return DOMPurify.sanitize(message);
};

// Wrap the component with a higher-order component to handle edge cases
const WithErrorBoundary = (WrappedComponent: FC<Props>) => {
  return class extends React.Component<Props> {
    state = { hasError: false };

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error: Error) {
      console.error(`XSS error in ${COMPONENT_NAME}:`, error);
    }

    render() {
      if (this.state.hasError) {
        return (
          <div data-testid="error-message">
            An error occurred while rendering the component.
            <br />
            Please contact the support team for assistance.
          </div>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};

// Use the higher-order component to handle edge cases
export const SanitizedMyComponent = WithErrorBoundary(MyComponent);

import React, { FC, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  source: 'user' | 'system';
}

const MyComponent: FC<Props> = ({ message, source }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    setSanitizedMessage(DOMPurify.sanitize(message));
  }, [message, source]);

  return (
    <div
      data-testid="backup-system-component"
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  );
};

MyComponent.error = (error: Error) => {
  console.error(`XSS error in ${COMPONENT_NAME}:`, error);
};

const COMPONENT_NAME = 'MyComponent';

export default MyComponent;

export const sanitizeMessage = (message: string): string => {
  return DOMPurify.sanitize(message);
};

// Wrap the component with a higher-order component to handle edge cases
const WithErrorBoundary = (WrappedComponent: FC<Props>) => {
  return class extends React.Component<Props> {
    state = { hasError: false };

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error: Error) {
      console.error(`XSS error in ${COMPONENT_NAME}:`, error);
    }

    render() {
      if (this.state.hasError) {
        return (
          <div data-testid="error-message">
            An error occurred while rendering the component.
            <br />
            Please contact the support team for assistance.
          </div>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};

// Use the higher-order component to handle edge cases
export const SanitizedMyComponent = WithErrorBoundary(MyComponent);