import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject: string;
  message: string;
  children?: ReactNode; // Allows for additional content within the email component
  altText?: string; // For accessibility, used for screen readers and images
}

const MyEmailComponent: FC<Props> = ({ className, style, subject, message, children, altText, ...rest }) => {
  return (
    <div {...rest} className={className} style={style}>
      <h2>{subject}</h2>
      {children}
      {message && <div dangerouslySetInnerHTML={{ __html: message }} />}
      {altText && <img src="" alt={altText} />} // Placeholder for images, can be replaced with actual image source
    </div>
  );
};

MyEmailComponent.defaultProps = {
  className: '',
  style: {},
  children: null,
  altText: '',
};

export default MyEmailComponent;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject: string;
  message: string;
  children?: ReactNode; // Allows for additional content within the email component
  altText?: string; // For accessibility, used for screen readers and images
}

const MyEmailComponent: FC<Props> = ({ className, style, subject, message, children, altText, ...rest }) => {
  return (
    <div {...rest} className={className} style={style}>
      <h2>{subject}</h2>
      {children}
      {message && <div dangerouslySetInnerHTML={{ __html: message }} />}
      {altText && <img src="" alt={altText} />} // Placeholder for images, can be replaced with actual image source
    </div>
  );
};

MyEmailComponent.defaultProps = {
  className: '',
  style: {},
  children: null,
  altText: '',
};

export default MyEmailComponent;