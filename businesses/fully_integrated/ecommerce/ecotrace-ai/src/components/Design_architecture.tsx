import React, { FC, ErrorBoundary, useCallback, useMemo } from 'react';
// ...

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error) {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // You can return any custom error UI here
      return <div>An error occurred.</div>;
    }

    return this.props.children;
  }
}

// ...

const MyComponent: FC<Props> = (props) => {
  // ...

  return (
    <ErrorBoundary>
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </ErrorBoundary>
  );
};

import { sanitizeHtml } from 'react-helmet-sanitizer';
// ...

const sanitize = (newMessage: string) => sanitizeHtml(newMessage, {
  // ...
});

const [message, setMessage] = React.useState<string>(optimizedMessage);

React.useEffect(() => {
  setMessage(optimizedMessage);
}, [optimizedMessage]);

import React, { FC, ErrorBoundary, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMemo } from 'react-use';
import { sanitizeHtml } from 'react-helmet-sanitizer';

interface Props {
  message: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  // ...
}

const sanitize = (newMessage: string) => sanitizeHtml(newMessage, {
  // ...
});

const MyComponent: FC<Props> = ({ message }) => {
  const [message, setMessage] = React.useState<string>(message);
  const optimizedMessage = useMemo(() => {
    // Perform expensive calculation here
    return calculatedMessage;
  }, []);

  const handleMessageChange = useCallback((newMessage: string) => {
    // Add validation for message
    if (!newMessage || newMessage.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    const sanitizedMessage = sanitize(newMessage);

    setMessage(sanitizedMessage);
  }, []);

  React.useEffect(() => {
    setMessage(optimizedMessage);
  }, [optimizedMessage]);

  return (
    <ErrorBoundary>
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </ErrorBoundary>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;

import React, { FC, ErrorBoundary, useCallback, useMemo } from 'react';
// ...

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error) {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // You can return any custom error UI here
      return <div>An error occurred.</div>;
    }

    return this.props.children;
  }
}

// ...

const MyComponent: FC<Props> = (props) => {
  // ...

  return (
    <ErrorBoundary>
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </ErrorBoundary>
  );
};

import { sanitizeHtml } from 'react-helmet-sanitizer';
// ...

const sanitize = (newMessage: string) => sanitizeHtml(newMessage, {
  // ...
});

const [message, setMessage] = React.useState<string>(optimizedMessage);

React.useEffect(() => {
  setMessage(optimizedMessage);
}, [optimizedMessage]);

import React, { FC, ErrorBoundary, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMemo } from 'react-use';
import { sanitizeHtml } from 'react-helmet-sanitizer';

interface Props {
  message: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  // ...
}

const sanitize = (newMessage: string) => sanitizeHtml(newMessage, {
  // ...
});

const MyComponent: FC<Props> = ({ message }) => {
  const [message, setMessage] = React.useState<string>(message);
  const optimizedMessage = useMemo(() => {
    // Perform expensive calculation here
    return calculatedMessage;
  }, []);

  const handleMessageChange = useCallback((newMessage: string) => {
    // Add validation for message
    if (!newMessage || newMessage.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    const sanitizedMessage = sanitize(newMessage);

    setMessage(sanitizedMessage);
  }, []);

  React.useEffect(() => {
    setMessage(optimizedMessage);
  }, [optimizedMessage]);

  return (
    <ErrorBoundary>
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </ErrorBoundary>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;

2. Type the `sanitizeHtml` function:

3. Use `useState` with type assertion for better type safety:

4. Use `useEffect` to update the state when the `optimizedMessage` changes: