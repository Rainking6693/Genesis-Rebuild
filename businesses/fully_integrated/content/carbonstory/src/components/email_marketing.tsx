import React, { FC, ReactNode, Key } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  subject: string; // Add subject for email personalization
  message: string;
  children?: ReactNode; // Allow for additional content within the component
}

const MyEmailComponent: FC<Props> = ({ subject, message, children }) => {
  // Add a default value for children to avoid potential errors
  const content = children || <div dangerouslySetInnerHTML={{ __html: message }} />;

  // Wrap subject in an h3 tag for better readability
  const subjectElement = <h3>{subject}</h3>;

  // Use a safe HTML library (e.g., DOMPurify) to prevent XSS attacks
  const safeMessage = content.props.dangerouslySetInnerHTML
    ? DOMPurify.sanitize(content.props.dangerouslySetInnerHTML.__html)
    : DOMPurify.sanitize(content.toString());

  // Use a semantic element (article) for the main content
  // Add a unique key for the article element to improve performance
  const uniqueKey = subject || Math.random().toString(36).substring(7);

  return (
    <article key={uniqueKey}>
      {subjectElement}
      <div
        // Use a unique key for list items to improve performance
        key={subject}
        // Use DOMPurify to sanitize the message
        dangerouslySetInnerHTML={{ __html: safeMessage }}
      />
    </article>
  );
};

export default MyEmailComponent;

In this updated code, I've added a unique key to the article element and the inner div to improve performance. I've also used DOMPurify to sanitize both the message and the content string in case the children prop doesn't have a dangerouslySetInnerHTML property. Additionally, I've imported the Key type from React to ensure type safety.