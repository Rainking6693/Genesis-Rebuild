import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  isError?: boolean;
}

const FunctionalComponent: React.FC<Props> = ({ message, isError = false }) => {
  const className = `social-media-message ${isError ? 'error' : ''}`;

  return (
    <div className={className}>
      {message}
      <span className="sr-only">Read more on the social media post</span>
    </div>
  );
};

export default FunctionalComponent;

<FunctionalComponent message="Something went wrong." isError />
<FunctionalComponent message="Check out our new product!" />

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  isError?: boolean;
}

const FunctionalComponent: React.FC<Props> = ({ message, isError = false }) => {
  const className = `social-media-message ${isError ? 'error' : ''}`;

  return (
    <div className={className}>
      {message}
      <span className="sr-only">Read more on the social media post</span>
    </div>
  );
};

export default FunctionalComponent;

<FunctionalComponent message="Something went wrong." isError />
<FunctionalComponent message="Check out our new product!" />

1. Added `PropsWithChildren` to the FunctionalComponent's type parameter to allow for nested content.
2. Added an optional `isError` prop to handle error messages differently from regular messages.
3. Added a CSS class `error` to style error messages differently.
4. Added a screen reader-only (`sr-only`) text to help visually impaired users understand that there's more content available.

Now, you can use this component like this: