import React, { FC, ReactNode, Key } from 'react';

interface Props {
  message: string;
  children?: ReactNode;
  className?: string;
  testID?: string;
}

const MyComponent: FC<Props> = ({ message, children, className, testID }) => {
  const sanitizedMessage = createSanitizedHTML(message);

  return (
    <div data-testid={testID} className={className}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      {children}
    </div>
  );
};

const createSanitizedHTML = (html: string) => {
  let tempElement: HTMLElement | null = null;

  try {
    tempElement = document.createElement('div');
    tempElement.innerHTML = html;
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return '';
  }

  return tempElement.textContent || '';
};

export default MyComponent;

import React, { FC, ReactNode, Key } from 'react';

interface Props {
  message: string;
  children?: ReactNode;
  className?: string;
  testID?: string;
}

const MyComponent: FC<Props> = ({ message, children, className, testID }) => {
  const sanitizedMessage = createSanitizedHTML(message);

  return (
    <div data-testid={testID} className={className}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      {children}
    </div>
  );
};

const createSanitizedHTML = (html: string) => {
  let tempElement: HTMLElement | null = null;

  try {
    tempElement = document.createElement('div');
    tempElement.innerHTML = html;
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return '';
  }

  return tempElement.textContent || '';
};

export default MyComponent;