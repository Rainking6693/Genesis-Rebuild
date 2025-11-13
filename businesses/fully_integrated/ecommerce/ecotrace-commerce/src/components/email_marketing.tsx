import React, { FC, ReactNode } from 'react';

interface Props {
  subject: string;
  message: string;
  children?: ReactNode; // Allows for additional content within the email component
  altText?: string; // Add altText for accessibility when using images
}

const MyEmailComponent: FC<Props> = ({ subject, message, children, altText }) => {
  return (
    <div role="presentation"> // Add role="presentation" to prevent screen readers from interpreting the email as a document
      <h2>{subject}</h2>
      <div>{message}</div>
      {children} // Render any additional content provided

      {/* Handle edge cases where children may contain images */}
      {React.Children.map(children, (child) => {
        if (child && child.type === 'img') {
          return React.cloneElement(child as React.ReactElement<any>, { alt: altText });
        }
        return child;
      })}
    </div>
  );
};

export default MyEmailComponent;

import React, { FC, ReactNode } from 'react';

interface Props {
  subject: string;
  message: string;
  children?: ReactNode; // Allows for additional content within the email component
  altText?: string; // Add altText for accessibility when using images
}

const MyEmailComponent: FC<Props> = ({ subject, message, children, altText }) => {
  return (
    <div role="presentation"> // Add role="presentation" to prevent screen readers from interpreting the email as a document
      <h2>{subject}</h2>
      <div>{message}</div>
      {children} // Render any additional content provided

      {/* Handle edge cases where children may contain images */}
      {React.Children.map(children, (child) => {
        if (child && child.type === 'img') {
          return React.cloneElement(child as React.ReactElement<any>, { alt: altText });
        }
        return child;
      })}
    </div>
  );
};

export default MyEmailComponent;