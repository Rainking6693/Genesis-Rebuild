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

<MyComponent message="Your subscription has been updated." error={true}>
  <p>Here's a helpful message about the update.</p>
</MyComponent>

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

<MyComponent message="Your subscription has been updated." error={true}>
  <p>Here's a helpful message about the update.</p>
</MyComponent>

1. Added an `error` prop to indicate if the message is an error or not. This can help with styling and accessibility.

2. Added a `children` prop to allow for additional content within the component.

3. Created a CSS class `my-component` for styling and a `error` class for error messages.

4. Added a default value of `false` for the `error` prop.

5. Updated the return statement to include the children and the message.

Now, you can use this component like this: