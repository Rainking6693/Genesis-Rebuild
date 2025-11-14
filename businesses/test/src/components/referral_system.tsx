import React, { Key, ReactNode } from 'react';

// Add a unique identifier for the component
const componentId = 'ReferralSystemMyComponent';

interface Props {
  message: string;
}

// Use PascalCase for component names
const MyComponent: React.FC<Props> = ({ message }) => {
  // Add a key attribute for React's reconciliation process
  const keyValue = useUniqueKey(componentId);

  // Sanitize the HTML to prevent XSS attacks
  const sanitizedMessage = createSanitizedHTML(message);

  return <div key={keyValue} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

// Add a utility function for generating unique identifiers
const useUniqueKey = (baseId: string) => {
  const [id, setId] = React.useState(baseId);

  React.useEffect(() => {
    const newId = `${baseId}-${Math.random().toString(36).substring(2, 15)}`;
    setId(newId);
  }, [baseId]);

  return id;
};

// Sanitize the HTML to prevent XSS attacks
const createSanitizedHTML = (html: string) => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  return tempElement.textContent || '';
};

// Add export comments for clarity
// eslint-disable-next-line import/no-default-export
export default MyComponent;

import React, { Key, ReactNode } from 'react';

// Add a unique identifier for the component
const componentId = 'ReferralSystemMyComponent';

interface Props {
  message: string;
}

// Use PascalCase for component names
const MyComponent: React.FC<Props> = ({ message }) => {
  // Add a key attribute for React's reconciliation process
  const keyValue = useUniqueKey(componentId);

  // Sanitize the HTML to prevent XSS attacks
  const sanitizedMessage = createSanitizedHTML(message);

  return <div key={keyValue} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

// Add a utility function for generating unique identifiers
const useUniqueKey = (baseId: string) => {
  const [id, setId] = React.useState(baseId);

  React.useEffect(() => {
    const newId = `${baseId}-${Math.random().toString(36).substring(2, 15)}`;
    setId(newId);
  }, [baseId]);

  return id;
};

// Sanitize the HTML to prevent XSS attacks
const createSanitizedHTML = (html: string) => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  return tempElement.textContent || '';
};

// Add export comments for clarity
// eslint-disable-next-line import/no-default-export
export default MyComponent;