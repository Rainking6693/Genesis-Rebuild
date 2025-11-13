import React, { FC, PropsWithChildren, useId } from 'react';

interface Props extends PropsWithChildren {
  message: string;
  className?: string;
  id?: string;
}

const FunctionalComponent: FC<Props> = ({ message, className, id, children }) => {
  const componentId = id || useId();

  return (
    <div id={componentId} className={className} data-testid="functional-component">
      {message}
      {children}
    </div>
  );
};

FunctionalComponent.displayName = 'FunctionalComponent';

export default FunctionalComponent;

import React from 'react';
import AuditLogs from './AuditLogs';

const MyComponent = () => {
  return (
    <AuditLogs message="Log message" className="my-custom-class">
      <p>Additional children</p>
    </AuditLogs>
  );
};

export default MyComponent;

import React, { FC, PropsWithChildren, useId } from 'react';

interface Props extends PropsWithChildren {
  message: string;
  className?: string;
  id?: string;
}

const FunctionalComponent: FC<Props> = ({ message, className, id, children }) => {
  const componentId = id || useId();

  return (
    <div id={componentId} className={className} data-testid="functional-component">
      {message}
      {children}
    </div>
  );
};

FunctionalComponent.displayName = 'FunctionalComponent';

export default FunctionalComponent;

import React from 'react';
import AuditLogs from './AuditLogs';

const MyComponent = () => {
  return (
    <AuditLogs message="Log message" className="my-custom-class">
      <p>Additional children</p>
    </AuditLogs>
  );
};

export default MyComponent;

1. Imported `PropsWithChildren` to allow passing additional props to the component.
2. Added `className` prop to allow custom styling.
3. Added `id` prop to improve accessibility and resiliency (e.g., for ARIA labels or when using CSS selectors).
4. Used `useId` to generate a unique `id` for the component if not provided.
5. Allowed passing additional children to the component.
6. Moved the `data-testid` attribute to the root element for better testability.

Now you can use the component like this: