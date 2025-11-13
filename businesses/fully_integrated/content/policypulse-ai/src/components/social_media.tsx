import React, { FC, DetailedHTMLProps, HTMLAttributes, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  platform?: string;
}

const sanitizeMessage = (message: string) => {
  // Sanitize user-generated messages to prevent XSS attacks using DOMPurify
  return DOMPurify.sanitize(message);
};

const MyComponent: FC<Props> = ({ className, message, platform, ...rest }) => {
  // Use a safe method to set innerText for accessibility and innerHTML for rendering
  const formattedMessage = platform ? `${platform} - ${message}` : message;
  const safeMessage = sanitizeMessage(formattedMessage);

  // Set innerText for accessibility and innerHTML for rendering
  useEffect(() => {
    const div = document.createElement('div');
    div.textContent = safeMessage;
    const sanitizedHTML = div.innerHTML;

    // Update the component's innerHTML with the sanitized HTML
    React.useImperativeHandle(
      undefined,
      () => ({
        updateHTML: () => {
          React.findDOMNode(MyComponent.ref)!.innerHTML = sanitizedHTML;
        },
      }),
      []
    );

    // Set the component's innerHTML with the sanitized HTML
    return () => {
      React.findDOMNode(MyComponent.ref)!.innerHTML = sanitizedHTML;
    };
  }, [safeMessage]);

  return (
    <div
      className={className}
      ref={(ref) => (MyComponent.ref = ref)}
      {...rest}
    />
  );
};

MyComponent.defaultProps = {
  className: '',
  message: sanitizeMessage('Welcome to PolicyPulse AI! Stay compliant with ease.'),
};

export default React.forwardRef(MyComponent);

import React, { FC, DetailedHTMLProps, HTMLAttributes, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  platform?: string;
}

const sanitizeMessage = (message: string) => {
  // Sanitize user-generated messages to prevent XSS attacks using DOMPurify
  return DOMPurify.sanitize(message);
};

const MyComponent: FC<Props> = ({ className, message, platform, ...rest }) => {
  // Use a safe method to set innerText for accessibility and innerHTML for rendering
  const formattedMessage = platform ? `${platform} - ${message}` : message;
  const safeMessage = sanitizeMessage(formattedMessage);

  // Set innerText for accessibility and innerHTML for rendering
  useEffect(() => {
    const div = document.createElement('div');
    div.textContent = safeMessage;
    const sanitizedHTML = div.innerHTML;

    // Update the component's innerHTML with the sanitized HTML
    React.useImperativeHandle(
      undefined,
      () => ({
        updateHTML: () => {
          React.findDOMNode(MyComponent.ref)!.innerHTML = sanitizedHTML;
        },
      }),
      []
    );

    // Set the component's innerHTML with the sanitized HTML
    return () => {
      React.findDOMNode(MyComponent.ref)!.innerHTML = sanitizedHTML;
    };
  }, [safeMessage]);

  return (
    <div
      className={className}
      ref={(ref) => (MyComponent.ref = ref)}
      {...rest}
    />
  );
};

MyComponent.defaultProps = {
  className: '',
  message: sanitizeMessage('Welcome to PolicyPulse AI! Stay compliant with ease.'),
};

export default React.forwardRef(MyComponent);