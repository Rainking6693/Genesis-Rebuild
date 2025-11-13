import React, { FC, ReactNode } from 'react';

interface Props {
  name: string;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ name, children }) => {
  const fallbackName = 'Anonymous';
  const displayName = name || fallbackName;

  return (
    <>
      {children}
      <h1>Hello, {displayName}!</h1>
      <div role="presentation">
        {/* Add accessible ARIA attributes for screen readers */}
        <span id="name">{displayName}</span>
      </div>
    </>
  );
};

export default MyComponent;

import React, { FC, ReactNode } from 'react';

interface Props {
  name: string;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ name, children }) => {
  const fallbackName = 'Anonymous';
  const displayName = name || fallbackName;

  return (
    <>
      {children}
      <h1>Hello, {displayName}!</h1>
      <div role="presentation">
        {/* Add accessible ARIA attributes for screen readers */}
        <span id="name">{displayName}</span>
      </div>
    </>
  );
};

export default MyComponent;