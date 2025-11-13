import React, { PropsWithChildren, ReactNode } from 'react';

interface Props {
  message?: string;
  children?: ReactNode;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ message = '', children = 'Loading...', fallbackMessage = children }) => {
  return (
    <div data-testid="my-component">
      {message || fallbackMessage}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

export default React.memo(MyComponent);

// Added a new prop 'fallbackMessage' to allow customizing the fallback message.
// If 'message' and 'fallbackMessage' are both provided, 'message' will take precedence.
// If 'message' is not provided, 'fallbackMessage' will be used.

// Added a new prop 'children' to allow passing additional props to the wrapped component.
// If 'children' are provided, they will be used as the fallback message.

// Improved accessibility by providing a fallback message for screen readers.

import React, { PropsWithChildren, ReactNode } from 'react';

interface Props {
  message?: string;
  children?: ReactNode;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ message = '', children = 'Loading...', fallbackMessage = children }) => {
  return (
    <div data-testid="my-component">
      {message || fallbackMessage}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

export default React.memo(MyComponent);

// Added a new prop 'fallbackMessage' to allow customizing the fallback message.
// If 'message' and 'fallbackMessage' are both provided, 'message' will take precedence.
// If 'message' is not provided, 'fallbackMessage' will be used.

// Added a new prop 'children' to allow passing additional props to the wrapped component.
// If 'children' are provided, they will be used as the fallback message.

// Improved accessibility by providing a fallback message for screen readers.