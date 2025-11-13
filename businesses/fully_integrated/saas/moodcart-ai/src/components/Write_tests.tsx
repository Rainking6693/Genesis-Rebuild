import React, { FC, Key } from 'react';

interface Props {
  message: string;
}

// Adding a displayName for easier debugging and testing
MyComponent.displayName = 'MyComponent';

const MyComponent: FC<Props> = ({ message }: Props) => {
  // Adding a key prop for accessibility and performance
  // Using a unique key to ensure each rendered element has a unique key
  const uniqueKey = Math.random().toString(36).substring(7);

  // Sanitize the input message to prevent XSS attacks
  const sanitizedMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  return <div key={uniqueKey} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

// Importing the component and adding a default export for better modularity
import { MyComponent } from './MyComponent';

export default MyComponent;

import React, { FC, Key } from 'react';

interface Props {
  message: string;
}

// Adding a displayName for easier debugging and testing
MyComponent.displayName = 'MyComponent';

const MyComponent: FC<Props> = ({ message }: Props) => {
  // Adding a key prop for accessibility and performance
  // Using a unique key to ensure each rendered element has a unique key
  const uniqueKey = Math.random().toString(36).substring(7);

  // Sanitize the input message to prevent XSS attacks
  const sanitizedMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  return <div key={uniqueKey} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

// Importing the component and adding a default export for better modularity
import { MyComponent } from './MyComponent';

export default MyComponent;