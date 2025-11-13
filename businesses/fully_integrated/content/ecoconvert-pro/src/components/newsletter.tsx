import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject: string;
  preheader: string;
  body?: string;
}

const sanitizeBody = (body: string): string => body.replace(/<[^>]+>/g, '');

const Newsletter: FC<Props> = ({ subject, preheader, body, ...divProps }) => {
  const sanitizedBody = body ? sanitizeBody(body) : '';

  return (
    <div {...divProps} role="article">
      <h1>{subject}</h1>
      <p>{preheader}</p>
      <div dangerouslySetInnerHTML={{ __html: sanitizedBody }} />
    </div>
  );
};

export default Newsletter;

In this updated version, I've added the `role="article"` attribute to the Newsletter component for better accessibility. I've also extracted the sanitization function to a separate utility function for better maintainability. Additionally, I've added type annotations for better type safety and maintainability, and I've handled the case where the `body` property is undefined or null to prevent errors.