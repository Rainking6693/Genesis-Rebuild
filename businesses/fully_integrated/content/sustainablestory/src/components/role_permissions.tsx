import React, { FC, ReactNode, useId } from 'react';

interface SustainableStoryComponentProps {
  message: string;
  children?: ReactNode;
}

const SustainableStoryComponent: FC<SustainableStoryComponentProps> = ({ message, children }) => {
  const id = useId();

  return (
    <div data-testid={id} aria-labelledby={id}>
      <h2 id={id} className="sr-only">Sustainable Story</h2>
      {message}
      {children}
    </div>
  );
};

export default SustainableStoryComponent;

// For the second component, I will use a more descriptive name based on the business context
import React, { FC, ReactNode, useId } from 'react';

interface RolePermissionsComponentProps {
  message: string;
  children?: ReactNode;
}

const RolePermissionsComponent: FC<RolePermissionsComponentProps> = ({ message, children }) => {
  const id = useId();

  return (
    <div role="permissions-container" data-testid={id}>
      <h2 id={id} className="sr-only">Role Permissions</h2>
      {message}
      {children}
    </div>
  );
};

export default RolePermissionsComponent;

1. Added `useId` hook to generate unique IDs for each component, improving resiliency and accessibility.
2. Added `aria-labelledby` and `data-testid` attributes to the root div for better accessibility and testing.
3. Added a `h2` element with the `sr-only` class for screen readers, improving accessibility.
4. Made the component names more descriptive based on the business context.
5. Used the `FC` (Function Component) type from the 'react' package instead of importing it separately.
6. Imported `ReactNode` type from 'react' to ensure type safety.
7. Used the `React.createElement` method implicitly by writing JSX syntax, which is more concise and easier to read.