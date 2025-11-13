import React, { PropsWithChildren, ReactNode } from 'react';

interface Props {
  subject: string;
  previewText: string;
  message: string;
  className?: string;
  children?: ReactNode;
}

const MyComponent: React.FC<Props> = ({ subject, previewText, message, className = '', children }) => {
  return (
    <div className={className}>
      <h3>{subject}</h3>
      <p>{previewText}</p>
      <div
        dangerouslySetInnerHTML={{ __html: message }}
        aria-label="Newsletter content"
      >
        {children}
      </div>
    </div>
  );
};

export default MyComponent;

In this updated version, I've added a default value for the `className` prop, allowing it to be optional. I've also added a `children` prop of type `ReactNode` to allow for the possibility of additional child elements within the component. This can be useful if you want to include additional content or components within the newsletter.