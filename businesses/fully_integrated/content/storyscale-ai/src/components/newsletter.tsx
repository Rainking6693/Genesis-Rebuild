import React, { PropsWithChildren, DefaultHTMLProps } from 'react';
import DOMPurify from 'dompurify'; // Import a safe-html library

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  subject?: string; // Add optional subject for personalized newsletter titles
  previewText?: string; // Add optional preview text for newsletter previews
  message?: string;
}

const MyComponent: React.FC<Props> = ({ id, className, subject, previewText, message, ...rest }) => {
  // Wrap subject in h1 tag for better readability
  const headingId = `newsletter-${subject?.toLowerCase().replace(/\s+/g, '-')}`;

  // Use a safe-html library to prevent XSS attacks
  const safeHTML = (html: string) => {
    return DOMPurify.sanitize(html);
  };

  return (
    <div id={headingId} className={className} {...rest}>
      <h1 id={headingId}>{subject}</h1>
      <p>{previewText}</p>
      <div dangerouslySetInnerHTML={{ __html: safeHTML(message) }} />
    </div>
  );
};

MyComponent.defaultProps = {
  id: 'newsletter',
  className: '',
  subject: '',
  previewText: '',
  message: '',
};

export default MyComponent;

In this updated code, I've added the `id` and `className` props to the component, making it more flexible. I've also extended the `Props` interface with `DefaultHTMLProps<HTMLDivElement>` to include common HTML attributes. The `safeHTML` function now uses the `DOMPurify` library to sanitize the HTML content. Lastly, I've set default values for the `id` and `className` props in the `defaultProps` object.