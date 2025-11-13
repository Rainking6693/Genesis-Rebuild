import React, { FC, ReactNode } from 'react';

type Props = {
  message: string;
  children?: ReactNode;
  className?: string;
  dataTestId?: string;
};

const getClasses = (className: string) =>
  className ? ` ${className}` : '';

const MyComponent: FC<Props> = ({
  message,
  children,
  className,
  dataTestId,
}) => {
  const combinedMessage = children ? (
    <>
      {message}
      {children}
    </>
  ) : (
    message
  );

  return (
    <div data-testid={dataTestId} className={`my-component${getClasses(className)}`}>
      {combinedMessage}
    </div>
  );
};

export default MyComponent;

In this updated code, I've added the following improvements:

1. Added `children` prop to allow for more flexibility in the component's content.
2. Added `className` prop to allow for custom CSS classes.
3. Added `dataTestId` prop for better testing and accessibility.
4. Created a `getClasses` utility function to handle the case where the `className` prop is not provided.
5. Combined the message and children props into a single `combinedMessage` variable to ensure that both are always displayed.
6. Wrapped the message and children in a fragment (`<>...</>`) when both are provided for better readability.
7. Added a default export for better compatibility with different import styles.