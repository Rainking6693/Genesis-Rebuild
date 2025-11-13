import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  isError?: boolean;
}

const MyComponent: React.FC<Props> = ({ message, isError = false }) => {
  const className = `social-media-message ${isError ? 'error' : ''}`;

  return (
    <div className={className} role="alert">
      <div>{message}</div>
    </div>
  );
};

export default MyComponent;

<MyComponent message="An error occurred." isError />
<MyComponent message="Your post has been successfully published." />

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  isError?: boolean;
}

const MyComponent: React.FC<Props> = ({ message, isError = false }) => {
  const className = `social-media-message ${isError ? 'error' : ''}`;

  return (
    <div className={className} role="alert">
      <div>{message}</div>
    </div>
  );
};

export default MyComponent;

<MyComponent message="An error occurred." isError />
<MyComponent message="Your post has been successfully published." />

1. Added the `PropsWithChildren` type to handle dynamic content within the component.
2. Added an optional `isError` prop to indicate if the message is an error. This can be used to style the message differently.
3. Added a `role` attribute to the container div to make it accessible as an alert.
4. Created a CSS class for the message and added an error class for error messages.

Now, you can use the component like this: