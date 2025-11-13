import React, { FC, ReactNode, useId } from 'react';
import DOMPurify from 'dompurify';

interface SanitizedMessageProps {
  message: string;
}

interface SanitizedContentProps {
  content: string;
}

const SanitizedContent: FC<SanitizedContentProps> = ({ content }) => {
  try {
    return <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />;
  } catch (error) {
    console.error('Error sanitizing content:', error);
    return <span>{content}</span>;
  }
};

const sanitizeContent = (content: string): ReactNode => SanitizedContent({ content });

interface SafeMessageComponentProps extends SanitizedContentProps {
  id?: string;
}

const SafeMessageComponent: FC<SafeMessageComponentProps> = ({ id, content }) => {
  const componentId = id || useId();

  return <div id={componentId}>{content}</div>;
};

SafeMessageComponent.sanitizeContent = sanitizeContent;

const MyComponent: FC<SanitizedMessageProps> = ({ message }) => {
  const sanitizedMessage = sanitizeContent(message);
  return <SafeMessageComponent id="my-component" content={sanitizedMessage} />;
};

export default MyComponent;

In this updated code:

1. I've added the `ReactNode` type to the return value of the `SanitizedContent` function and used `span` as the container element for better accessibility.
2. I've created a separate `SanitizedContent` component to handle the sanitization, making the code more modular and reusable.
3. I've added an `id` prop to the `SafeMessageComponent` for better accessibility and easier styling.
4. I've used the `useId` hook from React to generate an `id` if one is not provided.
5. I've renamed the component to `SafeMessageComponent` to better reflect its purpose.

This updated component should be more resilient, handle edge cases better, be more accessible, and be more maintainable. It also allows for easier reuse of the sanitization logic in other components.