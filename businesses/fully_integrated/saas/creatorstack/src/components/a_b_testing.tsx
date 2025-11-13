import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { PropsWithChildren, ReactElement } from 'react';
import DOMPurify from 'dompurify';

interface Props extends PropsWithChildren<{}> {
  message?: string;
  testId?: string;
}

const ABBTestingComponent: FunctionComponent<Props> = ({ message, children, testId }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message || '');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (message) {
      setSanitizedMessage(DOMPurify.sanitize(message));
      setIsLoading(false);
    }
  }, [message]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!sanitizedMessage) {
    ABBTestingComponent.error(new Error('Potential XSS attack detected or invalid message'));
    return <div>Error: Potential XSS attack detected or invalid message</div>;
  }

  return (
    <div data-testid={testId} aria-label="A/B testing component">
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} key={sanitizedMessage} />
      {children}
    </div>
  );
};

ABBTestingComponent.error = (error: Error) => {
  console.error('Potential XSS attack detected or invalid message:', error);
};

ABBTestingComponent.defaultProps = {
  message: '',
};

ABBTestingComponent.displayName = 'ABBTestingComponent';

export default ABBTestingComponent;

import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { PropsWithChildren, ReactElement } from 'react';
import DOMPurify from 'dompurify';

interface Props extends PropsWithChildren<{}> {
  message?: string;
  testId?: string;
}

const ABBTestingComponent: FunctionComponent<Props> = ({ message, children, testId }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message || '');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (message) {
      setSanitizedMessage(DOMPurify.sanitize(message));
      setIsLoading(false);
    }
  }, [message]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!sanitizedMessage) {
    ABBTestingComponent.error(new Error('Potential XSS attack detected or invalid message'));
    return <div>Error: Potential XSS attack detected or invalid message</div>;
  }

  return (
    <div data-testid={testId} aria-label="A/B testing component">
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} key={sanitizedMessage} />
      {children}
    </div>
  );
};

ABBTestingComponent.error = (error: Error) => {
  console.error('Potential XSS attack detected or invalid message:', error);
};

ABBTestingComponent.defaultProps = {
  message: '',
};

ABBTestingComponent.displayName = 'ABBTestingComponent';

export default ABBTestingComponent;