import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { sanitizeUserInput } from '../../security/sanitizer';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const sanitizeUserInput = (input: string): string => {
  try {
    // Your sanitization logic here
    const sanitizedOutput = sanitize(input);

    // Check if the sanitized output is valid HTML
    if (!isValidHtml(sanitizedOutput)) {
      console.error(`Invalid HTML output from sanitizeUserInput: ${sanitizedOutput}`);
      throw new Error('Invalid HTML output');
    }

    return sanitizedOutput;
  } catch (error) {
    console.error(`Error sanitizing input: ${error.message}`);
    return input; // Return the original input if sanitization fails
  }
};

const isValidHtml = (html: string): boolean => {
  // Your HTML validation logic here
  // For example, you can use DOMParser to validate the HTML
  // ...
  try {
    new DOMParser().parseFromString(html, 'text/html');
    return true;
  } catch (error) {
    console.error(`Invalid HTML output: ${error.message}`);
    return false;
  }
};

const MyComponent: React.FC<Props> = ({ className, style, message, ...rest }) => {
  const sanitizedMessage = sanitizeUserInput(message || '');
  let element: ReactNode;

  if (sanitizedMessage) {
    element = (
      <div key={sanitizedMessage} {...rest} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    );
  } else {
    element = <div className="no-message-provided">No message provided</div>;
  }

  return (
    <div className={className} style={style}>
      {element}
    </div>
  );
};

MyComponent.defaultProps = {
  className: '',
  style: {},
};

export default MyComponent;

import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { sanitizeUserInput } from '../../security/sanitizer';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const sanitizeUserInput = (input: string): string => {
  try {
    // Your sanitization logic here
    const sanitizedOutput = sanitize(input);

    // Check if the sanitized output is valid HTML
    if (!isValidHtml(sanitizedOutput)) {
      console.error(`Invalid HTML output from sanitizeUserInput: ${sanitizedOutput}`);
      throw new Error('Invalid HTML output');
    }

    return sanitizedOutput;
  } catch (error) {
    console.error(`Error sanitizing input: ${error.message}`);
    return input; // Return the original input if sanitization fails
  }
};

const isValidHtml = (html: string): boolean => {
  // Your HTML validation logic here
  // For example, you can use DOMParser to validate the HTML
  // ...
  try {
    new DOMParser().parseFromString(html, 'text/html');
    return true;
  } catch (error) {
    console.error(`Invalid HTML output: ${error.message}`);
    return false;
  }
};

const MyComponent: React.FC<Props> = ({ className, style, message, ...rest }) => {
  const sanitizedMessage = sanitizeUserInput(message || '');
  let element: ReactNode;

  if (sanitizedMessage) {
    element = (
      <div key={sanitizedMessage} {...rest} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    );
  } else {
    element = <div className="no-message-provided">No message provided</div>;
  }

  return (
    <div className={className} style={style}>
      {element}
    </div>
  );
};

MyComponent.defaultProps = {
  className: '',
  style: {},
};

export default MyComponent;