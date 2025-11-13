import React, { FC, ReactNode, PropsWithChildren } from 'react';

type TestId = string;
type ClassName = string;
type Message = string | null;

const sanitizeTestId = (testId: string): TestId =>
  testId.replace(/[^a-zA-Z0-9-\s]/g, '');

const sanitizeClassName = (className: string): ClassName =>
  className.replace(/[^a-zA-Z0-9-\._]/g, '');

const sanitizeChildren = (children: ReactNode): ReactNode => {
  if (typeof children === 'string' || typeof children === 'number') {
    return <span key={`child-${children}`}>{children}</span>;
  }
  return children;
};

type Props = PropsWithChildren<{
  message?: Message;
  testId?: TestId;
  className?: ClassName;
}>;

const MyComponent: FC<Props> = ({ children = 'Default message', message, testId, className }) => {
  const renderedMessage = message || children;

  if (!renderedMessage) return null;

  const sanitizedTestId = sanitizeTestId(testId);
  const sanitizedClassName = sanitizeClassName(className);
  const sanitizedChildren = sanitizeChildren(children);

  return (
    <div data-testid={sanitizedTestId} className={sanitizedClassName} role="presentation">
      {sanitizedChildren}
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode, PropsWithChildren } from 'react';

type TestId = string;
type ClassName = string;
type Message = string | null;

const sanitizeTestId = (testId: string): TestId =>
  testId.replace(/[^a-zA-Z0-9-\s]/g, '');

const sanitizeClassName = (className: string): ClassName =>
  className.replace(/[^a-zA-Z0-9-\._]/g, '');

const sanitizeChildren = (children: ReactNode): ReactNode => {
  if (typeof children === 'string' || typeof children === 'number') {
    return <span key={`child-${children}`}>{children}</span>;
  }
  return children;
};

type Props = PropsWithChildren<{
  message?: Message;
  testId?: TestId;
  className?: ClassName;
}>;

const MyComponent: FC<Props> = ({ children = 'Default message', message, testId, className }) => {
  const renderedMessage = message || children;

  if (!renderedMessage) return null;

  const sanitizedTestId = sanitizeTestId(testId);
  const sanitizedClassName = sanitizeClassName(className);
  const sanitizedChildren = sanitizeChildren(children);

  return (
    <div data-testid={sanitizedTestId} className={sanitizedClassName} role="presentation">
      {sanitizedChildren}
    </div>
  );
};

export default MyComponent;