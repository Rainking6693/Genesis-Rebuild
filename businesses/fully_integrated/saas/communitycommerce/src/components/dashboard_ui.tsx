import React, { PropsWithChildren, ReactNode } from 'react';

interface Props {
  message: string;
  className?: string;
  children?: ReactNode;
}

const MyComponent: React.FC<Props> = ({ message, className, children }) => {
  const fallbackMessage = 'An error occurred. Please refresh the page.';
  const finalMessage = message || fallbackMessage;

  return (
    <div className={`my-component ${className}`}>
      {children}
      <div className="message">{finalMessage}</div>
    </div>
  );
};

export default MyComponent;

1. Extended the `Props` interface to accept a `className` prop for styling flexibility.
2. Added a fallback message in case the `message` prop is not provided.
3. Allowed for custom content to be rendered within the component using the `children` prop.
4. Wrapped the message in a `div` with a class of `message` for better styling and accessibility.
5. Used the `ReactNode` type for the `children` prop to allow for any valid React node (elements, arrays, or strings).
6. Added a space between the custom content and the message for better readability.