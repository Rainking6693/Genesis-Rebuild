import React, { FC, useEffect, useRef } from 'react';

interface Props {
  seoTitle: string; // Add SEO-friendly title for each component
  seoDescription: string; // Add SEO-friendly description for each component
  message: string;
  isUserGeneratedContent?: boolean; // Flag for user-generated content
}

const MyComponent: FC<Props> = ({ seoTitle, seoDescription, message, isUserGeneratedContent = false }) => {
  const ogTitleRef = useRef<HTMLMetaElement | null>(null);
  const ogDescriptionRef = useRef<HTMLMetaElement | null>(null);

  useEffect(() => {
    // Add Open Graph tags for social media sharing
    const addOpenGraphTag = (tagName: string, content: string) => {
      const existingTag = document.querySelector(`head > meta[property="${tagName}"]`);
      if (!existingTag) {
        const newTag = document.createElement('meta');
        newTag.property = tagName;
        newTag.content = content;
        document.head.appendChild(newTag);
      } else {
        existingTag.content = content;
      }
    };

    if (ogTitleRef.current) {
      addOpenGraphTag('og:title', seoTitle);
    } else {
      ogTitleRef.current = document.createElement('meta');
      ogTitleRef.current.property = 'og:title';
      ogTitleRef.current.content = seoTitle;
      document.head.appendChild(ogTitleRef.current);
    }

    if (ogDescriptionRef.current) {
      addOpenGraphTag('og:description', seoDescription);
    } else {
      ogDescriptionRef.current = document.createElement('meta');
      ogDescriptionRef.current.property = 'og:description';
      ogDescriptionRef.current.content = seoDescription;
      document.head.appendChild(ogDescriptionRef.current);
    }

    // Use dangerouslySetInnerHTML for user-generated content to prevent XSS attacks
    const safeMessage = isUserGeneratedContent ? { __html: message } : { innerHTML: message };
  }, [seoTitle, seoDescription, isUserGeneratedContent, message]);

  // Add ARIA attributes for accessibility
  const messageId = `my-component-message-${Math.random().toString(36).substring(7)}`;
  return (
    <div>
      <div id={messageId} {...(isUserGeneratedContent ? { dangerouslySetInnerHTML: safeMessage } : {})}>
        <a href={`#${messageId}`}>Read more</a>
      </div>
      <div hidden>{isUserGeneratedContent ? `<div id="${messageId}" dangerouslySetInnerHTML=${JSON.stringify(safeMessage)}></div>` : message}</div>
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useRef } from 'react';

interface Props {
  seoTitle: string; // Add SEO-friendly title for each component
  seoDescription: string; // Add SEO-friendly description for each component
  message: string;
  isUserGeneratedContent?: boolean; // Flag for user-generated content
}

const MyComponent: FC<Props> = ({ seoTitle, seoDescription, message, isUserGeneratedContent = false }) => {
  const ogTitleRef = useRef<HTMLMetaElement | null>(null);
  const ogDescriptionRef = useRef<HTMLMetaElement | null>(null);

  useEffect(() => {
    // Add Open Graph tags for social media sharing
    const addOpenGraphTag = (tagName: string, content: string) => {
      const existingTag = document.querySelector(`head > meta[property="${tagName}"]`);
      if (!existingTag) {
        const newTag = document.createElement('meta');
        newTag.property = tagName;
        newTag.content = content;
        document.head.appendChild(newTag);
      } else {
        existingTag.content = content;
      }
    };

    if (ogTitleRef.current) {
      addOpenGraphTag('og:title', seoTitle);
    } else {
      ogTitleRef.current = document.createElement('meta');
      ogTitleRef.current.property = 'og:title';
      ogTitleRef.current.content = seoTitle;
      document.head.appendChild(ogTitleRef.current);
    }

    if (ogDescriptionRef.current) {
      addOpenGraphTag('og:description', seoDescription);
    } else {
      ogDescriptionRef.current = document.createElement('meta');
      ogDescriptionRef.current.property = 'og:description';
      ogDescriptionRef.current.content = seoDescription;
      document.head.appendChild(ogDescriptionRef.current);
    }

    // Use dangerouslySetInnerHTML for user-generated content to prevent XSS attacks
    const safeMessage = isUserGeneratedContent ? { __html: message } : { innerHTML: message };
  }, [seoTitle, seoDescription, isUserGeneratedContent, message]);

  // Add ARIA attributes for accessibility
  const messageId = `my-component-message-${Math.random().toString(36).substring(7)}`;
  return (
    <div>
      <div id={messageId} {...(isUserGeneratedContent ? { dangerouslySetInnerHTML: safeMessage } : {})}>
        <a href={`#${messageId}`}>Read more</a>
      </div>
      <div hidden>{isUserGeneratedContent ? `<div id="${messageId}" dangerouslySetInnerHTML=${JSON.stringify(safeMessage)}></div>` : message}</div>
    </div>
  );
};

export default MyComponent;