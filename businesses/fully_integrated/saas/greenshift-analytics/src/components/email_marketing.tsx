import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject: string;
  message: string;
  children?: ReactNode; // Allows for additional content within the email component
}

const MyEmailComponent: FC<Props> = ({ className, ...divProps }) => {
  const sanitizedSubject = sanitizeText(subject);
  const sanitizedMessage = sanitizeText(message);

  return (
    <div {...divProps} className={className}>
      <h2>{sanitizedSubject}</h2>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      {children}
    </div>
  );
};

export default MyEmailComponent;

function sanitizeText(text: string): string {
  // Implement a function to sanitize the input text to prevent XSS attacks
  // For example, using DOMPurify library:
  // const DOMPurify = require('dompurify');
  // return DOMPurify.sanitize(text);

  // Replace this with your preferred sanitization method.
  return text.replace(/<[^>]+>/gm, '');
}

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject: string;
  message: string;
  children?: ReactNode; // Allows for additional content within the email component
}

const MyEmailComponent: FC<Props> = ({ className, ...divProps }) => {
  const sanitizedSubject = sanitizeText(subject);
  const sanitizedMessage = sanitizeText(message);

  return (
    <div {...divProps} className={className}>
      <h2>{sanitizedSubject}</h2>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      {children}
    </div>
  );
};

export default MyEmailComponent;

function sanitizeText(text: string): string {
  // Implement a function to sanitize the input text to prevent XSS attacks
  // For example, using DOMPurify library:
  // const DOMPurify = require('dompurify');
  // return DOMPurify.sanitize(text);

  // Replace this with your preferred sanitization method.
  return text.replace(/<[^>]+>/gm, '');
}