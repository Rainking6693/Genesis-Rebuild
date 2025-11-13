import React, { FC, ReactNode, DefaultHTMLProps, RefAttributes } from 'react';
import PropTypes from 'prop-types';
import { TextareaAutosize } from '@material-ui/core'; // Adding a library for textarea autosize to improve user experience

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message: string;
}

const validateMessage = (message: string): message is ReactNode => {
  // Implement a simple validation function to ensure the message is safe to render
  // This is a basic example, you may want to use a more robust solution in a real-world scenario
  const safeHtmlRegex = /^<div>[\w\s]*<\/div>$/;
  const safeAriaAttributesRegex = /^[\w-]+[\s]*=\s*["']?([\w-]+|true|false|null|[\w\s]*)["']?\s*$/;

  // Check if the message is a valid HTML string
  if (!safeHtmlRegex.test(message)) {
    return false;
  }

  // Check if the message contains valid ARIA attributes
  const matches = message.match(/aria-[^>]+/g);
  if (matches && matches.some((attr) => !safeAriaAttributesRegex.test(attr))) {
    return false;
  }

  return true;
};

const MyComponent: FC<Props & RefAttributes<HTMLDivElement>> = ({ message, ...rest }) => {
  if (!validateMessage(message)) {
    throw new Error('Invalid or unsafe HTML provided');
  }

  return (
    <div
      {...rest} // Forward ref and other props
      dangerouslySetInnerHTML={{ __html: message }}
    >
      {/* Adding a TextareaAutosize component to improve accessibility by making the content editable */}
      <TextareaAutosize style={{ display: 'none' }} />
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;

import React, { FC, ReactNode, DefaultHTMLProps, RefAttributes } from 'react';
import PropTypes from 'prop-types';
import { TextareaAutosize } from '@material-ui/core'; // Adding a library for textarea autosize to improve user experience

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message: string;
}

const validateMessage = (message: string): message is ReactNode => {
  // Implement a simple validation function to ensure the message is safe to render
  // This is a basic example, you may want to use a more robust solution in a real-world scenario
  const safeHtmlRegex = /^<div>[\w\s]*<\/div>$/;
  const safeAriaAttributesRegex = /^[\w-]+[\s]*=\s*["']?([\w-]+|true|false|null|[\w\s]*)["']?\s*$/;

  // Check if the message is a valid HTML string
  if (!safeHtmlRegex.test(message)) {
    return false;
  }

  // Check if the message contains valid ARIA attributes
  const matches = message.match(/aria-[^>]+/g);
  if (matches && matches.some((attr) => !safeAriaAttributesRegex.test(attr))) {
    return false;
  }

  return true;
};

const MyComponent: FC<Props & RefAttributes<HTMLDivElement>> = ({ message, ...rest }) => {
  if (!validateMessage(message)) {
    throw new Error('Invalid or unsafe HTML provided');
  }

  return (
    <div
      {...rest} // Forward ref and other props
      dangerouslySetInnerHTML={{ __html: message }}
    >
      {/* Adding a TextareaAutosize component to improve accessibility by making the content editable */}
      <TextareaAutosize style={{ display: 'none' }} />
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;