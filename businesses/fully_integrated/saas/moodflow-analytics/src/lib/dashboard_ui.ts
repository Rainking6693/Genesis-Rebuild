import React, { FC, ReactNode, useId } from 'react';
import { string, bool, oneOfType, elementType } from 'prop-types';

// Import required styles for the dashboard UI
import './MyComponent.module.css';

interface Props {
  children: ReactNode;
  message?: string;
  isError?: boolean;
  id?: string | React.ElementType;
  testId?: string;
  title?: string;
  role?: string;
  ariaLive?: string;
}

const MyComponent: FC<Props> = ({
  children,
  message,
  isError = false,
  id,
  testId,
  title,
  role,
  ariaLive,
}) => {
  const componentId = id || useId();

  return (
    <div data-testid={testId} id={componentId} data-title={title} data-role={role} data-aria-live={ariaLive} className={`moodflow-dashboard-message ${isError ? 'error' : ''}`}>
      {children || message}
    </div>
  );
};

MyComponent.defaultProps = {
  children: '',
  message: 'No message provided',
};

MyComponent.propTypes = {
  children: ReactNode.isRequired,
  message: string,
  isError: bool,
  id: oneOfType([string, elementType]),
  testId: string,
  title: string,
  role: string,
  ariaLive: oneOfType([string, bool]),
};

// Use React.memo for performance optimization
export const MemoizedMyComponent = React.memo(MyComponent);

This updated code addresses the initial requirements and adds additional features for improved accessibility and testing.