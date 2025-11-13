import React, { PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
  subject?: string; // Add subject for personalized newsletter title (optional)
  previewText?: string; // Add preview text for newsletter summary (optional)
  body?: string; // Add body content for detailed newsletter content (optional)
};

const Newsletter: React.FC<Props> = ({ children }) => {
  const [subject, previewText, body] = children as [string, string, string];

  // Sanitize user-generated content to prevent XSS attacks
  const sanitizedBody = body ? sanitize(body) : '';

  return (
    <div>
      <h1>{subject || ''}</h1> // Use empty string as fallback if subject is not provided
      <p>{previewText || ''}</p> // Use empty string as fallback if previewText is not provided
      <div dangerouslySetInnerHTML={{ __html: sanitizedBody }} />
    </div>
  );
};

// You can use a library like DOMPurify to sanitize user-generated content
// https://github.com/cure53/DOMPurify
const sanitize = (html: string) => {
  const DOMPurify = (window as any).DOMPurify;
  return DOMPurify.sanitize(html);
};

export default Newsletter;

In this updated version, I've made the following changes:

1. Added optional props for subject, previewText, and body.
2. Used PropsWithChildren to handle any number of children passed to the component.
3. Extracted the children and sanitized the body content using DOMPurify.
4. Provided empty strings as fallbacks for subject and previewText if they are not provided.
5. Imported DOMPurify from the global window object (you may need to adjust this import based on your project setup).