import React, { PropsWithChildren, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

type MyComponentProps = PropsWithChildren<{
  message: string;
  className?: string;
  attributes?: Record<string, string | number | boolean>;
  testID?: string;
  role?: string;
}>;

const MyComponent: React.FC<MyComponentProps> = ({
  message,
  className,
  attributes,
  children,
  testID,
  role,
}: MyComponentProps) => {
  const mergedAttributes: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> = {
    ...attributes,
    'data-testid': testID,
    'data-role': role,
    'aria-label': message,
  };

  // Check for invalid props and log a warning
  if (Object.keys(mergedAttributes).some((key) => !['class', 'aria-label', 'data-testid', 'data-role'].includes(key))) {
    console.warn(`Invalid prop: ${key}`);
  }

  return (
    <div className={className} {...mergedAttributes}>
      {children && (
        <>
          {children}
          <div data-testid-children>{message}</div>
        </>
      )}
    </div>
  );
};

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { PropsWithChildren, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

type MyComponentProps = PropsWithChildren<{
  message: string;
  className?: string;
  attributes?: Record<string, string | number | boolean>;
  testID?: string;
  role?: string;
}>;

const MyComponent: React.FC<MyComponentProps> = ({
  message,
  className,
  attributes,
  children,
  testID,
  role,
}: MyComponentProps) => {
  const mergedAttributes: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> = {
    ...attributes,
    'data-testid': testID,
    'data-role': role,
    'aria-label': message,
  };

  // Check for invalid props and log a warning
  if (Object.keys(mergedAttributes).some((key) => !['class', 'aria-label', 'data-testid', 'data-role'].includes(key))) {
    console.warn(`Invalid prop: ${key}`);
  }

  return (
    <div className={className} {...mergedAttributes}>
      {children && (
        <>
          {children}
          <div data-testid-children>{message}</div>
        </>
      )}
    </div>
  );
};

MyComponent.displayName = 'MyComponent';

export default MyComponent;