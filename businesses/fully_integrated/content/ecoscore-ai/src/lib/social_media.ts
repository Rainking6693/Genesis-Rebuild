import React, { FC, Key } from 'react';

type Props = {
  message: string;
};

const sanitizeMessage = (message: string) => {
  // Use a library like DOMPurify for a more robust sanitization
  // https://github.com/cure53/DOMPurify
  const DOMPurify = window as any; // Assuming DOMPurify is loaded on the page
  return DOMPurify.sanitize(message);
};

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessage = sanitizeMessage(message);
  const key: Key = message; // Use the message as the key for better performance

  return (
    <div data-testid="my-component" dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
  );
};

export const MyComponent = MyComponent as FC<Props>;

export type MyComponentProps = Props;

In this version, I've used the DOMPurify library for sanitizing user-generated messages, which provides a more robust solution for preventing XSS attacks. I've also added a data-testid attribute for easier testing. Lastly, I've used the TypeScript as assertion to type the exported component as FC<Props>.