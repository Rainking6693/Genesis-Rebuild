import React, { FC, ReactNode } from 'react';

interface Props {
  message: string;
  error?: boolean;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, error = false, children }) => {
  const className = `my-component ${error ? 'error' : ''}`;

  return (
    <div className={className}>
      {children}
      <div>{message}</div>
    </div>
  );
};

export default MyComponent;

<MyComponent message="Your subscription has been updated.">
  <p>Here's more information about the update...</p>
</MyComponent>

<MyComponent message="An error occurred while updating your subscription." error />

import React, { FC, ReactNode } from 'react';

interface Props {
  message: string;
  error?: boolean;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, error = false, children }) => {
  const className = `my-component ${error ? 'error' : ''}`;

  return (
    <div className={className}>
      {children}
      <div>{message}</div>
    </div>
  );
};

export default MyComponent;

<MyComponent message="Your subscription has been updated.">
  <p>Here's more information about the update...</p>
</MyComponent>

<MyComponent message="An error occurred while updating your subscription." error />

1. Added `error` prop to handle error messages and apply a CSS class for styling.
2. Added `children` prop to allow for additional content within the component.
3. Imported `ReactNode` to handle any type of child elements.
4. Created a CSS class for error messages to make styling more maintainable.
5. Added a default value for the `error` prop to avoid potential issues when the prop is not provided.

Now, you can use the component like this: