import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { ABTestProps, A/BTest } from '../../ab_testing';

interface MyComponentProps extends ABTestProps {
  message: string;
  children?: ReactNode;
  fallback?: ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = ({
  message,
  testId,
  children,
  fallback,
  ...rest
}) => {
  const renderContent = () => {
    if (children) {
      return children;
    }

    if (fallback) {
      return fallback;
    }

    throw new Error('No content provided for the selected variant in A/B testing.');
  };

  return (
    <A/BTest testId={testId} fallback={renderContent} {...rest}>
      {renderContent()}
    </A/BTest>
  );
};

MyComponent.defaultProps = {
  fallback: () => <div>Fallback content for A/B testing</div>,
};

export default MyComponent;

import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { ABTestProps, A/BTest } from '../../ab_testing';

interface MyComponentProps extends ABTestProps {
  message: string;
  children?: ReactNode;
  fallback?: ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = ({
  message,
  testId,
  children,
  fallback,
  ...rest
}) => {
  const renderContent = () => {
    if (children) {
      return children;
    }

    if (fallback) {
      return fallback;
    }

    throw new Error('No content provided for the selected variant in A/B testing.');
  };

  return (
    <A/BTest testId={testId} fallback={renderContent} {...rest}>
      {renderContent()}
    </A/BTest>
  );
};

MyComponent.defaultProps = {
  fallback: () => <div>Fallback content for A/B testing</div>,
};

export default MyComponent;