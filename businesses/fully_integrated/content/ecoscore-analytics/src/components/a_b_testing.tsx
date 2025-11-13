import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes, useEffect, useState } from 'react';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren, DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  testId?: string;
  isVisibleByDefault?: boolean;
  fallbackMessage?: string;
}

const ABBTestingComponent: FunctionComponent<Props> = ({ message, testId = 'ab-testing-component', isVisibleByDefault = true, fallbackMessage = '', ...rest }) => {
  const [isVisible, setIsVisible] = useState(isVisibleByDefault);

  useEffect(() => {
    // Simulate a/b testing logic here
    // For example, you can use a random number to decide whether to show the component or not
    const shouldShowComponent = Math.random() < 0.5;
    setIsVisible(shouldShowComponent);
  }, []);

  if (!isVisible) {
    return <div data-testid={`${testId}-fallback`}>{fallbackMessage}</div>;
  }

  return (
    <div data-testid={testId} {...rest}>
      {message}
    </div>
  );
};

ABBTestingComponent.displayName = 'ABBTestingComponent';

ABBTestingComponent.defaultProps = {
  fallbackMessage: 'Component hidden due to A/B testing',
};

export default ABBTestingComponent;

import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes, useEffect, useState } from 'react';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren, DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  testId?: string;
  isVisibleByDefault?: boolean;
  fallbackMessage?: string;
}

const ABBTestingComponent: FunctionComponent<Props> = ({ message, testId = 'ab-testing-component', isVisibleByDefault = true, fallbackMessage = '', ...rest }) => {
  const [isVisible, setIsVisible] = useState(isVisibleByDefault);

  useEffect(() => {
    // Simulate a/b testing logic here
    // For example, you can use a random number to decide whether to show the component or not
    const shouldShowComponent = Math.random() < 0.5;
    setIsVisible(shouldShowComponent);
  }, []);

  if (!isVisible) {
    return <div data-testid={`${testId}-fallback`}>{fallbackMessage}</div>;
  }

  return (
    <div data-testid={testId} {...rest}>
      {message}
    </div>
  );
};

ABBTestingComponent.displayName = 'ABBTestingComponent';

ABBTestingComponent.defaultProps = {
  fallbackMessage: 'Component hidden due to A/B testing',
};

export default ABBTestingComponent;