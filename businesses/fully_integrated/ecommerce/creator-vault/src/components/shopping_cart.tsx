import React, { FC, ReactNode } from 'react';

interface Props {
  id?: string; // Adding an optional id for each cart item
  message: string;
  className?: string; // Adding a className for styling
}

const MyComponent: FC<Props> = ({ id, message, className }) => {
  // Adding a null check for message to handle edge cases
  if (!message) return null;

  // Using React.Fragment for better performance and cleaner markup
  return (
    <React.Fragment>
      {/* Adding role="alert" for accessibility */}
      <div className={className} role="alert">
        {message}
        {/* Adding a key prop for each cart item to handle list re-renders */}
        {id && <span className="visually-hidden">{id}</span>}
      </div>
    </React.Fragment>
  );
};

export default MyComponent;

import React, { FC, ReactNode } from 'react';

interface Props {
  id?: string; // Adding an optional id for each cart item
  message: string;
  className?: string; // Adding a className for styling
}

const MyComponent: FC<Props> = ({ id, message, className }) => {
  // Adding a null check for message to handle edge cases
  if (!message) return null;

  // Using React.Fragment for better performance and cleaner markup
  return (
    <React.Fragment>
      {/* Adding role="alert" for accessibility */}
      <div className={className} role="alert">
        {message}
        {/* Adding a key prop for each cart item to handle list re-renders */}
        {id && <span className="visually-hidden">{id}</span>}
      </div>
    </React.Fragment>
  );
};

export default MyComponent;