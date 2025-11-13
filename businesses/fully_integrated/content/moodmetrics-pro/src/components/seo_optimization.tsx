import React, { PropsWithChildren } from 'react';

interface BaseProps {
  /** The unique ID for the component, useful for accessibility and SEO */
  id?: string;
}

interface Props extends BaseProps {
  /** The main content of the component */
  message: string;
}

const MyComponent: React.FC<Props> = ({ id, message, children }) => {
  // Add a role="textbox" for accessibility and SEO
  const textBoxId = id || `my-component-${Math.random().toString(36).substring(7)}`;

  return (
    <div id={textBoxId} role="textbox">
      {/* Render the main content */}
      <div>{message}</div>
      {/* Render any additional children */}
      {children}
    </div>
  );
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';

interface BaseProps {
  /** The unique ID for the component, useful for accessibility and SEO */
  id?: string;
}

interface Props extends BaseProps {
  /** The main content of the component */
  message: string;
}

const MyComponent: React.FC<Props> = ({ id, message, children }) => {
  // Add a role="textbox" for accessibility and SEO
  const textBoxId = id || `my-component-${Math.random().toString(36).substring(7)}`;

  return (
    <div id={textBoxId} role="textbox">
      {/* Render the main content */}
      <div>{message}</div>
      {/* Render any additional children */}
      {children}
    </div>
  );
};

export default MyComponent;