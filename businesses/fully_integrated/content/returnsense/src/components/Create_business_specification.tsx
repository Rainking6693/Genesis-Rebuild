import React, { FC, useEffect, useState } from 'react';

interface Props {
  message?: string;
}

const validateMessage = (message: string): string => {
  // Add your validation logic here
  // For example, let's ensure the message is not empty
  if (!message) {
    throw new Error('Message cannot be empty');
  }
  return message;
};

const MyComponent: FC<Props> = ({ message }) => {
  const [content, setContent] = useState(message || '');

  useEffect(() => {
    try {
      const validatedMessage = validateMessage(content);
      setContent(validatedMessage);
    } catch (error) {
      console.error(error);
    }
  }, [content]);

  // Use a safe method to set innerHTML, such as DOMParser
  const safeHTML = new DOMParser().parseFromString(content, 'text/html').body.innerHTML;

  return <div dangerouslySetInnerHTML={{ __html: safeHTML }} />;
};

MyComponent.defaultProps = {
  message: validateMessage(''),
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';

interface Props {
  message?: string;
}

const validateMessage = (message: string): string => {
  // Add your validation logic here
  // For example, let's ensure the message is not empty
  if (!message) {
    throw new Error('Message cannot be empty');
  }
  return message;
};

const MyComponent: FC<Props> = ({ message }) => {
  const [content, setContent] = useState(message || '');

  useEffect(() => {
    try {
      const validatedMessage = validateMessage(content);
      setContent(validatedMessage);
    } catch (error) {
      console.error(error);
    }
  }, [content]);

  // Use a safe method to set innerHTML, such as DOMParser
  const safeHTML = new DOMParser().parseFromString(content, 'text/html').body.innerHTML;

  return <div dangerouslySetInnerHTML={{ __html: safeHTML }} />;
};

MyComponent.defaultProps = {
  message: validateMessage(''),
};

export default MyComponent;